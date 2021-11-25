import axios from 'axios'
import Log from '../components/Log'

/**Returns details about a user given its id */
export const getUser = async (userId) => {
  try {
    const response = await axios.get(`/api/users/${userId}/profile`)
    return response.data
  } catch (error) {
    Log.error(error)
    return null
  }
}

/**Returns details about a car given its id and owner id */
export const getCar = async (userId, carId) => {
  try {
    const response = await axios.get(`/api/users/${userId}/cars/${carId}`)
    return response.data
  } catch (error) {
    Log.error(error)
    return null
  }
}

/**Returns all the waypoints (not from and to) of a path */
export const getPathWaypoints = async (groupId, pathId) => {
  try {
    const response = await axios.get(
      `/api/groups/${groupId}/paths/${pathId}/waypoints`
    )
    return response.data
  } catch (error) {
    Log.error(error)
    return []
  }
}

/**Returns all the cars of a user given its id */
export const getUserCars = (userId) => {
  return axios
    .get(`/api/users/${userId}/cars`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      Log.error(error)
      return []
    })
}

/**returns all the paths in a group */
export const getGroupPaths = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}/paths`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      Log.error(error)
      return []
    })
}

/**returns details about a path give its id */
export const getPath = (groupId, pathId) => {
  return axios
    .get(`/api/groups/${groupId}/paths/${pathId}`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      Log.error(error)
      return null
    })
}
