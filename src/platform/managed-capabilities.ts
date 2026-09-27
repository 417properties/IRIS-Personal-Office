export const managedCapabilities = {
  durableWorkflow:{providerClass:'Vercel Workflow / WorkflowAgent',canonical:false},
  modelTransport:{providerClass:'AI SDK / AI Gateway',canonical:false},
  toolProtocol:{providerClass:'Typed AI SDK tools + MCP',canonical:false,protocolTarget:'2026-07-28'},
  tracing:{providerClass:'OpenTelemetry / platform tracing',canonical:false},
  canonicalDatabase:{providerClass:'Postgres (bounded provider: Neon)',canonical:true,semanticOwner:'IRIS'}
} as const;
export function assertNoProviderOwnsIrreducibleProperty():true {
  for (const [key,value] of Object.entries(managedCapabilities)) {
    if (key!=='canonicalDatabase' && value.canonical) throw new Error('REPLACEABLE_PROVIDER_BECAME_CANONICAL');
  }
  return true;
}
