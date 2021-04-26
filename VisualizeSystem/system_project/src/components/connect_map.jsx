import React, { useEffect, useState, useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';
import Step from './step_stop'
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, TextField } from '@material-ui/core';
import Data from '../file/test2.json'

require("echarts/map/js/world.js");

const useStyles = makeStyles((theme) => ({
    grid: {
        width: '100%',
        height: '600px',
        margin: '0px'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: "fff",
        // backgroundColor: theme.palette.success.light
    },
    paper_list: {
        padding: theme.spacing(5),
        // textAlign: 'center',
        color: "fff",
        // backgroundColor: theme.palette.success.light
    }
}));



export default function App() {
    const classes = useStyles();

    const [initialData, setInitialData] = useState([])
    const [initialData1, setInitialData1] = useState([])
    const [max_vis, setMax] = useState([1, 1])
    const [age, setAge] = React.useState(0);
    const [top, setTop] = React.useState(0);
    const [year, setYear] = React.useState(0);
    const [type, setType] = React.useState(5);
    const [country, setCountry] = useState({});
    const [Station, setStation] = useState({});

    const [vis, setvis] = React.useState(0);

    const handleChange = (event) => {
        // console.log(event.target.value)
        setAge(event.target.value);

    };

    const handleChange_year = (event) => {
        console.log(event.target.value)
        // if (Object.keys(link).length !== 0) {
        //     getData(link, vis, event.target.value)
        // }
        setYear(event.target.value);
        // getData(data,vis,event.target.value)
        // OnSubmit()
    };

    console.log(Data['SIN']['Name'])

    function getTitle(type, year) {
        if (type == 5) {
            return "Arrival/Departure in " + (year + 2005)
        }
        else {
            if (type == 0) {
                return "Departure in " + (year + 2005)
            }
            else {
                return "Arrival in " + (year + 2005)

            }
        }
    }

    function getTitleMain(type, year, age) {
        var title_type = ""
        var title_vis = ""


        if (type == 5) {
            return "Vistualization in " + (year + 2005)
        }
        else {
            if (type == 0) {
                title_type = "Departure"
            }
            else {
                title_type = "Arrival"
            }
            if (age == 0) {
                title_vis = "Passenger Demand"
            }
            else {
                title_vis = "Flight Demand"
            }
            return title_type + " " + title_vis + " in " + (year + 2005)
        }


    }

    // useEffect(() => {
    //     if (Object.keys(props.name).length > 0) {
    //         getData(props.name, vis, year)
    //     }
    // }, [props.name])

    const previousValues = useRef({ type, year });

    useEffect(() => {
        if (
            previousValues.current.type !== type |
            previousValues.current.year !== year
        ) {
            axios.post("http://localhost:5000/BKK_O_D", { "type": type, 'year': year }).then(

                (response) => {

                    const pie = response.data.piechart;
                    const map = response.data.vismap;
                    const max = response.data.max;

                    setInitialData(map)
                    setInitialData1(pie)
                    setMax(max)
                    setCountry(response.data.top_region)
                    setStation(response.data.top_station)
                    // console.log(response.data.top_region)

                },
                (error) => {
                    console.log(error);
                }
            );
            console.log("both changed")
            previousValues.current = { type, year };
        }


    })


    const handleChange_vis = (event) => {

        setType(event.target.value)

        // axios.post("http://localhost:5000/BKK_O_D", {"type": type}  ).then(

        //     (response) => {

        //         const pie = response.data.piechart;
        //         const map = response.data.vismap;
        //         const max = response.data.max;
        //         // console.log(result)
        //         // setInitialData(result.map(

        //         //     tmp => ({ 'Orig': tmp.Orig, 'Dest': tmp.Dest, 'passenger':tmp.passenger, 'count':tmp.count }))
        //         // );
        //         setInitialData(map)
        //         setInitialData1(pie)
        //         setMax(max)

        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );
    };

    const handleChangeTop = (event) => {

        setTop(event.target.value)
    };


    function gendate_bar(data) {

        var yAxis_count = [];
        var yAxis_passenger = [];
        var lable = [];


        for (var i = 15; i >= 0; i--) {
            var dataItem = data[i];

            if (typeof dataItem == "object") {

                // console.log(dataItem)

                var tmp = dataItem.name
                // var path = tmp.join('-');
                lable.push(tmp);
                yAxis_passenger.push(dataItem.val[0]);
                yAxis_count.push(dataItem.val[1]);

            }
        }

        console.log(yAxis_passenger)
        return [lable, yAxis_passenger, yAxis_count]
    }

    var maximum = 1000

    if (typeof initialData[0] == "object") {
        var maximum = (initialData[0].val[age])

    }

    // console.log(maximum)


    function convertData(data) {


        var res = [];
        var pie = [];

        // console.log(max)
        for (var i = 0; i < data.length; i++) {

            // console.log(i)

            var dataItem = data[i];
            var check = 0
            if (age == 0) {
                check = 1
            }
            if (dataItem.name && dataItem.val[age]) {
                res.push({
                    name: dataItem.name,
                    value: dataItem.val[age]
                });
            }
            if (dataItem.name && dataItem.val[check]) {
                pie.push({
                    name: dataItem.name,
                    value: dataItem.val[check]
                });
            }
        }
        return [res, pie];
    };



    const getOption_bar = () => {
        const [lable, yAxis_passenger, yAxis_count] = gendate_bar(initialData)

        const option = {
            title: {
                text: 'Country ' + getTitle(type, year),
                left: 'center',
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
                // data: ['Number of Passenger', 'Number of Flight'],
                top: 30
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
                data: lable
            },
            series: [
                {
                    name: 'Number of Passenger Demand',
                    type: 'bar',
                    color: '#4B8B3B',
                    
                    data: yAxis_passenger
                },
                {
                    name: 'Number of Flights Demand',
                    type: 'bar',
                    // color: '#D2601A',
                    data: yAxis_count
                }
            ]
        };


        return option

    }

    // console.log(max_vis[age])




    const getOption = () => {



        const option = {
            title: {
                text: getTitleMain(type, year, age),
                // subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)',
                // sublink: 'http://esa.un.org/wpp/Excel-Data/population.htm',
                left: 'center',
                top: 'top'
            },
            // geo: {
            //     map: 'world',
            //     label: {
            //         emphasis: {
            //             show: true
            //         }
            //     },
            //     scaleLimit: {
            //         min: 1.05,
            //         max: 10
            //     },
            //     roam: true,
            //     // {
            //     //     move : false,
            //     //     zoom : true
            //     // },
            //     itemStyle: {
            //         normal: {
            //             areaColor: '#323c48',
            //             borderColor: '#404a59'
            //         },
            //         emphasis: {
            //             areaColor: '#2a333d'
            //         }
            //     }
            // },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    // console.log(params)
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
                        ;
                    return params.name + ' : ' + value;
                }
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    dataView: { readOnly: false },
                    restore: {},
                    saveAsImage: {}
                }
            },
            labelLine: {
                show: false
            },
            label: {
                show: false,
                // position: 'center'
            },

            visualMap: {
                min: 0,
                max: max_vis[age] * 0.75,
                // text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                // inRange: {
                //     colorLightness: [0, 1]
                // }
                inRange: {
                    color: ['#DEF1E3', 'green'],
                    // color: ['green','yellow', 'orangered'],
                    // colorLightness: [0.7, 0.2]
                }
                // inRange: {
                //     colorLightness: [0, 1]
                // }
            },
            // visualMap: {
            //     show: false,
            //     min: 0,
            //     max: maximum,
            //     inRange: {
            //         opacity: [0.1, 1],
            //         width: [1, 5]
            //     }
            // },
            // visualMap: {
            //     show: false,
            //     min: 0,
            //     max: 2000000,
            //     inRange: {
            //         color: ['lightskyblue','yellow', 'orangered'],
            //         opacity: [0.1, 1],
            //         width: [1, 5]
            //     }
            // },
            series: [
                {
                    name: '',
                    backgroundColor: '#404a59',
                    type: 'map',
                    mapType: 'world',
                    roam: false,
                    scaleLimit: {
                        min: 1.05,
                        max: 10
                    },
                    itemStyle: {

                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        emphasis: {
                            label: {
                                show: false,
                                shadowBlur: 10,
                                areaColor: '#2a333d'
                                // areaColor: null

                            }
                        },
                        normal: {

                            areaColor: 'black',
                            color: '#000',
                            areaStyle: {
                                color: '#00FF00'

                            }
                        }
                    },

                    data: convertData(initialData)[0],

                    //     {name: 'Zimbabwe', value: 13076.978},
                    nameMap: {
                        Korea: "South Korea",
                        // Korea: "North Korea",
                        Russia: "Russian Federation",
                        'Samoa Western' :  'Samoa',
                        // 'U.S. Virgin Is.' :  'Virgin Islands',
                        'Turks and Caicos Is.' : 'Turks and Caicos Islands',
                        'Dem. Rep.' : 'North Korea',
                        'N. Mariana' : 'Is Mariana',
                        'Lao PDR' : 'Laos',
                        'W. Sahara' : 'Sahara',
                        'Fr. S. Antarctic Lands' : 'Antarctica',
                        'N. Cyprus'  : 'Cyprus',
                        'Dominican Rep.' : 'Dominican Republic',
                        Congo : 'Democratic Republic of the Congo',
                        'S. Sudan' : 'South Sudan' 

                    },
                    // emphasis: {
                    //     itemStyle: {
                    //         shadowBlur: 10,
                    //         shadowColor: 'rgba(0, 0, 0, 0.5)'
                    //     }
                    // }
                }
            ]
        }
        return option
    }

    const getOption_pie = () => {


        const option = {
            // title: {
            //     text: 'Region\' Arrival/Departure',
            //     // subtext: '纯属虚构',
            //     left: 'center'
            // },
            color: ['#626169', '#362863', '#7F0068', '#DF3A5B', '#EF7854', '#7A893E', '#3B5281', '#756857', '#B24F60', '#FFCD2A'],
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
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
                // orient: 'vertical',
                // orient: 'horizontial',
                top: 50,
                // type: 'scroll',
                left: 'center',
                data: ['Africa', 'Asia', 'Australasia', 'Caribbean', 'Central America', 'Europe', 'Middle East', 'North America', 'Russian Federation', 'South America'],

            },
            title: [{
                text: 'Region ' + getTitle(type, year),
                left: 'center'
            }, {
                subtext: 'Number of Passenger Demand',
                left: '25%',
                top: '85%',
                textAlign: 'center'
            }, {
                subtext: 'Number of Flight Demand',
                left: '63%',
                top: '85%',
                textAlign: 'center'
            }],

            series: [
                {
                    name: 'passenger',

                    type: 'pie',
                    radius: '40%',
                    center: ['25%', '60%'],
                    data: convertData(initialData1)[0],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    labelLine: {
                        show: true
                    },
                    label: {
                        show: true,
                        formatter: '{d}%',
                        // position: 'center'
                    },
                },
                {
                    name: 'count',
                    // title: {
                    //     text: 'จำนวนครั้งเที่ยวบิน',
                    //     // subtext: '数据来自网络'
                    // },
                    type: 'pie',
                    radius: '40%',
                    center: ['65%', '60%'],

                    // data: (convertData(initialData1)[1]),
                    data: convertData(initialData1)[1].sort(function (a, b) {
                        console.log(a.value, b.value)
                        return b.value - a.value;
                    }),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    labelLine: {
                        show: true
                    },
                    label: {
                        show: true,
                        formatter: '{d}%',
                        // position: 'center'
                    },
                }
            ]
        }
        return option
    }

    const printOverall = () => {
        if (Object.keys(country).length !== 0) {
            if(top == 0){
                return (
                    <div style={{ height: '545px'}}>
                        {['Asia', 'Europe', 'Middle East', 'North America', 'Russian Federation', 'South America', 'Australasia', 'Caribbean', 'Central America', 'Africa'].map(function (text, idx) {
                            return (<p >{text} : {country[text]} </p>)
                        })}
                    </div>
                );

            }
            else{
                return (
                    <div style={{ height: '545px'}}>
                        {['Asia', 'Europe', 'Middle East', 'North America', 'Russian Federation', 'South America', 'Australasia', 'Caribbean', 'Central America', 'Africa'].map(function (text, idx) {
                            return (
                                <div >
                                    <p >{text} : {Station[text]},{Data[Station[text]]['Country Name']}</p> 
                                    {/* <p></p> */}
                                </div>
                                    )
                        })}
                    </div>
                );

            }
            
        }
        else {
            return (
                <div style={{ height: '545px' }}>
                    {['Asia', 'Europe', 'Middle East', 'North America', 'Russian Federation', 'South America', 'Australasia', 'Caribbean', 'Central America', 'Africa'].map(function (text, idx) {
                        return (<p >{text} :</p>)
                    })}
                </div>
            );
        }
    }



    return (
        <div
            style={{
                backgroundColor: '#F0F0F0',
                minHeight: '170vh'
            }}>






            {/* <h4>{initialData}</h4> */}


            <Grid container spacing={3} className={classes.grid}>
                <Grid item xs={12} md={3} className={classes.paper}>
                    <Paper>
                        <Select
                            value=""
                            displayEmpty
                            onChange={handleChange_vis}

                        >
                            <MenuItem value="" disabled >Visualize of Suvarnabhumi Airport </MenuItem>
                            <MenuItem value={1}>Arrival</MenuItem>
                            <MenuItem value={0}>Departure</MenuItem>
                        </Select>
                    </Paper>


                </Grid>
                <Grid item xs={12} md={2} className={classes.paper}>
                    <Paper>
                        <Select
                            value={""}
                            displayEmpty
                            onChange={handleChange}

                        >
                            <MenuItem value="" disabled >Area Country Attribute</MenuItem>
                            <MenuItem value={0}>Passenger Demand</MenuItem>
                            <MenuItem value={1}>Flight Demand</MenuItem>
                        </Select></Paper>


                </Grid>
                <Grid item xs={12} md={1} className={classes.paper}>
                    <Paper>
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

                <Grid item xs={12} md={9}>
                    <Paper className={classes.paper}>
                        <ReactEcharts
                            option={getOption()}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: '700px', width: '100%' }}
                            // onChartReady={onChartReady} 
                            // loadingOption={getLoadingOption()}
                            // showLoading={true}
                            className='react_for_echarts' />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper className={classes.paper_list} >
                        <div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 > Overall Analytic</h3>

                                <Select
                                    value={""}
                                    displayEmpty
                                    onChange={handleChangeTop}

                                >
                                    <MenuItem value="" disabled >Top of Each Region</MenuItem>
                                    <MenuItem value={0}>Country</MenuItem>
                                    <MenuItem value={1}>Airport</MenuItem>
                                </Select>

                            </div>


                            {/* <h4 style={{ textAlign: 'center' }}>Overall Analytic</h4>
                            {['Asia', 'Europe', 'Middle East', 'North America', 'Russian Federation', 'South America', 'Australasia', 'Caribbean', 'Central America', 'Africa'].map((text, index) => (
                                <p>{text} : {country[text]} </p>
                            ))} */}

                            {printOverall()}

                        </div>

                    </Paper>
                </Grid>


                <Grid item xs={12} md={6}>
                    <Paper className={classes.paper}>
                        <ReactEcharts
                            option={getOption_pie()}
                            style={{ height: '500px', width: '100%' }}
                            className='react_for_echarts' />

                    </Paper>

                </Grid>
                <Grid item xs={12} md={6} >
                    <Paper className={classes.paper}>
                        <ReactEcharts
                            option={getOption_bar()}
                            style={{ height: '500px', width: '100%' }}
                            className='react_for_echarts' />

                    </Paper>

                </Grid>


            </Grid>

        </div >

    );
}