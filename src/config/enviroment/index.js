const development = require('./development');
const production = require('./production');

let enviroment = development;
if (process.env.NODE_ENV === 'production') {
    enviroment = production
}
module.exports = enviroment;