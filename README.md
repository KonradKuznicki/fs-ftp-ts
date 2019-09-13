# WARNING: work in progress on v0.0.1

# FTP Client in TypeScript

This client is focused on ease of usage 
 
With Promises and automatic connection management all you need to do is

```JavaScript
import {FTP} from 'ftp-ts';

(async () => {

const file = await FTP('ftp://localhost').readFile('README.md').toString('utf8');

})()
```

I also try to keep API similar to Node.js File System API
