import React, { useState, useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'
import axios from 'axios'
import Log from './Log'
import Fab from '@material-ui/core/Fab'
import Texts from '../Constants/Texts'
import { withStyles } from '@material-ui/core/styles'
import withLanguage from './LanguageContext'

const styles = {
  add: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: '5rem',
    width: '5rem',
    borderRadius: '50%',
    border: 'solid 0.5px #999',
    backgroundColor: '#ff6f00',
    zIndex: 100,
    fontSize: '2rem'
  },
  addPlan: {
    right: '0.5rem',
    height: '4rem',
    width: '4rem',
    borderRadius: '50%',
    border: 'solid 0.5px #999',
    backgroundColor: '#ff6f00',
    zIndex: 100,
    fontSize: '2rem'
  },
  addActivity: {
    right: '0.5rem',
    height: '4rem',
    width: '4rem',
    borderRadius: '50%',
    border: 'solid 0.5px #999',
    backgroundColor: '#ff6f00',
    zIndex: 100,
    fontSize: '2rem'
  }
}

const fetchPaths = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}/paths`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      Log.error(error)
      return []
    })
}

function _GroupSharedRoutesScreen({
  group,
  classes,
  language,
  history
}) {
  const [fetchedActivityData, setFetchedActivityData] = useState(false)
  const [sharedPaths, setSharedPaths] = useState([])

  useEffect(() => {
    fetchPaths(group.group_id).then((paths) => {
      setFetchedActivityData(true)
      setSharedPaths(paths)
    })
  }, [])

  const { name } = group
  const texts = Texts[language].groupSharedRoutesScreen

  const renderActivities = () => {}

  const add = () => {
    const path = `/groups/${group.group_id}/paths/create`
    history.push(path)
  }

  return fetchedActivityData ? (
    <React.Fragment>
      <div className="row no-gutters" id="groupMembersHeaderContainer">
        <div className="col-2-10">
          <button
            type="button"
            className="transparentButton center"
            onClick={() => history.goBack()}
          >
            <i className="fas fa-arrow-left" />
          </button>
        </div>
        <div className="col-6-10 ">
          <h1 className="verticalCenter">{name}</h1>
        </div>
        <div className="col-1-10 "></div>
      </div>
      <div
        className="row no-gutters"
        style={{
          bottom: '8rem',
          right: '7%',
          zIndex: 100,
          position: 'fixed'
        }}
      >
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.add}
          onClick={add}
        >
          <i className="fas fa-plus" />
        </Fab>
      </div>

      <div style={{ paddingBottom: '6rem' }}>
        {sharedPaths && (
          <div id="groupActivitiesContainer" className="horizontalCenter">
            <h1 className="">{texts.routesHeader}</h1>
            <ul>
              {sharedPaths.map((path, index) => (
                <li key={index}>
                  {JSON.stringify(path)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </React.Fragment>
  ) : (
    <LoadingSpinner />
  )
}

export const GroupSharedRoutesScreen = withStyles(styles)(
  withLanguage(_GroupSharedRoutesScreen)
)
