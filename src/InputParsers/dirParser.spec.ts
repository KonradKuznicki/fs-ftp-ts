import { FTPDirInputError, parseFTPDir } from './dirParser';

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
