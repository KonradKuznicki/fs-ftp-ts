import {
  FTPProtocolInputError,
  FTPProtocols,
  URLProtocol2FTPProtocol,
} from './protocolParser';

describe('URLProtocol2FTPProtocol', () => {
  it('should extract ftp protocol', () => {
    expect(URLProtocol2FTPProtocol('ftp:')).toBe(FTPProtocols.FTP);
    expect(URLProtocol2FTPProtocol('ftps:')).toBe(FTPProtocols.FTPs);
    expect(URLProtocol2FTPProtocol('sftp:')).toBe(FTPProtocols.sFTP);
  });
  it('should throw error on not ftp protocol', () => {
    expect(() => {
      URLProtocol2FTPProtocol('asdf');
    }).toThrow(FTPProtocolInputError);
  });
});
