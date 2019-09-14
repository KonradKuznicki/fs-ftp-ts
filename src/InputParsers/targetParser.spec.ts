import { FTPServerURLInputError, parseTarget } from './targetParser';
import { URL } from 'url';

describe('parseTarget', () => {
  it('should throw error when there is anything missing on path', () => {
    expect(() => {
      parseTarget('');
    }).toThrow(FTPServerURLInputError);
    expect(() => {
      parseTarget('asdf');
    }).toThrow(FTPServerURLInputError);
    expect(() => {
      parseTarget('/asdf');
    }).toThrow();
  });
  it('should be ok with minimal ftp file path', () => {
    expect(parseTarget('ftp://asdf')).toStrictEqual({
      protocol: 'ftp',
      host: 'asdf',
      port: 21,
    });
  });
  it('should be ok with maximal ftp file path', () => {
    expect(parseTarget('ftp://lol:nope@asdf:2121/asdf')).toStrictEqual({
      user: 'lol',
      password: 'nope',
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
  it('should be ok with URL object', () => {
    expect(parseTarget(new URL('ftp://lol:nope@asdf:2121/asdf'))).toStrictEqual(
      {
        user: 'lol',
        password: 'nope',
        protocol: 'ftp',
        host: 'asdf',
        port: 2121,
      },
    );
  });
  it('should throw error when there is no host name', () => {
    expect(() => {
      // @ts-ignore
      parseTarget(3);
    }).toThrow(
      new FTPServerURLInputError(
        'Bad file descriptor, expected instance of URL or string',
      ),
    );
  });
});
