// Admin product management
let products = [
  { name: "Classic T-Shirt", price: 24.99, category: "tshirt", images: ["images/tshirt1.jpg","images/tshirt2.jpg"] },
  { name: "Formal Shirt", price: 49.99, category: "shirt", images: ["images/shirt1.jpg","images/shirt2.jpg"] }
];

const productListEl = document.getElementById("product-list");
const addBtn = document.getElementById("add-product");

function renderAdminProducts() {
    productListEl.innerHTML = "";
    products.forEach((product, index) => {
        const li = document.createElement("li");
        li.textContent = `${product.name} - $${product.price.toFixed(2)} (${product.category})`;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.style.marginLeft = "10px";
        removeBtn.addEventListener("click", () => {
            products.splice(index, 1);
            renderAdminProducts();
            alert(`${product.name} removed from products.`);
        });
        li.appendChild(removeBtn);
        productListEl.appendChild(li);
    });
}

// Add new product
addBtn.addEventListener("click", () => {
    const name = document.getElementById("product-name").value.trim();
    const price = parseFloat(document.getElementById("product-price").value);
    const category = document.getElementById("product-category").value.trim().toLowerCase();
    const images = document.getElementById("product-images").value.split(",").map(img => img.trim());

    if(!name || isNaN(price) || !category || images.length === 0){
        alert("Please fill in all fields correctly.");
        return;
    }

    products.push({ name, price, category, images });
    renderAdminProducts();
    alert(`${name} added successfully!`);

    // Clear inputs
    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-category").value = "";
    document.getElementById("product-images").value = "";
});

// Initial render
renderAdminProducts();
