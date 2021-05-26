# CHAT API REST

### This project was created by [Jesús Mares] (https://github.com/jesusmares82-hub) and Diego Mesa at ACADEMLO.

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

## Tech

​
This project uses a number of open source projects to work properly:
​

- [node.js] - evented I/O for the backend
- [Sequelize] - ORM for node.js apps
- [Express] - fast node.js network app framework

## Installation

​
Requires [Node.js](https://nodejs.org/) v13+ to run.
​
Install the dependencies and devDependencies and start the server.
​

### Development

```sh
cd whatsup
npm i
Create a database called: whatsup;
npx sequelize-cli db:migrate
npm run dev
```

​

### Production

​

```sh
npm install --production
NODE_ENV=production
npm start
```

​

## Plugins

​
| Plugin | README |
| ------ | ------ |
| Json Web Token | [plugins/jsonwebtoken/README.md][pljw] |
| Bcryptjs | [plugins/bcryptjs/README.md][plbc] |
| Sequelize | [plugins/googledrive/README.md][plsq] |

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

​
[sequelize]: <https://github.com/sequelize/sequelize/blob/main/README.md>
[node.js]: <http://nodejs.org>
[express]: <http://expressjs.com>
​[PlJw]: <https://github.com/auth0/node-jsonwebtoken/blob/master/README.md>
[PlBc]: <https://github.com/dcodeIO/bcrypt.js/blob/master/README.md>
[PlSq]: <https://github.com/sequelize/sequelize/blob/main/README.md>
