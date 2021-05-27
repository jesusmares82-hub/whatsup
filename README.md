# CHAT API REST

### This project was created by [Jesús Mares] (https://github.com/jesusmares82-hub) and Diego Mesa at ACADEMLO.

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

## Tech

​
This project uses a number of open source projects to work properly:
​

- [node.js](http://nodejs.org) - evented I/O for the backend
- [Sequelize](https://github.com/sequelize/sequelize/blob/main/README.md) - ORM for node.js apps
- [Express](http://expressjs.com) - fast node.js network app framework

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
| Json Web Token | [Json Web Token](https://github.com/auth0/node-jsonwebtoken/blob/master/README.md)
| Bcryptjs | [Bcryptjs ](https://github.com/dcodeIO/bcrypt.js/blob/master/README.md) |
| Sequelize | [Sequelize](https://github.com/sequelize/sequelize/blob/main/README.md) |

**Free Software, Hell Yeah!**
