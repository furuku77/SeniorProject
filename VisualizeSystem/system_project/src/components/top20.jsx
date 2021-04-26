import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import Data from '../file/test2.json'
import ReactEcharts from 'echarts-for-react';
import Select from '@material-ui/core/Select';
import { MenuItem, Drawer, Button, List, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Airport from './Airport_select'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink, Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import HomeIcon from '@material-ui/icons/Home';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: "#000"

    },
    menuButton: {
        marginRight: theme.spacing(2),
        color : "#ffffff"
    },
    help: {
        marginRight: theme.spacing(2),
        color : "#ffffff",
        left : '80%'
    },

    title: {
        // flexGrow: 0.1,
        color : "#ffffff"

    },
    paper_list: {
        padding: theme.spacing(4),
        // textAlign: 'center',
        color: "fff",
        // backgroundColor: theme.palette.success.light
    },
    paper_draw: {
        padding: theme.spacing(4),
        textAlign: 'center',
        color: "fff",
        // backgroundColor: theme.palette.success.light
    }
}));


export default function App() {
    const classes = useStyles();

    const [vis, setvis] = useState(0);
    const [region, setRegion] = useState(1);
    const [orig, setOrig] = useState([]);
    const [dest, setDest] = useState([]);
    const [stop, setStop] = useState([]);
    const [send, setSend] = useState({});
    const [state, setState] = useState(false);
    const [year, setYear] = React.useState(0);

    const handleChange_vis = (event) => {
        // console.log(event)
        setvis(event.target.value);

    };

    const handleChange_region = (event) => {
        console.log(event.target.value)
        // console.log(event)
        setRegion(event.target.value);

    };

    const toggleDrawer = (open) => (event) => {
        setState(open)
    }

    // const list = () => {
    //     console.log("edok")
    // }
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    useEffect(() => {
        axios.post("http://localhost:5000/top20", { 'region': region, 'year': year }).then(

            (response) => {

                // console.log(response.data['bkk_orig'])

                setOrig(response.data['bkk_orig'])
                setDest(response.data['bkk_dest'])
                setStop(response.data['bkk_stop'])
                // console.log(response.data)

                // setVal_node(response.data.for_node)
                // setInitialData(result.map(

                //     tmp => ({ 'link': tmp.link, 'val': tmp.val }))
                // );
                // setInitialData(result)

            },
            (error) => {
                console.log(error);
            }
        );
    }, [region]);

    // console.log(orig)

    function goto(event) {
        // console.log(data)
        console.log(event)
        const tmp = event.split('-');
        const link = {
            "station": tmp[0],
            "Dest": tmp[1]
        }

        console.log(link)


        setSend(link)
        // return  
        // return 
    }

    const print = (data) => {


        // return <h5>123456</h5>

        if (data.length === 0) {
            return <div> </div>
        }
        else {
            // console.log(data)
            const tmp = data.map(name =>
                <p onClick={() => goto(name) || setState(false)} >{name}</p>
            )
            return <div   > {tmp}</div>
        }

    }

    const choosedata = (choose) => {


        // return <h5>123456</h5>

        if (choose == 0) {
            return orig
        }
        else if (choose == 1) {
            return dest
        }
        else if (choose == 2) {
            return stop
        }

    }

    console.log("-----", year, "-------")



    return (

        <div
            style={{
                backgroundColor: '#F0F0F0',
                minHeight: '205vh'
            }}
        >
            <div className={classes.root}>
                <AppBar position="static" style={{ backgroundColor: 'black' }}>
                    <Toolbar>
                        {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton> */}
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
                                <MenuItem onClick={handleClose}><NavLink exact to="/connectMap" style={{color: 'black', textDecoration: 'none'}} activeStyle={{color: 'black', textDecoration: 'none'}}>Air Traffic Demand of BKK</NavLink></MenuItem>
                                <MenuItem onClick={handleClose}><NavLink exact to="/connectSelect" style={{color: 'black', textDecoration: 'none'}} activeStyle={{color: 'black', textDecoration: 'none'}}>Air Traffic Demand for Route</NavLink></MenuItem>
                            </Menu>
                        </div>

                        {/* <Typography variant="h6" className={classes.title}><NavLink exact to="/connectSelect" activeClassName="Active">Connect</NavLink></Typography> */}
                        <p className={classes.title}><NavLink exact to="/Bank" activeClassName="Active" style={{color: 'white', textDecoration: 'none'}} activeStyle={{color: 'red', textDecoration: 'none'}}>BANK</NavLink></p>
                        <IconButton edge="end" className={classes.help} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </div>
            <div>

                <Drawer className={classes.paper_draw}
                    anchor={"right"}
                    open={state}
                    onClose={() => setState(false)}>

                    <div style={{ height: '100%', width: '250px' }}>
                        <br/>
                        <Select
                            value=""
                            displayEmpty
                            onChange={handleChange_vis}

                        >
                            <MenuItem value="" disabled >Type Connection of BKK </MenuItem>
                            <MenuItem value={0}>Outbound</MenuItem>
                            <MenuItem value={1}>Inbound</MenuItem>
                            <MenuItem value={2}>Transit</MenuItem>
                        </Select>
                        <h2></h2>
                        <Select
                            value=""
                            displayEmpty
                            onChange={handleChange_region}

                        >
                            <MenuItem value="" disabled >Region</MenuItem>
                            <MenuItem value={0}>Asia</MenuItem>
                            <MenuItem value={1}>Europe</MenuItem>
                            <MenuItem value={2}>Middle East</MenuItem>
                            <MenuItem value={3}>North America</MenuItem>
                            <MenuItem value={4}>Russian Federation</MenuItem>
                            <MenuItem value={5}>South America</MenuItem>
                            <MenuItem value={6}>Australasia</MenuItem>
                            <MenuItem value={7}>Caribbean</MenuItem>
                            <MenuItem value={8}>Central America</MenuItem>
                            <MenuItem value={9}>Africa</MenuItem>
                        </Select>

                        {/* {print(choosedata(vis))} */}
                        <List >
                            {choosedata(vis).map((text, index) => (
                                <ListItem button key={text}>
                                    <ListItemText style = {{textAlign: 'center'}} primary={text} onClick={() => goto(text) || setState(false)} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Drawer>
            </div>

            <Airport name={send} changeYear={data => setYear(data)}></Airport>

        </div>
    );
}
