import React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route, Switch, HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import Connect_map from './pages/connection_map'
import Connect_select from './pages/connecttion_select'
import Bank from './pages/bank'
import Home from './pages/Home'
import * as serviceWorker from './serviceWorker';



ReactDOM.render(


  <App/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
