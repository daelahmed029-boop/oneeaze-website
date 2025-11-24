const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const connectDB = require('../config/database');

// Connect to MongoDB
connectDB();

// Rate limiting storage (in production, use Redis)
const rateLimit = new Map();

// Simple rate limiting middleware
const rateLimiter = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 10; // 10 requests per window
    
    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, { count: 1, startTime: now });
    } else {
        const window = rateLimit.get(ip);
        if (now - window.startTime > windowMs) {
            // Reset window
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

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Apply rate limiting
    rateLimiter(req, res, () => {});

    try {
        // Route handling based on method and path
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

// Join waitlist handler
async function handleJoinWaitlist(req, res) {
    try {
        // Validation rules
        await Promise.all([
            body('name')
                .notEmpty()
                .withMessage('Name is required')
                .isLength({ min: 2 })
                .withMessage('Name must be at least 2 characters')
                .run(req),
            body('email')
                .isEmail()
                .withMessage('Please include a valid email')
                .run(req),
            body('phone')
                .optional()
                .isMobilePhone()
                .withMessage('Please include a valid phone number')
                .run(req),
            body('interest')
                .optional()
                .isIn(['shopping', 'food', 'payments', 'all'])
                .run(req)
        ]);

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, phone, interest, referralCode } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'You are already on our waitlist!'
            });
        }

        // Validate referral code if provided
        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (!referrer) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid referral code'
                });
            }
        }

        // Create user with metadata
        user = new User({
            name,
            email,
            phone,
            interest: interest || 'all',
            referredBy: referralCode,
            metadata: {
                ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                signupSource: 'website'
            }
        });

        await user.save();

        // Send welcome email (implement email service)
        await sendWelcomeEmail(user);

        res.status(201).json({
            success: true,
            message: 'Successfully joined waitlist!',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                waitlistPosition: user.waitlistPosition,
                earlyAccess: user.earlyAccess,
                referralCode: user.referralCode,
                joinDate: user.createdAt
            }
        });

    } catch (error) {
        console.error('Waitlist join error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists in waitlist'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
}

// Get waitlist stats handler
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

// Get referral info handler
async function handleGetReferral(req, res, code) {
    try {
        const user = await User.findByReferralCode(code);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid referral code'
            });
        }

        const referralStats = await user.getReferralStats();

        res.json({
            success: true,
            data: {
                referrerName: user.name,
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

// Get all users (admin only)
async function handleGetUsers(req, res) {
    try {
        // Basic admin check (in production, use proper authentication)
        const authHeader = req.headers.authorization;
        if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const { page = 1, limit = 50, sort = '-createdAt' } = req.query;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        const total = await User.countDocuments();

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });

    } catch (error) {
        console.error('Users fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
}

// Email service (placeholder - implement with your email service)
async function sendWelcomeEmail(user) {
    try {
        // Implement email sending with Nodemailer, SendGrid, etc.
        console.log(`Welcome email would be sent to: ${user.email}`);
        
        // Example with Nodemailer:
        /*
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Welcome to OneEaze Waitlist!',
            html: generateWelcomeEmail(user)
        });
        */
        
    } catch (error) {
        console.error('Email sending error:', error);
    }
}

function generateWelcomeEmail(user) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                .stat { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to OneEaze!</h1>
                    <p>You're on your way to simplifying your digital life</p>
                </div>
                <div class="content">
                    <h2>Hello ${user.name},</h2>
                    <p>Thank you for joining the OneEaze waitlist! Here are your details:</p>
                    
                    <div class="stat">
                        <h3>Waitlist Position</h3>
                        <p style="font-size: 2em; font-weight: bold; color: #2563eb;">#${user.waitlistPosition}</p>
                        ${user.earlyAccess ? 
                            '<p style="color: #10b981; font-weight: bold;">🌟 You qualified for early access!</p>' : 
                            `<p>Only <strong>${1000 - user.waitlistPosition + 1}</strong> spots left for early access!</p>`
                        }
                    </div>
                    
                    <div class="stat">
                        <h3>Your Referral Code</h3>
                        <p style="font-size: 1.5em; font-weight: bold; color: #7c3aed;">${user.referralCode}</p>
                        <p>Share with friends and move up the waitlist!</p>
                    </div>
                    
                    <p>We'll notify you when OneEaze launches in your area.</p>
                    <p>Best regards,<br>The OneEaze Team</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
