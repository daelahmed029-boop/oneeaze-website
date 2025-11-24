const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Rate limiting storage
const rateLimit = new Map();

const rateLimiter = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const maxRequests = 10;
    
    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, { count: 1, startTime: now });
    } else {
        const window = rateLimit.get(ip);
        if (now - window.startTime > windowMs) {
            rateLimit.set(ip, { count: 1, startTime: now });
        } else {
            window.count++;
            if (window.count > maxRequests) {
                return res.status(429).json({
                    success: false,
                    message: 'Too many requests. Please try again later.'
                });
            }
        }
    }
    
    next();
};

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    rateLimiter(req, res, () => {});

    try {
        const { method, url } = req;
        const path = url.split('?')[0];

        if (method === 'POST' && path === '/api/waitlist/join') {
            await handleJoinWaitlist(req, res);
        } else if (method === 'GET' && path === '/api/waitlist/stats') {
            await handleGetStats(req, res);
        } else if (method === 'GET' && path.startsWith('/api/waitlist/referral/')) {
            const code = path.split('/').pop();
            await handleGetReferral(req, res, code);
        } else if (method === 'GET' && path === '/api/waitlist/users') {
            await handleGetUsers(req, res);
        } else {
            res.status(404).json({
                success: false,
                message: 'Endpoint not found'
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

async function handleJoinWaitlist(req, res) {
    try {
        await Promise.all([
            body('name').notEmpty().withMessage('Name is required').run(req),
            body('email').isEmail().withMessage('Please include a valid email').run(req),
            body('phone').optional().isMobilePhone().withMessage('Please include a valid phone number').run(req),
            body('interest').optional().isIn(['shopping', 'food', 'payments', 'all']).run(req)
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, phone, interest, referralCode } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser.success && existingUser.data) {
            return res.status(400).json({
                success: false,
                message: 'You are already on our waitlist!'
            });
        }

        // Create user
        const result = await User.create({
            name,
            email,
            phone,
            interest: interest || 'all',
            referralCode,
            metadata: {
                ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                signupSource: 'website'
            }
        });

        if (!result.success) {
            throw new Error(result.error);
        }

        res.status(201).json({
            success: true,
            message: 'Successfully joined waitlist!',
            data: {
                id: result.data.id,
                name: result.data.name,
                email: result.data.email,
                waitlistPosition: result.data.waitlist_position,
                earlyAccess: result.data.early_access,
                referralCode: result.data.referral_code,
                joinDate: result.data.created_at
            }
        });

    } catch (error) {
        console.error('Waitlist join error:', error);
        
        if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists in waitlist'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Server error. Please try again.'
        });
    }
}

async function handleGetStats(req, res) {
    try {
        const stats = await User.getWaitlistStats();
        
        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching waitlist statistics'
        });
    }
}

async function handleGetReferral(req, res, code) {
    try {
        const result = await User.findByReferralCode(code);
        
        if (!result.success || !result.data) {
            return res.status(404).json({
                success: false,
                message: 'Invalid referral code'
            });
        }

        const referralStats = await User.getReferralStats(code);

        res.json({
            success: true,
            data: {
                referrerName: result.data.name,
                ...referralStats
            }
        });

    } catch (error) {
        console.error('Referral error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking referral code'
        });
    }
}

async function handleGetUsers(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const { page = 1, limit = 50 } = req.query;
        const result = await User.getAllUsers({ 
            page: parseInt(page), 
            limit: parseInt(limit) 
        });

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Users fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
}
