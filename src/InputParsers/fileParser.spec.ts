import { FTPFileInputError, parseFTPFile } from './fileParser';
import { URL } from 'url';

describe('parseFTPFile', () => {
  it('should get file path for file', () => {
    expect(parseFTPFile(new URL('ftp://asdf/asdf'))).toStrictEqual({
      path: '/asdf',
    });
  });
  it('should throw error on not file', () => {
    expect(() => {
      parseFTPFile(new URL('ftp://asdf/asdf/'));
    }).toThrow(FTPFileInputError);
  });
});
