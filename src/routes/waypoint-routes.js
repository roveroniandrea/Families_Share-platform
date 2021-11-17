const express = require('express')
const router = new express.Router()

const Waypoint = require('../models/waypoint')
const Path = require('../models/path')

/**Accepting or rejecting a waypoint in pending status */
router.put('/:id', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Not authenticated')
  }
  const waypoint_id = req.params.id
  const newStatus = req.body.status
  Waypoint.findOne({
    waypoint_id
  })
    .then((waypoint) => {
      if (!waypoint) {
        return res.status(404).send('Not found')
      } else {
        if (waypoint.status !== 'pending') {
          return res.status(401).send('Waypoint not in pending status')
        } else {
          Path.findOne({ path_id: waypoint.path_id }).then(async (path) => {
            if (!path) {
              return res.status(404).send('Path not found')
            } else {
              if (path.car_owner_id !== req.user_id) {
                return res
                  .status(403)
                  .send('Only path owner can accept or reject')
              } else {
                await Waypoint.updateOne(
                  { waypoint_id },
                  { ...waypoint, status: newStatus }
                )
                return res.status(200).send('Waypoint updated')
              }
            }
          })
        }
      }
    })
    .catch(next)
})

/**Deleting a waypoint */
router.delete('/:id', (req, res, next) => {
  if (!req.user_id) {
    return res.status(401).send('Not authenticated')
  }
  const waypoint_id = req.params.id
  Waypoint.findOne({
    waypoint_id
  })
    .then((waypoint) => {
      if (!waypoint) {
        return res.status(404).send('Not found')
      } else {
        Path.findOne({ path_id: waypoint.path_id }).then(async (path) => {
          if (!path) {
            return res.status(404).send('Path not found')
          } else {
            if (
              path.car_owner_id !== req.user_id &&
              waypoint.passenger_id !== req.user_id
            ) {
              return res
                .status(403)
                .send(
                  'Only path owner or passenger itself can cancel a waypoint'
                )
            } else {
              await Waypoint.deleteOne({ waypoint_id })
              return res.status(200).send('Waypoint deleted')
            }
          }
        })
      }
    })
    .catch(next)
})

module.exports = router
