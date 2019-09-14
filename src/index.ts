import * as FTP from '../ftp';
import { URL } from 'url';
import { FTPDir, parseFTPDir } from './InputParsers/dirParser';
import { FTPFile, parseFTPFile } from './InputParsers/fileParser';
import { FTPServerURL, Parser, parseTarget } from './InputParsers/targetParser';

interface Reader<T> {
  parser: Parser<T>;
  reader: () => any;
}

export const read = async <T extends { path: string }>(
  target,
  reader: Reader<T>,
) => {
  const config = parseTarget(target, reader.parser);
  const serverConfig: FTPServerURL = config as FTPServerURL; // <-- this doesn't work
  const client = FTP(serverConfig);
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
