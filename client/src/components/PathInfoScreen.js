import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { withSnackbar } from 'notistack'
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles'
import axios from 'axios'
import ConfirmDialog from './ConfirmDialog'
import OptionsModal from './OptionsModal'
import withLanguage from './LanguageContext'
import Texts from '../Constants/Texts'
import Log from './Log'
import { getFastestRoute, initAutocomplete } from '../Services/MapsService'
import {
  getPath,
  getCar,
  getPathWaypoints
} from '../Services/CarSharingServices'

const styles = (theme) => ({
  root: {
    width: '100%'
  },
  continueButton: {
    backgroundColor: '#00838F',
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    '&:hover': {
      backgroundColor: '#00838F'
    },
    boxShadow: '0 6px 6px 0 rgba(0,0,0,0.24)',
    height: '4.2rem',
    width: '12rem'
  },
  createButton: {
    backgroundColor: '#ff6f00',
    position: 'fixed',
    bottom: '5%',
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '3.2rem',
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    '&:hover': {
      backgroundColor: '#ff6f00'
    }
  },
  stepLabel: {
    root: {
      color: '#ffffff',
      '&$active': {
        color: 'white',
        fontWeight: 500
      },
      '&$completed': {
        color: theme.palette.text.primary,
        fontWeight: 500
      },
      '&$alternativeLabel': {
        textAlign: 'center',
        marginTop: 16,
        fontSize: '5rem'
      },
      '&$error': {
        color: theme.palette.error.main
      }
    }
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    marginTop: theme.spacing.unit,
    color: 'grey',
    marginRight: theme.spacing.unit,
    '&:hover': {
      backgroundColor: '#ffffff'
    }
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    padding: theme.spacing.unit * 3
  }
})

const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiStepper: {
      root: {
        padding: 18
      }
    },
    MuiStepLabel: {
      label: {
        fontFamily: 'Roboto',
        fontSize: '1.56rem'
      }
    },
    MuiButton: {
      root: {
        fontSize: '1.2rem',
        fontFamily: 'Roboto',
        float: 'left'
      }
    }
  }
})

class PathInfoScreen extends React.Component {
  state = {
    fetchedPathData: false,
    path: {},
    car: {},
    optionsModalIsOpen: false,
    confirmDialogIsOpen: false,
    imageModalIsOpen: false,
    waypoints: [],
    requestPassageAtAddress: '',
    displayedRequestPassageAtAddress: '',
    withdrawRequestStep: 2
  }

  constructor() {
    super()
    this.mapRef = React.createRef()
    this.directionsRenderer = new window.google.maps.DirectionsRenderer()
    this.requestPassageRef = React.createRef()
  }

  handleOptions = () => {
    this.setState({ optionsModalIsOpen: true })
  }

  handleDelete = () => {
    const { match, history } = this.props
    const { groupId, path_id } = match.params
    axios
      .delete(`/api/groups/${groupId}/paths/${path_id}`)
      .then((response) => {
        Log.info(response)
        history.goBack()
      })
      .catch((error) => {
        Log.error(error)
        history.goBack()
      })
  }

  handleConfirmDialogOpen = () => {
    this.setState({ optionsModalIsOpen: false, confirmDialogIsOpen: true })
  }

  handleConfirmDialogClose = (choice) => {
    if (choice === 'agree') {
      this.handleDelete()
    }
    this.setState({ confirmDialogIsOpen: false })
  }

  handleWithdrawPassageRequest = (choice) => {
    if (choice === 'agree') {
      const userId = JSON.parse(localStorage.getItem('user')).id
      const myWaypoint = this.state.waypoints.find(
        (w) => w.passenger_id === userId
      )
      if (myWaypoint) {
        axios.delete(`/api/waypoints/${myWaypoint.waypoint_id}`).then(() => {
          window.location.reload()
        })
      }
    } else {
      if (choice === 'disagree') {
        this.setState({ ...this.state, withdrawRequestStep: 2 })
      } else {
        this.setState({
          ...this.state,
          withdrawRequestStep: this.state.withdrawRequestStep - 1
        })
      }
    }
  }

  async componentDidMount() {
    this.directionsRenderer.setMap(
      new window.google.maps.Map(this.mapRef.current)
    )
    const { match } = this.props
    const { groupId, path_id } = match.params
    const userId = JSON.parse(localStorage.getItem('user')).id

    const path = await getPath(groupId, path_id)
    const waypoints = await getPathWaypoints(groupId, path_id)
    const car = await getCar(userId, path.car_id)
    const color = path.color
    getFastestRoute(
      path.from,
      path.to,
      waypoints.map((w) => w.address),
      this.directionsRenderer
    )

    this.setState({ path, car, fetchedPathData: true, color, waypoints })

    initAutocomplete(this.requestPassageRef, (addr) => {
      this.setState({ ...this.state, displayedRequestPassageAtAddress: addr })
      getFastestRoute(
        path.from,
        path.to,
        [...waypoints.map((w) => w.address), addr],
        this.directionsRenderer
      )
    })
  }

  handleRequestPassage = () => {
    const { groupId, path_id } = this.props.match.params
    const userId = JSON.parse(localStorage.getItem('user')).id
    if (this.state.displayedRequestPassageAtAddress) {
      axios
        .post(`/api/groups/${groupId}/paths/${path_id}/waypoints`, {
          user_id: userId,
          address: this.state.displayedRequestPassageAtAddress
        })
        .then(() => {
          window.location.reload()
        })
    }
  }

  render() {
    const { history, language, classes } = this.props
    const { path, car, fetchedPathData, color, waypoints } = this.state
    const texts = Texts[language].PathInfoScreen
    const userId = JSON.parse(localStorage.getItem('user')).id

    const rowStyle = { minHeight: '7rem' }

    const { confirmDialogIsOpen, optionsModalIsOpen } = this.state
    const options = [
      {
        label: texts.delete,
        style: 'optionsModalButton',
        handle: this.handleConfirmDialogOpen
      }
    ]

    const d = new Date(path.departure_date)
    const path_date_format =
      d.getDate() + '/' + (1 + d.getMonth()) + '/' + d.getFullYear()
    const path_time_format = d.getHours() + ':' + d.getMinutes()

    const is_path_owner = path.car_owner_id === userId

    const myWaypoint = waypoints.find((w) => w.passenger_id === userId)

    const selfPassengerRequestStatus = myWaypoint?.status || 'none'

    return (
      <React.Fragment>
        <div id="createActivityContainer">
          <ConfirmDialog
            title={texts.confirmDialogTitle}
            handleClose={this.handleConfirmDialogClose}
            isOpen={confirmDialogIsOpen}
          />
          <div id="pathHeaderContainer" style={{ backgroundColor: color }}>
            <div className="row no-gutters" id="profileHeaderOptions">
              <div className="col-2-10">
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={() => history.goBack()}
                >
                  <i className="fas fa-arrow-left" />
                </button>
              </div>
              <div className="col-6-10" />
              {is_path_owner ? (
                <React.Fragment>
                  <div className="col-1-10" />
                  <div className="col-1-10">
                    <button
                      type="button"
                      className="transparentButton center"
                      onClick={this.handleOptions}
                    >
                      <i className="fas fa-ellipsis-v" />
                    </button>
                  </div>
                </React.Fragment>
              ) : (
                <div />
              )}
            </div>
            <OptionsModal
              isOpen={optionsModalIsOpen}
              handleClose={this.handleClose}
              options={options}
            />
          </div>

          <div className={classes.root}>
            <MuiThemeProvider theme={muiTheme}>
              <div id="createActivityInformationContainer">
                <br />
                <br />
                <div className="row no-gutters">
                  <div
                    id="createActivityTimeslotsHeader"
                    className="col-6-10 center"
                  >
                    <h1 className="center">{texts.car}</h1>
                  </div>
                  <div
                    id="createActivityTimeslotsHeader"
                    className="col-4-10"
                  />
                </div>
                <div className="row no-gutters" style={rowStyle}>
                  <div className="col-2-10">
                    <i className="fas fa-car center" />
                  </div>
                  <div
                    className="col-8-10"
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}
                  >
                    <h2 className="center">{car.car_name}</h2>
                  </div>
                </div>

                <br />
                <br />
                <div className="row no-gutters">
                  <div
                    id="createActivityTimeslotsHeader"
                    className="col-6-10 center"
                  >
                    <h1 className="center">{texts.start}</h1>
                  </div>
                  <div
                    id="createActivityTimeslotsHeader"
                    className="col-4-10"
                  />
                </div>
                <div className="row no-gutters" style={rowStyle}>
                  <div className="col-2-10">
                    <i className="fas fa-map-marker-alt center" />
                  </div>
                  <div
                    className="col-8-10"
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}
                  >
                    <h2 className="center">{path.from}</h2>
                  </div>
                </div>

                <br />
                <br />
                <div className="row no-gutters">
                  <div
                    id="createActivityTimeslotsHeader"
                    className="col-6-10 center"
                  >
                    <h1 className="center">{texts.destination}</h1>
                  </div>
                  <div
                    id="createActivityTimeslotsHeader"
                    className="col-4-10"
                  />
                </div>
                <div className="row no-gutters" style={rowStyle}>
                  <div className="col-2-10">
                    <i className="fas fa-map-marker-alt center" />
                  </div>
                  <div
                    className="col-8-10"
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}
                  >
                    <h2 className="center">{path.to}</h2>
                  </div>
                </div>

                <br />
                <br />
                <div className="row no-gutters">
                  <div
                    id="createActivityTimeslotsHeader"
                    className="col-6-10 center"
                  >
                    <h1 className="center">{texts.date}</h1>
                  </div>
                  <div
                    id="createActivityTimeslotsHeader"
                    className="col-4-10"
                  />
                </div>
                <div className="row no-gutters" style={rowStyle}>
                  <div className="col-2-10">
                    <i className="fas fa-calendar-alt center" />
                  </div>
                  <div
                    className="col-8-10"
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}
                  >
                    <h2 className="center">{path_date_format}</h2>
                  </div>
                </div>

                <br />
                <br />
                <div className="row no-gutters">
                  <div
                    id="createActivityTimeslotsHeader"
                    className="col-6-10 center"
                  >
                    <h1 className="center">{texts.time}</h1>
                  </div>
                  <div
                    id="createActivityTimeslotsHeader"
                    className="col-4-10"
                  />
                </div>
                <div className="row no-gutters" style={rowStyle}>
                  <div className="col-2-10">
                    <i className="fas fa-clock center" />
                  </div>
                  <div
                    className="col-8-10"
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}
                  >
                    <h2 className="center">{path_time_format}</h2>
                  </div>
                </div>
                <div className="row no-gutters" style={rowStyle}>
                  <div
                    className="col-2-10"
                    style={{
                      display: 'flex',
                      justifyContent: 'end',
                      alignItems: 'center'
                    }}
                  >
                    <img src="/images/profiles/car-seat.png" />
                  </div>
                  <div className="col-8-10">
                    <h2 className="center">{texts.otherPassengers}</h2>
                  </div>
                </div>
                <div className="row no-gutters">
                  <div className="col-2-10"></div>
                  <div className="col-8-10">
                    <table style={{ width: '100%', color: 'black' }}>
                      <thead>
                        <tr>
                          <td style={{ border: '1px solid black' }}>
                            {texts.passenger}
                          </td>
                          <td style={{ border: '1px solid black' }}>
                            {texts.requestStatus}
                          </td>
                          <td style={{ border: '1px solid black' }}>
                            {texts.action}
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {waypoints?.map((w, i) => (
                          <tr key={i}>
                            <td>
                              {w?.waypoint_id === myWaypoint?.waypoint_id ? (
                                <b>{texts.yourRequest}</b>
                              ) : (
                                w.passenger_id
                              )}
                            </td>
                            <td>{w.status}</td>
                            <td>
                              {is_path_owner &&
                                w.status === 'pending' &&
                                'TODO: accetta/rifiuta'}
                              {is_path_owner &&
                                w.status === 'accepted' &&
                                'TODO: elimina dal percorso'}
                              {w?.waypoint_id === myWaypoint?.waypoint_id &&
                                (w.status === 'pending' || w.status === 'accepted') && (
                                  <button
                                    onClick={this.handleWithdrawPassageRequest}
                                  >
                                    {texts.withdrawRequest}
                                  </button>
                                )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {waypoints.length === 0 && <p>{texts.noPassengers}</p>}
                  </div>
                </div>
                {!is_path_owner && selfPassengerRequestStatus === 'none' && (
                  <div className="row no-gutters">
                    <div className="col-2-10"></div>
                    <div className="col-8-10">
                      <input
                        type="text"
                        placeholder={texts.requestPassage}
                        onChange={(e) =>
                          this.setState({
                            ...this.state,
                            requestPassageAtAddress: e.target.value
                          })
                        }
                        ref={this.requestPassageRef}
                      />
                      <button
                        onClick={this.handleRequestPassage}
                        disabled={!Boolean(this.state.requestPassageAtAddress)}
                      >
                        {texts.requestPassage}
                      </button>
                    </div>
                  </div>
                )}
                <br />
                <br />
                <div
                  className="row no-gutters"
                  style={{
                    ...rowStyle,
                    height: '300px',
                    marginRight: '20px'
                  }}
                >
                  <div className="col-2-10"></div>
                  <div ref={this.mapRef} className="col-8-10"></div>
                </div>
                <br />
                <br />
              </div>
            </MuiThemeProvider>
          </div>
        </div>
        <ConfirmDialog
          title={texts.confirmWithdraw}
          handleClose={this.handleWithdrawPassageRequest}
          isOpen={this.state.withdrawRequestStep === 1}
        />
      </React.Fragment>
    )
  }
}

PathInfoScreen.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  enqueueSnackbar: PropTypes.func
}
export default withSnackbar(
  withRouter(withLanguage(withStyles(styles)(PathInfoScreen)))
)
