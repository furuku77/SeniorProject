import React, { PureComponent } from 'react';
import Timeline from 'react-visjs-timeline'
import '../scss/base.scss'

export default class Demo extends PureComponent {
    render() {
        const items = [
            {
              "id": 1,
              "content": "ICN",
              "start": "2014-01-01T11:05:00",
              "type": "box"
            },
            {
                "id": 2,
                "content": "ICN",
                "start": "2014-01-01T23:45:00",
                "type": "box"
              },
              {
                "id": 3,
                "content": "ICN",
                "start": "2014-01-01T00:50:00",
                "type": "box"
              },
              {
                "id": 4,
                "content": "ICN",
                "start": "2014-01-01T13:15:00",
                "type": "box"
              },
              {
                "id": 5,
                "content": "ICN",
                "start": "2014-01-01T21:30:00",
                "type": "box"
              },
              {
                "id": 6,
                "content": "ICN",
                "start": "2014-01-01T22:55:00",
                "type": "box"
              },
              {
                "id": 7,
                "content": "ICN",
                "start": "2014-01-01T00:20:00",
                "type": "box"
              },
              {
                "id": 8,
                "content": "ICN",
                "start": "2014-01-01T21:10:00",
                "type": "box"
              },
              {
                "id": 9,
                "content": "ICN",
                "start": "2014-01-01T22:15:00",
                "type": "box"
              },
              {
                "id": 10,
                "content": "ICN",
                "start": "2014-01-01T00:30:00",
                "type": "box"
              },
              {
                "id": 11,
                "content": "ICN",
                "start": "2014-01-01T13:30:00",
                "type": "box"
              },
              {
                "id": 12,
                "content": "ICN",
                "start": "2014-01-01T14:45:00",
                "type": "box"
              },
              {
                "id": 13,
                "content": "ICN",
                "start": "2014-01-01T15:15:00",
                "type": "box"
              },
              {
                "id": 14,
                "content": "ICN",
                "start": "2014-01-01T01:20:00",
                "type": "box"
              },
              {
                "id": 15,
                "content": "ICN",
                "start": "2014-01-01T00:10:00",
                "type": "box"
              },
              {
                "id": 16,
                "content": "ICN",
                "start": "2014-01-01T21:25:00",
                "type": "box"
              },
              {
                "id": 17,
                "content": "ICN",
                "start": "2014-01-01T01:40:00",
                "type": "box"
              }
           
            
          ]
        const options = {
            width: '100%',
            // height: '100px',
            margin: {
                item: 20
              },
            stack: false,
            showMajorLabels: true,
            showCurrentTime: true,
            limitSize : true,
            start : '2014-01-01',
            zoomMin: 1000000,
            zoomMax:100000000,
            autoResize : true,
            stack : true,
            orientation :{
              item : 'bottom'
            } , 
            // start : '2014-01-01',

            type: 'background',
            format: {
                minorLabels: {
                    minute: 'HH:mm',
                    hour: 'HH:mm',
                },
                majorLabels: {
                    month: 'YYYY'
                }
            }
            
        }


        return (
            <Timeline options={options} items={items} />
        );
    }
}