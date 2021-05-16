const jwt = require('jsonwebtoken');

module.exports = {
    validateToken: (...userTypes) => {
        return (req, res, next) => {
            const authorizationHeaader = req.headers.authorization;
            let result;
            if (authorizationHeaader) {
                const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
                const options = {
                    expiresIn: '2d',
                    issuer: 'http://Killer.io'
                };
                try {
                    // verify makes sure that the token hasn't expired and has been issued by us
                    result = jwt.verify(token, process.env.JWT_SECRET, options);

                    // Let's pass back the decoded token to the request object
                    req.decoded = result;
                    type = req.decoded.type;
                    if (req.decoded && (userTypes.includes(type) === true)) {
                        next(); // role is allowed, so continue on the next middleware
                    } else {
                        res.status(403).send({ message: "Forbidden" }); // user is forbidden
                    }
                } catch (err) {
                    // Throw an error just in case anything goes wrong with verification
                    throw new Error(err);
                }
            } else {
                result = {
                    error: `Authentication error. Token required.`,
                    status: 401
                };
                res.status(401).send(result);
            }
        }
    }
    
    // middleware for doing role-based permissions
//      permit: (...permittedRoles) => {
//         //  console.log(permittedRoles);
//     // return a middleware
//     return (request, response, next) => {
//         const { user } = request
//         console.log(request);
//         if (user ) {
//             next(); // role is allowed, so continue on the next middleware
//         } else {
//             response.status(403).json({ message: "Forbidden" }); // user is forbidden
//         }
//     }
// }
};