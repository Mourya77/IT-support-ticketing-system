import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TicketCard = ({ ticket, onStatusChange }) => {

    // 1. Logic to handle moving tickets
    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // API Call to update status
            await axios.put(`/api/tickets/${ticket._id}`, { status: newStatus }, config);

            toast.success(`Moved to ${newStatus}`);
            onStatusChange(); // Refresh the board
        } catch (error) {
            toast.error('Failed to update status');
            console.error(error);
        }
    };

    // 2. Your existing styling
    const priorityColors = {
        Low: 'bg-gray-200 text-gray-800',
        Medium: 'bg-yellow-200 text-yellow-800',
        High: 'bg-red-200 text-red-800',
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            {/* Header: Title and Priority */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">{ticket.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${priorityColors[ticket.priority] || 'bg-gray-200'}`}>
                    {ticket.priority}
                </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{ticket.description}</p>

            {/* Footer: Status Dropdown and Date */}
            <div className="flex justify-between items-center text-xs text-gray-500">

                {/* REPLACED STATIC BADGE WITH DROPDOWN */}
                <select
                    value={ticket.status}
                    onChange={handleStatusChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 outline-none cursor-pointer hover:bg-gray-100"
                >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>

                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default TicketCard;