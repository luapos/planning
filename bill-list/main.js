// Tailwind CSS Configuration
tailwind.config = {
    theme: {
        extend: {
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgb(16, 185, 129), 0 0 10px rgb(16, 185, 129), 0 0 15px rgb(16, 185, 129)' },
                    '100%': { boxShadow: '0 0 10px rgb(16, 185, 129), 0 0 20px rgb(16, 185, 129), 0 0 30px rgb(16, 185, 129)' }
                }
            }
        }
    }
};

// Sidebar Management Class
class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.getElementById('mainContent');
        this.toggleButton = document.getElementById('sidebarToggle');
        this.toggleIcon = document.getElementById('toggleIcon');
        this.mobileMenuButton = document.getElementById('mobileMenuButton');
        this.mobileOverlay = document.getElementById('mobileOverlay');

        this.isCollapsed = this.getSavedState();
        this.isMobileMenuOpen = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applySavedState();
        // Wait for DOM to be fully loaded before initializing charts
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.initChart(), 100); // Small delay to ensure canvas is ready
            });
        } else {
            setTimeout(() => this.initChart(), 100);
        }
        this.initBillToggle();
    }

    setupEventListeners() {
        // Desktop toggle
        this.toggleButton.addEventListener('click', () => this.toggleSidebar());

        // Mobile menu
        this.mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());
        this.mobileOverlay.addEventListener('click', () => this.closeMobileMenu());

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleSidebar() {
        this.isCollapsed = !this.isCollapsed;
        this.updateSidebar();
        this.saveState();
    }

    updateSidebar() {
        if (this.isCollapsed) {
            this.collapseSidebar();
        } else {
            this.expandSidebar();
        }
    }

    collapseSidebar() {
        this.sidebar.classList.add('sidebar-collapsed');
        this.sidebar.style.width = '4rem';
        this.mainContent.style.marginLeft = '4rem';
        this.toggleIcon.style.transform = 'rotate(180deg)';
    }

    expandSidebar() {
        this.sidebar.classList.remove('sidebar-collapsed');
        this.sidebar.style.width = '16rem';
        this.mainContent.style.marginLeft = '16rem';
        this.toggleIcon.style.transform = 'rotate(0deg)';
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;

        if (this.isMobileMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }

    openMobileMenu() {
        this.sidebar.style.transform = 'translateX(0)';
        this.mobileOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.sidebar.style.transform = 'translateX(-100%)';
        this.mobileOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        this.isMobileMenuOpen = false;
    }

    handleResize() {
        if (window.innerWidth >= 1024) {
            // Desktop
            this.sidebar.style.transform = '';
            this.mobileOverlay.classList.add('hidden');
            document.body.style.overflow = '';
            this.isMobileMenuOpen = false;
            this.updateSidebar();
        } else {
            // Mobile
            this.sidebar.classList.remove('sidebar-collapsed');
            this.sidebar.style.width = '16rem';
            this.mainContent.style.marginLeft = '0';

            if (!this.isMobileMenuOpen) {
                this.sidebar.style.transform = 'translateX(-100%)';
            }
        }
    }

    saveState() {
        localStorage.setItem('sidebarCollapsed', this.isCollapsed.toString());
    }

    getSavedState() {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    }

    applySavedState() {
        if (window.innerWidth >= 1024) {
            this.updateSidebar();
        } else {
            this.handleResize();
        }
    }

    // Chart initialization - Fixed implementation
    initChart() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) {
            console.warn('Chart canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');

        // Destroy existing chart if it exists
        if (window.revenueChartInstance) {
            window.revenueChartInstance.destroy();
        }

        // Sample data for revenue by hour
        const hourlyLabels = [
            '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
            '20:00', '21:00'
        ];

        const revenueData = [
            0, 15000, 25000, 45000, 75000, 225000,
            180000, 120000, 90000, 60000, 40000, 30000,
            20000, 10000
        ];

        window.revenueChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hourlyLabels,
                datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: revenueData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return 'Doanh thu: ' + new Intl.NumberFormat('vi-VN').format(context.parsed.y) + 'đ';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(0) + 'K';
                                }
                                return value;
                            },
                            color: '#6b7280',
                            font: {
                                size: 12
                            },
                            padding: 8
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 12
                            },
                            padding: 8
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: 'rgb(59, 130, 246)'
                    }
                }
            }
        });
    }

    // Bill details toggle functionality
    initBillToggle() {
        const billToggle = document.getElementById('billToggle');
        const billDetails = document.getElementById('billDetails');
        const billChevron = document.getElementById('billChevron');

        if (!billToggle || !billDetails || !billChevron) {
            return; // Elements not found, skip initialization
        }

        let billExpanded = false;

        billToggle.addEventListener('click', () => {
            billExpanded = !billExpanded;

            if (billExpanded) {
                billDetails.style.display = 'block';
                billChevron.style.transform = 'rotate(180deg)';
            } else {
                billDetails.style.display = 'none';
                billChevron.style.transform = 'rotate(0deg)';
            }
        });
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SidebarManager();
});
