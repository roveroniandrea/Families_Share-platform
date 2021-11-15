import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import moment from "moment";
import { withRouter } from "react-router-dom";
import * as path from "lodash.get";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Avatar from "./Avatar";
import Log from "./Log";

class CarListItem extends React.Component {
  state = { fetchedChild: false, car: {} };

  componentDidMount() {
    const { userId, carId } = this.props;
    axios
      .get(`/api/users/${userId}/cars/${carId}`)
      .then(response => {
        const car = response.data;
        this.setState({ fetchedChild: true, car });
      })
      .catch(error => {
        Log.error(error);
        this.setState({
          fetchedCar: true,
          car: {
            car_id: "",
            owner_id: "",
            car_name: "",
            num_seats: 2
          }
        });
      });
  }

  render() {
    const { language, history, carId } = this.props;
    const { pathname } = history.location;
    const { car, profileId,fetchedChild } = this.state;
    const texts = Texts[language].carListItem;
    const route = `${pathname}/${carId}`;
    return (
      <div
        id="childContainer"
        className="row no-gutters"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.1" }}
      >
          <React.Fragment>
            <div className="col-3-10">
              <i className="fas fa-car" />
            </div>
            <div className="col-7-10">
              <div
                role="button"
                tabIndex={-42}
                onClick={() => history.push(route)}
                id="carInfoContainer"
                className="verticalCenter"
              >
                <div className="row no-gutters">
                  <div className="col-2-10"></div>
                  <div className="col-8-10">
                    <div><h2>{car.car_name}</h2></div>
                  </div>
                </div>

              </div>
            </div>

          </React.Fragment>

      </div>
    );
  }


}

export default withRouter(withLanguage(CarListItem));

CarListItem.propTypes = {
  carId: PropTypes.string,
  userId: PropTypes.string,
  language: PropTypes.string,
  history: PropTypes.object
};
