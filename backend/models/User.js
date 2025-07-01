const { Schema, model } = require('mongoose');
const { hash } = require('bcryptjs');

const UserSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  redditRefreshToken: {
    type: String
  },
  redditUsername: {
    type: String
  }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password, 10);
  next();
});

const User = model('User', UserSchema);
module.exports = { User };
