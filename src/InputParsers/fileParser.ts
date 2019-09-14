import { InputError } from './InputError';

export class FTPFileInputError extends InputError {}

export interface FTPFile {
  path: string;
}

export const parseFTPFile = (url: URL): FTPFile => {
  if (!url.pathname || url.pathname.endsWith('/')) {
    throw new FTPFileInputError(
      'This path looks like a dir, if you want to read dir try readdir instead',
    );
  }
  return {
    path: url.pathname,
  };
};
