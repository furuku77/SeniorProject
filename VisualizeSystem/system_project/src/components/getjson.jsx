import React, { PureComponent } from 'react';
import Data from '../file/test2.json'

export default class getjson extends PureComponent {
    render() {
        function geoCoordMap(idx) {
            console.log(555)
            // console.log(idx,[Data[idx]['Latitude'],Data[idx]['Longitude']])
            return [Data[idx]['Latitude'],Data[idx]['Longitude']];
            // return [Data.airports[idx]['Latitude'], Data.airports[idx]['Longitude']];
        }

            const GZData = [
                [{ name: 'CAN' }, { name: 'BKK', value: 0.35769480941849876 }],
                [{ name: 'CSX' }, { name: 'BKK', value: 0.012488617145830622 }],
                [{ name: 'CTU' }, { name: 'BKK', value: 0.00013008976193573565 }],
                [{ name: 'HGH' }, { name: 'BKK', value: 0.0 }],
                [{ name: 'HKG' }, { name: 'BKK', value: 0.07031351632626512 }],
                [{ name: 'ICN' }, { name: 'BKK', value: 0.0019513464290360349 }],
                [{ name: 'KHN' }, { name: 'BKK', value: 0.0028619747625861845 }],
                [{ name: 'KMG' }, { name: 'BKK', value: 0.06276831013399245 }],
                [{ name: 'LHW' }, { name: 'BKK', value: 0.00039026928580720695 }],
                [{ name: 'PEK' }, { name: 'BKK', value: 0.008781058930662156 }],
                [{ name: 'PVG' }, { name: 'BKK', value: 0.03980746715233511 }],
                [{ name: 'SHA' }, { name: 'PVG', value: 0.0 }],
                [{ name: 'SWA' }, { name: 'BKK', value: 0.0005854039287108105 }],
                [{ name: 'SZX' }, { name: 'BKK', value: 0.03844152465200989 }],
                [{ name: 'TAO' }, { name: 'BKK', value: 0.004358007024847145 }],
                [{ name: 'TNA' }, { name: 'BKK', value: 0.008195655001951347 }],
                [{ name: 'TPE' }, { name: 'BKK', value: 0.0009756732145180174 }],
                [{ name: 'URC' }, { name: 'BKK', value: 0.20013008976193573565 }],
                [{ name: 'WUH' }, { name: 'BKK', value: 0.01853779107584233 }],
                [{ name: 'WUX' }, { name: 'BKK', value: 0.0007154936906465461 }],
                [{ name: 'XIY' }, { name: 'BKK', value: 0.0 }],
                [{ name: 'XIY' }, { name: 'CAN', value: 0.05769480941849876 }],
                [{ name: 'XIY' }, { name: 'CSX', value: 0.312488617145830622 }],
                [{ name: 'XIY' }, { name: 'CTU', value: 0.00013008976193573565 }],
                [{ name: 'XIY' }, { name: 'HGH', value: 0.0 }],
                [{ name: 'XIY' }, { name: 'HKG', value: 0.07031351632626512 }],
                [{ name: 'XIY' }, { name: 'ICN', value: 0.0019513464290360349 }],
                [{ name: 'XIY' }, { name: 'KHN', value: 0.0028619747625861845 }],
                [{ name: 'XIY' }, { name: 'KMG', value: 0.06276831013399245 }],
                [{ name: 'XIY' }, { name: 'LHW', value: 0.00039026928580720695 }],
                [{ name: 'XIY' }, { name: 'PEK', value: 0.508781058930662156 }],
                [{ name: 'XIY' }, { name: 'PVG', value: 0.039482242747495774 }],
                [{ name: 'XIY' }, { name: 'SHA', value: 0.0 }],
                [{ name: 'XIY' }, { name: 'SWA', value: 0.0005854039287108105 }],
                [{ name: 'XIY' }, { name: 'SZX', value: 0.03844152465200989 }],
                [{ name: 'XIY' }, { name: 'TAO', value: 0.004358007024847145 }],
                [{ name: 'XIY' }, { name: 'TNA', value: 0.008195655001951347 }],
                [{ name: 'XIY' }, { name: 'TPE', value: 0.0009756732145180174 }],
                [{ name: 'XIY' }, { name: 'URC', value: 0.00013008976193573565 }],
                [{ name: 'XIY' }, { name: 'WUH', value: 0.01853779107584233 }],
                [{ name: 'XIY' }, { name: 'WUX', value: 0.0007154936906465461 }],
                [{ name: 'XIY' }, { name: 'ZHA', value: 0.0006504488096786782 }],
                [{ name: 'ZHA' }, { name: 'BKK', value: 0.0006504488096786782 }],
            ];

            const convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    console.log(dataItem[0].name)
                    console.log(dataItem[1].name)
                    var fromCoord = geoCoordMap(dataItem[0].name);
                    var toCoord = geoCoordMap(dataItem[1].name);
                    console.log(fromCoord)
                    console.log(toCoord)
                    // console.log(toCoord)
                    // if (fromCoord && toCoord) {
                    //     res.push({
                    //         fromName: dataItem[0].name,
                    //         toName: dataItem[1].name,
                    //         coords: [fromCoord, toCoord],
                    //         value: dataItem[1].value
                    //     });
                    // }
                    // console.log(dataItem[0].name,dataItem[1].name)
                    // console.log(dataItem[1].name)
                    // console.log([Data[dataItem[1].name]['Latitude'],Data[dataItem[1].name]['Longitude']])
                    // console.log(fromCoord[][])
                }
                return res;
            };

            const test = convertData(GZData)

            // console.log(test)


            

        
        return (
            <div>
                
                {/* {Data.map((PostDetail, index) => {
                    return <h1>{PostDetail.Name}</h1>

                })} */}

            </div>

        );
    }
}
