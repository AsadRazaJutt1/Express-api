const controller = require('../controllers/users');
const { userType } = require('../constants');
const validateToken = require('../utils').validateToken;
const permit = require('../utils').permit;
module.exports = (router) => {
    router.route('/users')
        .post(controller.add)
        .get(validateToken(userType.ADMIN), controller.getAll); // This route is now protected

    router.route('/login')
        .post(controller.login); 
};