export interface TraceSink { span(name:string,attributes:Record<string,string|number|boolean>):void; }
export class NoopTraceSink implements TraceSink { span(_name:string,_attributes:Record<string,string|number|boolean>):void {} }
export const TRACING_IS_NONCANONICAL=true;
