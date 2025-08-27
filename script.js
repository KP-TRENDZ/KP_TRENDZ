const products = [
  { name: "Classic T-Shirt", price: 24.99, category: "tshirt", images: ["images/tshirt1.jpg", "images/tshirt2.jpg"] },
  { name: "Formal Shirt", price: 49.99, category: "shirt", images: ["images/shirt1.jpg", "images/shirt2.jpg"] }
];

const productsContainer = document.querySelector(".products");
const cartItemsContainer = document.querySelector(".cart-items");
const totalEl = document.querySelector(".total");
const cartToggle = document.getElementById("cart-toggle");
const cartSidebar = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartCountEl = document.getElementById("cart-count");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const checkoutBtn = document.getElementById("checkout");

let cart = [];

// Render products dynamically
function renderProducts() {
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-images">
        <img src="${product.images[0]}" alt="${product.name}">
        <img src="${product.images[1] || product.images[0]}" alt="${product.name}">
      </div>
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button>Add to Cart</button>
    `;
    card.querySelector("button").addEventListener("click", () => addToCart(product));
    productsContainer.appendChild(card);
    setTimeout(() => card.classList.add("visible"), 100);
  });
}

// Add to Cart
function addToCart(product) {
  const existing = cart.find(item => item.name === product.name);
  if(existing) existing.quantity += 1;
  else cart.push({...product, quantity:1});
  updateCart();
}

// Update cart UI
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity} - $${(item.price*item.quantity).toFixed(2)}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.addEventListener("click", () => { cart.splice(index,1); updateCart(); });
    li.appendChild(removeBtn);
    cartItemsContainer.appendChild(li);
  });
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
  cartCountEl.textContent = cart.reduce((sum,item)=>sum+item.quantity,0);
}

// Cart toggle
cartToggle.addEventListener("click",()=>{
  cartSidebar.classList.toggle("open");
  overlay.classList.toggle("active");
});
overlay.addEventListener("click",()=>{
  cartSidebar.classList.remove("open");
  overlay.classList.remove("active");
});

// Search & filter
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
function filterProducts(){
  const query = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  productsContainer.childNodes.forEach(card=>{
    const name = card.querySelector("h3").textContent.toLowerCase();
    const cardCategory = products.find(p=>p.name.toLowerCase()===name).category;
    card.style.display = (name.includes(query)&&(category==="all"||category===cardCategory))?"block":"none";
  });
}

// Checkout with EmailJS
checkoutBtn.addEventListener("click", ()=>{
  if(cart.length===0){ alert("Cart is empty!"); return; }
  let total = cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  cart.forEach(item=>{
    emailjs.send("YOUR_SERVICE_ID","YOUR_TEMPLATE_ID",{
      product_name:item.name,
      quantity:item.quantity,
      price:item.price.toFixed(2),
      total:total.toFixed(2),
      user_email:"YOUR_EMAIL_HERE"
    },"YOUR_USER_ID")
    .then(()=>console.log(`Email sent for ${item.name}`))
    .catch(err=>console.error("Email error:",err));
  });
  alert(`Order placed! Total: $${total.toFixed(2)}`);
  cart=[];
  updateCart();
});

renderProducts();
updateCart();