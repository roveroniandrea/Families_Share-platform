import React from "react";
import PropTypes from "prop-types";
import autosize from "autosize";
import { CirclePicker } from "react-color";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";

class CreatePathInformation extends React.Component {
  constructor(props) {
    super(props);
    const {
      handleSubmit,
      from,
      to,
      color,
      car_id
    } = this.props;
    this.state = { from,
      to,
      color,
      car_id };
    handleSubmit(this.state, this.validate(this.state));
    autosize(document.querySelectorAll("textarea"));
  }

  validate = state => {
    if (state.color && state.from && state.to && state.car_id) {
      return true;
    }
    return false;
  };

  handleChange = event => {
    const state = Object.assign({}, this.state);
    const { name, value } = event.target;
    const { handleSubmit } = this.props;
    state[name] = value;
    handleSubmit(state, this.validate(state));
    this.setState(state);
  };

  handleColorChange = color => {
    const { handleSubmit } = this.props;
    const state = Object.assign({}, this.state);
    state.color = color.hex;
    handleSubmit(state, this.validate(state));
    this.setState(state);
  };

  render() {
    const { language } = this.props;
    const { from,
      to,
      color,
      car_id } = this.state;
    const texts = Texts[language].createPathInformation;
    const rowStyle = { minHeight: "7rem" };
    return (
      <div id="createActivityInformationContainer">
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-car center" />
          </div>
          <div className="col-8-10">
            <input
              type="text"
              name="car_id"
              placeholder={texts.car}
              value={car_id}
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
              type="text"
              name="from"
              placeholder={texts.from}
              value={from}
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
              type="text"
              name="to"
              placeholder={texts.to}
              value={to}
              className="center"
              onChange={this.handleChange}
            />
          </div>
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
        <div className="row no-gutters" style={{ marginBottom: "2rem" }}>
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
    );
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
};

export default withLanguage(CreatePathInformation);
