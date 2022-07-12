const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
  username: {
    type: String
  }
})
module.exports.User = mongoose.model('User', UserSchema)

const exerciseSchema = mongoose.Schema({
  username: {
    type: String
  },

  description: {
    type: String
  },
  duration: {
    type: Number
  },
  date: {
    type: Date,
    default: new Date(Date.now())
  }
})
const logsSchema = mongoose.Schema({
  username: {
    type: String,
  },
  count: {
    type: Number,
    default: 1
  },
  log: [{
    description: {
      type: String
    },
    duration: {
      type: Number
    },
    date: {
      type: String
    }
  }]
})
module.exports.Exercise = mongoose.model('exercises', exerciseSchema)
module.exports.Log = mongoose.model('logs', logsSchema)