// منتجات تجريبية تُستخدم فقط عند الضغط على زر "استيراد منتجات تجريبية"
const seedProducts=[
{id:1,name:"سماعة لاسلكية Pro",cat:"electronics",category:"إلكترونيات",price:35000,old:45000,stock:12,sku:"EAR-001",icon:"🎧",image:"",badge:"خصم",description:"سماعة لاسلكية بجودة صوت ممتازة وبطارية مناسبة للاستخدام اليومي."},
{id:2,name:"ساعة ذكية X8",cat:"electronics",category:"إلكترونيات",price:55000,old:70000,stock:8,sku:"WATCH-008",icon:"⌚",image:"",badge:"عرض",description:"ساعة ذكية أنيقة لمتابعة النشاط والتنبيهات اليومية."},
{id:3,name:"خلاط مطبخ متعدد",cat:"home",category:"منزل",price:28000,old:35000,stock:20,sku:"HOME-003",icon:"🥤",image:"",badge:"خصم",description:"خلاط عملي للاستخدام المنزلي اليومي."},
{id:4,name:"مصباح مكتبي LED",cat:"home",category:"منزل",price:18000,old:null,stock:15,sku:"HOME-004",icon:"💡",image:"",badge:"",description:"مصباح مكتبي بإضاءة مريحة وتصميم عصري."},
{id:5,name:"حقيبة يومية أنيقة",cat:"fashion",category:"أزياء",price:25000,old:32000,stock:10,sku:"FASH-005",icon:"👜",image:"",badge:"خصم",description:"حقيبة يومية بتصميم أنيق ومساحة عملية."},
{id:6,name:"نظارة شمسية كلاسيكية",cat:"fashion",category:"أزياء",price:22000,old:null,stock:18,sku:"FASH-006",icon:"🕶️",image:"",badge:"",description:"نظارة شمسية بتصميم كلاسيكي."}
];

const productsCol = typeof db!=="undefined" ? db.collection("products") : null;
const settingsDoc = typeof db!=="undefined" ? db.collection("settings").doc("store") : null;
const IMAGE_LIMIT = 500*1024; // 500KB خام (~666KB بعد base64) لتبقى ضمن حد مستند Firestore (1MB)

let products=[];
let currentImage="";
const $=s=>document.querySelector(s),money=n=>new Intl.NumberFormat("ar-IQ").format(Number(n)||0)+" د.ع";

function img(p){return p.image?`<img src="${p.image}" alt="">`:(p.icon||"🛍️")}

function stats(){ $("#statProducts").textContent=products.length;$("#statStock").textContent=products.reduce((a,p)=>a+(+p.stock||0),0);$("#statValue").textContent=money(products.reduce((a,p)=>a+(+p.price||0)*(+p.stock||0),0))}

function render(){let q=($("#adminSearch")?.value||"").trim().toLowerCase(),cat=$("#adminCat")?.value||"all";let list=products.filter(p=>(!q||p.name.toLowerCase().includes(q)||(p.sku||"").toLowerCase().includes(q))&&(cat==="all"||p.cat===cat));$("#adminRows").innerHTML=list.map(p=>`<tr><td><div class="prod-cell"><div class="thumb">${img(p)}</div><div><b>${p.name}</b><small style="display:block;color:#999">${p.description?.slice(0,35)||""}</small></div></div></td><td>${p.sku||"-"}</td><td>${p.category||p.cat}</td><td>${money(p.price)}</td><td>${p.stock||0}</td><td class="actions"><button onclick="edit(${p.id})">تعديل</button><button class="delete" onclick="del(${p.id})">حذف</button></td></tr>`).join("")||`<tr><td colspan="6" style="text-align:center;padding:35px">لا توجد منتجات بعد. أضف منتجاً جديداً أو استورد منتجات تجريبية من صفحة الإعدادات.</td></tr>`;stats()}

function resetForm(){["pName","pSku","pCategory","pPrice","pOld","pStock","pBadge","pDesc","editId"].forEach(id=>$("#"+id).value="");$("#pStock").value=0;currentImage="";$("#preview").innerHTML="📷";$("#formTitle").textContent="إضافة منتج"}
function openEditor(p=null){$("#productEditor").classList.add("show");if(!p){resetForm();return}$("#formTitle").textContent="تعديل المنتج";$("#editId").value=p.id;$("#pName").value=p.name;$("#pSku").value=p.sku||"";$("#pCat").value=p.cat;$("#pCategory").value=p.category||"";$("#pPrice").value=p.price;$("#pOld").value=p.old||"";$("#pStock").value=p.stock||0;$("#pBadge").value=p.badge||"";$("#pDesc").value=p.description||"";currentImage=p.image||"";$("#preview").innerHTML=p.image?`<img src="${p.image}">`:"📷"}
function edit(id){openEditor(products.find(p=>p.id===id))}

async function del(id){
  if(!confirm("حذف المنتج؟"))return;
  try{ await productsCol.doc(String(id)).delete() }
  catch(err){ alert("تعذر حذف المنتج: "+err.message) }
}

$("#addBtn").onclick=()=>openEditor();$("#closeEditor").onclick=$("#cancelEditor").onclick=()=>$("#productEditor").classList.remove("show");

$("#imageFile").onchange=e=>{let file=e.target.files[0];if(!file)return;if(file.size>IMAGE_LIMIT){alert("الصورة كبيرة. اختر صورة أقل من "+(IMAGE_LIMIT/1024)+"KB (قاعدة بيانات Firestore تحدد حجم المستند بـ 1MB).");e.target.value="";return}let r=new FileReader();r.onload=()=>{currentImage=r.result;$("#preview").innerHTML=`<img src="${currentImage}">`};r.readAsDataURL(file)};

$("#productForm").onsubmit=async e=>{
  e.preventDefault();
  let id=+$("#editId").value||Date.now(),old=products.find(p=>p.id===id);
  let p={id,name:$("#pName").value.trim(),sku:$("#pSku").value.trim(),cat:$("#pCat").value,category:$("#pCategory").value.trim()||$("#pCat option:checked").textContent,price:+$("#pPrice").value,old:$("#pOld").value?+$("#pOld").value:null,stock:+$("#pStock").value,badge:$("#pBadge").value.trim(),description:$("#pDesc").value.trim(),image:currentImage,icon:old?.icon||"🛍️"};
  let btn=e.target.querySelector('button[type="submit"]'),oldText=btn.textContent;
  btn.disabled=true;btn.textContent="جارٍ الحفظ...";
  try{
    await productsCol.doc(String(id)).set(p);
    $("#productEditor").classList.remove("show");
  }catch(err){
    alert("تعذر حفظ المنتج: "+err.message);
  }finally{
    btn.disabled=false;btn.textContent=oldText;
  }
};

$("#adminSearch").oninput=render;$("#adminCat").onchange=render;
document.querySelectorAll(".side").forEach(b=>b.onclick=()=>{document.querySelectorAll(".side").forEach(x=>x.classList.remove("active"));b.classList.add("active");let p=b.dataset.page;$("#productsPage").classList.toggle("hidden",p!=="products");$("#settingsPage").classList.toggle("hidden",p!=="settings")});

// ---- الإعدادات (اسم المتجر، واتساب، الوصف) عبر Firestore ----
settingsDoc?.get().then(doc=>{
  if(!doc.exists)return;
  let s=doc.data();
  if(s.name)$("#storeName").value=s.name;
  if(s.wa)$("#waNumber").value=s.wa;
  if(s.desc)$("#storeDesc").value=s.desc;
}).catch(err=>console.error(err));

$("#saveSettings").onclick=async()=>{
  try{
    await settingsDoc.set({name:$("#storeName").value,wa:$("#waNumber").value,desc:$("#storeDesc").value});
    alert("تم حفظ الإعدادات");
  }catch(err){ alert("تعذر حفظ الإعدادات: "+err.message) }
};

$("#seedBtn").onclick=async()=>{
  if(!confirm("سيتم إضافة 6 منتجات تجريبية إلى القائمة الحالية. متابعة؟"))return;
  try{
    let batch=db.batch();
    seedProducts.forEach(p=>batch.set(productsCol.doc(String(p.id+Date.now())),{...p,id:p.id+Date.now()}));
    await batch.commit();
    alert("تم استيراد المنتجات التجريبية");
  }catch(err){ alert("تعذر الاستيراد: "+err.message) }
};

// ---- الاتصال المباشر (Realtime) بقائمة المنتجات ----
productsCol?.onSnapshot(snap=>{
  products=snap.docs.map(d=>d.data()).sort((a,b)=>b.id-a.id);
  render();
},err=>{
  console.error(err);
  $("#adminRows").innerHTML=`<tr><td colspan="6" style="text-align:center;padding:35px;color:#a33">تعذر الاتصال بقاعدة البيانات. تحقق من إعدادات Firebase وقواعد الأمان (Firestore rules).</td></tr>`;
});
