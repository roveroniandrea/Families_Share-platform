import React from 'react'
import PropTypes from 'prop-types'
import autosize from 'autosize'
import { CirclePicker } from 'react-color'
import withLanguage from './LanguageContext'
import Texts from '../Constants/Texts'
import axios from 'axios'
import Log from './Log'
import {
  getFastestRoute,
  initAutocomplete,
  linkToOpenGMaps
} from '../Services/MapsService'

class CreatePathInformation extends React.Component {
  constructor(props) {
    super(props)
    const { handleSubmit, from, to, color, car_id } = this.props
    this.state = {
      from,
      to,
      displayedFrom: '',
      displayedTo: '',
      color,
      car_id,
      myCars: [],
      pathExists: false
    }
    this.getMyCars().then((cars) => {
      this.setState({ ...this.state, myCars: cars })
    })

    handleSubmit(this.state, this.validate(this.state))
    autosize(document.querySelectorAll('textarea'))
    this.fromRef = React.createRef()
    this.toRef = React.createRef()
    this.mapRef = React.createRef()
    this.directionsRenderer = new window.google.maps.DirectionsRenderer()
  }

  validate = (state) => {
    if (state.color && state.from && state.to && state.car_id) {
      return true
    }
    return false
  }

  handleChange = (event) => {
    const state = Object.assign({}, this.state)
    const { name, value } = event.target
    const { handleSubmit } = this.props
    state[name] = value
    handleSubmit(state, this.validate(state))
    this.setState(state)
    if (
      (name === 'from' || name === 'to') &&
      this.state.from &&
      this.state.to
    ) {
      getFastestRoute(
        this.state.from,
        this.state.to,
        [],
        this.directionsRenderer
      ).then((res) => {
        this.setState({ ...this.state, pathExists: res.exists })
      })
    }
  }

  handleColorChange = (color) => {
    const { handleSubmit } = this.props
    const state = Object.assign({}, this.state)
    state.color = color.hex
    handleSubmit(state, this.validate(state))
    this.setState(state)
  }

  /**Returns all my cars */
  getMyCars = () => {
    const userId = JSON.parse(localStorage.getItem('user')).id
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

  componentDidMount() {
    this.directionsRenderer.setMap(
      new window.google.maps.Map(this.mapRef.current)
    )
    initAutocomplete(this.fromRef, (addr) => {
      this.handleChange({
        target: { name: 'displayedFrom', value: addr }
      })
      this.handleChange({
        target: { name: 'from', value: addr }
      })
    })
    initAutocomplete(this.toRef, (addr) => {
      this.handleChange({
        target: { name: 'to', value: addr }
      })
      this.handleChange({
        target: { name: 'displayedTo', value: addr }
      })
    })
  }

  getLinkToGmaps = () => {
    return linkToOpenGMaps(this.state.from, this.state.to, [])
  }

  render() {
    const { language } = this.props
    const { displayedTo, displayedFrom, color, car_id, pathExists } = this.state
    const texts = Texts[language].createPathInformation
    const rowStyle = { minHeight: '7rem' }
    return (
      <div id="createActivityInformationContainer">
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-car center" />
          </div>
          <div className="col-8-10">
            <select
              value={car_id}
              onChange={(e) =>
                this.handleChange({
                  target: { name: 'car_id', value: e.target.value }
                })
              }
              placeholder={texts.car}
              name="car_id"
              className="center"
            >
              <option key={0} value="">
                ----
              </option>
              {this.state.myCars.map((c) => (
                <option key={c.car_id} value={c.car_id}>
                  {c.car_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-map-marker-alt center" />
          </div>
          <div className="col-8-10">
            <input
              ref={this.fromRef}
              type="text"
              name="displayedFrom"
              placeholder={texts.from}
              value={displayedFrom}
              className="center"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-map-marker-alt center" />
          </div>
          <div className="col-8-10">
            <input
              ref={this.toRef}
              type="text"
              name="displayedTo"
              placeholder={texts.to}
              value={displayedTo}
              className="center"
              onChange={this.handleChange}
            />
          </div>
        </div>
        {!pathExists && (
          <div className="row no-gutters" style={rowStyle}>
            <div className="col-2-10"></div>
            <div className="col-8-10">
              <h4 style={{ color: 'red' }}>{texts.pathNotExists}</h4>
            </div>
          </div>
        )}
        {pathExists && (
          <>
            <div className="row no-gutters">
              <div className="col-2-10"></div>
              <div className="col-8-10">
                <a
                  type="button"
                  href={this.getLinkToGmaps()}
                  className="joinGroupButton"
                  style={{ color: 'white' }}
                  target="blank"
                >
                  {texts.openGmaps}
                </a>
              </div>
            </div>
            <br />
          </>
        )}
        <div
          className="row no-gutters"
          style={{
            ...rowStyle,
            display: pathExists ? 'flex' : 'none',
            height: '300px'
          }}
        >
          <div className="col-2-10"></div>
          <div ref={this.mapRef} className="col-8-10"></div>
        </div>
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i
              className="fas fa-palette center"
              style={{ color }}
              alt="palette icon"
            />
          </div>
          <div className="col-8-10">
            <h1 className="verticalCenter" style={{ color }}>
              {texts.color}
            </h1>
          </div>
        </div>
        <div className="row no-gutters" style={{ marginBottom: '2rem' }}>
          <div className="col-2-10" />
          <div className="col-8-10">
            <CirclePicker
              width="100%"
              color={color}
              onChange={this.handleColorChange}
            />
          </div>
        </div>
      </div>
    )
  }
}

CreatePathInformation.propTypes = {
  name: PropTypes.string,
  location: PropTypes.string,
  description: PropTypes.string,
  cost: PropTypes.number,
  color: PropTypes.string,
  handleSubmit: PropTypes.func,
  language: PropTypes.string,
  link: PropTypes.string
}

export default withLanguage(CreatePathInformation)
