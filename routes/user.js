const UserController = require('../Controllers/UserController');
const { userType } = require('../Constants');
const validateToken = require('../Utils').validateToken;
const permit = require('../Utils').permit;
module.exports = (router) => {
    router.route('/users')
        .post(UserController.add)
        .get(validateToken(userType.ADMIN), UserController.getAll); // This route is now protected

    router.route('/login')
        .post(UserController.login);
};