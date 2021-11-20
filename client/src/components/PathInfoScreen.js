import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { withSnackbar } from 'notistack'
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import moment from 'moment'
import axios from 'axios'
import withLanguage from './LanguageContext'
import BackNavigation from "./BackNavigation";
import CreatePathInformation from './CreatePathInformation'
import CreatePathDates from './CreatePathDates'
import CreatePathTimeslots from './CreatePathTimeslots'
import Texts from '../Constants/Texts'
import Log from './Log'
import LoadingSpinner from './LoadingSpinner'

const getPath = (groupId, pathId) => {
  return axios
    .get(`/api/groups/${groupId}/paths/${pathId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {
        path_id: "",
        car_owner_id: "",
        car_id: "",
        group_id: "",
        departure_date: new Date(),
        from: "",
        to: "",
        color: ""
      };
    });
};

const getCar = (userId, car_Id) => {
  return axios
    .get(`/api/users/${userId}/cars/${car_Id}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {
        car_id: "err",
        owner_id: "err",
        car_name: "err",
        num_seats: 2,
        other_info: "err"
      };
    });
};

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
  state = { fetchedPathData: false, path: {}, car: {} };

  async componentDidMount() {
    const { match } = this.props
    const { groupId, path_id } = match.params
    const userId = JSON.parse(localStorage.getItem("user")).id

    const path = await getPath(groupId, path_id)
    const car = await getCar(userId, path.car_id)
    this.setState({ path, car, fetchedPathData: true });
  }

  render() {
    const { history, language, classes } = this.props
    const texts = Texts[language].PathInfoScreen
    const { path, car, fetchedPathData, color } = this.state;
    const rowStyle = { minHeight: '7rem' }
    //const steps = texts.stepLabels
    //const { activeStep, stepWasValidated, creating } = this.state
    return (
      <div id="createActivityContainer">
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => history.goBack()}
        />

        <div className={classes.root}>
          <MuiThemeProvider theme={muiTheme}>

            <div id="createActivityInformationContainer">
              <br/><br/>
              <div className="row no-gutters">
                <div id="createActivityTimeslotsHeader" className="col-2-10">
                  <h1 className="center">{texts.car}</h1>
                </div>
                <div id="createActivityTimeslotsHeader" className="col-8-10" />
              </div>

              <div className="row no-gutters" style={rowStyle} >
                <div className="col-2-10">
                  <i className="fas fa-car center" />
                </div>
                <div className="col-8-10" style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                  <h2 className="center">{car.car_name}</h2>
                </div>
              </div>
              <br/>

              <div className="row no-gutters">
                <div id="createActivityTimeslotsHeader" className="col-2-10">
                  <h1 className="center">{texts.start}</h1>
                </div>
                <div id="createActivityTimeslotsHeader" className="col-8-10" />
              </div>


              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <i className="fas fa-map-marker-alt center" />
                </div>
                <div className="col-8-10" style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                  <h2 className="center">{path.from}</h2>
                </div>
              </div>
              <br/>

              <div className="row no-gutters">
                <div id="createActivityTimeslotsHeader" className="col-2-10">
                  <h1 className="center">{texts.destination}</h1>
                </div>
                <div id="createActivityTimeslotsHeader" className="col-8-10" />
              </div>

              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <i className="fas fa-map-marker-alt center" />
                </div>
                <div className="col-8-10" style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                  <h2 className="center">{path.to}</h2>
                </div>
              </div>
              <br/>

              <div className="row no-gutters">
                <div id="createActivityTimeslotsHeader" className="col-2-10">
                  <h1 className="center">{texts.color}</h1>
                </div>
                <div id="createActivityTimeslotsHeader" className="col-8-10" />
              </div>


              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <i
                    className="fas fa-palette center"
                    style={{ color }}
                    alt="palette icon"
                  />
                </div>
                <div className="col-8-10" style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                  <h2 className="center">{path.color}</h2>
                </div>
              </div>
              <br/>

              <div className="row no-gutters">
                <div id="createActivityTimeslotsHeader" className="col-2-10">
                  <h1 className="center">{texts.date}</h1>
                </div>
                <div id="createActivityTimeslotsHeader" className="col-8-10" />
              </div>

              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <i className="fas fa-calendar-alt center" />
                </div>
                <div className="col-8-10" style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                  <h2 className="center">{path.departure_date}</h2>
                </div>
              </div>
              <br/>

              <div className="row no-gutters">
                <div id="createActivityTimeslotsHeader" className="col-6-10">
                  <h1 className="center">{texts.time}</h1>
                </div>
                <div id="createActivityTimeslotsHeader" className="col-4-10" />
              </div>

              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <i className="fas fa-clock center" />
                </div>
                <div className="col-8-10" style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                  <h2 className="center">{path.departure_date}</h2>
                </div>
              </div>
              <br/>
            </div>

          </MuiThemeProvider>
        </div>

      </div>


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