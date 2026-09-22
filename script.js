const defaultProducts=[
{id:1,name:"سماعة لاسلكية Pro",cat:"electronics",category:"إلكترونيات",price:35000,old:45000,stock:12,sku:"EAR-001",icon:"🎧",image:"",badge:"خصم",description:"سماعة لاسلكية بجودة صوت ممتازة وبطارية مناسبة للاستخدام اليومي."},
{id:2,name:"ساعة ذكية X8",cat:"electronics",category:"إلكترونيات",price:55000,old:70000,stock:8,sku:"WATCH-008",icon:"⌚",image:"",badge:"عرض",description:"ساعة ذكية أنيقة لمتابعة النشاط والتنبيهات اليومية."},
{id:3,name:"خلاط مطبخ متعدد",cat:"home",category:"منزل",price:28000,old:35000,stock:20,sku:"HOME-003",icon:"🥤",image:"",badge:"خصم",description:"خلاط عملي للاستخدام المنزلي اليومي."},
{id:4,name:"مصباح مكتبي LED",cat:"home",category:"منزل",price:18000,old:null,stock:15,sku:"HOME-004",icon:"💡",image:"",badge:"",description:"مصباح مكتبي بإضاءة مريحة وتصميم عصري."},
{id:5,name:"حقيبة يومية أنيقة",cat:"fashion",category:"أزياء",price:25000,old:32000,stock:10,sku:"FASH-005",icon:"👜",image:"",badge:"خصم",description:"حقيبة يومية بتصميم أنيق ومساحة عملية."},
{id:6,name:"نظارة شمسية كلاسيكية",cat:"fashion",category:"أزياء",price:22000,old:null,stock:18,sku:"FASH-006",icon:"🕶️",image:"",badge:"",description:"نظارة شمسية بتصميم كلاسيكي."}
];
// المنتجات تُحمّل الآن من Firestore (قاعدة بيانات فايربيس)، وتظهر defaultProducts فقط مؤقتاً قبل وصول البيانات الحقيقية أو إذا كانت القاعدة فارغة
let products=defaultProducts;
let waNumber="9647700000000";
let cart=JSON.parse(localStorage.getItem("cart")||"[]"), filter="all";
const $=s=>document.querySelector(s), money=n=>new Intl.NumberFormat("ar-IQ").format(Number(n)||0)+" د.ع";
function save(){localStorage.setItem("cart",JSON.stringify(cart));renderCart()}
function imageOrIcon(p,cls=""){return p.image?`<img class="${cls}" src="${p.image}" alt="${p.name}">`:`<span class="${cls} emoji">${p.icon||"🛍️"}</span>`}
function renderCategories(){const cats=[["all","✨","كل المنتجات"],["electronics","📱","إلكترونيات"],["home","🏠","المنزل"],["fashion","👕","أزياء"]];$("#categoryList").innerHTML=cats.map(c=>`<div class="category" data-cat="${c[0]}"><span class="cat-icon">${c[1]}</span><strong>${c[2]}</strong></div>`).join("");document.querySelectorAll(".category").forEach(x=>x.onclick=()=>{filter=x.dataset.cat;renderProducts();location.hash="products"})}
function renderProducts(list=products.filter(p=>filter==="all"||p.cat===filter)){ $("#productGrid").innerHTML=list.map(p=>`<article class="product"><div class="product-img" data-view="${p.id}">${imageOrIcon(p)}</div>${p.badge?`<span class="badge">${p.badge}</span>`:""}<div class="product-info"><h3>${p.name}</h3><p>${p.category} • متوفر ${p.stock}</p><div class="price">${money(p.price)} ${p.old?`<span class="old">${money(p.old)}</span>`:""}</div><button class="add" data-add="${p.id}">أضف إلى السلة</button></div></article>`).join("")||`<p style="text-align:center;color:#999;padding:40px">لا توجد منتجات حالياً</p>`;document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>add(+b.dataset.add));document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>view(+b.dataset.view))}
function add(id){let p=products.find(x=>x.id===id),x=cart.find(i=>i.id===id);if(!p||p.stock<1)return alert("المنتج غير متوفر");x?x.qty++:cart.push({id,qty:1});save();openCart()}
function renderCart(){let count=cart.reduce((a,i)=>a+i.qty,0);$("#cartCount").textContent=count;let total=0;$("#cartItems").innerHTML=cart.length?cart.map(i=>{let p=products.find(x=>x.id===i.id);if(!p)return "";total+=p.price*i.qty;return `<div class="cart-row"><div class="cart-thumb">${imageOrIcon(p)}</div><div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${i.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div><b>${money(p.price*i.qty)}</b></div>`}).join(""):`<div style="text-align:center;color:#888;padding:60px 10px">السلة فارغة 🛒</div>`;$("#cartTotal").textContent=money(total)}
function changeQty(id,n){let x=cart.find(i=>i.id===id);if(!x)return;x.qty+=n;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save()}
function openCart(){$("#cartDrawer").classList.add("open");$("#overlay").classList.add("show")} function closeCart(){$("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("show")}
function view(id){let p=products.find(x=>x.id===id);$("#modalContent").innerHTML=`<div class="modal-img">${imageOrIcon(p)}</div><div class="modal-body"><span class="eyebrow">${p.category}</span><h2>${p.name}</h2><p>${p.description||""}</p><h3>${money(p.price)} ${p.old?`<span class="old">${money(p.old)}</span>`:""}</h3><button class="primary-btn full" onclick="add(${p.id});document.querySelector('dialog').close()">أضف إلى السلة</button></div>`;$("#productModal").showModal()}

function loadFromFirebase(){
  if(typeof db==="undefined"){console.warn("Firebase غير مهيأ - تحقق من firebase-config.js");return}
  db.collection("products").onSnapshot(snap=>{
    products = snap.empty ? defaultProducts : snap.docs.map(d=>d.data());
    renderProducts(); renderCart();
  }, err=>{ console.error("خطأ تحميل المنتجات من Firebase:", err) });
  db.collection("settings").doc("store").get().then(doc=>{
    if(!doc.exists) return;
    let s = doc.data();
    if(s.wa) waNumber = s.wa;
    if(s.name){ document.querySelectorAll(".brand").forEach(b=>b.textContent=s.name); document.title = s.name+" | متجر إلكتروني" }
  }).catch(err=>console.error(err));
}

document.addEventListener("DOMContentLoaded",()=>{renderCategories();renderProducts();renderCart();loadFromFirebase();
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;renderProducts()});
$("#cartBtn").onclick=openCart;$("#closeCart").onclick=closeCart;$("#overlay").onclick=closeCart;$("#clearCart").onclick=()=>{cart=[];save()};$("#closeModal").onclick=()=>$("#productModal").close();$("#menuBtn").onclick=()=>$("#mainNav").classList.toggle("show");
$("#searchBtn").onclick=()=>{$("#searchPanel").classList.add("show");$("#searchInput").focus()};$("#closeSearch").onclick=()=>$("#searchPanel").classList.remove("show");$("#searchInput").oninput=e=>{let q=e.target.value.trim();renderProducts(q?products.filter(p=>p.name.includes(q)||p.category.includes(q)):products.filter(p=>filter==="all"||p.cat===filter))};
$("#checkoutBtn").onclick=()=>{if(!cart.length)return alert("السلة فارغة");$("#checkoutModal").classList.add("show");closeCart()};$("#closeCheckout").onclick=()=>$("#checkoutModal").classList.remove("show");
$("#checkoutForm").onsubmit=e=>{e.preventDefault();let f=new FormData(e.target),lines=cart.map(i=>{let p=products.find(x=>x.id===i.id);return `${p.name} × ${i.qty} = ${money(p.price*i.qty)}`}).join("\\n");let msg=`طلب جديد من المتجر\\n\\nالاسم: ${f.get("name")}\\nالهاتف: ${f.get("phone")}\\nالمحافظة: ${f.get("city")}\\nالعنوان: ${f.get("address")}\\nملاحظات: ${f.get("note")||"-"}\\n\\nالمنتجات:\\n${lines}\\n\\nالمجموع: ${$("#cartTotal").textContent}`;window.open("https://wa.me/"+waNumber+"?text="+encodeURIComponent(msg),"_blank");};
});
