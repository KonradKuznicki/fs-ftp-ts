# WARNING: work in progress

To get something working for the first version I used [node-ftp](https://github.com/mscdex/node-ftp) 

But this project is not maintained for last 4 years so I plan to rewrite it and fix bugs

I have to also research [ftp-ts](https://github.com/lumphe/ftp-ts)

# FTP Client in TypeScript 
[![Coverage Status](https://coveralls.io/repos/github/KonradKuznicki/ftp-ts/badge.svg?branch=master)](https://coveralls.io/github/KonradKuznicki/ftp-ts?branch=master) [![CircleCI](https://circleci.com/gh/KonradKuznicki/ftp-ts.svg?style=svg)](https://circleci.com/gh/KonradKuznicki/ftp-ts)

This client is focused on ease of usage 
 
With Promises and automatic connection management all you need to do is

```JavaScript
const fsFtpTs = require("fs-ftp-ts");
(async () => {

    const list = await fsFtpTs.readdir('ftp://speedtest.tele2.net/');
    
    console.log(list.map(i => i.name));

    const file = await fsFtpTs.readFile('ftp://demo:password@test.rebex.net/readme.txt');
    
    console.log(file.toString('utf8'));

})();
```

I also try to keep API similar to Node.js File System API

# Tests 
`$ yarn run test:all`

## Unit tests
`$ yarn run test`

## End 2 End tests with real ftp server [ftp-srv](https://github.com/trs/ftp-srv) 
_This server does not provide me with weird errors 
<br> that I experience on the web with node-ftp
<br> but I hope to emulate them._
 
`$ yarn run test:e2e`
