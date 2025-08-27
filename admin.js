const productList = document.querySelector(".product-list");
const addProductForm = document.getElementById("add-product-form");

let products = JSON.parse(localStorage.getItem("products")) || [
  { name: "Classic T-Shirt", price: 24.99, category: "tshirt", images: ["images/tshirt1.jpg","images/tshirt2.jpg"] },
  { name: "Formal Shirt", price: 49.99, category: "shirt", images: ["images/shirt1.jpg","images/shirt2.jpg"] },
];

// Render product list
function renderProducts() {
  productList.innerHTML = "";
  products.forEach((product, index) => {
    const div = document.createElement("div");
    div.classList.add("admin-product");
    div.innerHTML = `
      <p><strong>${product.name}</strong> - $${product.price.toFixed(2)} [${product.category}]</p>
      <img src="${product.images[0]}" alt="${product.name}">
      <img src="${product.images[1]}" alt="${product.name}">
      <button onclick="removeProduct(${index})">Remove</button>
    `;
    productList.appendChild(div);
  });
  localStorage.setItem("products", JSON.stringify(products));
}

// Remove product
function removeProduct(index) {
  products.splice(index, 1);
  renderProducts();
}

// Add new product
addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const category = document.getElementById("product-category").value;
  const image1 = document.getElementById("product-image1").value;
  const image2 = document.getElementById("product-image2").value;

  products.push({ name, price, category, images: [image1, image2] });
  addProductForm.reset();
  renderProducts();
});

// Initial render
renderProducts();
