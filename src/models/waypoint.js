const mongoose = require('mongoose')

const waypointSchema = new mongoose.Schema(
  {
    waypoint_id: {
      type: String,
      required: true,
      unique: true
    },
    path_id: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    passenger_id: {
      type: String,
      required: true
    },
    status: {
      type: String, //'pending' | 'accepted' | 'rejected'
      required: true
    }
  },
  { timestamps: true }
)

mongoose.pluralize(null)
const model = mongoose.model('Waypoint', waypointSchema)

module.exports = model
