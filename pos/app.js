// Point of Sale App Logic
function posApp() {
    return {
        // Customer data
        customer: {
            id: null,
            name: '',
            gender: '',
            age: '',
            phone: '',
            points: 0
        },
        customerSearch: '',

        // Product search
        productSearch: '',

        // Cart data
        cart: {
            items: []
        },

        // Order metadata
        orderNote: '',
        pointsUsed: 0,
        discount: 0,
        discountType: 'percent',
        amountPaid: '',

        // UI state
        showConfirmationModal: false,

        // Dummy data for demo
        dummyCustomers: [
            { id: 1, name: 'Nguyễn Văn An', gender: 'Nam', age: '45', phone: '0901234567', points: 125 },
            { id: 2, name: 'Trần Thị Bình', gender: 'Nữ', age: '32', phone: '0912345678', points: 87 },
            { id: 3, name: 'Lê Minh Cường', gender: 'Nam', age: '28', phone: '0923456789', points: 210 },
            { id: 4, name: 'Phạm Thị Dung', gender: 'Nữ', age: '54', phone: '0934567890', points: 340 },
            { id: 5, name: 'Hoàng Văn Em', gender: 'Nam', age: '36', phone: '0945678901', points: 75 }
        ],

        dummyProducts: [
            { id: 1, sku: 'P001', name: 'Paracetamol 500mg', unit: 'Vỉ', cost: 15000, price: 22000, stock: 150, points: 2 },
            { id: 2, sku: 'P002', name: 'Vitamin C 1000mg', unit: 'Tuýp', cost: 48000, price: 65000, stock: 75, points: 6 },
            { id: 3, sku: 'P003', name: 'Amoxicillin 500mg', unit: 'Hộp', cost: 35000, price: 52000, stock: 60, points: 5 },
            { id: 4, sku: 'P004', name: 'Dầu gió xanh', unit: 'Chai', cost: 18000, price: 25000, stock: 100, points: 2 },
            { id: 5, sku: 'P005', name: 'Băng cá nhân', unit: 'Hộp', cost: 12000, price: 18000, stock: 200, points: 1 },
            { id: 6, sku: 'P006', name: 'Men tiêu hóa', unit: 'Gói', cost: 5000, price: 8000, stock: 300, points: 1 },
            { id: 7, sku: 'P007', name: 'Thuốc ho Bảo Thanh', unit: 'Chai', cost: 42000, price: 58000, stock: 45, points: 5 },
            { id: 8, sku: 'P008', name: 'Thuốc nhỏ mắt', unit: 'Chai', cost: 28000, price: 38000, stock: 80, points: 3 },
            { id: 9, sku: 'P009', name: 'Kem đánh răng Colgate', unit: 'Tuýp', cost: 22000, price: 32000, stock: 120, points: 3 },
            { id: 10, sku: 'P010', name: 'Khẩu trang y tế', unit: 'Hộp', cost: 30000, price: 45000, stock: 90, points: 4 }
        ],

        // Computed properties
        get filteredCustomers() {
            if (!this.customerSearch) return this.dummyCustomers;

            const search = this.customerSearch.toLowerCase();
            return this.dummyCustomers.filter(cust => {
                return cust.name.toLowerCase().includes(search) ||
                       (cust.phone && cust.phone.slice(-3).includes(search));
            });
        },

        get filteredProducts() {
            if (!this.productSearch) return this.dummyProducts;

            const search = this.productSearch.toLowerCase();
            return this.dummyProducts.filter(prod => {
                return prod.name.toLowerCase().includes(search) ||
                       prod.sku.toLowerCase().includes(search);
            });
        },

        // Methods
        init() {
            // Initialize charts
            this.initRevenueChart();

            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();

            // Setup sidebar toggle
            this.setupSidebar();
        },

        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // F2 - Search or create customer
                if (e.key === 'F2') {
                    e.preventDefault();
                    document.querySelector('input[placeholder*="Tìm theo tên"]').focus();
                }

                // F3 - Search product
                if (e.key === 'F3') {
                    e.preventDefault();
                    document.querySelector('input[placeholder*="Nhập tên, mã vạch"]').focus();
                }
            });
        },

        setupSidebar() {
            const mobileMenuButton = document.getElementById('mobileMenuButton');
            const mobileSidebarClose = document.getElementById('mobileSidebarClose');
            const mobileOverlay = document.getElementById('mobileOverlay');
            const sidebar = document.getElementById('sidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');
            const mainContent = document.getElementById('mainContent');
            const toggleIcon = document.getElementById('toggleIcon');

            if (mobileMenuButton) {
                mobileMenuButton.addEventListener('click', () => {
                    sidebar.classList.remove('-translate-x-full');
                    mobileOverlay.classList.remove('hidden');
                });
            }

            if (mobileSidebarClose) {
                mobileSidebarClose.addEventListener('click', () => {
                    sidebar.classList.add('-translate-x-full');
                    mobileOverlay.classList.add('hidden');
                });
            }

            if (mobileOverlay) {
                mobileOverlay.addEventListener('click', () => {
                    sidebar.classList.add('-translate-x-full');
                    mobileOverlay.classList.add('hidden');
                });
            }

            if (sidebarToggle) {
                sidebarToggle.addEventListener('click', () => {
                    const sidebarText = document.querySelectorAll('.sidebar-text');
                    const logoContainer = document.querySelector('.sidebar-logo-container');

                    sidebar.classList.toggle('w-64');
                    sidebar.classList.toggle('w-20');
                    mainContent.classList.toggle('md:ml-64');
                    mainContent.classList.toggle('md:ml-20');
                    toggleIcon.classList.toggle('rotate-180');

                    sidebarText.forEach(el => {
                        el.classList.toggle('hidden');
                    });

                    logoContainer.classList.toggle('mx-auto');
                });
            }
        },

        initRevenueChart() {
            const ctx = document.getElementById('revenueChart');
            if (!ctx) return;

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
                    datasets: [
                        {
                            label: 'Doanh thu',
                            data: [0, 1200000, 2100000, 3400000, 4200000, 5240000],
                            borderColor: 'rgba(16, 185, 129, 1)',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Lợi nhuận',
                            data: [0, 400000, 700000, 1100000, 1400000, 1780000],
                            borderColor: 'rgba(59, 130, 246, 1)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    let value = context.raw;
                                    return `${context.dataset.label}: ${formatCurrency(value)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            display: false
                        }
                    }
                }
            });
        },

        selectCustomer(customer) {
            this.customer = customer;
            this.showCustomerDropdown = false;
        },

        addProductToCart(product) {
            // Check if product already exists in cart
            const existingIndex = this.cart.items.findIndex(item => item.id === product.id);

            if (existingIndex >= 0) {
                // Increment quantity if product already in cart
                this.incrementQuantity(existingIndex);
            } else {
                // Add new product to cart
                this.cart.items.push({
                    id: product.id,
                    sku: product.sku,
                    name: product.name,
                    unit: product.unit,
                    cost: product.cost,
                    price: product.price,
                    quantity: 1,
                    points: product.points,
                    note: '',
                    total: product.price
                });
            }

            this.showProductDropdown = false;
            this.productSearch = '';
        },

        updateItemTotal(index) {
            const item = this.cart.items[index];
            item.quantity = parseInt(item.quantity) || 1;
            item.total = item.price * item.quantity;
        },

        incrementQuantity(index) {
            this.cart.items[index].quantity++;
            this.updateItemTotal(index);
        },

        decrementQuantity(index) {
            if (this.cart.items[index].quantity > 1) {
                this.cart.items[index].quantity--;
                this.updateItemTotal(index);
            }
        },

        removeItem(index) {
            this.cart.items.splice(index, 1);
        },

        clearCart() {
            if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
                this.cart.items = [];
                this.orderNote = '';
                this.pointsUsed = 0;
                this.discount = 0;
                this.amountPaid = '';
            }
        },

        calculateCartTotal() {
            return this.cart.items.reduce((total, item) => total + item.total, 0);
        },

        calculateDiscountAmount() {
            const cartTotal = this.calculateCartTotal();
            if (this.discountType === 'percent') {
                return cartTotal * (parseFloat(this.discount) || 0) / 100;
            } else {
                return parseFloat(this.discount) || 0;
            }
        },

        calculateFinalTotal() {
            const cartTotal = this.calculateCartTotal();
            const discountAmount = this.calculateDiscountAmount();
            const pointsValue = (parseFloat(this.pointsUsed) || 0) * 1000; // 1 point = 1000 VND
            return Math.max(0, cartTotal - discountAmount - pointsValue);
        },

        calculateChange() {
            const finalTotal = this.calculateFinalTotal();
            const paid = parseFloat(this.amountPaid.replace(/[,.]/g, '')) || 0;
            return paid - finalTotal;
        },

        formatDiscountDisplay() {
            const amount = this.calculateDiscountAmount();
            if (this.discountType === 'percent') {
                return `${this.discount}% (${formatCurrency(amount)})`;
            } else {
                return formatCurrency(amount);
            }
        },

        toggleMobilePayment() {
            // Scroll to payment section on mobile
            const paymentSection = document.getElementById('paymentSection');
            if (paymentSection) {
                paymentSection.scrollIntoView({ behavior: 'smooth' });
            }
        },

        processPayment() {
            if (this.cart.items.length === 0) return;

            // Show confirmation modal
            this.showConfirmationModal = true;
        },

        completePurchase() {
            // Here would be the logic to save the bill to the database
            // For demo purposes, we'll just clear the cart and show a success message
            alert('Đơn hàng đã được tạo thành công!');
            this.showConfirmationModal = false;

            // Reset cart and form
            this.cart.items = [];
            this.orderNote = '';
            this.pointsUsed = 0;
            this.discount = 0;
            this.amountPaid = '';
            this.customer = { id: null, name: '', gender: '', age: '', phone: '', points: 0 };
        },

        saveBill() {
            if (this.cart.items.length === 0) return;

            // Here would be the logic to save the bill as draft
            alert('Đơn hàng đã được lưu tạm thời!');
        },

        cancelBill() {
            if (this.cart.items.length === 0) return;

            if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                this.cart.items = [];
                this.orderNote = '';
                this.pointsUsed = 0;
                this.discount = 0;
                this.amountPaid = '';
                this.customer = { id: null, name: '', gender: '', age: '', phone: '', points: 0 };
            }
        }
    };
}

// Helper function to format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(value).replace('₫', 'đ');
}

// Listen for keyboard shortcuts globally
document.addEventListener('DOMContentLoaded', () => {
    // Keyboard shortcut for barcode scanner emulation
    document.addEventListener('keydown', (e) => {
        // F2 - Search or create customer (global)
        if (e.key === 'F2') {
            e.preventDefault();
            document.querySelector('input[placeholder*="Tìm theo tên"]').focus();
        }

        // F3 - Search product (global)
        if (e.key === 'F3') {
            e.preventDefault();
            document.querySelector('input[placeholder*="Nhập tên, mã vạch"]').focus();
        }
    });
});

