import Axios from 'axios';

/**Initializes an input field with a Google Maps autocomplete.
 * @param inputRef React inputRef referring to the input component
 * @param onChange Callback with the selected place (string)
 */
export function initAutocomplete(inputRef, onChange) {
  if (window.google && inputRef.current) {
    const a = new window.google.maps.places.Autocomplete(inputRef.current)
    a.place_changed = () => {
      const place = a.getPlace()
      onChange(`${place.name}, ${place.formatted_address}`)
    }
  }
}

/**
 * Returns the fastest path betweeen from and to
 * @param {string} from 
 * @param {string} to 
 * @param {string[]} waypoints 
 * @returns A promise with `{exists: boolean, waypoints: string[]}`. Exists is false if the route does not exist.
 * Waypoint `ids` will be returned in the shortest order
 */
export function getFastestRoute(from, to, waypoints = [], renderer = null) {
  const notFound = {
    exists: false,
    waypoints: []
  }
  if (window.google) {
    const directionsService = new window.google.maps.DirectionsService()
    return directionsService
      .route({
        origin: from,
        destination: to,
        waypoints: waypoints.map((w) => ({
          location: w,
          stopover: false
        })),
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING
      })
      .catch(() => notFound)
      .then((response) => {
        if(response.status === 'OK'){
          if(renderer){
            renderer.setDirections(response);
          }
          return {
            exists: true,
            waypoints: response.geocoded_waypoints.map((w) => w.place_id)
          }
        }
        else{
          return notFound
        }
      }
      )
  } else {
    return Promise.resolve(notFound)
  }
}

/**Returns a url in order to open the native google maps app */
export function linkToOpenGMaps(from, to, waypoints = [], ){
  return `https://www.google.com/maps/dir/?api=1&origin=${from}&destination=${to}&travelmode=driving${waypoints.length > 0? `&waypoints=${waypoints.join('|')}`: ''}`

}
