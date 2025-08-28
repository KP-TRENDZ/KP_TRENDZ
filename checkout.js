let cart = JSON.parse(localStorage.getItem("kpCart")) || [];
const checkoutCart = document.querySelector(".checkout-cart-items");
const checkoutTotal = document.querySelector(".checkout-total");
const checkoutForm = document.getElementById("checkout-form");

function renderCheckoutCart(){
  checkoutCart.innerHTML = "";
  let total = 0;
  cart.forEach(item=>{
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.textContent = `${item.name} (${item.color}) x${item.quantity} - $${(item.price*item.quantity).toFixed(2)}`;
    checkoutCart.appendChild(li);
  });
  checkoutTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Handle checkout submission
checkoutForm.addEventListener("submit", e=>{
  e.preventDefault();
  const formData = new FormData(checkoutForm);
  const customer = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    street: formData.get("street"),
    city: formData.get("city"),
    province: formData.get("province"),
    postal: formData.get("postal"),
    country: formData.get("country"),
    payment: formData.get("payment"),
    items: cart
  };

  // Send email to admin (via EmailJS)
  emailjs.send("YOUR_SERVICE_ID","YOUR_TEMPLATE_ID",{
    to_email: "rrana7029@gmail.com",
    customer_name: customer.name,
    customer_email: customer.email,
    order_details: customer.items.map(i=>`${i.name} (${i.color}) x${i.quantity}`).join(", "),
    total: cart.reduce((sum,i)=>sum+i.price*i.quantity,0)
  }).then(()=>{
    alert("Order placed! Confirmation sent to admin.");
  });

  // Optional: Send confirmation to customer
  emailjs.send("YOUR_SERVICE_ID","YOUR_TEMPLATE_ID",{
    to_email: customer.email,
    customer_name: customer.name,
    order_details: customer.items.map(i=>`${i.name} (${i.color}) x${i.quantity}`).join(", "),
    total: cart.reduce((sum,i)=>sum+i.price*i.quantity,0)
  }).then(()=>{
    alert("Confirmation email sent to customer!");
  });

  // Payment handling
  if(customer.payment==="manual"){
    alert("You chose Pay on Delivery. Order recorded.");
  } else {
    alert("Stripe payment placeholder (implement Stripe checkout here).");
  }

  // Clear cart
  cart=[];
  localStorage.setItem("kpCart", JSON.stringify(cart));
  renderCheckoutCart();
  checkoutForm.reset();
});

renderCheckoutCart();
