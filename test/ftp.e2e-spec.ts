import { readdir, readFile } from '../src';

import { FtpSrv } from 'ftp-srv';

const ftpurl = 'ftp://127.0.0.1:22221';

const srv = new FtpSrv({ url: ftpurl, pasv_url: ftpurl, anonymous: true });

srv.on('login', (data, resolve, reject) => {
  resolve({ root: './test-resources', cwd: './test-resources' });
});

beforeAll(() => {
  srv.listen();
});

describe('FTP end 2 end with real server', () => {
  describe('readFile', () => {
    it('should download test file', async () => {
      const file = await readFile(ftpurl + '/test.txt');
      expect(file.toString('utf8')).toEqual(expect.stringContaining('test'));
    });
  });
  describe('readdir', () => {
    it('should list files', async () => {
      const list = await readdir(ftpurl);
      expect(list).toHaveLength(1);
    });
  });
});

afterAll(() => {
  srv.close();
});
