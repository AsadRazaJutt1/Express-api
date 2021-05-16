const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

// schema maps to a collection
const Schema = mongoose.Schema;

// encrypt password before save

const userSchema = new Schema({
    name: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
    type: {
      type: Number,
      required: true,
      trim: true,
    },
    password: {
        type: 'String',
        required: true,
        trim: true
    }
});

userSchema.pre('save', (next) => {
  const user = this;
  if(!user.isModified || !user.isNew) { // don't rehash if it's an old user
    console.log("old");
    next();
  } else {
    console.log("new");
    bcrypt.hash(user.password, stage.saltingRounds, (err, hash) => {
      if (err) {
        console.log('Error hashing password for user', user.name);
        next(err);
      } else {
        user.password = hash;
        next();
      }
    });
  }
});

module.exports = mongoose.model('User', userSchema);