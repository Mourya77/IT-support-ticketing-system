const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust path if needed
const Ticket = require('./models/Ticket');

dotenv.config();

const seedData = async () => {
    try {
        // 1. Connect to DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 2. Clear existing data (Optional: removes old junk)
        await User.deleteMany({});
        await Ticket.deleteMany({});
        console.log('🧹 Cleared existing data');

        // 3. Hash Passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 4. Create Users
        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
                department: 'Management'
            },
            {
                name: 'John Agent',
                email: 'agent@example.com',
                password: hashedPassword,
                role: 'agent',
                department: 'IT Support'
            }
        ]);

        console.log('👥 Users Created:');
        console.log('   1. admin@example.com (Pass: password123)');
        console.log('   2. agent@example.com (Pass: password123)');

        // 5. Create a Test Ticket
        await Ticket.create({
            title: 'Fix Printer',
            description: 'The printer on the 2nd floor is jammed.',
            priority: 'High',
            status: 'Open',
            assignedTo: users[1]._id // Assign to John Agent
        });
        console.log('🎫 Test Ticket Created');

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

seedData();