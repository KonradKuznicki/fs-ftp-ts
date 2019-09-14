import { InputError } from './InputError';

export class FTPProtocolInputError extends InputError {}

export enum FTPProtocols {
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
      throw new FTPProtocolInputError('Unknown FTP protocol: ' + protocol);
  }
};
