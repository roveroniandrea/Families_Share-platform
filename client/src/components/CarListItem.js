import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Texts from '../Constants/Texts'
import withLanguage from './LanguageContext'
import { Skeleton } from 'antd'
import { getCar } from '../Services/CarSharingServices'

class CarListItem extends React.Component {
  state = { fetchedCar: false, car: {} }

  componentDidMount() {
    const { userId, carId } = this.props
    getCar(userId, carId).then((car) => {
      if (car) {
        this.setState({ fetchedCar: true, car })
      } else {
        this.setState({
          fetchedCar: true,
          car: {
            car_id: '',
            owner_id: '',
            car_name: '',
            num_seats: 2
          }
        })
      }
    })
  }

  render() {
    const { language, history, carId } = this.props
    const { pathname } = history.location
    const { car, fetchedCar } = this.state
    const texts = Texts[language].carListItem
    const route = `${pathname}/${carId}`
    return (
      <div
        className="row no-gutters profileInfoContainer"
        role="button"
        tabIndex={-42}
        onClick={() => history.push(route)}
        id="carInfoContainer"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.1' }}
      >
        {fetchedCar ? (
          <React.Fragment>
            <div className="col-5-10">
              <i className="fas fa-car center" />
            </div>
            <div className="col-5-10">
              <div className="verticalCenter">
                <h1>{car.car_name}</h1>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <Skeleton avatar active paragraph={{ rows: 1 }} />
        )}
      </div>
    )
  }
}

export default withRouter(withLanguage(CarListItem))

CarListItem.propTypes = {
  carId: PropTypes.string,
  userId: PropTypes.string,
  language: PropTypes.string,
  history: PropTypes.object
}
