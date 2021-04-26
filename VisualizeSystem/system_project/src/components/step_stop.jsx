import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import axios from 'axios'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 700,
    height: 300
  },
}));

export default function FullWidthTabs(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const test = (data) => {
        

    if (data.length === 0) {
        return <div><p>doesn't have</p></div>
    }
    else {
        data = data.slice(0,5)
        const tmp = data.map((name,i) =>
        <h5>{name}</h5>
        )
        return <div>{tmp}</div>
    }

}

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Direct" {...a11yProps(0)} />
          <Tab label="Stop 1 time" {...a11yProps(1)} />
          <Tab label="Stop 2 time" {...a11yProps(2)} />
          <Tab label="Stop 3 time" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
        {test(props.non)}
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
        {test(props.stop1)}
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
        {test(props.stop2)}
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
        {test(props.stop3)}
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}