const mongoose = require('mongoose')

const carSchema = new mongoose.Schema(
  {
    car_id: {
      type: String,
      unique: true,
      required: true
    },
    car_name: {
      type: String,
      required: true
    },
    num_seats: {
      type: String,
      required: true
    },
    other_info: String
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

mongoose.pluralize(null)
const model = mongoose.model('Car', carSchema)

module.exports = model
