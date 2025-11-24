const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

class User {
  // Generate random referral code
  static generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'ONE';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Create new user
  static async create(userData) {
    try {
      console.log('Creating user with data:', userData);

      // Get current user count for waitlist position
      const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Count error:', countError);
        throw countError;
      }

      const waitlistPosition = (count || 0) + 1;
      const earlyAccess = waitlistPosition <= 1000;
      
      // Generate referral code
      let referralCode;
      let isUnique = false;
      let attempts = 0;
      
      while (!isUnique && attempts < 10) {
        referralCode = this.generateReferralCode();
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('referral_code')
          .eq('referral_code', referralCode)
          .single();
        
        if (checkError && checkError.code === 'PGRST116') {
          // No user found with this code - it's unique!
          isUnique = true;
        } else if (!checkError && !existingUser) {
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique) {
        throw new Error('Could not generate unique referral code');
      }

      // Validate referral code if provided
      if (userData.referralCode) {
        const { data: referrer, error: refError } = await supabase
          .from('users')
          .select('referral_code')
          .eq('referral_code', userData.referralCode)
          .single();

        if (refError || !referrer) {
          throw new Error('Invalid referral code');
        }
      }

      // Create user
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name: userData.name,
            email: userData.email.toLowerCase(),
            phone: userData.phone,
            interest: userData.interest || 'all',
            referral_code: referralCode,
            referred_by: userData.referralCode,
            waitlist_position: waitlistPosition,
            early_access: earlyAccess,
            ip_address: userData.metadata?.ipAddress,
            user_agent: userData.metadata?.userAgent,
            signup_source: userData.metadata?.signupSource || 'website'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      console.log('User created successfully:', data);
      return { success: true, data };

    } catch (error) {
      console.error('User creation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, data: null }; // No user found
        }
        throw error;
      }

      return { success: true, data };

    } catch (error) {
      console.error('Find by email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Find user by referral code
  static async findByReferralCode(code) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('referral_code', code)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, data: null }; // No user found
        }
        throw error;
      }

      return { success: true, data };

    } catch (error) {
      console.error('Find by referral code error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get waitlist statistics
  static async getWaitlistStats() {
    try {
      // Total users
      const { count: totalUsers, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Early access users
      const { count: earlyAccessUsers, error: earlyError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('early_access', true);

      if (earlyError) throw earlyError;

      // Interest statistics
      const { data: interestStats, error: interestError } = await supabase
        .from('users')
        .select('interest')
        .group('interest');

      if (interestError) throw interestError;

      return {
        totalUsers: totalUsers || 0,
        earlyAccessUsers: earlyAccessUsers || 0,
        earlyAccessSpotsLeft: Math.max(0, 1000 - (earlyAccessUsers || 0)),
        interestStats: interestStats || []
      };

    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  }

  // Get all users (for admin)
  static async getAllUsers({ page = 1, limit = 50, sort = 'created_at' } = {}) {
    try {
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order(sort, { ascending: false })
        .range(start, end);

      if (error) throw error;

      return {
        users: data || [],
        pagination: {
          current: page,
          pages: Math.ceil((count || 0) / limit),
          total: count || 0
        }
      };

    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  // Get referral stats for a user
  static async getReferralStats(referralCode) {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('referred_by', referralCode);

      if (error) throw error;

      return {
        referralCode,
        referralCount: count || 0,
        rewardsEligible: (count || 0) >= 5
      };

    } catch (error) {
      console.error('Get referral stats error:', error);
      throw error;
    }
  }
}

module.exports = User;
