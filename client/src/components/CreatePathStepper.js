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
import CreatePathInformation from './CreatePathInformation'
import CreatePathDates from './CreatePathDates'
import CreatePathTimeslots from './CreatePathTimeslots'
import Texts from '../Constants/Texts'
import Log from './Log'
import LoadingSpinner from './LoadingSpinner'

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

class CreatePathStepper extends React.Component {
  constructor(props) {
    super(props)
    const colors = [
      '#f44336',
      '#e91e63',
      '#9c27b0',
      '#673ab7',
      '#3f51b5',
      '#2196f3',
      '#03a9f4',
      '#00bcd4',
      '#009688',
      '#4caf50',
      '#8bc34a',
      '#cddc39',
      '#ffeb3b',
      '#ffc107',
      '#ff9800',
      '#ff5722',
      '#795548',
      '#607d8b'
    ]
    this.state = {
      activeStep: 0,
      information: {
        color: colors[Math.floor(Math.random() * colors.length)],
        from: '',
        to: '',
        car_id: ''
      },
      dates: {
        selectedDays: [],
        repetition: false,
        repetitionType: '',
        lastSelect: new Date()
      },
      timeslots: {
        activityTimeslots: [],
        differentTimeslots: false
      },
      stepWasValidated: false,
      creating: false
    }
  }

  componentDidMount() {
    document.addEventListener('message', this.handleMessage, false)
  }

  componentWillUnmount() {
    document.removeEventListener('message', this.handleMessage, false)
  }

  handleMessage = (event) => {
    const data = JSON.parse(event.data)
    const { history } = this.props
    const { activeStep } = this.state
    if (data.action === 'stepperGoBack') {
      if (activeStep - 1 >= 0) {
        this.setState({ activeStep: activeStep - 1 })
      } else {
        history.goBack()
      }
    }
  }

  createPath = () => {
    const { match, history, enqueueSnackbar, language } = this.props
    const texts = Texts[language].createPathStepper
    const { groupId } = match.params
    const { information, dates, date } = this.state
    const userId = JSON.parse(localStorage.getItem('user')).id
    const departure_date = dates.selectedDays[0]
    departure_date.setHours(date.slice(0, 2), date.slice(3, 5))
    const path = {
      car_owner_id: userId,
      group_id: groupId,
      departure_date,
      from: information.from,
      to: information.to,
      color: information.color,
      car_id: information.car_id
    }
    this.setState({ creating: true })
    axios
      .post(`/api/groups/${groupId}/paths`, { path })
      .then(response => {
        Log.info(response);
        history.goBack();
      })
      .catch(error => {
        Log.error(error);
        history.goBack();
      });
  }

  handleContinue = () => {
    const { activeStep } = this.state
    if (activeStep === 2) {
      this.createPath()
    } else {
      this.setState({
        activeStep: activeStep + 1
      })
    }
  }

  handleCancel = () => {
    const { activeStep } = this.state
    this.setState({
      activeStep: activeStep - 1
    })
  }

  handleInformationSubmit = (information, wasValidated) => {
    this.setState({ information, stepWasValidated: wasValidated })
  }

  handleDatesSubmit = (dates, wasValidated) => {
    this.setState({ dates, stepWasValidated: wasValidated })
  }

  handleTimeslotsSubmit = (date) => {
    this.setState({ date })
  }

  getStepContent = () => {
    const { activeStep, information, dates } = this.state
    switch (activeStep) {
      case 0:
        return (
          <CreatePathInformation
            {...information}
            handleSubmit={this.handleInformationSubmit}
          />
        )
      case 1:
        return (
          <CreatePathDates {...dates} handleSubmit={this.handleDatesSubmit} />
        )
      case 2:
        return (
          <CreatePathTimeslots
            activityName={information.name}
            activityLocation={information.location}
            activityLink={information.link}
            dates={dates.selectedDays}
            handleSubmit={this.handleTimeslotsSubmit}
          />
        )
      default:
        return <div>Lorem Ipsum</div>
    }
  }

  getStepLabel = (label, index) => {
    const { activeStep } = this.state
    const iconStyle = { fontSize: '2rem' }
    let icon = ''
    switch (index) {
      case 0:
        icon = 'fas fa-info-circle'
        break
      case 1:
        icon = 'fas fa-calendar-alt'
        break
      case 2:
        icon = 'fas fa-clock'
        break
      default:
        icon = 'fas fa-exclamation'
    }
    if (activeStep >= index) {
      iconStyle.color = '#00838F'
    } else {
      iconStyle.color = 'rgba(0,0,0,0.5)'
    }
    return (
      <div id="stepLabelIconContainer">
        <i className={icon} style={iconStyle} />
      </div>
    )
  }

  getDatesCompletedLabel = (label) => {
    const { dates: days } = this.state
    const { selectedDays, repetitionType } = days
    let completedLabel = ''
    if (repetitionType === 'monthly') {
      const selectedDay = moment(selectedDays[0])
      completedLabel = `Every ${selectedDay.format('Do ')}`
    } else {
      const eachMonthsDates = {}
      selectedDays.forEach((selectedDay) => {
        const key = moment(selectedDay).format('MMMM YYYY')
        if (eachMonthsDates[key] === undefined) {
          eachMonthsDates[key] = [selectedDay]
        } else {
          eachMonthsDates[key].push(selectedDay)
        }
      })
      const months = Object.keys(eachMonthsDates)
      const dates = Object.values(eachMonthsDates)
      for (let i = 0; i < months.length; i += 1) {
        let monthString = ''
        dates[i].forEach((date) => {
          monthString += ` ${moment(date).format('DD')},`
        })
        monthString = monthString.substr(0, monthString.length - 1)
        monthString += ` ${months[i]}`
        completedLabel += ` ${monthString}, `
      }
      completedLabel = completedLabel.substr(0, completedLabel.length - 2)
    }
    return (
      <div style={{ paddingTop: '2 rem' }}>
        <div className="row-nogutters">{label}</div>
        <div className="row-nogutters" style={{ opacity: 0.54 }}>
          {completedLabel}
        </div>
      </div>
    )
  }

  render() {
    const { language, classes } = this.props
    const texts = Texts[language].createPathStepper
    const steps = texts.stepLabels
    const { activeStep, stepWasValidated, creating } = this.state
    return (
      <div className={classes.root}>
        {creating && <LoadingSpinner />}
        <MuiThemeProvider theme={muiTheme}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel
                    icon={this.getStepLabel(label, index)}
                    className={classes.stepLabel}
                  >
                    {activeStep > index && index === 1 ? (
                      <div>{this.getDatesCompletedLabel(label)}</div>
                    ) : (
                      label
                    )}
                  </StepLabel>
                  <StepContent>
                    {this.getStepContent()}
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={!stepWasValidated}
                          variant="contained"
                          color="primary"
                          onClick={this.handleContinue}
                          className={
                            activeStep === steps.length - 1
                              ? classes.createButton
                              : classes.continueButton
                          }
                        >
                          {activeStep === steps.length - 1
                            ? texts.finish
                            : texts.continue}
                        </Button>
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleCancel}
                          className={classes.cancelButton}
                        >
                          {texts.cancel}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              )
            })}
          </Stepper>
        </MuiThemeProvider>
      </div>
    )
  }
}

CreatePathStepper.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  enqueueSnackbar: PropTypes.func
}
export default withSnackbar(
  withRouter(withLanguage(withStyles(styles)(CreatePathStepper)))
)
