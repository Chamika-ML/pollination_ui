import React from 'react'
import { useState } from 'react';
import './Home.css'


export default function Home() {


    const [iframeContent, setIframeContent] = useState(["<h1>Map Will Load Here</h1>"]);

    async function plotMap(){
        setIframeContent(["<h1>Loading...</h1>"])

        var minLat = parseFloat(document.getElementById('minLat').value);
        var maxLat = parseFloat(document.getElementById('maxLat').value);
        var minLong = parseFloat(document.getElementById('minLong').value);
        var maxLong = parseFloat(document.getElementById('maxLong').value);
        var url = `http://127.0.0.1:7777/pollination/?minLat=${minLat}&maxLat=${maxLat}&minLon=${minLong}&maxLon=${maxLong}`;
        var url2 = `http://127.0.0.1:7777/timing/?minLat=${minLat}&maxLat=${maxLat}&minLon=${minLong}&maxLon=${maxLong}`;

        try {
            //processing time astimateion
            const time_rsponce = await fetch(url2);
            const process_time = await time_rsponce.json();
            setIframeContent([`<h1>Loading........This will take ${process_time.time} minutes to complete</h1>`])
            if (process_time.message === "0"){
                setIframeContent(["<h1>Try again...Connection or Server Error</h1>"])
                return
            }
            // the heatmap result
            const response = await fetch(url);
            const data = await response.json();

            if (data.map === "0"){
                setIframeContent(["<h1>Try again...Connection or Server error</h1>"])
                return
            }
            setIframeContent(data.map);
        } catch (error) {
            console.error('Error fetching HTML content:', error);
        }
    }

    function resetInputs(){
       console.log("Reset")
    }

  return (
    <div className='main-container'>
        <h1>Honeybee pollination index model</h1>
        <div className='input-container'>
            <p>Minimum latitude:  </p>
            <input type='text' name='minLat' id='minLat' />
            <p>Maximum latitude:  </p>
            <input type='text' name='maxLat' id='maxLat' />
            <p>Minimum longitude:  </p>
            <input type='text' name='minLong' id='minLong' />
            <p>Maximum longitude:  </p>
            <input type='text' name='maxLong' id='maxLong' />
            <button name='plot' onClick={plotMap}>Plot</button>
            <button name='reset' onClick={resetInputs}>Reset</button>
        </div>

      <div className='iframe-container'>
      <iframe
        title="HTML Content"
        srcDoc={iframeContent}
        style={{ width: '100%', height: '80vh', border: 'none' }}
      />
    </div>
    </div>
  )
}
