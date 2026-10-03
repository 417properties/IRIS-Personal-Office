const fs=require('node:fs');
function deny(kind){if(process.env.IRIS_B2_NETWORK_LOG)fs.appendFileSync(process.env.IRIS_B2_NETWORK_LOG,JSON.stringify({pid:process.pid,kind})+'\n');throw Error('IRIS_B2_QUALIFICATION_NETWORK_DENIED:'+kind);}
globalThis.fetch=()=>deny('fetch');
for(const name of ['node:http','node:https']){const m=require(name);m.request=()=>deny(name+'.request');m.get=()=>deny(name+'.get');}
require('node:net').Socket.prototype.connect=function(){return deny('net.connect');};
require('node:tls').connect=()=>deny('tls.connect');
