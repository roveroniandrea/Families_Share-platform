import React from 'react'
import PropTypes from 'prop-types'
import CarProfileHeader from './CarProfileHeader'
import CarProfileInfo from './CarProfileInfo'
import LoadingSpinner from './LoadingSpinner'
import { getCar } from '../Services/CarSharingServices'

class CarProfileScreen extends React.Component {
  state = { fetchedCarData: false, car: {} }

  async componentDidMount() {
    const { match } = this.props
    const { profileId, carId } = match.params
    const car = await getCar(profileId, carId)
    this.setState({ car, fetchedCarData: true })
  }

  render() {
    const { car, fetchedCarData } = this.state
    return fetchedCarData ? (
      <React.Fragment>
        <CarProfileHeader background={`#00838F`} name={`${car.car_name}`} />
        <CarProfileInfo num_seats={car.num_seats} other_info={car.other_info} />
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    )
  }
}

CarProfileScreen.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
}

export default CarProfileScreen
