import { LogEntry, Transport } from './logger';

const LOGTAIL_REMOTE = `https://in.logtail.com`;

export class LogtailTransport implements Transport {
  context: ExecutionContext;
  token: string;

  constructor(token: string, context: ExecutionContext) {
    this.token = token;
    this.context = context;
  }

  log(entry: LogEntry, obj?: any) {
    this.context.passThroughOnException();
    this.context.waitUntil(
      fetch(LOGTAIL_REMOTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          level: entry.level,
          message: entry.message,
          context: {
            ...obj,
          },
        }),
      })
    );
  }
}
