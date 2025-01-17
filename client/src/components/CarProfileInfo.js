import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import withLanguage from "./LanguageContext";
import InviteDialog from "./InviteDialog";
import Texts from "../Constants/Texts";
import ConfirmDialog from "./ConfirmDialog";

class CarProfileInfo extends React.Component {
  state = { modalIsOpen: false, confirmDialogIsOpen: false, deleteIndex: "" };

  handleConfirmDialogOpen = index => {
    this.setState({ confirmDialogIsOpen: true, deleteIndex: index });
  };

  handleConfirmDialogClose = choice => {
    const { deleteIndex } = this.state;
    if (choice === "agree") {
      this.deleteCar(deleteIndex);
    }
    this.setState({ confirmDialogIsOpen: false, deleteIndex: "" });
  };

  handleClose = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    const {
      num_seats,
      other_info,
      language,
    } = this.props;
    const { confirmDialogIsOpen, modalIsOpen } = this.state;
    const texts = Texts[language].carProfileInfo;
    return (
      <React.Fragment>
        <ConfirmDialog
          isOpen={confirmDialogIsOpen}
          title={texts.confirmDialogTitle}
          handleClose={this.handleConfirmDialogClose}
        />
        <InviteDialog
          isOpen={modalIsOpen}
          handleClose={this.handleClose}
          handleInvite={this.handleAdd}
          inviteType="parent"
        />
        <div className="childProfileInfoSection">
          <div className="row no-gutters">
            <div className="col-2-10">
            <img
                  src="/images/profiles/car-seat.png"
                  alt=""
                  style={{ height: '25px',marginBottom:'2px' }}
                />
            </div>
            <div className="col-8-10">
              <div>
                <h1>{num_seats}</h1>
              </div>
            </div>
          </div>

          <div className="row no-gutters">
            <div className="col-2-10">
              <i className = "fas fa-info"/>
            </div>
            <div className="col-8-10">
              <div>
                <h1>{other_info}</h1>
                </div>
            </div>
          </div>
          
        </div>
      </React.Fragment>
    );
  }
}

CarProfileInfo.propTypes = {
  history: PropTypes.object,
  car_id: PropTypes.string,
  owner_id: PropTypes.string,
  car_name: PropTypes.string,
  num_seats: PropTypes.string,
  language: PropTypes.string,
  match: PropTypes.object,
  handleAddParent: PropTypes.func,
  handleDeleteParent: PropTypes.func
};

export default withRouter(withLanguage(CarProfileInfo));
