export interface VoiceIngressAdapter {
  transcribe(input:Uint8Array):Promise<{text:string;provider_ref:string}>;
}
export const VOICE_IS_NONCANONICAL=true;
