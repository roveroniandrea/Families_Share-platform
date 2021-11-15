import React from "react";
import PropTypes from "prop-types";
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

const styles = () => ({
  add: {
    position: "fixed",
    bottom: "5%",
    right: "5%",
    height: "5rem",
    width: "5rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem"
  }
});

class ProfileCars extends React.Component {
  constructor(props) {
    super(props);
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const { profileId, usersCars } = this.props;
    const myProfile = userId === profileId;
    this.state = {
      myProfile,
      cars: usersCars,
      profileId
    };
  }

  addCar = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}/create`);
  };

  render() {
    const { classes, language } = this.props;
    const { cars, myProfile } = this.state;
    const texts = Texts[language].profileCars;
    return (
      <React.Fragment>
        {cars.length > 0 ? (
          <ul>
            {cars.map((car, index) => (
              <li key={index}>
                <h1>{car.car_name}</h1>
              </li>
            ))}
          </ul>
        ) : (
          <div className="addCarPrompt">{texts.addCarPrompt}</div>
        )}
        {myProfile && (
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.add}
            onClick={this.addCar}
          >
            <i className="fas fa-car" />
          </Fab>
        )}
      </React.Fragment>
    );
  }
}

ProfileCars.propTypes = {
  usersChildren: PropTypes.array,
  profileId: PropTypes.string,
  history: PropTypes.object,
  classes: PropTypes.object,
  language: PropTypes.string
};

export default withStyles(styles)(withLanguage(ProfileCars));
