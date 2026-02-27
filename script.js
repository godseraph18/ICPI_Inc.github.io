// PRODUCT DATA
const products = [
    { id: 1, name: "Australian butterflies sweeping", price: 9450.00, stock: 12, image: "images/mix.jpg" },
    { id: 2, name: "Papilio ulysses joesa matt", price: 7899.99, stock: 5, image: "images/blue.jpg" },
    { id: 3, name: "Selenocosmia javanensis", price: 4299.50, stock: 40, image: "images/spider.jpg" },
    { id: 4, name: "Graphium agamemnon", price: 3120.00, stock: 8, image: "images/green.jpg" },
    { id: 5, name: "Catopsilia pomona", price: 4385.00, stock: 25, image: "images/orange.jpg" },
    { id: 6, name: "Danaus genutia", price: 6745.00, stock: 100, image: "images/yellow.jpg" }
];

let currentUser = null;

// LOAD ON START
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
    renderFeatured();
    renderCatalog();
    startClock();
});

// SHOW FEATURED (HOME PAGE)
function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    grid.innerHTML = '';

    // Just grab the first 3 products for the showcase
    const featured = products.slice(0, 3);

    featured.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <div class="product-image" style="background-image: url('${p.image}'); background-size: cover; background-position: center;"></div>
                <h3>${p.name}</h3>
                <span class="stock-badge" id="featured-stock-${p.id}"><i class="ph ph-package"></i> ${p.stock}</span>
                <span class="price">₱${p.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                <button class="buy-btn" onclick="placeOrder(${p.id})"><i class="ph ph-shopping-cart-simple"></i> PLACE ORDER</button>
            </div>
        `;
    });
}

// SHOW PRODUCTS CATALOG
function renderCatalog(productsToRender = products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    if(productsToRender.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary);">No products found matching your search.</p>';
        return;
    }

    productsToRender.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <div class="product-image" style="background-image: url('${p.image}'); background-size: cover; background-position: center;"></div>
                <h3>${p.name}</h3>
                <span class="stock-badge" id="stock-${p.id}"><i class="ph ph-package"></i> ${p.stock}</span>
                <span class="price">₱${p.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                <button class="buy-btn" onclick="placeOrder(${p.id})"><i class="ph ph-shopping-cart-simple"></i> PLACE ORDER</button>
            </div>
        `;
    });
}

// BROWSE / SEARCH CATALOG
function filterCatalog() {
    const query = document.getElementById('catalog-search').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderCatalog(filtered);
}


// LOGIN
function toggleLoginModal() {
    const m = document.getElementById('login-modal');
    m.style.display = m.style.display === 'block' ? 'none' : 'block';
}

function login() {
    const user = document.getElementById('username-input').value;
    const pass = document.getElementById('password-input').value;
    
    // Mock credentials validation
    if(user && pass === "admin123") {
        currentUser = user;
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
        
        // Update account details dynamically
        document.getElementById('account-id').innerText = `ID: ${user.toUpperCase()}-${Math.floor(Math.random()*10000)}`;
        document.getElementById('account-level').innerText = `Access Level: STANDARD_USER`;
        document.getElementById('account-status').innerText = `Status: ACTIVE`;

        toggleLoginModal();
        alert(`ACCESS GRANTED: Welcome, ${user}`);
    } else {
        alert("ACCESS DENIED: Invalid credentials. (Hint: password is admin123)");
    }
}

function logout() {
    currentUser = null;
    document.getElementById('login-btn').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'none';

    // Reset account details
    document.getElementById('account-id').innerText = `ID: NOT_LOGGED_IN`;
    document.getElementById('account-level').innerText = `Access Level: GUEST`;
    document.getElementById('account-status').innerText = `Status: INACTIVE`;

    alert("LOGGED OUT");
}

// CUSTOMER INQUIRY
function submitTicket() {
    if(!currentUser) {
        alert("ERROR: Must be logged in to submit a ticket.");
        return;
    }
    const text = document.getElementById('support-ticket-text').value;
    if(text.trim() === "") {
        alert("ERROR: Ticket description cannot be empty.");
        return;
    }
    
    document.getElementById('support-ticket-text').value = "";
    alert("SUCCESS: Customer inquiry ticket submitted. Our support team will contact you shortly.");
}

// TOAST NOTIFICATIONS
function showToast(message, type = "success") {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const bgColor = type === "success" ? "var(--success)" : "red";
    
    toast.style.background = bgColor;
    toast.style.color = "white";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "6px";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    toast.style.fontFamily = "inherit";
    toast.style.fontSize = "0.95rem";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease-in-out";
    toast.innerText = message;
    
    container.appendChild(toast);
    
    // Fade in
    setTimeout(() => toast.style.opacity = "1", 10);
    
    // Fade out and remove
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// PLACE ORDER
function placeOrder(id) {
    if(!currentUser) {
        showToast("ERROR: Login required to place an order!", "error");
        toggleLoginModal();
        return;
    }

    const p = products.find(x => x.id === id);
    if(p.stock > 0) {
        p.stock--;
        
        const badge = document.getElementById(`stock-${p.id}`);
        if(badge) {
            badge.innerHTML = `<i class="ph ph-package"></i> ${p.stock}`;
            badge.style.color = p.stock < 5 ? 'red' : 'inherit';
        }
        
        const featBadge = document.getElementById(`featured-stock-${p.id}`);
        if(featBadge) {
            featBadge.innerHTML = `<i class="ph ph-package"></i> ${p.stock}`;
            featBadge.style.color = p.stock < 5 ? 'red' : 'inherit';
        }

        const orderId = `#ORD-${Math.floor(Math.random()*10000)}`;
        const invId = `#INV-${Math.floor(Math.random()*10000)}`;
        const dateStr = new Date().toISOString().split('T')[0];
        const formattedPrice = `₱${p.price.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

        // Add to Orders
        const tbody = document.getElementById('invoice-body');
        const row = `<tr id="row-${orderId}">
            <td>${orderId}</td>
            <td>${dateStr}</td>
            <td>${p.name}</td>
            <td>${formattedPrice}</td>
            <td class="status-ok">PROCESSING</td>
            <td><button class="buy-btn" style="padding:5px; border-color: red; color: red;" onclick="deleteOrder('${orderId}', '${invId}', ${p.id})"><i class="ph ph-trash"></i> CANCEL</button></td>
        </tr>`;
        tbody.innerHTML = row + tbody.innerHTML;

        // Add to Invoices
        const invBody = document.getElementById('actual-invoice-body');
        const invRow = `<tr id="row-${invId}">
            <td>${invId}</td>
            <td>${dateStr}</td>
            <td>${orderId}</td>
            <td>${formattedPrice}</td>
            <td><button class="buy-btn" style="padding:5px;" onclick="downloadInvoice('${invId}', '${orderId}', '${p.name}', '${formattedPrice}', '${dateStr}')"><i class="ph ph-download-simple"></i> GET PDF</button></td>
        </tr>`;
        invBody.innerHTML = invRow + invBody.innerHTML;
        
        showToast(`SUCCESS: Order placed for ${p.name}`);
    } else {
        showToast("ERROR: Product is out of stock!", "error");
    }
}

// NAVIGATION
function showSection(name) {
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('catalog-section').style.display = 'none';
    document.getElementById('account-section').style.display = 'none';
    document.getElementById('invoices-section').style.display = 'none';
    document.getElementById('actual-invoices-section').style.display = 'none';
    document.getElementById(name + '-section').style.display = 'block';
}

// CLOCK
function startClock() {
    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString();
    }, 1000);
}

// DELETE ORDER / CANCEL
function deleteOrder(orderId, invId, productId) {
    if(confirm(`Are you sure you want to cancel order ${orderId}?`)) {
        // Remove rows
        const ordRow = document.getElementById(`row-${orderId}`);
        const invRow = document.getElementById(`row-${invId}`);
        if(ordRow) ordRow.remove();
        if(invRow) invRow.remove();

        // Restore stock
        const p = products.find(x => x.id === productId);
        if(p) {
            p.stock++;
            const badge = document.getElementById(`stock-${p.id}`);
            if(badge) {
                badge.innerHTML = `<i class="ph ph-package"></i> ${p.stock}`;
                badge.style.color = p.stock < 5 ? 'red' : 'inherit';
            }
            const featBadge = document.getElementById(`featured-stock-${p.id}`);
            if(featBadge) {
                featBadge.innerHTML = `<i class="ph ph-package"></i> ${p.stock}`;
                featBadge.style.color = p.stock < 5 ? 'red' : 'inherit';
            }
        }
        
        showToast(`Order ${orderId} has been cancelled.`, "error");
    }
}

// DOWNLOAD PDF INVOICE
function downloadInvoice(invNum, ordNum, itemName, priceStr, dateStr) {
    showToast("Generating PDF Invoice...", "success");

    // Populate hidden template
    document.getElementById('pdf-user').innerText = currentUser || "Guest";
    document.getElementById('pdf-inv-num').innerText = invNum;
    document.getElementById('pdf-ord-num').innerText = ordNum;
    document.getElementById('pdf-date').innerText = dateStr;
    document.getElementById('pdf-item').innerText = itemName;
    document.getElementById('pdf-price').innerText = priceStr;

    // Get the template element
    const element = document.getElementById('invoice-template');
    
    // Create the PDF
    const opt = {
        margin:       0.5,
        filename:     `${invNum}_ICPI_Invoice.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Create a wrapper string so we don't mess with the DOM directly
    const printContent = `<div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111; background: white; margin: 0; box-sizing: border-box;">
        ${element.innerHTML}
    </div>`;

    html2pdf().set(opt).from(printContent).save().then(() => {
        showToast("PDF Downloaded Successfully!", "success");
    });

}

