import React from "react";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import Log from "./Log";

const styles = {
  checkbox: {
    "&$checked": {
      color: "#00838F"
    }
  },
  checked: {}
};


class CreateCarScreen extends React.Component {
  constructor(props) {
    super(props);
    const { history } = this.props;
    const { state } = history.location;
    if (state !== undefined) {
      this.state = {
        ...state
      };
    } else {
      this.state = {
        car_name: "",
        num_seats: 0,
        other_info: "",
        acceptAdditionalTerms: false
      };
    }
  }

  componentDidMount() {
    const { language } = this.props;
    const { acceptTerms } = this.state;
    if (!acceptTerms) {
      document
        .getElementById("acceptTermsCheckbox")
        .setCustomValidity(Texts[language].createCarScreen.acceptTermsErr);
    }
  }

  handleCancel = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleChange = event => {
    const { name } = event.target;
    const { value } = event.target;
    this.setState({ [name]: value });
  };

  validate = () => {
    const { language } = this.props;
    const texts = Texts[language].createCarScreen;
    const formLength = this.formEl.length;
    if (this.formEl.checkValidity() === false) {
      for (let i = 0; i < formLength; i += 1) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(`${elem.name}Err`);
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
            if (elem.validity.customError) {
              errorLabel.textContent = texts.acceptTermsErr;
            } else if (elem.validity.valueMissing) {
              errorLabel.textContent = texts.requiredErr;
            }
          } else {
            errorLabel.textContent = "";
          }
        }
      }
      return false;
    }
    for (let i = 0; i < formLength; i += 1) {
      const elem = this.formEl[i];
      const errorLabel = document.getElementById(`${elem.name}Err`);
      if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
        errorLabel.textContent = "";
      }
    }
    return true;
  };

  submitChanges = () => {
    const { match, history } = this.props;
    const { profileId: userId } = match.params;
    const {
      car_name,
      num_seats,
      other_info,
    } = this.state;
    const bodyFormData = new FormData();
    bodyFormData.append("car_name", car_name);
    bodyFormData.append("num_seats", num_seats);
    bodyFormData.append("other_info", other_info);
    axios
      .post(`/api/users/${userId}/cars`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(response => {
        Log.info(response);
        history.goBack();
      })
      .catch(error => {
        Log.error(error);
        history.goBack();
      });
  };

  handleSave = event => {
    event.preventDefault();
    if (this.validate()) {
      this.submitChanges();
    }
    this.setState({ formIsValidated: true });
  };

  handleAdd = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push({
      pathname: `${pathname}/additional`,
      state: {
        ...this.state
      }
    });
    return false;
  };

  handleAcceptTerms = () => {
    const { acceptTerms } = this.state;
    const { language } = this.props;
    const elem = document.getElementById("acceptTermsCheckbox");
    elem.checked = !acceptTerms;
    if (!acceptTerms) {
      elem.setCustomValidity("");
    } else {
      elem.setCustomValidity(Texts[language].createCarScreen.acceptTermsErr);
    }
    this.setState({ acceptTerms: !acceptTerms });
  };

  render() {
    const { classes, language, history } = this.props;
    const texts = Texts[language].createCarScreen;
    const {
      formIsValidated,
      car_name,
      num_seats,
      acceptAdditionalTerms,
      acceptTerms,
    } = this.state;
    const formClass = [];
    if (formIsValidated) {
      formClass.push("was-validated");
    }
    const bottomBorder = { borderBottom: "1px solid rgba(0,0,0,0.1)" };
    return (
      <React.Fragment>
        <div
          id="editChildProfileHeaderContainer"
          style={{ backgroundColor: 'rgb(0, 131, 143)' }}
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
        <div id="createChildProfileInfoContainer">
          <form
            ref={form => {
              this.formEl = form;
            }}
            onSubmit={this.handleSubmit}
            className={formClass}
            noValidate
          >
            <div className="row no-gutters" style={bottomBorder}>
              <div className="col-5-10">
                <input
                  type="text"
                  name="car_name"
                  className="createChildProfileInputField form-control"
                  placeholder={texts.car_name}
                  onChange={this.handleChange}
                  required
                  value={car_name}
                />
                <span className="invalid-feedback" id="nameErr" />
              </div>
              {/**TODO: numero di posti */} 
              <div className="col-5-10">
                <input
                  type="number"
                  name="num_seats"
                  className="createChildProfileInputField form-control"
                  placeholder={texts.num_seats}
                  onChange={this.handleChange}
                  required
                  value={num_seats}
                />
                <span className="invalid-feedback" id="surnameErr" />
              </div>
            </div>
            
            <div
              id="additionalInformationContainer"
              className="row no-gutters"
              style={bottomBorder}
            >
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
                  {acceptAdditionalTerms ? texts.edit : texts.add}
                </button>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10">
                <Checkbox
                  classes={{ root: classes.checkbox, checked: classes.checked }}
                  className="center"
                  checked={acceptTerms}
                  onClick={this.handleAcceptTerms}
                />
              </div>
              <div className="col-8-10">
                <h1 className="verticalCenter">{texts.acceptTerms}</h1>
              </div>
            </div>
            <div style={{ paddingLeft: "3%" }} className="row no-gutters">
              <input
                type="checkbox"
                style={{ display: "none" }}
                id="acceptTermsCheckbox"
                name="acceptTerms"
                className="form-control"
                required
                defaultChecked={acceptTerms}
              />
              <span className="invalid-feedback" id="acceptTermsErr" />
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default withLanguage(withStyles(styles)(CreateCarScreen));

CreateCarScreen.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  language: PropTypes.string,
  classes: PropTypes.object
};
