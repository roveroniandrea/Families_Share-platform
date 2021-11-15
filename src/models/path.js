const mongoose = require('mongoose')

const pathSchema = new mongoose.Schema(
  {
    path_id: {
      type: String,
      required: true,
      unique: true
    },
    car_owner_id: {
      type: String,
      required: true
    },
    group_id: {
      type: String,
      required: true
    },
    departure_date: {
      type: Date,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

mongoose.pluralize(null)
const model = mongoose.model('Path', pathSchema)

module.exports = model
