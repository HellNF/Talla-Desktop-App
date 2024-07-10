import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function Chart({ campaignData }) {
    const [selectedTime, setSelectedTime] = useState(null);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        // Inizializza selectedTime al primo valore di tempo disponibile
        if (campaignData.length > 0) {
            setSelectedTime(campaignData[0].time);
        }
    }, [campaignData]);

    // Gestisce il cambio del tempo selezionato
    const handleTimeChange = (event) => {
        const time = parseFloat(event.target.value);
        setSelectedTime(time);
    };

    // Filtra i dati in base al tempo selezionato
    useEffect(() => {
        if (campaignData.length > 0 && selectedTime !== null) {
            const dataFiltered = campaignData.filter(item => item.tag_id === 103);
            setFilteredData(dataFiltered);
        } else {
            setFilteredData([]);
        }
    }, [campaignData, selectedTime]);

    return (
        <div>
            <h1>Dashboard</h1>
            {/* Selettore di Timeline */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="range"
                    min={campaignData.length > 0 ? campaignData[0].time : 0}
                    max={campaignData.length > 0 ? campaignData[campaignData.length - 1].time : 0}
                    step={0.001}
                    value={selectedTime || ''}
                    onChange={handleTimeChange}
                    style={{ width: '80%' }}
                />
                <span>{selectedTime}</span>
            </div>

            {/* Grafico Plotly */}
            <Plot
                data={[
                    {
                        x: filteredData.map(row => row.x_kf),
                        y: filteredData.map(row => row.y_kf),
                        text: filteredData.map(row => `Time: ${row.time}`),
                        mode: 'markers',
                        type: 'scatter',
                        marker: { size: 12 },
                    },
                ]}
                layout={{
                    width: 720,
                    height: 480,
                    title: 'Positions of a Person',
                    xaxis: { title: 'X Position' },
                    yaxis: { title: 'Y Position' }
                }}
            />
        </div>
    );
}

export default Chart;
