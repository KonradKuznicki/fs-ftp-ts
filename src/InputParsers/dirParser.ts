import { InputError } from './InputError';

export class FTPDirInputError extends InputError {}

export interface FTPDir {
  path: string;
}

export const parseFTPDir = (url: URL): FTPDir => {
  if (!url.pathname || !url.pathname.endsWith('/')) {
    throw new FTPDirInputError(
      'This path looks like a file, if you want to read file try readFile instead',
    );
  }
  return {
    path: url.pathname,
  };
};
