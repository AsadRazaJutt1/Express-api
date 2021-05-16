const controller = require('../controllers/users');
const validateToken = require('../utils').validateToken;
module.exports = (router) => {
    router.route('/users')
        .post(controller.add)
        .get(validateToken, controller.getAll); // This route is now protected

    router.route('/login')
        .post(controller.login);
};