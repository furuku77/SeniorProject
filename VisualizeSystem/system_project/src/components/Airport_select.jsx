import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import Data from '../file/test2.json'
import ReactEcharts from 'echarts-for-react';
import CsvDownload from "react-json-to-csv";
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';
import Step from './step_stop'
import Base from '../file/world.topo.bathy.200401.jpg'
import Highlight from '../file/bathymetry_bw_composite_4k.jpg'
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, TextField } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import World3d from './world3d'

require("echarts/map/js/world.js");

const useStyles = makeStyles((theme) => ({
    grid: {
        width: '100%',
        height: '600px',
        margin: '0px'
    },
    paper: {
        // padding: theme.spacing(2),
        textAlign: 'center',
        color: "fff",
        // backgroundColor: theme.palette.success.light
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


export default function App(props) {
    console.log(5555, props)

    const classes = useStyles();



    const [initialData, setInitialData] = useState([])
    const [path, setPath] = useState({})
    const [val_node, setVal_node] = useState([])
    const [globe, setGlobe] = useState(0)
    const [link, setLink] = useState({})
    // const [Dataclick, Click] = useState({})
    const [age, setAge] = React.useState(0);
    const [node, setNode] = React.useState(2);
    const [year, setYear] = React.useState(0);
    const [vis, setvis] = React.useState(0);
    const [month, setMonth] = React.useState(0);
    const [passen, setPassen] = React.useState(0);
    const [support, setSupport] = useState("");
    const [max_type, setMaxType] = React.useState("");
    const [max_route, setMaxRoute] = React.useState("");
    const [prev, setPrev] = useState("");
    const [next, setNext] = useState("");
    const [non, setNon] = useState([])
    const [stop1, setStop1] = useState([])
    const [stop2, setStop2] = useState([])
    const [stop3, setStop3] = useState([])
    const [valstop, setValStop] = useState([])
    const [valsumall, setSumAll] = useState(0)
    const [maxmonth, setMaxMonth] = useState("");
    const [minmonth, setMinMonth] = useState("");
    const [LisMax, setLismax] = useState([]);
    const [PlotBar, setPlotBar] = useState([]);

    const { register, handleSubmit, errors } = useForm(); // initialize the hook

    const handleChange = (event) => {
        // console.log(event.target.value)
        setAge(event.target.value);

    };

    const handleChange_node = (event) => {
        // console.log(event.target.value)
        setNode(event.target.value);

    };

    const handleChange_vis = (event) => {
        setvis(event.target.value);
    };

    const handleChange_globe = (event) => {
        setGlobe(event.target.value);
    };

    const handleChange_year = (event) => {
        console.log(event.target.value)
        if (Object.keys(link).length !== 0) {
            getData(link, vis, event.target.value)
        }
        setYear(event.target.value);
        props.changeYear(event.target.value)
        // getData(data,vis,event.target.value)
        // OnSubmit()
    };

    //   {'station': Dataclick , 'type' : vis}

    // console.log("check", Object.keys(props.name).length)

    useEffect(() => {
        if (Object.keys(props.name).length > 0) {
            getData(props.name, vis, year)
        }
    }, [props.name])



    function getData(data, vis, year) {
        setLink(data)

        axios.post("http://localhost:5000/api", { 'station': data, 'type': vis, 'year': year }).then(


            (response) => {

                const result = response.data.vis;
                setVal_node(response.data.for_node)
                setMonth(response.data.month)
                setPassen(response.data.passen)
                setSupport(response.data.support)
                setPrev(response.data.prev)
                setNext(response.data.next)
                setMaxMonth(response.data.max_month)
                setMinMonth(response.data.min_month)
                setLismax(response.data.LisMax)

                setInitialData(result.map(

                    tmp => ({ 'link': tmp.link, 'val': tmp.val }))
                );
                // setInitialData(result)

            },
            (error) => {
                console.log(error);
                alert("ไม่มีคู่สนามบิน")
            }
        );
        axios.post("http://localhost:5000/transit", { 'station': data, 'type': vis, 'year': year }).then(

            (response) => {

                const result = response.data;
                // console.log(result)
                // setInitialData(result.map(

                //     tmp => ({ 'link': tmp.link, 'val':tmp.val }) )
                //   );
                setPath(result)
                setNon(response.data['non_stop'])
                setStop1(response.data['Stop1'])
                setStop2(response.data['Stop2'])
                setStop3(response.data['Stop3'])
                setMaxType(response.data['max_type'])
                setMaxRoute(response.data['max_routing'])
                setSumAll(response.data['sumall'])
                setValStop(response.data['each'])
                setPlotBar(response.data['PlotBar'])

                console.log(response.data['each'])

                // const non = path['non-stop']
                // const stop1 = path['Stop1']
                // const stop2 = path['Stop2']
                // const stop3 = path['Stop3']
            },
            (error) => {
                console.log(error);
                // alert("ไม่มีคู่สนามบิน")
            }
        );


    }

    const OnSubmit = (data, e) => {
        console.log(register)
        getData(data, vis, year)
        e.target.reset();

    };

    // console.log(max)

    // console.log(val_node)

    console.log(initialData[0])
    const BJData = initialData

    function getMax(data) {
        if (typeof BJData[0] == "object") {
            return BJData[0].val[age]

        }
        else {
            return 1
        }


    }

    // console.log(globe)



    function gendate_bar(data) {

        var yAxis_count = [];
        var yAxis_passenger = [];
        var lable = [];

        for (var i = 10; i >= 0; i--) {
            var dataItem = data[i];

            if (typeof dataItem == "object") {

                // console.log(dataItem)

                var tmp = dataItem.link
                var path = tmp.join('-');
                lable.push(path);
                yAxis_passenger.push(dataItem.val[0]);
                yAxis_count.push(dataItem.val[1]);

            }
        }

        // console.log(yAxis_passenger)
        return [lable, yAxis_passenger, yAxis_count]
    }

    function convertData(data) {

        var res = [];

        // console.log(max)
        for (var i = 0; i < data.length; i++) {

            // console.log(i)

            var dataItem = data[i];
            // console.log(dataItem)
            // console.log(dataItem.link[0])
            // console.log(dataItem.link[1])
            var fromCoord = geoCoordMap(dataItem.link[0]);

            var toCoord = geoCoordMap(dataItem.link[1]);
            // console.log(fromCoord)
            // console.log(toCoord)
            if (fromCoord && toCoord) {
                res.push({
                    fromName: dataItem.link[0],
                    toName: dataItem.link[1],
                    coords: [fromCoord, toCoord],
                    value: dataItem.val[age]
                });
            }
        }
        return res;
    };

    function geoCoordMap(idx) {

        // console.log(idx, [Data[idx]['Latitude'], Data[idx]['Longitude']])
        return [Data[idx]['Longitude'], Data[idx]['Latitude']];
    }

    function getCountry(idx) {
        if (idx != "" && idx != "none") {
            console.log(idx)
            return "https://www.countryflags.io/" + Data[idx]['Country'] + "/shiny/64.png";
        }
        else {
            return ""
        }

    }





    const getOption_bar = () => {
        const [lable, yAxis_passenger, yAxis_count] = gendate_bar(BJData)

        const option = {
            title: {
                text: 'Top 10 Travel Pattern',
                // subtext: '数据来自网络'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            toolbox: {
                show: true,
                feature: {
                    // dataView: {title: 'View', show: true},
                    // restore: {},
                    saveAsImage: { title: 'Save', show: true }
                }
            },
            legend: {
                // data: ['Number of Passenger', 'Number of Flight']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: PlotBar[1]
            },
            series: [
                {
                    // name: 'Number of Passengers',
                    type: 'bar',
                    color: '#4B8B3B',
                    data: PlotBar[0]
                },
                // {
                //     name: 'Number of Flights',
                //     type: 'bar',
                //     data: PlotBar[0]
                // }
            ]
        };


        return option

    }

    const getOption_pie = () => {
        const [lable, yAxis_passenger, yAxis_count] = gendate_bar(BJData)

        const option = {
            title: {
                text: 'Pattern Connnection',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)'
            },
            toolbox: {
                show: true,
                feature: {
                    // dataView: {title: 'View', show: true},
                    // restore: {},
                    saveAsImage: { title: 'Save', show: true }
                }
            },
            legend: {
                top: 30,
                left: 'left',
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '65%'],
                    data: valstop[age],
                    labelLine: {
                        show: true
                    },
                    label: {
                        normal: {
                            formatter: '{d}%',
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };


        return option

    }

    const test = (data) => {


        if (data.length === 0) {
            return <div style={{ height: '200px' }}> <h5>No Pattern</h5></div>
        }
        else {
            data = data.slice(0, 5)
            const tmp = data.map((name, i) =>

                <p>{name}</p>
            )
            return <div style={{ height: '200px' }}>{tmp}</div>
        }

    }

    // console.log(path)

    const getOption_time = () => {
        const option = {
            title: {
                text: 'Monthly Passenger Demand',
                textAlign: 'left'
            },
            toolbox: {
                show: true,
                feature: {
                    // dataView: {title: 'View', show: true},
                    // restore: {},
                    saveAsImage: { title: 'Save', show: true }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: month
            },
            yAxis: {
                type: 'value'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            series: [{
                data: passen,
                type: 'line',
                color: '#4B8B3B',
                smooth: true,
                areaStyle: {}
            }]
        };

        return option
    }


    console.log(link)









    return (
        <div
            style={{
                backgroundColor: '#F0F0F0',
                minHeight: '215vh'

            }}>
            <div>

            </div>
            <div >

                {/* <Select
                value=""
                displayEmpty
                onChange={handleChange_vis}

            >
                <MenuItem value="" disabled >Choose Visualize of Suvarnabhumi Airport </MenuItem>
                <MenuItem value={0}>Suvarnabhumi Airport as Origin</MenuItem>
                <MenuItem value={1}>Suvarnabhumi Airport as Destination</MenuItem>
                <MenuItem value={2}>Suvarnabhumi Airport as Stop</MenuItem>
            </Select> */}
                <Grid container spacing={3} className={classes.grid}  >
                    <Grid item xs={12} md={2}>
                    <Paper className={classes.paper}>
                    <Select
                            value=""
                            displayEmpty
                            onChange={handleChange}

                        >
                            <MenuItem value="" disabled >Route Attribute</MenuItem>
                            <MenuItem value={0}>Passenger Demand</MenuItem>
                            <MenuItem value={1}>Flight Demand</MenuItem>
                        </Select>
                    </Paper>
                       
                    </Grid>

                    <Grid item xs={12} md={1}>
                    <Paper className={classes.paper}>
                    <Select
                            value=""
                            displayEmpty
                            onChange={handleChange_node}

                        >
                            <MenuItem value="" disabled >Node</MenuItem>
                            <MenuItem value={0}>Degree Arrival</MenuItem>
                            <MenuItem value={1}>Degree Departure</MenuItem>
                            <MenuItem value={2}>Arrival Passenger Demand</MenuItem>
                            <MenuItem value={3}>Departure Passenger Demand</MenuItem>
                        </Select>
                    </Paper>
                       
                    </Grid>

                    <Grid item xs={12} md={2}>
                    <Paper className={classes.paper}>
                    <Select
                            value=""
                            displayEmpty
                            onChange={handleChange_globe}

                        >
                            <MenuItem value="" disabled >Vistualization Type</MenuItem>
                            <MenuItem value={0}>2D Map</MenuItem>
                            <MenuItem value={1}>3D Globe</MenuItem>
                        </Select>

                    </Paper>

                      
                    </Grid>

                    <Grid item xs={12} md={1}>
                    <Paper className={classes.paper}>
                    <Select
                            value=""
                            displayEmpty
                            onChange={handleChange_year}

                        >
                            <MenuItem value="" disabled>Year</MenuItem>
                            <MenuItem value={0}>2005</MenuItem>
                            <MenuItem value={1}>2006</MenuItem>
                            <MenuItem value={2}>2007</MenuItem>
                            <MenuItem value={3}>2008</MenuItem>
                            <MenuItem value={4}>2009</MenuItem>
                            <MenuItem value={5}>2010</MenuItem>
                            <MenuItem value={6}>2011</MenuItem>
                            <MenuItem value={7}>2012</MenuItem>
                            <MenuItem value={8}>2013</MenuItem>
                            <MenuItem value={9}>2014</MenuItem>
                            <MenuItem value={10}>2015</MenuItem>
                            <MenuItem value={11}>2016</MenuItem>
                            <MenuItem value={12}>2017</MenuItem>
                            <MenuItem value={13}>2018</MenuItem>
                            <MenuItem value={14}>2019</MenuItem>
                        </Select>

                    </Paper>
                        
                    </Grid>

                    {/* <h1></h1> */}

                    <Grid item xs={12} md={12}>
                    <form onSubmit={handleSubmit(OnSubmit)} >
                        <input name="station" type="text" placeholder="Origin Airport" ref={register} />
                        <input name="Dest" type="text" placeholder="Destination Airport" ref={register} />
                        {/* <TextField name="station" label="Origin Station" variant="outlined" ref={register} /> */}
                        {/* <TextField name="Dest" label="Destination Station" variant="outlined" ref={register}/>  */}
                        <input type="submit" />
                    </form>

                    </Grid>





                    {/* <h1></h1> */}

                    


                    <Grid item xs={12} md={9}>
                        <Paper className={classes.paper}>
                            {/* <ReactEcharts
                            option={getOption()}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: '600px', width: '100%' }}
                            className='react_for_echarts' /> */}
                            <World3d data={convertData(initialData)} globe={globe} val_node={val_node} age={age} node={node} max={getMax(initialData)} link={link} LisMax={LisMax} year = {year} />
                            {/* <World3d data = {} /> */}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper className={classes.paper_list} >
                            <div>
                                <h3 style={{ textAlign: 'center' }} > Overall Analytic  </h3>
                                <br></br>
                        Main Connection : {max_type}
                                <br></br>
                                {/* Direct : {valstop[0]}
                                <br></br>
                        1 Stop : {valstop[1]}
                                <br></br>
                        2 Stops : {valstop[2]}
                                <br></br>
                        3 Stops : {valstop[3]} */}
                                <p>Top Travel Pattern :  {max_route}</p>
                                <p>Lowest Month : {minmonth}</p>
                                <p>Highest Month : {maxmonth}</p>
                                <p>Status : {support}</p>
                                {/* <p>previos station : {prev} </p>
                            <img src={getCountry(prev)}></img>
                            <p>next station : {next}</p>
                            <img src={getCountry(next)}></img> */}

                            </div>

                        </Paper>
                        <h1></h1>
                        <Paper className={classes.paper_pie} >
                            <br></br>
                            <ReactEcharts
                                option={getOption_pie()}
                                style={{ height: '265px', width: '100%' }}
                                className='react_for_echarts' />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper className={classes.paper_stop}>
                            <ReactEcharts
                                option={getOption_bar()}
                                style={{ height: '500px', width: '100%' }}
                                className='react_for_echarts' />
                        </Paper>
                        <h1></h1>
                        {/* <Grid item xs={12} md={12} >
                        <Paper className={classes.paper}>
                           <div style={{ height: '300px', width: '100%' }}>

                           </div>

                        </Paper>

                    </Grid> */}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {/* <Paper className={classes.paper}>
                        <Step non={non} stop1={stop1} stop2={stop2} stop3={stop3} />
                    </Paper>
                    <h3></h3> */}
                        <Grid item xs={12} md={12} >
                            <Paper className={classes.paper_stop}>
                                <ReactEcharts
                                    option={getOption_time()}
                                    style={{ height: '500px', width: '100%' }}
                                    className='react_for_echarts' />
                            </Paper>

                        </Grid>

                    </Grid>
                    <Grid item xs={12} md={12} >
                        {/* <Paper className={classes.paper}> */}
                        <h3 style={{ textAlign: 'center' }}>Top 5 Connnection</h3 >
                        {/* </Paper> */}
                    </Grid>

                    <Grid item xs={12} md={3} >
                        <Paper className={classes.paper_stop}>
                            <h4 style={{ textAlign: 'center' }}>Non Stop Connnection</h4>
                            {test(non)}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3} >
                        <Paper className={classes.paper_stop}>
                            <h4 style={{ textAlign: 'center' }}>1-STOP Connnection</h4>

                            {test(stop1)}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3} >
                        <Paper className={classes.paper_stop}>
                            <h4 style={{ textAlign: 'center' }}>2-STOP Connnection</h4>

                            {test(stop2)}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3} >
                        <Paper className={classes.paper_stop}>
                            <h4 style={{ textAlign: 'center' }}>3-STOP Connnection</h4>
                            {test(stop3)}
                        </Paper>
                    </Grid>


                </Grid>



            </div>

        </div>
    );
}


