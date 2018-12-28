import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.css';
import './index.css';
import rootReducer from "./reducers";
import App from './components/App';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import thunk from 'redux-thunk';

const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
