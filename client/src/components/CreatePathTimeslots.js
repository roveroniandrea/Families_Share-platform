import React from 'react'
import PropTypes from 'prop-types'
import withLanguage from './LanguageContext'
import Texts from '../Constants/Texts'

class CreateActivityTimeslots extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      departure_date: new Date(),
      handleSubmit: props.handleSubmit
    }
  }

  handleChange = event => {
    const { value } = event.target;
    this.setState({ departure_date: value });
    this.state.handleSubmit(value)
  };


  render() {
    const { language } = this.props
    const { departure_date } = this.state
    const texts = Texts[language].createPathTimeslots
    const rowStyle = { margin: '2rem 0' }

    return (
      <div id="createActivityTimeslotsContainer">
        <div id="createActivityTimeslotsHeader" className="row no-gutters">
          <h1>{texts.header}</h1>
        </div>
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-clock center" />
          </div>
          <div className="col-2-10">
            <h4 className="verticalCenter">{texts.from}</h4>
          </div>
          <div className="col-6-10">
            <input
              type="time"
              value={departure_date}
              onChange={this.handleChange}
              className="expandedTimeslotTimeInput"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withLanguage(CreateActivityTimeslots)

CreateActivityTimeslots.propTypes = {
  handleSubmit: PropTypes.func,
  language: PropTypes.string,
}
