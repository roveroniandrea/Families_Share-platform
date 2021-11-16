import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

const getUser = userId => {
    return axios
        .get(`/api/users/${userId}/profile`)
        .then(response => {
            return response.data.map(user => user.given_name + " " + user.family_name);
        })
        .catch(error => {
            Log.error(error);
            return [];
        });
};

const getCar = carId => {//TODO MANCA LA ROTTA
    return axios
        .get(`/api/users/${userId}/profile`)
        .then(response => {
            return response.data.map(user => user.given_name + " " + user.family_name);
        })
        .catch(error => {
            Log.error(error);
            return [];
        });
};


class PathListItem extends React.Component {
    constructor(props) {
        super(props);
        const { path } = this.props;
        this.state = { path };
    }

    handleActivityClick = event => {
        const { history } = this.props;
        const { pathname } = history.location;
        history.push(`${pathname}/${event.currentTarget.id}`);
    };

    getUser = (car_id) =>{
        const user = await getUser()
    }

    getDatesString = () => {
        const { language } = this.props;
        const { path } = this.state;
        const texts = Texts[language].pathListItem;
        let departure_date = new Date(path.departure_date);
        let datesString = moment(departure_date).format("DD-MM-YYYY ");
        let timeString = moment(departure_date).format(" HH:mm ");
        return datesString + texts.at + timeString;
    };

    render() {
        const { language } = this.props;
        const { path } = this.state;
        const texts = Texts[language].pathListItem;
        return (
            <React.Fragment>
                <div
                    role="button"
                    tabIndex="0"
                    onKeyPress={this.handleActivityClick}
                    className="row no-gutters"
                    style={{ minHheight: "7rem", cursor: "pointer" }}
                    id={path.path_id}
                    onClick={this.handleActivityClick}
                >
                    <div className="col-2-10">
                        <i
                            style={{
                                fontSize: "3rem",
                                color: path.color
                            }}
                            className="fas fa-certificate center"
                        />
                    </div>
                    <div
                        className="col-6-10"
                        style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
                    >
                        <div className="verticalCenter">
                            <div className="row no-gutters">
                                <h1>{this.getUser(path.car_Id)}</h1>
                            </div>
                            <div className="row no-gutters">
                                <h1>{texts.destination}: {path.to}</h1>
                            </div>
                            <div className="row no-gutters">
                                <i
                                    className="far fa-calendar-alt"
                                    style={{ marginRight: "1rem" }}
                                />
                                <h2>{this.getDatesString()}</h2>
                            </div>
                        </div>
                    </div>
                    <div
                        className="col-2-10"
                        style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
                    >
                        <i
                            style={{ fontSize: "2rem" }}
                            className="fas fa-chevron-right center"
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withLanguage(PathListItem));

PathListItem.propTypes = {
    path: PropTypes.object,
    groupId: PropTypes.string,
    history: PropTypes.object,
    language: PropTypes.string
};
