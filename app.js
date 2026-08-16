// THE THRIFTO CO. — store settings
const WHATSAPP_NUMBER = "918967427827"; // CHANGE to your WhatsApp number, e.g. 919876543210
const UPI_ID = "8967427827@ybl";            // CHANGE to your UPI ID
const ADMIN_PIN = "140909";                // CHANGE this PIN

const PRODUCTS = [
  {id:1,name:"Cream Linen Trousers",price:699,size:"M",condition:"Excellent",image:"file_000000001a40820bb31806519beb2fb9.png"},
  {id:2,name:"Black Double-Breasted Overcoat",price:2000,size:"M",condition:"Excellent",image:"file_00000000da8481fa86f2f6b7e9e4d300.png"},
  {id:3,name:"premium brown leather jacket",price:1199,size:"M",condition:"Very good",image:"file_000000003c40820bbbdc94ccaa729a0f.png"}
  {id:4,name:"Vintage Leather-Type Jacket",price:999,size:"M",condition:"Excellent",image:"file_000000005c9481fa92b9f60f61e033a0.png"}
];

let products = JSON.parse(localStorage.getItem("thrifto_products") || "null") || PRODUCTS;
let cart = JSON.parse(localStorage.getItem("thrifto_cart") || "[]");

function money(n){return "₹"+Number(n).toLocaleString("en-IN")}
function renderProducts(){
  const q=(document.getElementById("search").value||"").toLowerCase();
  const box=document.getElementById("products");
  const list=products.filter(p=>(p.name+" "+p.size+" "+p.condition).toLowerCase().includes(q));
  box.innerHTML=list.map(p=>`
    <article class="product">
      <img class="product-img" src="${p.image}" alt="${p.name}">
      <div class="product-body">
        <h3>${p.name}</h3><div class="meta">Size ${p.size} • ${p.condition}</div>
        <div class="price">${money(p.price)}</div>
        <div class="actions">
          <button class="small-btn" onclick="addToCart(${p.id})">Add</button>
          <button class="small-btn dark" onclick="buyNow(${p.id})">Order</button>
        </div>
      </div>
    </article>`).join("") || "<p>No items found.</p>";
}
function addToCart(id){const p=products.find(x=>x.id===id);if(!cart.some(x=>x.id===id))cart.push(p);saveCart();openCart()}
function saveCart(){localStorage.setItem("thrifto_cart",JSON.stringify(cart));document.getElementById("cartCount").textContent=cart.length}
function openCart(){document.getElementById("cart").classList.remove("hidden");renderCart()}
function closeCart(){document.getElementById("cart").classList.add("hidden")}
function renderCart(){
  const box=document.getElementById("cartItems");
  box.innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-line"><img src="${p.image}"><div><b>${p.name}</b><div class="meta">Size ${p.size}</div><div>${money(p.price)}</div><button class="text-btn" onclick="removeCart(${i})">Remove</button></div></div>`).join(""):"<p>Your bag is empty.</p>";
  document.getElementById("cartTotal").textContent=money(cart.reduce((a,p)=>a+Number(p.price),0));
}
function removeCart(i){cart.splice(i,1);saveCart();renderCart()}
function orderText(items){return "Hi The Thrifto Co.! I want to order:%0A"+items.map(p=>`• ${p.name} — Size ${p.size} — ${money(p.price)}`).join("%0A")}
function checkout(){
  if(!cart.length)return alert("Your bag is empty.");
  if(WHATSAPP_NUMBER.includes("999999"))return alert("Please add your WhatsApp number in app.js first.");
  location.href=`https://wa.me/${WHATSAPP_NUMBER}?text=${orderText(cart)}`;
}
function buyNow(id){cart=[products.find(p=>p.id===id)];saveCart();checkout()}
function payUPI(){
  if(!cart.length)return alert("Your bag is empty.");
  if(UPI_ID==="yourupi@upi")return alert("Please add your UPI ID in app.js first.");
  const total=cart.reduce((a,p)=>a+Number(p.price),0);
  location.href=`upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent("The Thrifto Co.")}&am=${total}&cu=INR&tn=${encodeURIComponent("The Thrifto Co. order")}`;
}
function openAdmin(){document.getElementById("admin").classList.remove("hidden")}
function closeAdmin(){document.getElementById("admin").classList.add("hidden")}
function unlockAdmin(){
  if(document.getElementById("pin").value!==ADMIN_PIN)return alert("Wrong PIN.");
  document.getElementById("adminPanel").classList.remove("hidden");
  document.querySelector("#adminPanel + .button").classList.add("hidden");
  renderAdmin();
}
function renderAdmin(){
  document.getElementById("adminProducts").innerHTML=products.map((p,i)=>`
    <div class="edit-row">
      <input value="${escapeHtml(p.name)}" onchange="editP(${i},'name',this.value)">
      <input type="number" value="${p.price}" onchange="editP(${i},'price',this.value)">
      <input value="${escapeHtml(p.size)}" onchange="editP(${i},'size',this.value)">
      <input value="${escapeHtml(p.condition)}" onchange="editP(${i},'condition',this.value)">
      <input value="${escapeHtml(p.image)}" onchange="editP(${i},'image',this.value)">
      <button class="small-btn" onclick="deleteP(${i})">Delete</button>
    </div>`).join("");
}
function escapeHtml(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;")}
function editP(i,k,v){products[i][k]=k==="price"?Number(v):v;localStorage.setItem("thrifto_products",JSON.stringify(products));renderProducts()}
function addProduct(){products.push({id:Date.now(),name:"New thrift item",price:499,size:"M",condition:"Very good",image:""});localStorage.setItem("thrifto_products",JSON.stringify(products));renderAdmin();renderProducts()}
function deleteP(i){products.splice(i,1);localStorage.setItem("thrifto_products",JSON.stringify(products));renderAdmin();renderProducts()}
function resetProducts(){products=JSON.parse(JSON.stringify(PRODUCTS));localStorage.setItem("thrifto_products",JSON.stringify(products));renderAdmin();renderProducts()}
renderProducts();saveCart();
