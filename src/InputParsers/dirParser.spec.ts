import { FTPDirInputError, parseFTPDir } from './dirParser';
import { URL } from 'url';

describe('parseFTPDir', () => {
  it('should get dir for dir', () => {
    expect(parseFTPDir(new URL('ftp://asdf/asdf/'))).toStrictEqual({
      path: '/asdf/',
    });
  });
  it('should throw error on not dir', () => {
    expect(() => {
      parseFTPDir(new URL('ftp://asdf/asdf'));
    }).toThrow(FTPDirInputError);
  });
});
