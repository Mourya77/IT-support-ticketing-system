import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import TicketCard from '../components/TicketCard';
import CreateTicketModal from '../components/CreateTicketModal';
import UserManagementModal from '../components/UserManagementModal'; // <--- Ensure this is imported
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false); // <--- State for User Modal

    // Function to fetch tickets (reused for initial load and updates)
    const fetchTickets = async () => {
        try {
            const res = await axios.get('/api/tickets');
            setTickets(res.data);
        } catch (error) {
            toast.error("Failed to fetch tickets");
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const openTickets = tickets.filter(t => t.status === 'Open');
    const progressTickets = tickets.filter(t => t.status === 'In Progress');
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved');

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">TicketHub Board</h1>
                    <p className="text-gray-600">Welcome, {user?.name} <span className="text-xs uppercase bg-gray-200 px-2 rounded">{user?.role}</span></p>
                </div>

                <div className="space-x-4">
                    {/* MANAGE USERS BUTTON (Only for Admin) */}
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => setIsUserModalOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow transition"
                        >
                            Manage Users
                        </button>
                    )}

                    {/* NEW TICKET BUTTON */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
                    >
                        + New Ticket
                    </button>

                    <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition">
                        Logout
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Column 1: Open */}
                <div className="bg-gray-100 p-4 rounded-lg min-h-[500px]">
                    <h2 className="text-lg font-bold text-gray-700 mb-4">🆕 Open ({openTickets.length})</h2>
                    {openTickets.map(ticket => (
                        <TicketCard
                            key={ticket._id}
                            ticket={ticket}
                            onStatusChange={fetchTickets}
                        />
                    ))}
                </div>

                {/* Column 2: In Progress */}
                <div className="bg-blue-50 p-4 rounded-lg min-h-[500px]">
                    <h2 className="text-lg font-bold text-blue-700 mb-4">🚧 In Progress ({progressTickets.length})</h2>
                    {progressTickets.map(ticket => (
                        <TicketCard
                            key={ticket._id}
                            ticket={ticket}
                            onStatusChange={fetchTickets}
                        />
                    ))}
                </div>

                {/* Column 3: Resolved */}
                <div className="bg-green-50 p-4 rounded-lg min-h-[500px]">
                    <h2 className="text-lg font-bold text-green-700 mb-4">✅ Resolved ({resolvedTickets.length})</h2>
                    {resolvedTickets.map(ticket => (
                        <TicketCard
                            key={ticket._id}
                            ticket={ticket}
                            onStatusChange={fetchTickets}
                        />
                    ))}
                </div>
            </div>

            {/* MODALS */}
            <CreateTicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTicketCreated={fetchTickets}
            />

            <UserManagementModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;