"use client"

import { ServicesData, VisitsData } from '@/types/types';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import React, { useState } from 'react';

interface StatisticsTableProps {
    visitsData: VisitsData[];
    servicesData: ServicesData[];
}

export const StatisticsTable: React.FC<StatisticsTableProps> = ({
    visitsData,
    servicesData,
}) => {
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pageInput, setPageInput] = useState('1');

    const mergedData = visitsData.map((visit) => {
        const relatedService = servicesData.find(
            (service) => service.service_id === visit.service_id
        );
        return {
            ...visit,
            service: relatedService,
        };
    });

    const filteredData = mergedData.filter((data) =>
        data.client_name?.includes(filter)
    );

    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const displayedData = filteredData.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= pageCount) {
            setCurrentPage(value - 1);
        }
        setPageInput(e.target.value);
    };

    const handleItemsPerPageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= 1) {
            setItemsPerPage(value);
            setCurrentPage(0);
        }
    };

    return (
        <div className="p-4 border-[1px] rounded-lg bg-white w-full overflow-y-auto flex flex-col gap-8">
            <div className="flex justify-between">
                <input
                    className="px-4 py-2 outline-none border-[1px] transition focus:border-violet-300 rounded-full w-full min-[768px]:w-64"
                    type="text"
                    placeholder="Search"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <div className="border-[.5px] w-full p-4 rounded-lg flex flex-col items-end gap-4 max-[1024px]:hidden">
                <table className="w-full">
                    <thead className="border-b-[.5px] p-4">
                        <tr>
                            <th className="text-center p-2 text-lg text-[#737373]">Client Name</th>
                            <th className="text-center p-2 text-lg text-[#737373]">Visit Date</th>
                            <th className="text-center p-2 text-lg text-[#737373]">Service</th>
                            <th className="text-center p-2 text-lg text-[#737373]">Price</th>
                        </tr>
                    </thead>
                    <tbody className="p-8 rounded-full">
                        {displayedData.map((data, index) => (
                            <tr className="border-b-[.5px]" key={index}>
                                <td className="text-center font-normal p-2">{data.client_name}</td>
                                <td className="text-center font-normal p-2">{data.end_time?.split('T')[0]}</td>
                                <td className="text-center font-normal p-2">{data.service?.title}</td>
                                <td className="text-center font-normal p-2">{data.service?.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between">
                <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                    <ArrowLeft />
                </button>
                <div>
                    <input
                        type="number"
                        min="1"
                        max={pageCount}
                        value={pageInput}
                        onChange={handlePageInput}
                    />
                    <span> of {pageCount}</span>
                </div>
                <button
                    disabled={currentPage === pageCount - 1}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                    <ArrowRight />
                </button>
            </div>
            <div>
                <label>Items per page:</label>
                <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageInput as any}
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    );
};