export interface IHeaders {
  'h-Custom': string;
}

export interface IReply<T> {
  200: { success: boolean, data?: T };
  302: { url: string };
  '4xx': { error: string };
}