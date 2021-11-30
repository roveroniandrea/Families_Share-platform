import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import Texts from '../Constants/Texts'
import withLanguage from './LanguageContext'
import Log from './Log'
import { Skeleton } from 'antd'
import {
  getUser,
  getCar,
  getPathWaypoints
} from '../Services/CarSharingServices.js'

const getNumWaypoints = async (groupId, pathId) => {
  const wTemp = await getPathWaypoints(groupId, pathId)
  const w = wTemp.filter((wP)=>wP.status === 'accepted');
  return w.length
}

class PathListItem extends React.Component {
  constructor(props) {
    super(props)
    const { path } = this.props
    this.state = {
      path,
      userInfo: '',
      available_seats: '',
      fetchedTimeslots: false
    }
    this.info(path.car_owner_id, path.car_id)
  }

  handleActivityClick = (event) => {
    const { history } = this.props
    const { pathname } = history.location
    history.push(`${pathname}/${event.currentTarget.id}`)
  }

  async info(user_id, car_id) {
    const user = await getUser(user_id)

    const car = await getCar(user_id, car_id)
    const available_seats =
      car.num_seats -
      (await getNumWaypoints(this.props.groupId, this.props.path.path_id))

    this.setState({
      ...this.state,
      userInfo: user.given_name + ' ' + user.family_name,
      available_seats: available_seats,
      fetchedTimeslots: true
    })
  }

  getDatesString = () => {
    const { language } = this.props
    const { path } = this.state
    const texts = Texts[language].pathListItem
    let departure_date = new Date(path.departure_date)
    let datesString = moment(departure_date).format('DD-MM-YYYY ')
    let timeString = moment(departure_date).format(' HH:mm ')
    return datesString + texts.at + timeString
  }

  render() {
    const { language } = this.props
    const { path, userInfo, available_seats, fetchedTimeslots } = this.state
    const texts = Texts[language].pathListItem
    return fetchedTimeslots ? (
      <React.Fragment>
        <div
          role="button"
          tabIndex="0"
          onKeyPress={this.handleActivityClick}
          className="row no-gutters"
          style={{ minHheight: '7rem', cursor: 'pointer' }}
          id={path.path_id}
          onClick={this.handleActivityClick}
        >
          <div className="col-2-10">
            <i
              style={{
                fontSize: '3rem',
                color: path.color
              }}
              className="fas fa-certificate center"
            />
          </div>
          <div
            className="col-3-10"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}
          >
            <div className="verticalCenter">
              <div className="row no-gutters">
                <h1>
                  {texts.destination}: {path.to}
                </h1>
              </div>
              <div className="row no-gutters">
                <i
                  className="far fa-calendar-alt"
                  style={{ marginRight: '1rem' }}
                />
                <h2>{this.getDatesString()}</h2>
              </div>
            </div>
          </div>
          <div
            className="col-1-10"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}
          ></div>
          <div
            className="col-2-10"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}
          >
            <div className="verticalCenter">
              <div className="row no-gutters">
                <h1>{userInfo}</h1>
              </div>
              <div className="row no-gutters">
                <img
                  src="/images/profiles/car-seat.png"
                  style={{ marginRight: '1rem', height: '16px' }}
                />

                <h2>{available_seats}</h2>
              </div>
            </div>
          </div>
          <div
            className="col-2-10"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}
          >
            <i
              style={{ fontSize: '2rem' }}
              className="fas fa-chevron-right center"
            />
          </div>
        </div>
      </React.Fragment>
    ) : (
      <Skeleton avatar active paragraph={{ rows: 1 }} />
    )
  }
}

export default withRouter(withLanguage(PathListItem))

PathListItem.propTypes = {
  path: PropTypes.object,
  groupId: PropTypes.string,
  history: PropTypes.object,
  language: PropTypes.string
}
