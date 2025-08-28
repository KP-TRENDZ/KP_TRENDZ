let products = JSON.parse(localStorage.getItem("kpProducts")) || [];

const adminForm = document.getElementById("admin-form");
const productList = document.getElementById("product-list");

function renderAdminProducts(){
  productList.innerHTML = "";
  products.forEach((p,index)=>{
    const div = document.createElement("div");
    div.className="admin-product";
    div.innerHTML=`
      <strong>${p.name}</strong> - ${p.category} - $${p.price.toFixed(2)}
      <button data-index="${index}" class="edit-btn">Edit</button>
      <button data-index="${index}" class="delete-btn">Delete</button>
      <p>Colors: ${p.colors.map(c=>c.color).join(", ")}</p>
    `;
    productList.appendChild(div);
  });

  // Delete buttons
  document.querySelectorAll(".delete-btn").forEach(btn=>{
    btn.addEventListener("click", e=>{
      const idx = e.target.dataset.index;
      products.splice(idx,1);
      localStorage.setItem("kpProducts", JSON.stringify(products));
      renderAdminProducts();
    });
  });

  // Edit buttons
  document.querySelectorAll(".edit-btn").forEach(btn=>{
    btn.addEventListener("click", e=>{
      const idx = e.target.dataset.index;
      const p = products[idx];
      adminForm.name.value = p.name;
      adminForm.category.value = p.category;
      adminForm.price.value = p.price;
      adminForm.color.value = p.colors[0].color;
      adminForm.images.value = p.colors[0].images.join(",");
      adminForm.dataset.editIndex = idx;
    });
  });
}

// Handle form submission
adminForm.addEventListener("submit", e=>{
  e.preventDefault();
  const name = adminForm.name.value;
  const category = adminForm.category.value;
  const price = parseFloat(adminForm.price.value);
  const color = adminForm.color.value;
  const images = adminForm.images.value.split(",").map(s=>s.trim());

  if(adminForm.dataset.editIndex !== undefined){
    const idx = adminForm.dataset.editIndex;
    const product = products[idx];
    product.name = name;
    product.category = category;
    product.price = price;
    const colorIndex = product.colors.findIndex(c=>c.color===color);
    if(colorIndex>=0){
      product.colors[colorIndex].images = images;
    } else {
      product.colors.push({color, images});
    }
    delete adminForm.dataset.editIndex;
  } else {
    products.push({name, category, price, colors:[{color, images}]});
  }

  localStorage.setItem("kpProducts", JSON.stringify(products));
  renderAdminProducts();
  adminForm.reset();
}

// Initial render
renderAdminProducts();
