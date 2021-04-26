import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import Data from '../file/test2.json'
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import Base from '../file/world.topo.bathy.200401.jpg'
import Highlight from '../file/bathymetry_bw_composite_4k.jpg'

export default function App(props) {

    // console.log(props)

    function geoCoordMap(idx) {

        // console.log(idx, [Data[idx]['Latitude'], Data[idx]['Longitude']])
        return [Data[idx]['Longitude'], Data[idx]['Latitude']];
    }

    function getMeta(idx) {

        if(Data[idx] != undefined){
            return Data[idx]['Name'];
        }
        else{
            return "Not Airport Name";
        }

        // console.log(idx, [Data[idx]['Latitude'], Data[idx]['Longitude']])
        
    }

    // function getData(data, vis, year) {
    //     setLink(data)
    //     console.log('EDOk', data)
    //     axios.post("http://localhost:5000/api", { 'station': data, 'type': vis, 'year': year }).then(


    //         (response) => {

    //             const result = response.data.vis;
    //             setVal_node(response.data.for_node)
    //             setInitialData(result.map(

    //                 tmp => ({ 'link': tmp.link, 'val': tmp.val }))
    //             );
    //             // setInitialData(result)

    //         },
    //         (error) => {
    //             console.log(error);
    //         }
    //     );
    //     axios.post("http://localhost:5000/transit", { 'station': data, 'type': vis, 'year': year }).then(

    //         (response) => {

    //             const result = response.data;
    //             // console.log(result)
    //             // setInitialData(result.map(

    //             //     tmp => ({ 'link': tmp.link, 'val':tmp.val }) )
    //             //   );
    //             setPath(result)
    //             setNon(response.data['non_stop'])
    //             setStop1(response.data['Stop1'])
    //             setStop2(response.data['Stop2'])
    //             setStop3(response.data['Stop3'])
    //             // const non = path['non-stop']
    //             // const stop1 = path['Stop1']
    //             // const stop2 = path['Stop2']
    //             // const stop3 = path['Stop3']
    //         },
    //         (error) => {
    //             console.log(error);
    //         }
    //     );


    // }


    function getTitle(){
        

        if(Object.keys(props.link).length !== 0 ){
            const title = props.link['station'] + " - "+ props.link['Dest'] + " in " + (props.year + 2005)
            return title 
        }
        else{
            return "Connection" 
        }
        
    }

    function getSubTitle(){

        console.log(props.link['station'],props.link['Dest'])
        console.log('----',Data['asdf'])
        
        if(Object.keys(props.link).length !== 0 ){
            const sub =  getMeta(props.link['station']) + " - "+ getMeta(props.link['Dest'])
            return sub
        }
        else{
            return ""
        }
        
    }

    const getOption = () => {
      
        
        
        // const BJData = initialData

        const color = ['#a6c84c', '#a6c84c', '#a6c84c'];
        const series = [];
        // console.log(item[2])
        series.push({
            type: 'lines',
            zlevel: 2,
            effect: {
                show: false,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 2.5
            },
            lineStyle: {
                normal: {
                    color: color[0],
                    width: 0,
                    curveness: 0.2,
                    opacity: 0.7,
                }
            },


            data: props.data
        },
            {
                type: 'lines',
                zlevel: 2,
                symbol: ['none', 'arrow'],
                symbolSize: 10,
                effect: {
                    show: false,
                    period: 6,
                    trailLength: 0,
                    symbol: 'none',
                    symbolSize: 15
                },
                lineStyle: {
                    normal: {
                        color: '#a6c84c',
                        width: 2.5,
                        opacity: 0.8,
                        curveness: 0.2
                    }
                },
                data: props.data

            },
            {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: false,
                        position: 'right',
                        // formatter: '{b}'
                    }
                },
                symbolSize: function (val) {
                    // console.log(maximum)
                    return (val[2] / props.LisMax[props.node]) * 30 ;
                },
                itemStyle: {
                    normal: {
                        color: '#a6c84c'
                    }
                },

                data: props.val_node.map(function (dataItem) {
                    // console.log(dataItem)
                    return {

                        name: dataItem.name,
                        value: geoCoordMap(dataItem.name).concat(dataItem.val[props.node])
                    };
                })
            });

        if (props.globe == 1) {
            const option = {
                backgroundColor: '#000',
                title: {
                    text:   getTitle(),
                    subtext: getSubTitle(),
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    }
                },
                globe: {
                    baseTexture: Base,
                    heightTexture: Highlight,

                    shading: 'lambert',

                    light: {
                        ambient: {
                            intensity: 0.4
                        },
                        main: {
                            intensity: 0.4
                        }
                    },

                    viewControl: {
                        autoRotate: true,
                        // maxBeta : 90,
                        // minAlpha : 90,
                        // autoRotateDirection = cw,
                        longitude: 100.7455978394,
                        latitude: 13.7026996613
                    },

                },
                visualMap: {
                    calculable: true,
                    realtime: false,
                    // show: true,
                    min: 0,
                    max: props.max,
                    
                    inRange: {
                        opacity: [0.1, 1],
                        width: [1, 5],
                        color: ['#a6c84c']
                    }
                },

                series: [{

                    type: 'lines3D',

                    coordinateSystem: 'globe',

                    blendMode: 'lighter',

                    lineStyle: {
                        width: 4,
                        color: 'rgb(50, 50, 150)',
                        opacity: 1
                    },


                    data: props.data
                },
                {

                    type: 'lines3D',

                    coordinateSystem: 'globe',

                    blendMode: 'lighter',

                    effect: {
                        show: true,
                        trailWidth: 4,
                        trailLength: 0.15,
                        trailOpacity: 1,
                        trailColor: 'rgb(30, 30, 60)'
                    },


                    data: props.data
                }, {
                    type: 'bar3D',
                    coordinateSystem: 'globe',
                    barSize: 0.6,
                    minHeight: 0.2,
                    silent: true,
                    itemStyle: {
                        color: 'orange'
                    },
                    data: props.val_node.map(function (dataItem) {
                        // console.log(dataItem)
                        return {

                            name: dataItem.name,
                            value: geoCoordMap(dataItem.name).concat(dataItem.val[props.node])
                        };
                    })

                }]

            }
            return option;

        }
        else {
            const option = {
                backgroundColor: '#202020',
                // backgroundColor: '#000',
                title: {
                    text:  getTitle() ,
                    
                    subtext: getSubTitle(),
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    }
                },

                legend: {
                    orient: 'vertical',
                    top: 'bottom',
                    left: 'right',
                    // data: ['A', '上海 Top10', '广州 Top10'],
                    textStyA: {
                        color: '#fff'
                    },
                    selectedMode: 'single'
                },
                geo: {
                    map: 'world',
                    label: {
                        emphasis: {
                            show: true
                        }
                    },
                    scaleLimit: {
                        min: 1.05,
                        max: 10
                    },
                    roam: true,
                    // {
                    //     move : false,
                    //     zoom : true
                    // },
                    itemStyle: {
                        normal: {
                            areaColor: 'black',
                            borderColor: '#404a59'
                        },
                        emphasis: {
                            areaColor: '#2a333d'
                        }
                    }
                },
                tooltip:
                {
                    // "trigger": "axis",
                    formatter: function (params, ticket, callback) {
                        // console.log(params)
                        if (params.componentSubType == "effectScatter") {
                            // console.log(params)
                            // console.log(params.name )
                            // console.log(params.value[2])
                            var res = params.name + ' : ' + params.value[2];
                            // console.log(res)
                            // var res = params;
                            setTimeout(function () {
                                callback(ticket, res);
                            }, 100)
                            return 'loading';
                        }
                        else if (params.componentSubType == "lines") {
                            var res = params.data.fromName + ' - ' + params.data.toName + ' : ' + params.data.value;
                            // console.log(res)
                            setTimeout(function () {
                                callback(ticket, res);
                            }, 100)
                            return 'loading';

                        }


                    }
                },
                visualMap: {
                    show: true,
                    calculable: true,
                    min: 0,
                    max: props.max,
                    
                    inRange: {
                        opacity: [0.1, 1],
                        width: [1, 5],
                        color: ['#a6c84c']
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

                series: series
            };
            return option;

        }



    };


    return (
        <div>

            <ReactEcharts
                option={getOption()}
                notMerge={true}
                lazyUpdate={true}
                style={{ height: '600px', width: '100%' }}
                className='react_for_echarts' />
           
        </div>

    );


}






