import React, { useEffect, useState } from 'react';
import axios from 'axios'
import logo from './logo.svg';
import './App.css';
import { Link, BrowserRouter as Router, Route, Switch, HashRouter } from 'react-router-dom';
import Connect_map from './pages/connection_map'
import Connect_select from './pages/connecttion_select'
import Nav from './components/navbar'
import Bank from './pages/bank'
import Home from './pages/Home'



function App() {

  return (



    <div>
      {/* <Bank></Bank> */}
      {/* <Nav></Nav> */}
      <Router>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route path="/ConnectMap" component={Connect_map}></Route>
          <Route path="/ConnectSelect" component={Connect_select}></Route>
          <Route path="/Bank" component={Bank}></Route>
        </Switch>
      </Router>,
    </div>
  );
}

export default App;
