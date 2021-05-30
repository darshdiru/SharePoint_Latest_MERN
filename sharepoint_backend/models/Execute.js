const mongoose = require('mongoose')

const ExecuteSchema = new mongoose.Schema({
  execute_response: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  api_name: {
    type: String,
  },
})

module.exports = Execute = mongoose.model('execute', ExecuteSchema)
