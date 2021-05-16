const users = require('./user');

module.exports = (router) => {
    users(router);
    return router;
};
