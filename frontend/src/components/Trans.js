import React, { useEffect, useState } from 'react';

const Trans = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`http://localhost:5000/transactions?page=${currentPage}&month=${selectedMonth}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }
                const data = await response.json();
                setTransactions(data.transactions);
                setTotalPages(data.totalPages);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [currentPage, selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Transactions</h2>
            <div className="flex justify-between mb-4">
                <div>
                    <label htmlFor="monthFilter" className="mr-2">Filter by Month:</label>
                    <select id="monthFilter" value={selectedMonth} onChange={handleMonthChange} className="border border-gray-300 rounded-md px-3 py-1">
                        <option value="">All Months</option>
                        {[...Array(12).keys()].map(monthIndex => (
                            <option key={monthIndex} value={String(monthIndex + 1).padStart(2, '0')}>
                                {new Date(2000, monthIndex, 1).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 mr-2 rounded">
                        Previous
                    </button>
                    <span className="mx-2">{currentPage} / {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded">
                        Next
                    </button>
                </div>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="min-w-full border border-collapse border-gray-800">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-6 py-3 text-left text-xs leading-4 font-semibold text-gray-800 uppercase tracking-wider border border-gray-800">ID</th>
                            <th className="px-6 py-3 text-left text-xs leading-4 font-semibold text-gray-800 uppercase tracking-wider border border-gray-800">Title</th>
                            <th className="px-6 py-3 text-left text-xs leading-4 font-semibold text-gray-800 uppercase tracking-wider border border-gray-800">Price</th>
                            <th className="px-6 py-3 text-left text-xs leading-4 font-semibold text-gray-800 uppercase tracking-wider border border-gray-800">Description</th>
                            <th className="px-6 py-3 text-left text-xs leading-4 font-semibold text-gray-800 uppercase tracking-wider border border-gray-800">Category</th>
                            <th className="px-6 py-3 text-left text-xs leading-4 font-semibold text-gray-800 uppercase tracking-wider border border-gray-800">Sold</th>
                            <th className="px-6 py-3 text-left text-xs leading-4 font-semibold text-gray-800 uppercase tracking-wider border border-gray-800">Date of Sale</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-800">{transaction.id}</td>
                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-800">{transaction.title}</td>
                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-800">{transaction.price}</td>
                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-800">{transaction.description}</td>
                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-800">{transaction.category}</td>
                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-800">{transaction.sold ? 'Yes' : 'No'}</td>
                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-800">{transaction.dateOfSale}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Trans;
