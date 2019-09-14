const Client = require('ftp');

class FTP {
  constructor(config) {
    this.config = config;
    this.c = new Client();
    this._connected = false;
    this._timeOut = null;
    this._autoDisconnectAfter = 1000;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.c.once('ready', () => {
        this._connected = true;
        resolve();
      });
      this.c.once('error', reject);
      this.c.connect(this.config);
    });
  }

  disconnect() {
    this.c.end();
    this._connected = false;
    if (this._timeOut) {
      clearTimeout(this._timeOut);
    }
  }

  connectionEnded() {
    if (this._timeOut) {
      clearTimeout(this._timeOut);
    }
    this._timeOut = setTimeout(
      () => this.disconnect(),
      this._autoDisconnectAfter,
    );
  }

  async autoConnection() {
    clearTimeout(this._timeOut);
    if (!this._connected) {
      await this.connect();
    }
  }

  list(path = '') {
    return new Promise(async (resolve, reject) => {
      await this.autoConnection();
      this.c.list(path, (err, data) => {
        if (err) {
          reject(err);
          this.connectionEnded();
          return;
        }
        resolve(data);
        this.connectionEnded();
      });
    });
  }

  getStream(filePath) {
    return new Promise(async (resolve, reject) => {
      await this.autoConnection();
      this.c.get(filePath, (err, stream) => {
        if (err) {
          reject(err);
          this.connectionEnded();
          return;
        }
        resolve(stream);
        stream.once('close', () => this.connectionEnded());
      });
    });
  }

  async getBuffer(file) {
    const fileInfo = await this.list(file);
    let downloaded = 0;
    const toDownload = fileInfo[0].size;

    return await new Promise(async (resolve, reject) => {
      const stream = await this.getStream(file);
      const datas = [];
      const errors = [];
      stream.once('close', function() {
        if (errors.length) {
          reject(errors);
        } else {
          const bbuf = Buffer.concat(datas);
          resolve(bbuf);
        }
      });
      // stream.on('data', datas.push.bind(datas));
      stream.on('data', data => {
        downloaded += data.length;
        console.log(
          'fetched',
          downloaded,
          'of',
          toDownload,
          'chunk',
          data.length,
        );
        datas.push(data);
      });
      stream.on('error', errors.push.bind(errors));
    });
  }

  async getText(file) {
    const buffer = await this.getBuffer(file);
    return buffer.toString('utf8');
  }
}

function NewFTP (config) {
  return new FTP(config);
}
NewFTP.prototype = FTP.prototype;
module.exports = NewFTP;
