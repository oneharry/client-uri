"use client";
// import { baseUrl } from '@/app/layout';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./table.css";


interface Application {
    id: string;
    jobTitle: string;
    companyName: string;
    status: string;
    dateApplied: string;
}

const Table: React.FC = () => {
    const [data, setData] = useState<Application[]>([]);
    const [filteredData, setFilteredData] = useState<Application[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filter, setFilter] = useState<string>('');
    const [loading, isLoading] = useState<boolean>(true);

    const totalPages = filteredData.length > 0 ? Math.ceil(data.length / rowsPerPage) : 0;
    const currentData = filteredData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

        setFilter(event.target.value);

    };


    // asyn call fetches data from backen
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:3001/applications`);

            const data = response.data.sort((a: Application, b: Application) => {
                const firstDate = new Date(a.dateApplied);
                const lastDate = new Date(b.dateApplied);
                return lastDate.getTime() - firstDate.getTime();
            });

            // return all unique status
            const appStatuses: string[] = data.map((x: Application) => {
                return x.status;
            })
                .filter((status: string, index: number, self: string) => self.indexOf(status) === index);

            // sets data to state
            setStatuses(appStatuses);
            setData(data);
            setFilteredData(data);
            isLoading(false)
        } catch (error) {
            console.error('Error', error);
        }
    };

    // fetch data on component did mount
    useEffect(() => {
        fetchData();
    }, []);


    // handles component on ilter value change
    useEffect(() => {
        if (filter === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter((item) => item.status === filter);
            setFilteredData(filtered);
        }
        setCurrentPage(0);
    }, [filter])


    // handle the sort, on click in the table
    const handleSort = () => {
        const sortedData = filteredData.sort((a: Application, b: Application) => {
            const firstDate = new Date(a.dateApplied);
            const lastDate = new Date(b.dateApplied);

            if (sortOrder === 'asc') {
                setSortOrder("desc")
                return firstDate.getTime() - lastDate.getTime();
            } else {
                setSortOrder("asc")
                return lastDate.getTime() - firstDate.getTime();
            }
        });
        setFilteredData(sortedData);
    };


    return (
        <div className="my-8 bg-white rounded-lg ">
            {loading ? (<p className="text-center text-gray-600">Loading ...</p>) :
                filteredData.length === 0 ? (
                    <p className="text-center text-gray-600">No data available</p>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <label htmlFor="filter" className="mr-2 text-gray-600">
                                    Filter by Status:
                                </label>
                                <select
                                    id="filter"
                                    value={filter}
                                    onChange={handleFilterChange}
                                    className="border border-gray-300 rounded px-2 py-1"
                                >
                                    <option key="" value="">
                                        All
                                    </option>
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border-b border-gray-200">Job Title</th>
                                        <th className="px-4 py-2 border-b border-gray-200">Company</th>
                                        <th className="px-4 py-2 border-b border-gray-200">Status</th>
                                        <th className="px-4 py-2 border-b border-gray-200 sort-btn" onClick={handleSort}>Date Applied {sortOrder === 'asc' ? '▲' : '▼'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((job) => (
                                        <tr key={job.id} className="text-gray-700 hover:bg-gray-100">
                                            <td className="px-4 py-2 border-b border-gray-200">{job.jobTitle}</td>
                                            <td className="px-4 py-2 border-b border-gray-200">{job.companyName}</td>
                                            <td className="px-4 py-2 border-b border-gray-200">{job.status}</td>
                                            <td className="px-4 py-2 border-b border-gray-200">{job.dateApplied}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                <label htmlFor="rowsPerPage" className="mr-2 text-gray-600">
                                    Rows per page:
                                </label>
                                <select
                                    id="rowsPerPage"
                                    value={rowsPerPage}
                                    onChange={handleChangeRowsPerPage}
                                    className="border border-gray-300 rounded px-2 py-1"
                                >
                                    {[5, 10, 15].map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 0}
                                    className={`px-3 py-1 rounded ${currentPage === 0 ? 'bg-gray-300' : 'bg-blue-500 text-white'
                                        }`}
                                >
                                    Previous
                                </button>
                                <span className="text-gray-600">
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage >= totalPages - 1}
                                    className={`px-3 py-1 rounded ${currentPage >= totalPages - 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
        </div>
    );
};

export default Table;
