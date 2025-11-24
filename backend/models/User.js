const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        trim: true
    },
    interest: {
        type: String,
        enum: ['shopping', 'food', 'payments', 'all'],
        default: 'all'
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true
    },
    referredBy: {
        type: String
    },
    waitlistPosition: {
        type: Number,
        index: true
    },
    earlyAccess: {
        type: Boolean,
        default: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    subscription: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },
    metadata: {
        ipAddress: String,
        userAgent: String,
        signupSource: {
            type: String,
            default: 'website'
        }
    }
}, {
    timestamps: true
});

// Generate referral code before saving
userSchema.pre('save', async function(next) {
    if (!this.referralCode) {
        let uniqueCode;
        let isUnique = false;
        
        while (!isUnique) {
            uniqueCode = this.generateReferralCode();
            const existingUser = await mongoose.model('User').findOne({ referralCode: uniqueCode });
            if (!existingUser) {
                isUnique = true;
            }
        }
        
        this.referralCode = uniqueCode;
    }

    // Set waitlist position if not set
    if (!this.waitlistPosition) {
        const count = await mongoose.model('User').countDocuments();
        this.waitlistPosition = count + 1;
        
        // Grant early access to first 1000 users
        if (this.waitlistPosition <= 1000) {
            this.earlyAccess = true;
        }
    }

    next();
});

// Generate random referral code
userSchema.methods.generateReferralCode = function() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'ONE';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Static method to get waitlist stats
userSchema.statics.getWaitlistStats = async function() {
    const totalUsers = await this.countDocuments();
    const earlyAccessUsers = await this.countDocuments({ earlyAccess: true });
    
    const interestStats = await this.aggregate([
        {
            $group: {
                _id: '$interest',
                count: { $sum: 1 }
            }
        }
    ]);

    return {
        totalUsers,
        earlyAccessUsers,
        earlyAccessSpotsLeft: Math.max(0, 1000 - earlyAccessUsers),
        interestStats
    };
};

// Static method to get user by referral code
userSchema.statics.findByReferralCode = async function(code) {
    return this.findOne({ referralCode: code });
};

// Method to get referral stats
userSchema.methods.getReferralStats = async function() {
    const referralCount = await mongoose.model('User').countDocuments({ referredBy: this.referralCode });
    return {
        referralCode: this.referralCode,
        referralCount,
        rewardsEligible: referralCount >= 5
    };
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
