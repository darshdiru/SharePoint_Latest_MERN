const mongoose = require('mongoose')

const BoxSchema = new mongoose.Schema({
  connection_email: {
    type: String,
    required: true,
  },
  box_id: {
    type: String,
    required: true,
  },
})

module.exports = Box = mongoose.model('box', BoxSchema)
