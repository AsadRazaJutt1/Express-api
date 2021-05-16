const mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userType } = require('../constants');
const connUri = process.env.MONGO_LOCAL_CONN_URL;
module.exports = {
    add: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
            let result = {};
            let status = 201;
            if (!err) {
                const { name, type, password } = req.body;
                const user = new User({ name, type, password }); // document = instance of a model
                // TODO: We can hash the password here before we insert instead of in the model
                user.save((err, user) => {
                    if (!err) {
                        result.status = status;
                        result.result = user;
                    } else {
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }
                    res.status(status).send(result);
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },

    login: (req, res) => {
        const { name, password } = req.body;

        mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                User.findOne({ name }, (err, user) => {
                    if (!err && user) {
                        // We could compare passwords in our model instead of below
                        bcrypt.compare(String(password), user.password).then(match => {
                            if (match) {
                                status = 200;
                                // Create a token
                                const payload = { user: user.name, type: user.type };
                                const options = { expiresIn: '2d', issuer: 'http://Killer.io' };
                                const secret = process.env.JWT_SECRET;
                                const token = jwt.sign(payload, secret, options);

                                // console.log('TOKEN', token);
                                result.token = token;
                                result.status = status;
                                result.result = user;
                            } else {
                                status = 401;
                                result.status = status;
                                result.error = `Authentication error`;
                            }
                            res.status(status).send(result);
                        }).catch(err => {
                            status = 500;
                            result.status = status;
                            result.error = err;
                            res.status(status).send(result);
                        });
                    } else {
                        status = 404;
                        result.status = status;
                        result.error = err;
                        res.status(status).send(result);
                    }
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },

    getAll: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const payload = req.decoded;
                // TODO: Log the payload here to verify that it's the same payload
                //  we used when we created the token
                // console.log('PAYLOAD', payload);
                if (payload && payload.user === 'asad') {
                    User.find({}, (err, users) => {
                        if (!err) {
                            result.status = status;
                            result.error = err;
                            result.result = users;
                        } else {
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    });
                } else {
                    status = 401;
                    result.status = status;
                    result.error = `Authentication error`;
                    res.status(status).send(result);
                }
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    }
}