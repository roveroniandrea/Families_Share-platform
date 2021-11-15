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

/*
const getParents = (userId, childId) => {
  return axios
    .get(`/api/users/${userId}/children/${childId}/parents`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};
*/

class CarProfileScreen extends React.Component {
  state = { fetchedCarData: false, car: {} };

  async componentDidMount() {
    const { match } = this.props;
    const { profileId, carId } = match.params;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    console.log(match.params)
    const car = await getCar(profileId, carId);
    //child.parents = await getParents(profileId, childId);
    //child.showAdditional = userId === profileId;
    this.setState({ car, fetchedCarData: true });
  }

/*
  handleAddParent = parent => {
    const { child } = this.state;
    child.parents.push(parent);
    this.setState({ child });
  };

  handleDeleteParent = index => {
    const { history } = this.props;
    const { child } = this.state;
    child.parents.splice(index, 1);
    this.setState({ child });
    if (child.parents.length === 0) history.goBack();
  };
*/
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
          //handleAddParent={this.handleAddParent}
          //handleDeleteParent={this.handleDeleteParent}
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
