import { readFile } from '../src';

import { FtpSrv } from 'ftp-srv';
// const FtpServer = require('ftp-srv');
// const FileSystem = FtpSer.FileSystem;

const ftpurl = 'ftp://127.0.0.1:22221';

const srv = new FtpSrv({ url: ftpurl, pasv_url: ftpurl, anonymous: true });

srv.on('login', (data, resolve, reject) => {
  resolve({ root: './test-resources', cwd: './test-resources' });
});

beforeAll(() => {
  srv.listen();
});

describe('FTP', () => {
  describe('FTP end 2 end with real server', () => {
    it('should download test file', async () => {
      const file = await readFile(ftpurl + '/test.txt');
      expect(file.toString('utf8')).toEqual(expect.stringContaining('test'))
    });
  });
});

afterAll(() => {
  srv.close();
});
