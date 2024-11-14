"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'chart.js/auto';

export interface Statistics {
    total_applications: number;
    status_count: {
        pending: number;
        accepted: number;
        rejected: number;
    };
    month_count: {
        [month: string]: number;
    };
}

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
    ssr: false,
});

const data = {
    labels: [] as string[],
    datasets: [
        {
            label: 'Applications statuses',
            data: [] as number[],
            backgroundColor: [
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
};
const BarChart: React.FC = () => {

    // fettch data from backend
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:3001/applications/stats`);
            const statusCount: Statistics["status_count"] = response.data.status_count;

            // set statistsics data to app state
            for (const [status, count] of Object.entries(statusCount)) {
                data.labels.push(status)
                data.datasets[0].data.push(count)
            }
        } catch (error) {
            console.error('Error', error);
        }
    };

    useEffect(() => {
        console.log("DATA", data)
        fetchData();
    }, []);


    return (
        <div className='mx-auto mb-9 pt-8'>
            <h1 className=''>Applications Statistics</h1>
            <Bar data={data} />
        </div>
    );
};
export default BarChart;