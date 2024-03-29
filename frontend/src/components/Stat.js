import React, { useState, useEffect } from 'react';

const Stat = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch(`http://localhost:5000/statistics?month=${selectedMonth}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }
                const data = await response.json();
                setStatistics(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setLoading(false);
            }
            console.log(selectedMonth,"value")
        };

        fetchStatistics();
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Statistics</h2>
            <div className="flex mb-4">
                <label htmlFor="monthFilter" className="mr-2">Filter by Month:</label>
                <select id="monthFilter" value={selectedMonth} onChange={handleMonthChange}>
                        <option value="">All Months</option>
                        {[...Array(12).keys()].map(monthIndex => (
                            <option key={monthIndex} value={String(monthIndex + 1).padStart(2, '0')}>
                                {new Date(2000, monthIndex, 1).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="border p-4 rounded-md">
                    <p className="text-lg font-semibold mb-2">Statistics for {selectedMonth ? `Month ${selectedMonth}` : 'All Months'}</p>
                    <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
                    <p>Total Sold Items: {statistics.totalSoldItems}</p>
                    <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
                </div>
            )}
        </div>
    );
};

export default Stat;
