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

const getPath = (groupId, pathId) => {
    return axios
      .get(`/api/groups/${groupId}/paths/${pathId}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        Log.error(error);
        return {
            path_id:"",
            car_owner_id:"",
            car_id:"",
            group_id:"",
            departure_date: new Date(),
            from:"",
            to:"",
            color:""
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

class PathInfoScreen extends React.Component {
    state = { fetchedPathData: false, path: {} };

    async componentDidMount() {
        const { match } = this.props;
        const { groupId, path_id } = match.params;
        const userId = JSON.parse(localStorage.getItem("user")).id;

        console.log(groupId)
        console.log(path_id)

        const path = await getPath(groupId, path_id);
        console.log(path)
        this.setState({ path, fetchedPathData: true });
    }
  
    render() {
    const {
        departure_date,
        from,
        to,
        color,
        car_name,
        num_seats,
        other_info,
        match,
        showAdditional,
        } = this.state;
      const { language, classes } = this.props
      const texts = Texts[language].PathInfoScreen
      const { path, fetchedPathData } = this.state;
      //const steps = texts.stepLabels
      //const { activeStep, stepWasValidated, creating } = this.state
      return (
        <div className={classes.root}>
            <h1>Path info</h1>
            <h2>{departure_date}</h2>
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