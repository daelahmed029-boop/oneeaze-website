const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

connectDB();

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const stats = await User.getWaitlistStats();
        
        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Stats API error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics'
        });
    }
};
