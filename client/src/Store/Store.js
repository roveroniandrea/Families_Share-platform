import { combineReducers, createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import authentication from "../Reducers/AuthenticationReducer";
import language from "../Reducers/LanguageReducer";
import registration from "../Reducers/RegistrationReducer";
import { compose } from 'redux';

const loggerMiddleware = createLogger();

const rootReducer = combineReducers({ language, authentication, registration });

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(thunkMiddleware, loggerMiddleware))
);

export default store;
