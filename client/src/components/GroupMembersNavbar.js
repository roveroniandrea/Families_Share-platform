import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import axios from "axios";
import Log from "./Log";


const getGroupInfoPromise = groupId => {
  return axios
    .get(`/api/groups/${groupId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {
        open: ""
      };
    });
};
class GroupMembersNavbar extends React.Component {
  constructor(props) {
    super(props);
    const { history, match } = props;
    const { pathname } = history.location;
    const activeTab = pathname.slice(
      pathname.lastIndexOf("/") + 1,
      pathname.length
    );

    let group_id = (match.path).split("/")[2]
    this.getGroupInfo(group_id)
    this.state = { activeTab };
    this.handleActiveTab = this.handleActiveTab.bind(this);
  }

  async getGroupInfo(group_id) {
    let info = await getGroupInfoPromise(group_id)
    let { is_car_sharing } = info
    this.state = { ...is_car_sharing }
  }

  handleActiveTab(event) {
    this.setState({ activeTab: event.target.id });
    const { history } = this.props;
    const { pathname } = history.location;
    const parentPath = pathname.slice(0, pathname.lastIndexOf("/"));
    history.replace(`${parentPath}/${event.target.id}`);
  }

  render() {
    const { language } = this.props;
    const { activeTab, is_car_sharing } = this.state;
    const texts = Texts[language].groupNewsNavbar;
    return (
      <>
        {is_car_sharing && (<div
          role="button"
          tabIndex={-42}
          className="row no-gutters"
          id="groupNewsNavContainer"
          onClick={this.handleActiveTab}
        >
          <div className="col-5-10">
            <h1
              id="parents"
              className={activeTab === "parents" ? "groupNewsNavTabActive" : ""}
            >
              {texts.parents}
            </h1>
          </div>
          <div className="col-5-10">
            <h1
              id="children"
              className={activeTab === "children" ? "groupNewsNavTabActive" : ""}
            >
              {texts.children}
            </h1>
          </div>

        </div>
        )}
        {!is_car_sharing && (<div
          tabIndex={-42}
          className="row no-gutters"
          id="groupNewsNavContainer"
        >
          <div className="col-10-10">
            <h1>
              {texts.members}
            </h1>
          </div>
        </div>
        )}
      </>
    );
  }
}

export default withRouter(withLanguage(GroupMembersNavbar));

GroupMembersNavbar.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object
};
