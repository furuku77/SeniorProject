import React, { useEffect, useState } from 'react';
import Connect_select from '../components/top20'
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, TextField } from '@material-ui/core';
import Connectmap from '../file/Departure Passenger Demand in 2005.png'
import Connectselect from "../file/BKK - LAX.png"
import Bank from "../file/Daily Bank Structure on Thu Jan 15 2015 - Flights.png"

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    height: '600px',
    margin: '0px'

  },
  paper: {
    padding: theme.spacing(6),
    textAlign: 'center',
    color: "fff",
    backgroundColor: 'rgba(255,255,255,0.8)',
    height: '420px',
  },
  paper_list: {
    padding: theme.spacing(3),
    height: '250px',
    // textAlign: 'center',
    color: "fff",
    // backgroundColor: theme.palette.success.light
  },
  paper_stop: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: "fff",
    // backgroundColor: theme.palette.success.light
  },
  paper_pie: {
    // padding: theme.spacing(1),
    textAlign: 'center',
    color: "fff",
    // backgroundColor: theme.palette.success.light
  }
}));


function Home() {

  const classes = useStyles();

  return (

    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <Grid container spacing={5} className={classes.grid}  >

      <Grid item xs={12} md={12}>
          {/* <Paper className={classes.paper}> */}
            <h1 style={{ color: 'white' ,textAlign: 'center',fontSize: 40}}> Analysis of Connection and Bank based on Air Traffic Demand <br/> Case Study : Suvarnabhumi Airport</h1>
          {/* </Paper> */}
        </Grid>

        <Grid item xs={12} md={4}>
        <Paper className={classes.paper}>
          <h4 style = {{textAlign: 'center'}}>Air Traffic Demand of BKK</h4>
        <img src={Connectmap} width="350" height="200"/>
          <p>The passenger demand which have Suvarnabhumi airport as origin or destination, ,to represent passenger demand which can be see departure and arrival for each country by color opacity.</p>
        <p style = {{textAlign: 'center'}}><NavLink exact to="/connectMap" activeClassName="Active">Explore More</NavLink></p>
        </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
          <h4 style = {{textAlign: 'center'}}>Air Traffic Demand for Route</h4>
          <img src={Connectselect} width="350" height="200"/>
            <p>The passenger demand which have connected Suvarnabhumi airport , to represent the passenger demand which travel pattern of route by color opacity and presented 2D and 3D graphic.</p>
            <p style = {{textAlign: 'center'}}><NavLink exact to="/connectSelect" activeClassName="Active">Explore More</NavLink></p>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
        <Paper className={classes.paper}>
        <h4 style = {{textAlign: 'center'}}>Bank Structure</h4>
        <img src={Bank} width="350" height="200"/>
          <p>The Bank Structure to see overall airport which connecting Suvarnabhumi airport. One of tool to help you organize the flow air time flight for 24hrs. </p>
          <h1></h1>
        <p style = {{textAlign: 'center'}}><NavLink exact to="/Bank" activeClassName="Active">Explore More</NavLink></p>
        </Paper>
     
        </Grid>


      </Grid>

    </div>
  );
}

export default Home;