import React from "react";
import DayPicker from "react-day-picker";
import PropTypes from "prop-types";
import MomentLocaleUtils from "react-day-picker/moment";
import "../styles/DayPicker.css";
import { withSnackbar } from "notistack";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

const modifiersStyles = {
  selected: {
    backgroundColor: "#00838F"
  }
};

const Navbar = ({ onPreviousClick, onNextClick }) => {
  function handlePrevNav() {
    onPreviousClick();
  }
  function handleNextNav() {
    onNextClick();
  }
  return (
    <div className="">
      <span
        role="button"
        tabIndex={-42}
        className="dayPickerNavButton dayPickerPrevNav"
        onClick={handlePrevNav}
      />
      <span
        role="button"
        tabIndex={-43}
        className="dayPickerNavButton dayPickerNextNav"
        onClick={handleNextNav}
      />
    </div>
  );
};

class CreateActivityDates extends React.Component {
  constructor(props) {
    super(props);
    const {
      handleSubmit,
      selectedDays,
      lastSelect
    } = this.props;
    this.state = {
      selectedDays,
      lastSelect
    };
    handleSubmit(this.state, selectedDays.length > 0);
  }

  handleDayClick = async (day, { selected }) => {
    const { state } = this;
    const { selectedDays } = state;
    const { handleSubmit } = this.props;
    if (!selected) {
      selectedDays[0] = day;
      state.selectedDays = selectedDays;
      state.lastSelect = day;
    } else {
      state.selectedDays = []
      state.lastSelect = undefined;
    }
    this.setState(state);
    handleSubmit(this.state, state.selectedDays.length > 0);
  };

  render() {
    const { language } = this.props;
    const { selectedDays } = this.state;
    const texts = Texts[language].createPathDates;
    const navbar = <Navbar />;
    return (
      <div id="createActivityDatesContainer">
        <h1>{texts.header}</h1>
        <div style={{ width: "100%", fontSize: "1.5rem" }}>
          <DayPicker
            className="horizontalCenter"
            localeUtils={MomentLocaleUtils}
            locale={language}
            selectedDays={selectedDays}
            onDayClick={this.handleDayClick}
            modifiersStyles={modifiersStyles}
            navbarElement={navbar}
          />
        </div>
      </div>
    );
  }
}

CreateActivityDates.propTypes = {
  handleSubmit: PropTypes.func,
  lastSelect: PropTypes.instanceOf(Date),
  language: PropTypes.string,
  selectedDays: PropTypes.array,
  enqueueSnackbar: PropTypes.func
};

Navbar.propTypes = {
  onPreviousClick: PropTypes.func,
  onNextClick: PropTypes.func
};

export default withSnackbar(withLanguage(CreateActivityDates));
