import React, { useEffect, useState } from 'react';
import { appendErrors, useForm } from 'react-hook-form';
import axios from 'axios'
import Data from '../file/test2.json'
import ReactEcharts from 'echarts-for-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, TextField, MenuItem } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    grid: {
        width: '100%',
        height: '700px',
        margin: '0px'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: "fff",
        // backgroundColor: theme.palette.success.light
    },
    paper_list: {
        // padding: theme.spacing(2),
        textAlign: 'center',
        color: "fff",
        // width: '30%',
        // backgroundColor: theme.palette.success.light
    },
    paper_form: {
        // padding: theme.spacing(2),
        textAlign: 'center',
        color: "fff",
        width: '15%',
        // backgroundColor: theme.palette.success.light
    }
}));


export default function App() {

    const classes = useStyles();

    const [arr, setArr] = useState([]);
    const [dep, setDep] = useState([]);
    const [arr_flight, setArrFlight] = useState([]);
    const [dep_flight, setDepFlight] = useState([]);
    const [cumu_flight, setCumuFlight] = useState([]);
    const [avg_flight, setFlight] = useState([]);

    const [bankarr, setBankArr] = useState([]);
    const [bankdep, setBankDep] = useState([]);
    const [metaarr, setMetaArr] = useState();
    const [metadep, setMetaDep] = useState();
    const [cumu, setCumu] = useState([]);
    const [xaxis, setXaxis] = useState([]);
    const [xaxis_bar, setXaxisBar] = useState([]);
    const [avg, setAvg] = useState([]);
    const [arrp, setArrP] = useState({});
    const [arrc, setArrC] = useState({});
    const [piearrp, setPieArrP] = useState({});
    const [piearrc, setPieArrC] = useState({});
    const [piedepp, setPieDepP] = useState({});
    const [piedepc, setPieDepC] = useState({});
    const [depp, setDepP] = useState({});
    const [depc, setDepC] = useState({});

    const [display, setDisplay] = useState(false);
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(new Date('01/06/2015'));
    const [vis, setvis] = useState(0);
    const [time, setTime] = useState(0);
    const { register, handleSubmit, errors } = useForm();
    const [checked, setChecked] = React.useState(false);

    const handleChange_vis = (event) => {
        // console.log(5555,event.target.value)
        const tmp = event.target.value
        setvis(tmp);
        // console.log(vis)
        test(startDate, event.target.value, time, search)

    };

    function handleChange_time(event) {
        // console.log(4444,event.target.value)
        setTime(event.target.value);
        test(startDate, vis, event.target.value, search)
        // console.log(time)

    };

    const OnSubmit = (data, e) => {
        console.log(data)
        setSearch(data['station'])
        test(startDate, vis, time, data['station'])
        e.target.reset();

    };

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    function getTitle(vis) {
        if (vis == 0) {
            return "Flights"
        }
        else {
            return "Seats"

        }
    }



    function test(date, vis, time, search) {

        axios.post("http://localhost:5000/overall_bank", { 'date': date, 'vis': vis, 'time': time, 'search': search }, {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json'

            }
        }).then(

            (response) => {

                console.log(typeof response.data)
                const tmp = JSON.parse(response.data['bank_arr'])
                const tmp2 = JSON.parse(response.data['bank_dep'])

                setMetaArr(response.data['meta_arr'])
                setMetaDep(response.data['meta_dep'])

                setBankArr(tmp)
                setBankDep(tmp2)

                // setArrC(response.data['top_arr_count'])

                // console.log(response.data['top_arr_sum'])
                // setDepC(response.data['top_dep_count'])

                setXaxisBar(response.data['index'])

                // console.log(response.data['top_arr_sum'])


                // console.log(tmp['index'])

                if (vis == 0) {
                    console.log("0000")
                    setArr(response.data['arr_flight'])
                    setDep(response.data['dep_flight'])
                    setCumu(response.data['cumulative_flight'])
                    setAvg(response.data['table_flight'])
                    setArrP(response.data['top_arr_sum'])
                    setDepP(response.data['top_dep_sum'])
                    setPieArrP(response.data['pie_arr_sum'])
                    setPieDepP(response.data['pie_dep_sum'])

                }
                else {
                    console.log("1111")
                    setArr(response.data['arr'])
                    setDep(response.data['dep'])
                    setCumu(response.data['cumulative'])
                    setAvg(response.data['table'])
                    setArrP(response.data['top_arr_count'])
                    setDepP(response.data['top_dep_count'])
                    setPieArrP(response.data['pie_arr_count'])
                    setPieDepP(response.data['pie_dep_count'])

                }


                // console.log(response.data['cumulative'])
                // setArrFlight(response.data['arr_flight'])
                // setDepFlight(response.data['dep_flight'])
                // setCumuFlight(response.data['cumulative_flight'])
                // setFlight(response.data['table_flight'])

                // setXaxis(response.data['index'])
                setXaxis((tmp['columns']))

            },
            (error) => {
                console.log(error);
                alert("ไม่มีสนามบินเข้า/ออก")
            }
        );

    }





    function geoCoordMap(idx) {

        // console.log(idx, [Data[idx]['Latitude'], Data[idx]['Longitude']])
        return Data[idx]['Global Region'];
    }

    // console.log(Data['LAX']['Global Region'])


    function MakeBank(arr, dep) {


        const bank = [];

        if (typeof arr['columns'] == 'object' && typeof dep['columns'] == 'object') {




            // console.log(data)
            arr['index'].map((key, index) =>
            (
                // console.log(key,index),
                bank.push({
                    name: geoCoordMap(key),
                    type: 'bar',
                    stack: 'total',
                    barGap: '-100%',
                    data: arr['data'][index],
                    // avoidLabelOverlap: false,

                    label: {
                        show: true,
                        position: 'inside',
                        // rotate: -90,
                        formatter: key,
                        textStyle: {
                            fontSize: '8',
                        },
                    },
                    markArea: {
                        silent: true,
                        data: [
                          [
                            {
                              xAxis: 0,
                              itemStyle: {
                                color: "#f1d5d6",
                                // opacity : 0.01
                            }
                            },
                            {
                              xAxis: 100000,
                              itemStyle: {
                                color: "#f1d5d6",
                                // opacity : 0.01
                                
                            }
                            }
                          ],
                          [
                            {
                              xAxis: 0,
                              itemStyle: {
                                color: "#d1f0d5",
                                // opacity : 0.01
                              }
                            },
                            {
                              xAxis: -100000,
                              itemStyle: {
                                color: "#d1f0d5",
                                // opacity : 0.01
                              }
                            }
                          ]
                        ]
                      }
                }
                )
            ))

            // console.log(dep['columns'])

            dep['index'].map((key, index) =>
            (
                bank.push({
                    name: geoCoordMap(key),
                    type: 'bar',
                    stack: 'total',
                    data: dep['data'][index],
                    label: {
                        show: true,
                        position: 'inside',
                        // rotate: -90,
                        formatter: key,
                        textStyle: {
                            fontSize: '8',
                        },
                    }
                })
            ))

            // console.log(bank)

            return bank
        }
    }





    function convertData(arrc) {

        var pie = Object.keys(arrc).map((keyName, i) => (
            {
                name: keyName,
                value: arrc[keyName]
            }


            // console.log(keyName,arrc[ keyName])

        ))

        // console.log(pie)


        return pie
    }

    const getOption_pie = () => {


        const option = {
            color: ['#626169', '#362863', '#7F0068', '#DF3A5B', '#EF7854', '#7A893E'],
            title: {
                text: 'Ratio of Region ' + getTitle(vis),
                // subtext: '纯属虚构',
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
                // orient: 'vertical',
                // orient: 'vertical',
                orient: 'horizontal',
                top: 60,
                // left: 'left',
                // data: ['Africa', 'Asia', 'Australasia', 'Caribbean', 'Central America', 'Central America', 'Europe', 'Middle East', 'North America', 'Russian Federation', 'South America']
            },
            title: [{
                text: 'Region ' + getTitle(vis),
                left: 'center'
            }, {
                subtext: 'Arrival',
                left: '30%',
                top: '75%',
                textAlign: 'center'
            }, {
                subtext: 'Departure',
                left: '70%',
                top: '75%',
                textAlign: 'center'
            }],



            series: [
                {
                    // name: 'passenger',

                    type: 'pie',
                    radius: '35%',
                    center: ['30%', '50%'],
                    data: convertData(piearrp).sort(function (a, b) {
                        // console.log(a.value, b.value)
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
                        normal: {
                            formatter: '{d}%',
                        }
                    },
                },
                {
                    // name: 'count',
                    title: {
                        // text: 'จำนวนครั้งเที่ยวบิน',
                        // subtext: '数据来自网络'
                    },
                    type: 'pie',
                    radius: '35%',
                    center: ['70%', '50%'],

                    // data: (convertData(initialData1)[1]),
                    data: convertData(piedepp).sort(function (a, b) {
                        // console.log(a.value, b.value)
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
                        normal: {
                            formatter: '{d}%',
                        }
                    },
                }
            ]
        }
        return option
    }

    // console.log(arr)
    // console.log(dep)

    const getOption_bar = () => {


        const option = {
            title: {
                text: 'Hourly Arrival & Departure of ' + getTitle(vis),
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                top: 30
                // data: ['利润', '支出', '收入']
            },
            // dataZoom: [{
            //     type: 'inside'
            // }, {
            //     type: 'slider'
            // }],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [


                {
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    data: xaxis_bar.map(function (str) {
                        return str.substring(11, 16)
                    })
                }

            ],
            yAxis: [

                {
                    type: 'value'
                }


            ],
            series: [
                {
                    name: 'Arrival',
                    type: 'bar',
                    color: 'green',
                    stack: '总量',

                    data: arr
                },
                {
                    name: 'Departure',
                    type: 'bar',
                    stack: '总量',
                    color: 'red',
                    data: dep
                },
                {
                    name: 'Cumulative',
                    type: 'line',
                    color: 'black',

                    data: cumu
                },
                {
                    name: 'Average',
                    type: 'line',
                    color: '#F3CA20',
                    data: avg
                },
            ]
        };


        return option

    }

    const getOption_bar_flight = () => {


        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                // data: ['利润', '支出', '收入']
            },
            dataZoom: [{
                type: 'inside'
            }, {
                type: 'slider'
            }],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [


                {
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    data: xaxis
                }

            ],
            yAxis: [

                {
                    type: 'value'
                }


            ],
            series: [
                {
                    name: 'a',
                    type: 'bar',
                    stack: '总量',

                    data: arr_flight
                },
                {
                    name: 'b',
                    type: 'bar',
                    stack: '总量',
                    data: dep_flight
                },
                {
                    name: 'cumulative',
                    // smooth: true,
                    type: 'line',

                    data: cumu_flight
                },
                {
                    name: 'avg',
                    type: 'line',
                    data: avg_flight
                },
            ]
        };


        return option

    }

    // console.log(bankarr['index'])




    const getOption_bank = () => {


        const option = {
            color: ['#626169', '#362863', '#7F0068', '#DF3A5B', '#EF7854', '#7A893E'],

            title: {
                text:   "Daily Bank Structure on " + startDate.toDateString().split('00:')[0] + " - " + getTitle(vis) ,

                // subtext: getSubTitle(),
                left: 'center',
                textStyle: {
                    color: '#000',

                }
            },
            toolbox: {
                show: true,
                feature: {
                    // dataView: {title: 'View', show: true},
                    // restore: {},
                    saveAsImage: { title: 'Save', show: true },
                    restore: {},
                }
            },


            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },


            tooltip: {

                formatter: function (params, ticket, callback) {


                    // console.log(bankarr['index'].length)
                    // console.log(params)
                    if (params.value < 0) {


                        // console.log(metaarr[params.name])
                        // console.log(bankarr['index'][params.seriesIndex])
                        const lis = metaarr[params.name][bankarr['index'][params.seriesIndex]]


                        const str = lis.map(function (item, i) {

                            return ("Operating Airline : " + item[0] + "<br>"
                                + "Flight : " + item[3] + "<br>"
                                + "Alliance : " + item[1] + "<br>"
                                + "AC Type : " + item[2] + "<br>"
                                + "Seats : " + item[4] + "<br>"
                                + "Block Mins : " + item[5] + "<br>" + "<br>")

                        })



                        const res = (params.name + '<br/>'
                            + bankarr['index'][params.seriesIndex] + ", " + Data[bankarr['index'][params.seriesIndex]]['Name'] + ", " + Data[bankarr['index'][params.seriesIndex]]['Country Name'] + "<br> " + lis.length + " flight" + "<br>" + "<br>") + str

                        // return res
                        setTimeout(function () {
                            callback(ticket, res);
                        }, 300)
                        return 'loading';
                    }
                    else {


                        const lis = metadep[params.name][bankdep['index'][params.seriesIndex - bankarr['index'].length]]

                        const str = lis.map(function (item, i) {

                            return ("Operating Airline : " + item[0] + "<br>"
                                + "Flight : " + item[3] + "<br>"
                                + "Alliance : " + item[1] + "<br>"
                                + "AC Type : " + item[2] + "<br>"
                                + "Seats : " + item[4] + "<br>"
                                + "Block Mins : " + item[5] + "<br>" + "<br>")

                        })

                        const res = (params.name + '<br/>'
                            + bankdep['index'][params.seriesIndex - bankarr['index'].length] + ", " + Data[bankdep['index'][params.seriesIndex - bankarr['index'].length]]['Name'] + ", " + Data[bankdep['index'][params.seriesIndex - bankarr['index'].length]]['Country Name'] + "<br> "  + lis.length + " flight" + "<br>" + "<br>") + str
                        // + '<br/>------------------' + "Number of Flight : " + lis.length
                        // + '<br/>' 

                        setTimeout(function () {
                            callback(ticket, res);
                        }, 300)
                        return 'loading';
                        // return res

                    }
                }

                // trigger: 'axis',
                // axisPointer: {            // Use axis to trigger tooltip
                //     type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
                // }
            },
            legend: {
                top: 30
                // data: ['Africa', 'Asia', 'Australasia', 'Caribbean', 'Central America', 'Central America', 'Europe', 'Middle East', 'North America', 'Russian Federation', 'South America'],
                // orient: 'vertical'
            },
            // legend: {
            //     type: 'scroll',
            //     orient: 'horizontal',
            //     right: 10,
            //     top: 20,
            //     bottom: 20,
            //     // data: data.legendData,

            //     // selected: ['Thailand']
            // },

            dataZoom: [
                {
                    type: 'slider',
                    yAxisIndex: 0,
                    filterMode: 'none',
                    // left: '50%'

                },
                {
                    type: 'inside',
                    yAxisIndex: 0,
                    filterMode: 'none',
                    // left: '50%'

                }
            ],

            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                // splitArea: {
                //     show: true,
                //     // areaStyle : [
                //     //     {
                //     //         start: 1,
                //     //         end: 10,
                //     //         color: "red"
                //     //     },
                //     //     {
                //     //         start: 10,
                //     //         end: 20,
                //     //         color: "blue",
                //     //     }
                //     // ],
                // }
            },
            yAxis: {
                type: 'category',
                data: xaxis

            },
            series: MakeBank(bankarr, bankdep)

        };

        return option
    }

    const print = (data) => {

        // console.log("test",data)


        // return <h5>123456</h5>

        if (data.length === 0) {
            return <div style={{ height: '300px' }}></div>
        }
        else {
            // console.log(data)
            // const tmp = data.map(name => 
            // <p >{name}</p>
            // console.log(data)
            // data = Object.entries(data).sort((a,b) => b[1] - a[1]);


            const tmp = Object.entries(data)
                .sort((a, b) => b[1] - a[1])
                .map(([keyName, value]) => (
                    <h5 >
                        {keyName} : {parseFloat((value * 100)).toFixed(2)} %
                    </h5>
                ))
            return <div style={{ height: '300px' }}> {tmp}</div>
        }

    }

    // function get_chart(option){
    //     return <ReactEcharts
    //     option={option}
    //     notMerge={true}
    //     lazyUpdate={true}
    //     style={{ height: '700px', width: '100%' }}
    //     className='react_for_echarts' />

    // }

    function long(e) {
        setStartDate(e)
        setSearch("")
        test(e, vis, time, "")
        setChecked(false)
    }

    function append() {

    }





    return (
        <div
            style={{
                backgroundColor: '#F0F0F0',
                minHeight: '240vh'
            }}>

            {/* <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
            /> */}


            <Grid container spacing={3} className={classes.grid}>
                <Grid item xs={12} md={2}>
                    {/* <Paper className={classes.paper_list}> */}
                    <DatePicker selected={startDate} onChange={long}
                        filterDate={date => date.getFullYear() >= 2005 && date.getFullYear() <= 2019}
                    />
                    {/* </Paper> */}
                </Grid>
                <Grid item xs={12} md={2}>
                    <Paper className={classes.paper_list}>
                        <Select
                            value=''
                            displayEmpty
                            onChange={handleChange_vis}
                        >
                            <MenuItem value="" disabled >Type of Data </MenuItem>
                            <MenuItem value={0}>Flights</MenuItem>
                            <MenuItem value={1}>Seats</MenuItem>
                        </Select>

                    </Paper>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Paper className={classes.paper_list}>
                        <Select
                            value=""
                            displayEmpty
                            onChange={e => handleChange_time(e)}

                        >
                            <MenuItem value="" disabled >Time Interval</MenuItem>
                            <MenuItem value={0}>15 Minutes</MenuItem>
                            <MenuItem value={1}>30 Minutes</MenuItem>
                            <MenuItem value={2}>1 Hour</MenuItem>
                            <MenuItem value={3}>3 Hours</MenuItem>
                            <MenuItem value={4}>6 Hours</MenuItem>
                        </Select>

                    </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper className={classes.paper_form}>

                        <form onSubmit={handleSubmit(OnSubmit)} >
                            <input name="station" type="text" placeholder="Station airport" ref={register} />
                            {/* <TextField name="station" label="Origin Station" variant="outlined" ref={register} /> */}
                            {/* <TextField name="Dest" label="Destination Station" variant="outlined" ref={register}/>  */}
                            <input type="submit" />
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper className={classes.paper}>
                        <ReactEcharts
                            option={getOption_bank()}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: '700px', width: '100%' }}
                            className='react_for_echarts' />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6} >
                    <Paper className={classes.paper}>
                        <ReactEcharts
                            option={getOption_bar()}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: '600px', width: '100%' }}
                            className='react_for_echarts' />

                    </Paper>


                </Grid>


                <Grid item xs={12} md={6}>
                    <Paper className={classes.paper}>
                        <ReactEcharts
                            option={getOption_pie()}
                            notMerge={true}
                            style={{ height: '600px', width: '100%' }}
                            className='react_for_echarts' />

                    </Paper>

                </Grid>

                <Grid item xs={12} md={6} >
                    <Paper className={classes.paper}>
                        <h5>TOP10 Arrival  {getTitle(vis)}  on {startDate.toDateString().split('00:')[0]} {print(arrp)}</h5>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.paper}>
                        <h5>TOP10 Departure {getTitle(vis)} on {startDate.toDateString().split('00:')[0]} {print(depp)}</h5>
                    </Paper>


                </Grid>




            </Grid>
            <h1></h1>









            {/* {get_chart(getOption_bank())} */}







        </div>
    );
}