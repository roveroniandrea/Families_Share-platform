import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import BackNavigation from "./BackNavigation";
import CreateActivityStepper from "./CreateActivityStepper";

const CreatePathScreen = ({ language, history }) => {
  const texts = Texts[language].createActivityScreen;
  return (
    <div id="createActivityContainer">
      <BackNavigation
        title={texts.backNavTitle}
        onClick={() => history.goBack()}
      />
      <CreateActivityStepper />
    </div>
  );
};

CreatePathScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object
};

export default withLanguage(CreatePathScreen);