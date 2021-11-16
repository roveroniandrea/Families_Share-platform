import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import * as path from "lodash.get";
import CarProfileHeader from "./CarProfileHeader";
import CarProfileInfo from "./CarProfileInfo";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

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

class CarProfileScreen extends React.Component {
  state = { fetchedCarData: false, car: {} };

  async componentDidMount() {
    const { match } = this.props;
    const { profileId, carId } = match.params;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const car = await getCar(profileId, carId);
    this.setState({ car, fetchedCarData: true });
  }

  render() {
    const { car, fetchedCarData } = this.state;
    return fetchedCarData ? (
      <React.Fragment>
        <CarProfileHeader
          background={`#00838F`}
          name = {`${car.car_name}`}
        />
        <CarProfileInfo
          num_seats = {car.num_seats}
          other_info = {car.other_info}
        />
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }

}

CarProfileScreen.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
};

export default CarProfileScreen;
