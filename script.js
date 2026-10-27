const products = [
    {
        id: 1,
        name: "Midnight Oud",
        category: "Perfumes",
        price: 2499,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
        tag: "Bestseller"
    },
    {
        id: 2,
        name: "Amber Essence",
        category: "Perfumes",
        price: 1899,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
        tag: ""
    },
    {
        id: 3,
        name: "Rose Noir",
        category: "Perfumes",
        price: 2199,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
        tag: "Popular"
    },
    {
        id: 4,
        name: "Golden Musk",
        category: "Perfumes",
        price: 1599,
        image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=600&q=80",
        tag: ""
    },
    {
        id: 5,
        name: "Royal Oud Attar",
        category: "Attars",
        price: 1299,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
        tag: "Traditional"
    },
    {
        id: 6,
        name: "White Musk Attar",
        category: "Attars",
        price: 899,
        image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=600&q=80",
        tag: ""
    },
    {
        id: 7,
        name: "Saffron Oud Attar",
        category: "Attars",
        price: 1499,
        image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=600&q=80",
        tag: "Signature"
    },
    {
        id: 8,
        name: "Pure Rose Attar",
        category: "Attars",
        price: 999,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
        tag: ""
    }
];

let selectedCategory = "All";
let cart = [];

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

function setCategory(category) {
    selectedCategory = category;

    document.querySelectorAll(".category-button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === category
        );
    });

    renderProducts();
}

function renderProducts() {
    const search = document.getElementById("search").value
        .trim()
        .toLowerCase();

    const sort = document.getElementById("sort").value;

    let filtered = products.filter(product => {
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    if (sort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    document.getElementById("product-count").textContent =
        `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`;

    const grid = document.getElementById("product-grid");

    if (filtered.length === 0) {
        grid.innerHTML = `<p class="empty-results">No fragrances found. Try another search.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/500x600/f0ebe3/82776c?text=Fragrance';"
                >
                ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="add-button" onclick="addToCart(${product.id})">Add to Bag +</button>
            </div>
        </article>
    `).join("");
}

function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();
}

function changeQuantity(id, change) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

function renderCart() {
    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    document.getElementById("cart-count").textContent = count;
    document.getElementById("bag-count").textContent = `(${count})`;
    document.getElementById("cart-total").textContent = formatPrice(subtotal);

    const container = document.getElementById("cart-items");

    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-cart">Your bag is empty. Discover your next favourite fragrance.</p>`;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img
                src="${item.image}"
                alt="${item.name}"
                onerror="this.onerror=null;this.src='https://placehold.co/100x120/f0ebe3/82776c?text=Fragrance';"
            >

            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)}</p>

                <div class="quantity">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>

            <button class="remove-button" onclick="removeFromCart(${item.id})" aria-label="Remove ${item.name}">×</button>
        </div>
    `).join("");
}

function toggleCart(open) {
    document.getElementById("cart-panel").classList.toggle("open", open);
    document.getElementById("cart-overlay").classList.toggle("show", open);
    document.body.style.overflow = open ? "hidden" : "";
}

function checkout() {
    if (cart.length === 0) {
        alert("Your bag is empty. Please add a fragrance first.");
        return;
    }

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const summary = cart.map(item =>
        `${item.name} × ${item.quantity}`
    ).join("\n");

    alert(
        "Your order summary:\n\n" +
        summary +
        "\n\nSubtotal: " + formatPrice(subtotal) +
        "\n\nThis is a demo checkout. No payment has been processed."
    );
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        toggleCart(false);
    }
});

renderProducts();
renderCart();