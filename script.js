// Load products from localStorage or set defaults
if(!localStorage.getItem("kpProducts")) {
  const defaultProducts = [
    {
      name: "Classic T-Shirt",
      category: "tshirt",
      price: 24.99,
      colors: [
        { color: "White", images: ["images/tshirt1.jpg","images/tshirt2.jpg"] },
        { color: "Black", images: ["images/tshirt_black1.jpg","images/tshirt_black2.jpg"] }
      ]
    },
    {
      name: "Formal Shirt",
      category: "shirt",
      price: 49.99,
      colors: [
        { color: "Blue", images: ["images/shirt1.jpg","images/shirt2.jpg"] },
        { color: "Grey", images: ["images/shirt_grey1.jpg","images/shirt_grey2.jpg"] }
      ]
    }
  ];
  localStorage.setItem("kpProducts", JSON.stringify(defaultProducts));
}

let products = JSON.parse(localStorage.getItem("kpProducts")) || [];
let cart = JSON.parse(localStorage.getItem("kpCart")) || [];

const productContainer = document.getElementById("product-container");
const cartItemsContainer = document.querySelector(".cart-items");
const totalEl = document.querySelector(".total");
const cartToggle = document.getElementById("cart-toggle");
const cartSidebar = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartCountEl = document.getElementById("cart-count");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");

function renderProducts() {
  productContainer.innerHTML = "";
  products.forEach((p, index)=>{
    p.colors.forEach(colorObj=>{
      const div = document.createElement("div");
      div.className = "product-card";
      div.setAttribute("data-name", p.name);
      div.setAttribute("data-category", p.category);
      div.setAttribute("data-price", p.price);
      div.setAttribute("data-color", colorObj.color);

      div.innerHTML = `
        <div class="product-images">
          <img src="${colorObj.images[0]}" alt="${p.name} ${colorObj.color}">
          <img src="${colorObj.images[1]||colorObj.images[0]}" alt="${p.name} ${colorObj.color}">
        </div>
        <h3>${p.name}</h3>
        <p>$${p.price.toFixed(2)}</p>
        <p>Color: ${colorObj.color}</p>
        <button>Add to Cart</button>
      `;
      productContainer.appendChild(div);
    });
  });

  // Fade-in effect
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card,i)=>{
    setTimeout(()=>card.classList.add("visible"), i*100);
  });

  // Add to cart buttons
  document.querySelectorAll(".product-card button").forEach(button=>{
    button.addEventListener("click", e=>{
      const card = e.target.closest(".product-card");
      const name = card.getAttribute("data-name");
      const price = parseFloat(card.getAttribute("data-price"));
      const color = card.getAttribute("data-color");

      const existing = cart.find(item=>item.name===name && item.color===color);
      if(existing) existing.quantity += 1;
      else cart.push({name, price, color, quantity:1});

      updateCart();
      localStorage.setItem("kpCart", JSON.stringify(cart));
    });
  });
}

function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item, index)=>{
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.textContent = `${item.name} (${item.color}) x${item.quantity} - $${(item.price*item.quantity).toFixed(2)}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.addEventListener("click", ()=>{
      cart.splice(index,1);
      updateCart();
      localStorage.setItem("kpCart", JSON.stringify(cart));
    });
    li.appendChild(removeBtn);
    cartItemsContainer.appendChild(li);
  });
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
  cartCountEl.textContent = cart.reduce((sum,item)=>sum+item.quantity,0);
}

// Cart toggle
cartToggle.addEventListener("click", ()=>{
  cartSidebar.classList.toggle("open");
  overlay.classList.toggle("active");
});
overlay.addEventListener("click", ()=>{
  cartSidebar.classList.remove("open");
  overlay.classList.remove("active");
});

// Filters
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

function filterProducts() {
  const query = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  document.querySelectorAll(".product-card").forEach(card=>{
    const name = card.getAttribute("data-name").toLowerCase();
    const cat = card.getAttribute("data-category");
    card.style.display = (name.includes(query) && (category==="all"||cat===category)) ? "block":"none";
  });
}

// Initial render
renderProducts();
updateCart();
