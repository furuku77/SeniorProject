import React, { useEffect, useState } from 'react';
import Connect_map from '../components/connect_map'
import Nav from '../components/navbar'


function Map() {

    return (

        <div>
            <Nav />
            <Connect_map />
        </div>
    );
}

export default Map;