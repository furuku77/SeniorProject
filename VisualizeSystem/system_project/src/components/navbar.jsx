import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Link, BrowserRouter as Router, Route, Switch, HashRouter } from 'react-router-dom';
import { MenuItem, Menu } from '@material-ui/core';
import ButtonSuggest from './top20'
import Airport from './Airport_select'
import { NavLink } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 0,
        // backgroundColor: "#000"

    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 0.05,
    },
}));

export default function ButtonAppBar() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{ backgroundColor: 'black' }}>
                <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" >
                            <NavLink exact to="/" style={{ color: 'white', textDecoration: 'none' }} activeStyle={{ color: 'white', textDecoration: 'none' }}>
                                <HomeIcon></HomeIcon>
                            </NavLink>
                        </IconButton>
                    <div>
                        <p aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.menuButton}>
                            CONNECTION
                            </p>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}><NavLink exact to="/connectMap" style={{ color: 'black', textDecoration: 'none' }} activeStyle={{ color: 'black', textDecoration: 'none' }}>Air Traffic Demand of BKK</NavLink></MenuItem>
                            <MenuItem onClick={handleClose}><NavLink exact to="/connectSelect" style={{ color: 'black', textDecoration: 'none' }} activeStyle={{ color: 'black', textDecoration: 'none' }}>Air Traffic Demand for Route </NavLink></MenuItem>
                        </Menu>
                    </div>

                    {/* <Typography variant="h6" className={classes.title}><NavLink exact to="/connectSelect" activeClassName="Active">Connect</NavLink></Typography> */}
                    <p className={classes.title}><NavLink exact to="/Bank" activeClassName="Active" style={{ color: 'white', textDecoration: 'none' }} activeStyle={{ color: 'white', textDecoration: 'none' }}>BANK</NavLink></p>
                </Toolbar>
            </AppBar>
        </div>
    );
}