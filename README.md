# WARNING: work in progress on v0.0.1

To get something working for the first version I used [node-ftp](https://github.com/mscdex/node-ftp) 

But this project is maintained for last 4 years so I plan to rewrite it and fix bugs

# FTP Client in TypeScript

This client is focused on ease of usage 
 
With Promises and automatic connection management all you need to do is

```TypeScript
import FTP from 'ftp-ts';
import Buffer from 'buffer';

(async () => {

const file:Buffer = (await FTP.readFile('ftp://localhost/README.md')).toString('utf8');

console.log(file);

})()
```

I also try to keep API similar to Node.js File System API
