import { parseTarget, parseFTPDir, parseFTPFile } from './index';

describe('FTP', () => {
  describe('parseTarget', () => {
    it('should throw error when there is anything missing on path', () => {
      expect(() => {
        parseTarget('', ignore => ({}));
      }).toThrow();
      expect(() => {
        parseTarget('asdf', ignore => ({}));
      }).toThrow();
      expect(() => {
        parseTarget('/asdf', ignore => ({}));
      }).toThrow();
    });
    it('should be ok with minimal ftp file path', () => {
      expect(parseTarget('ftp://asdf', ignore => ({}))).toStrictEqual({
        protocol: 'ftp',
        host: 'asdf',
        port: 21,
      });
    });
    it('should be ok with maximal ftp file path', () => {
      expect(parseTarget('ftp://lol:nope@asdf:2121/asdf', ignore => ({}))).toStrictEqual({
        protocol: 'ftp',
        host: 'asdf',
        port: 2121,
      });
    });
    it('should work with additional parser', () => {
      expect(
        parseTarget('ftp://asdf/path', url => ({ path: url.pathname })),
      ).toHaveProperty('path', '/path');
    });
  });
  describe('parseFTPDir', () => {
    it('should get dir for dir', () => {
      expect(parseFTPDir(new URL('ftp://asdf/asdf/'))).toStrictEqual({
        path: '/asdf/',
      });
    });
    it('should throw error on not dir', () => {
      expect(() => {
        parseFTPDir(new URL('ftp://asdf/asdf'));
      }).toThrowError('EBADF: can not read file, try readFile instead');
    });
  });
  describe('parseFTPFile', () => {
    it('should get dir for dir', () => {
      expect(parseFTPFile(new URL('ftp://asdf/asdf'))).toStrictEqual({
        path: '/asdf',
      });
    });
    it('should throw error on not dir', () => {
      expect(() => {
        parseFTPFile(new URL('ftp://asdf/asdf/'));
      }).toThrowError('EBADF: can not read dir, try readdir instead');
    });
  });
});
