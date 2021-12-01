import React from 'react'
import moment from 'moment'
import * as path from 'lodash.get'
import { HuePicker } from 'react-color'
import axios from 'axios'
import PropTypes from 'prop-types'
import withLanguage from './LanguageContext'
import Texts from '../Constants/Texts'
import LoadingSpinner from './LoadingSpinner'
import Log from './Log'
import { getCar } from '../Services/CarSharingServices'

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',')

  const mime = arr[0].match(/:(.*?);/)[1]

  const bstr = atob(arr[1])

  let n = bstr.length

  const u8arr = new Uint8Array(n)
  while (n) {
    n -= 1
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

class EditCarProfileScreen extends React.Component {
  state = {
    fetchedChildData: false,
    month: moment().month() + 1,
    year: moment().year()
  }

  componentDidMount() {
    const { history } = this.props
    const { state } = history.location
    document.addEventListener('message', this.handleMessage, false)
    if (state !== undefined) {
      this.setState({ ...state })
    } else {
      const { match } = this.props
      const { profileId: userId, carId } = match.params
      getCar(userId, carId).then((car) => {
        if (car) {
          this.setState({ fetchedCarData: true, ...car })
        } else {
          this.setState({
            fetchedCarData: true,
            car_id: '',
            owner_id: '',
            car_name: '',
            num_seats: 2,
            other_info: ''
          })
        }
      })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('message', this.handleMessage, false)
  }

  handleMessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.action === 'fileUpload') {
      const image = `data:image/png;base64, ${data.value}`
      this.setState({
        image: { path: image },
        file: dataURLtoFile(image, 'photo.png')
      })
    }
  }

  handleCancel = () => {
    const { history } = this.props
    history.goBack()
  }

  handleChange = (event) => {
    const { name } = event.target
    const { value } = event.target
    this.setState({ [name]: value })
  }

  validate = () => {
    const { language } = this.props
    const texts = Texts[language].editCarProfileScreen
    const formLength = this.formEl.length
    if (this.formEl.checkValidity() === false) {
      for (let i = 0; i < formLength; i += 1) {
        const elem = this.formEl[i]
        const errorLabel = document.getElementById(`${elem.name}Err`)
        if (errorLabel && elem.nodeName.toLowerCase() !== 'button') {
          if (!elem.validity.valid) {
            if (elem.validity.valueMissing) {
              errorLabel.textContent = texts.requiredErr
            }
          } else {
            errorLabel.textContent = ''
          }
        }
      }
      return false
    }
    for (let i = 0; i < formLength; i += 1) {
      const elem = this.formEl[i]
      const errorLabel = document.getElementById(`${elem.name}Err`)
      if (errorLabel && elem.nodeName.toLowerCase() !== 'button') {
        errorLabel.textContent = ''
      }
    }
    return true
  }

  handleAdd = (event) => {
    const { history } = this.props
    const { pathname } = history.location
    event.preventDefault()
    history.push({
      pathname: `${pathname}/additional`,
      state: {
        ...this.state,
        editCar: true
      }
    })
    return false
  }

  handleColorChange = (color) => {
    this.setState({ background: color.hex })
  }

  submitChanges = () => {
    const { match, history } = this.props
    const { profileId: userId, carId } = match.params
    const { car_name, num_seats, other_info } = this.state
    const bodyFormData = new FormData()

    bodyFormData.append('car_name', car_name)
    bodyFormData.append('num_seats', num_seats)
    bodyFormData.append('other_info', other_info)

    axios
      .patch(`/api/users/${userId}/cars/${carId}`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        Log.info(response)
        history.goBack()
      })
      .catch((error) => {
        Log.error(error)
        history.goBack()
      })
  }

  handleSave = (event) => {
    event.preventDefault()
    if (this.validate()) {
      this.submitChanges()
    }
    this.setState({ formIsValidated: true })
  }

  render() {
    const { language, history } = this.props
    const {
      car_name,
      num_seats,
      other_info,
      formIsValidated,
      fetchedCarData
    } = this.state
    const texts = Texts[language].editCarProfileScreen
    const formClass = []

    if (formIsValidated) {
      formClass.push('was-validated')
    }
    return fetchedCarData ? (
      <React.Fragment>
        <div
          id="editChildProfileHeaderContainer"
          style={{ backgroundColor: '#00838F' }}
        >
          <div className="row no-gutters" id="profileHeaderOptions">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => history.goBack()}
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="col-6-10">
              <h1 className="verticalCenter">{texts.backNavTitle}</h1>
            </div>
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handleSave}
              >
                <i className="fas fa-check" />
              </button>
            </div>
          </div>
        </div>

        <div id="editChildProfileInfoContainer" className="horizontalCenter">
          <form
            ref={(form) => {
              this.formEl = form
            }}
            onSubmit={this.handleSave}
            className={formClass}
            noValidate
          >
            <div className="row no-gutters">
              <div className="col-5-10">
                <div className="fullInput editChildProfileInputField center">
                  <label htmlFor="name">{texts.name}</label>
                  <input
                    type="text"
                    name="car_name"
                    className="form-control"
                    onChange={this.handleChange}
                    required
                    value={car_name}
                  />
                  <span className="invalid-feedback" id="given_nameErr" />
                </div>
              </div>
              <div className="col-5-10">
                <div className="fullInput editChildProfileInputField center">
                  <label htmlFor="surname">{texts.seats}</label>
                  <input
                    type="text"
                    name="num_seats"
                    className="form-control"
                    onChange={this.handleChange}
                    required
                    value={num_seats}
                  />
                  <span className="invalid-feedback" id="family_nameErr" />
                </div>
              </div>
            </div>

            <div id="additionalInformationContainer" className="row no-gutters">
              <div className="col-7-10">
                <div className="center">
                  <h1>{texts.additional}</h1>
                  <h2>{texts.example}</h2>
                </div>
              </div>
              <div className="col-3-10">
                <button
                  className="center"
                  type="button"
                  onClick={this.handleAdd}
                >
                  {texts.add}
                </button>
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    )
  }
}

export default withLanguage(EditCarProfileScreen)

EditCarProfileScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object
}
