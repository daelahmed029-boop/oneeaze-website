class OneEazeAdmin {
    constructor() {
        this.apiBaseUrl = 'https://your-backend-url.vercel.app/api';
        this.adminToken = localStorage.getItem('adminToken');
        this.currentPage = 1;
        this.usersPerPage = 10;
        this.totalUsers = 0;
        
        this.init();
    }

    async init() {
        await this.checkAuth();
        await this.loadDashboardData();
        this.setupEventListeners();
    }

    async checkAuth() {
        if (!this.adminToken) {
            this.showLoginModal();
            return false;
        }
        
        try {
            const response = await this.apiCall('/waitlist/users?limit=1');
            if (!response.success) {
                throw new Error('Invalid token');
            }
            return true;
        } catch (error) {
            this.showLoginModal();
            return false;
        }
    }

    showLoginModal() {
        const modalContent = `
            <div class="demo-content">
                <div class="demo-animation">
                    <i class="fas fa-lock"></i>
                </div>
                <h3>Admin Login Required</h3>
                <div class="form-group">
                    <input type="password" id="adminPassword" placeholder="Enter admin password" class="w-full p-3 border rounded-lg">
                </div>
                <button class="btn btn-primary w-full" onclick="admin.login()">
                    <i class="fas fa-sign-in-alt"></i>
                    Login
                </button>
            </div>
        `;
        
        // You'll need to implement the modal system from main JS
        this.showModal(modalContent);
    }

    async login() {
        const password = document.getElementById('adminPassword').value;
        // In production, this should be a secure API call
        if (password === 'your-secure-admin-password') {
            this.adminToken = 'admin-token-' + Date.now();
            localStorage.setItem('adminToken', this.adminToken);
            this.closeModal();
            await this.loadDashboardData();
        } else {
            alert('Invalid password');
        }
    }

    async loadDashboardData() {
        await this.loadStats();
        await this.loadUsers();
    }

    async loadStats() {
        try {
            const response = await this.apiCall('/waitlist/stats');
            if (response.success) {
                this.updateStatsUI(response.data);
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    updateStatsUI(stats) {
        document.getElementById('totalUsers').textContent = stats.totalUsers.toLocaleString();
        document.getElementById('earlyAccessUsers').textContent = stats.earlyAccessUsers.toLocaleString();
        document.getElementById('earlyAccessLeft').textContent = stats.earlyAccessSpotsLeft.toLocaleString();
        
        // Calculate growth rate (mock data)
        const growthRate = Math.floor(Math.random() * 20) + 5;
        document.getElementById('growthRate').textContent = growthRate + '%';
        
        // Mock other stats
        document.getElementById('totalReferrals').textContent = Math.floor(stats.totalUsers * 0.3).toLocaleString();
        document.getElementById('activeReferrers').textContent = Math.floor(stats.totalUsers * 0.1).toLocaleString();
        document.getElementById('conversionRate').textContent = '12%';
    }

    async loadUsers() {
        try {
            const skip = (this.currentPage - 1) * this.usersPerPage;
            const response = await this.apiCall(`/waitlist/users?limit=${this.usersPerPage}&skip=${skip}`);
            
            if (response.success) {
                this.totalUsers = response.data.pagination.total;
                this.displayUsers(response.data.users);
                this.updatePaginationInfo();
            }
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    }

    displayUsers(users) {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'border-b hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-3 px-4">
                    <div class="font-medium">${user.name}</div>
                </td>
                <td class="py-3 px-4">${user.email}</td>
                <td class="py-3 px-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.waitlistPosition <= 1000 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }">
                        #${user.waitlistPosition}
                        ${user.waitlistPosition <= 1000 ? '<i class="fas fa-crown ml-1"></i>' : ''}
                    </span>
                </td>
                <td class="py-3 px-4">
                    <span class="capitalize">${user.interest}</span>
                </td>
                <td class="py-3 px-4">
                    ${new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td class="py-3 px-4">
                    <button class="text-blue-600 hover:text-blue-800" onclick="admin.viewUser('${user._id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updatePaginationInfo() {
        const start = (this.currentPage - 1) * this.usersPerPage + 1;
        const end = Math.min(this.currentPage * this.usersPerPage, this.totalUsers);
        
        document.getElementById('paginationInfo').textContent = 
            `Showing ${start}-${end} of ${this.totalUsers.toLocaleString()} users`;
    }

    nextPage() {
        if (this.currentPage * this.usersPerPage < this.totalUsers) {
            this.currentPage++;
            this.loadUsers();
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadUsers();
        }
    }

    async viewUser(userId) {
        // Implement user detail view
        console.log('View user:', userId);
    }

    async apiCall(endpoint, options = {}) {
        const url = this.apiBaseUrl + endpoint;
        const config = {
            headers: {
                'Authorization': `Bearer ${this.adminToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        const response = await fetch(url, config);
        return await response.json();
    }

    setupEventListeners() {
        // Refresh data every 30 seconds
        setInterval(() => {
            this.loadDashboardData();
        }, 30000);
    }

    // Modal methods (simplified)
    showModal(content) {
        // Implement modal display
        console.log('Show modal:', content);
    }

    closeModal() {
        // Implement modal close
        console.log('Close modal');
    }
}

// Global admin instance
const admin = new OneEazeAdmin();

// Global functions for HTML onclick
function refreshData() {
    admin.loadDashboardData();
}

function previousPage() {
    admin.previousPage();
}

function nextPage() {
    admin.nextPage();
}
