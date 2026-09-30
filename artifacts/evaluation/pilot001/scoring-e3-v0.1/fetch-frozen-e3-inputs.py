#!/usr/bin/env python3
import argparse
import concurrent.futures
import hashlib
import json
from pathlib import Path, PurePosixPath
import urllib.request

REPOSITORY = "417properties/IRIS-Personal-Office"


def byte_identity(data):
    return {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "git_blob": hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest(),
    }


def main():
    parser = argparse.ArgumentParser(description="Download and byte-verify frozen E3 inputs; never execute the candidate or harness.")
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    manifest = json.loads(args.manifest.read_bytes())
    if manifest["repository"] != REPOSITORY:
        raise ValueError("Unexpected source repository")
    inputs = manifest["frozen_inputs"]
    names = [row["local_name"] for row in inputs]
    if len(inputs) != 38 or len(set(names)) != len(inputs):
        raise ValueError("Expected six governing inputs and 32 uniquely named output files")
    args.out.mkdir(parents=True, exist_ok=True)

    def download(row):
        path = PurePosixPath(row["path"])
        commit = row["commit"]
        if path.is_absolute() or ".." in path.parts or not str(path).startswith("artifacts/"):
            raise ValueError("Unsafe repository path")
        if len(commit) != 40 or any(character not in "0123456789abcdef" for character in commit):
            raise ValueError("Source must be pinned to a full Git commit")
        if PurePosixPath(row["local_name"]).name != row["local_name"] or row["local_name"] in {".", ".."}:
            raise ValueError("Unsafe local filename")
        url = f"https://raw.githubusercontent.com/{REPOSITORY}/{commit}/{path}"
        with urllib.request.urlopen(url, timeout=30) as response:
            data = response.read()
        identity = byte_identity(data)
        expected = {key: row[key] for key in identity}
        if identity != expected:
            raise ValueError(f"Frozen byte identity mismatch: {path}")
        destination = args.out / row["local_name"]
        if destination.exists() and destination.read_bytes() != data:
            raise ValueError(f"Refusing to overwrite differing input: {destination.name}")
        if not destination.exists():
            destination.write_bytes(data)
        if destination.read_bytes() != data:
            raise ValueError(f"Local readback mismatch: {destination.name}")
        return {"local_name": destination.name, "source_url": url, **identity, "verified": True}

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        verified = list(pool.map(download, inputs))
    receipt = {
        "status": "FROZEN_INPUT_BYTES_VERIFIED",
        "candidate_executed": False,
        "harness_executed": False,
        "scoring_performed": False,
        "verified_files": verified,
    }
    (args.out / "E3-FROZEN-INPUT-TRANSPORT-RECEIPT.json").write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf8")
    print(json.dumps({"status": receipt["status"], "verified_files": len(verified), "out": str(args.out), "candidate_executed": False, "harness_executed": False}))


if __name__ == "__main__":
    main()
