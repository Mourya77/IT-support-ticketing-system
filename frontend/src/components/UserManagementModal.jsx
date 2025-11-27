import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserManagementModal = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'agent', department: '' });

    // Fetch users when modal opens
    useEffect(() => {
        if (isOpen) fetchUsers();
    }, [isOpen]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/auth/users');
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', formData);
            toast.success('User Added Successfully');
            setFormData({ name: '', email: '', password: '', role: 'agent', department: '' }); // Reset form
            fetchUsers(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add user');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Manage Employees</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
                </div>

                {/* 1. Add New User Form */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                    <h3 className="font-bold text-blue-800 mb-3">Add New Employee</h3>
                    <form onSubmit={handleRegister} className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Name" required className="p-2 border rounded"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <input type="email" placeholder="Email" required className="p-2 border rounded"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        <input type="password" placeholder="Password" required className="p-2 border rounded"
                            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        <input type="text" placeholder="Department" className="p-2 border rounded"
                            value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
                        <select className="p-2 border rounded col-span-2"
                            value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                            <option value="agent">Agent</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Add Employee
                        </button>
                    </form>
                </div>

                {/* 2. User List */}
                <h3 className="font-bold text-gray-700 mb-2">Current Staff ({users.length})</h3>
                <div className="space-y-2">
                    {users.map(user => (
                        <div key={user._id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                            <div>
                                <p className="font-bold text-gray-800">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email} • {user.department}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                {user.role.toUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserManagementModal;