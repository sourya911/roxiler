import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Barch = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    try {
      let url = 'http://localhost:5000/bar-chart';
      if (selectedMonth) {
        url += `?month=${selectedMonth}`;
      }
      const response = await fetch(url);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Custom function to generate the ticks for the X-axis
  const generateXTicks = () => {
    return [
      '0 - 100',
      '101 - 200',
      '201 - 300',
      '301 - 400',
      '401 - 500',
      '501 - 600',
      '601 - 700',
      '701 - 800',
      '801 - 900',
      '901 - above'
    ];
  };

  const chartWidth = data.length * 80; 

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="month" className="block font-semibold mb-2">Select Month:</label>
        <select id="monthFilter" value={selectedMonth} onChange={handleMonthChange}>
                        <option value="">All Months</option>
                        {[...Array(12).keys()].map(monthIndex => (
                            <option key={monthIndex} value={String(monthIndex + 1).padStart(2, '0')}>
                                {new Date(2000, monthIndex, 1).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
      </div>
      <div className="bg-white rounded-md shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Bar Chart</h2>
        <ResponsiveContainer width={chartWidth} height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" tick={generateXTicks()} interval={0} angle={45} textAnchor="start" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Barch;
