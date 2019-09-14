import { FTPProtocols, URLProtocol2FTPProtocol } from './protocolParser';
import { InputError } from './InputError';
import { URL } from 'url';

export type Parser<T extends {}> = (url: URL) => T;

export interface FTPServerURL {
  protocol: FTPProtocols;
  host: string;
  port: number;
}

export class FTPServerURLInputError extends InputError {}

export function parseTarget(target: URL | string): FTPServerURL;
export function parseTarget<T extends {}>(
  target: URL | string,
  additionalParser: Parser<T>,
): FTPServerURL & T;
export function parseTarget<T extends {}>(
  target: URL | string,
  additionalParser?: Parser<T>,
): FTPServerURL | FTPServerURL & T {
  let url;
  if (typeof target === 'string') {
    try {
      url = new URL(target);
    } catch (e) {
      if (
        e.constructor.name === 'NodeError' &&
        e.message.startsWith('Invalid URL:')
      ) {
        throw new FTPServerURLInputError(e.message);
      } else {
        throw e; // Hopeful should never happen
      }
    }
  } else if (target instanceof URL) {
    url = target;
  } else {
    throw new FTPServerURLInputError(
      'Bad file descriptor, expected instance of URL or string',
    );
  }

  const tmp = {
    protocol: URLProtocol2FTPProtocol(url.protocol),
    host: url.hostname,
    port: (url.port && parseInt(url.port, 10)) || 21,
  };

  if (typeof additionalParser === 'undefined') {
    return tmp;
  } else {
    return Object.assign(tmp, additionalParser(url));
  }
}
