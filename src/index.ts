import * as FTP from './ftp';
import { URL } from 'url';

enum FTPProtocols {
  FTP = 'ftp',
  FTPs = 'ftps',
  sFTP = 'sftp',
}

export const URLProtocol2FTPProtocol = (protocol: string): FTPProtocols => {
  switch (protocol) {
    case 'ftp:':
      return FTPProtocols.FTP;
    case 'ftps:':
      return FTPProtocols.FTPs;
    case 'sftp:':
      return FTPProtocols.sFTP;
    default:
      throw new Error('Unknown FTP protocol: ' + protocol);
  }
};

interface FTPServerURL {
  protocol: FTPProtocols;
  host: string;
  port: number;
}

interface FTPDir {
  path: string;
}

export const parseFTPDir = (url: URL): FTPDir => {
  if (!url.pathname || !url.pathname.endsWith('/')) {
    throw new Error('EBADF: can not read file, try readFile instead');
  }
  return {
    path: url.pathname,
  };
};

interface FTPFile {
  path: string;
}

export const parseFTPFile = (url: URL): FTPFile => {
  if (!url.pathname || url.pathname.endsWith('/')) {
    throw new Error('EBADF: can not read dir, try readdir instead');
  }
  return {
    path: url.pathname,
  };
};

type Parser<T extends {}> = (url: URL) => T;
export function parseTarget<T extends {}>(
  target: URL | string,
  additionalParser: Parser<T>,
): FTPServerURL & T {
  let url;
  if (typeof target === 'string') {
    url = new URL(target);
  } else if (target instanceof URL) {
    url = target;
  } else {
    throw new Error('EBADF: bad file descriptor, read');
  }

  if (url.protocol !== 'ftp:') {
    throw new Error('EBADP: bad protocol');
  }

  if (!url.hostname) {
    throw new Error('EBADF: no hostname');
  }

  const tmp = {
    protocol: URLProtocol2FTPProtocol(url.protocol),
    host: url.hostname,
    port: (url.port && parseInt(url.port, 10)) || 21,
  };

  // if (typeof additionalParser === 'undefined') {
  //   // additionalParser = url => ({});
  //   return tmp;
  // } else {
  return Object.assign(tmp, additionalParser(url));
  //  }
}

interface Reader<T> {
  parser: Parser<T>;
  reader: () => any;
}

export const read = async <T extends { path: string }>(
  target,
  reader: Reader<T>,
) => {
  const config = parseTarget(target, reader.parser);
  const client = FTP({ host: config.host, port: config.port});
  await client.connect();
  const content = await reader.reader.call(client, config.path);
  await client.disconnect();
  return content;
};

export const fileReader: Reader<FTPFile> = {
  parser: parseFTPFile,
  reader: FTP.prototype.getBuffer,
};

/**
 * Reads file from given url into memory - _be careful!_
 * @param target - for example: ftp://localhost/test.txt
 */
export const readFile = async (target: URL | string) => {
  return await read(target, fileReader);
};

export const dirReader: Reader<FTPDir> = {
  parser: parseFTPDir,
  reader: FTP.prototype.list,
};
export const readdir = async (target: URL | string) => {
  return await read(target, dirReader);
};
