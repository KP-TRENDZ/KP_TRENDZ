// ====== Product Data ======
let products = JSON.parse(localStorage.getItem("products")) || [
  { name: "Classic T-Shirt", price: 24.99, category: "tshirt", images: ["images/tshirt1.jpg","images/tshirt2.jpg"] },
  { name: "Formal Shirt", price: 49.99, category: "shirt", images: ["images/shirt1.jpg","images/shirt2.jpg"] },
];

// ====== DOM Elements ======
const productsContainer = document.querySelector(".products");
const cartItemsContainer = document.querySelector(".cart-items");
const totalEl = document.querySelector(".total");
const cartToggle = document.getElementById("cart-toggle");
const cartSidebar = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartCountEl = document.getElementById("cart-count");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const themeToggle = document.getElementById("theme-toggle");
const checkoutForm = document.getElementById("checkout-form");

let cart = [];

// ====== Render Products ======
function renderProducts() {
  productsContainer.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.setAttribute("data-name", product.name);
    card.setAttribute("data-category", product.category);
    card.setAttribute("data-price", product.price);

    card.innerHTML = `
      <div class="product-images">
        <img src="${product.images[0]}" alt="${product.name}">
        <img src="${product.images[1]}" alt="${product.name}">
      </div>
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button>Add to Cart</button>
    `;

    productsContainer.appendChild(card);
  });
}
renderProducts();

// ====== Cart Functions ======
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCart();
    });
    li.appendChild(removeBtn);
    cartItemsContainer.appendChild(li);
  });
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
  cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// ====== Add to Cart ======
productsContainer.addEventListener("click", (e) => {
  if(e.target.tagName === "BUTTON") {
    const card = e.target.closest(".product-card");
    const name = card.getAttribute("data-name");
    const price = parseFloat(card.getAttribute("data-price"));
    const existing = cart.find(item => item.name === name);
    if(existing) existing.quantity += 1;
    else cart.push({ name, price, quantity: 1 });
    updateCart();
  }
});

// ====== Cart Toggle ======
cartToggle.addEventListener("click", () => {
  cartSidebar.classList.toggle("open");
  overlay.classList.toggle("active");
});
overlay.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
  overlay.classList.remove("active");
});

// ====== Search & Filter ======
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
function filterProducts() {
  const query = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const cards = document.querySelectorAll(".product-card");
  cards.forEach(card => {
    const name = card.getAttribute("data-name").toLowerCase();
    const cardCategory = card.getAttribute("data-category");
    const matchesSearch = name.includes(query);
    const matchesCategory = category === "all" || cardCategory === category;
    card.style.display = matchesSearch && matchesCategory ? "block" : "none";
  });
}

// ====== Theme Toggle ======
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// ====== Checkout Form ======
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Order placed! (Email notification simulated)");
  cart = [];
  updateCart();
  checkoutForm.reset();
});

// ====== Save products to localStorage ======
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}
