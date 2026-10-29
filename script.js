const products = [
 {id:1,name:"Headphone Pulse Pro",category:"Áudio",price:349.90,old:449.90,tag:"-22%",rating:"4.9",reviews:128,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85"},
 {id:2,name:"Smartwatch Orbit S",category:"Wearables",price:429.90,old:559.90,tag:"MAIS VENDIDO",rating:"4.8",reviews:96,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85"},
 {id:3,name:"Fone AirBeat Wireless",category:"Áudio",price:189.90,old:249.90,tag:"-24%",rating:"4.8",reviews:214,image:"https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=700&q=85"},
 {id:4,name:"Speaker Boom Mini",category:"Áudio",price:259.90,old:319.90,tag:"-19%",rating:"4.9",reviews:82,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=85"},
 {id:5,name:"Relógio Minimal One",category:"Wearables",price:319.90,old:399.90,tag:"NOVO",rating:"4.7",reviews:61,image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85"},
 {id:6,name:"Headset Studio X",category:"Áudio",price:499.90,old:629.90,tag:"-20%",rating:"4.9",reviews:154,image:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=85"},
 {id:7,name:"Óculos Tech Vision",category:"Acessórios",price:229.90,old:289.90,tag:"-21%",rating:"4.6",reviews:45,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85"},
 {id:8,name:"Controle Game Core",category:"Acessórios",price:279.90,old:349.90,tag:"-20%",rating:"4.8",reviews:73,image:"https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=700&q=85"}
];
const $ = s => document.querySelector(s);
const money = n => n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
let activeFilter='Todos', searchTerm='', showAll=false, cart=JSON.parse(localStorage.getItem('volt-cart')||'[]');
const grid=$('#productGrid');
function renderProducts(){
 let list=products.filter(p=>(activeFilter==='Todos'||p.category===activeFilter)&&p.name.toLowerCase().includes(searchTerm.toLowerCase()));
 const shown=showAll?list:list.slice(0,4);
 grid.innerHTML=shown.length?shown.map(p=>`<article class="product-card">
 <div class="product-image"><span class="tag">${p.tag}</span><button class="wish" aria-label="Favoritar ${p.name}" data-wish="${p.id}">♡</button><img loading="lazy" src="${p.image}" alt="${p.name}"><button class="quick-add" data-add="${p.id}">＋ Adicionar ao carrinho</button></div>
 <div class="product-info"><span class="product-category">${p.category}</span><h3 class="product-name">${p.name}</h3><div class="product-rating"><span>★★★★★</span> ${p.rating} (${p.reviews})</div><div class="price-row"><strong class="price">${money(p.price)}</strong><span class="old-price">${money(p.old)}</span></div><div class="installments">ou 10x de ${money(p.price/10)} sem juros</div></div></article>`).join(''):'<p class="no-results">Nenhum produto encontrado. Tente outra busca.</p>';
 $('#showMore').style.display=list.length>4?'inline-flex':'none';
 $('#showMore').innerHTML=showAll?'Mostrar menos <span>−</span>':'Carregar mais produtos <span>＋</span>';
}
function saveCart(){localStorage.setItem('volt-cart',JSON.stringify(cart));renderCart()}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({...p,qty:1});saveCart();toast(`${p.name} adicionado ao carrinho`)}
function renderCart(){
 const count=cart.reduce((s,p)=>s+p.qty,0);$('#cartCount').textContent=count;$('#drawerCount').textContent=`(${count})`;
 $('#cartSubtotal').textContent=money(cart.reduce((s,p)=>s+p.price*p.qty,0));
 $('#cartItems').innerHTML=cart.length?cart.map(p=>`<div class="cart-item"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><span class="cart-price">${money(p.price)}</span><div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="Diminuir quantidade">−</button><span>${p.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Aumentar quantidade">＋</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Remover ${p.name}">×</button></div>`).join(''):'<div class="empty-cart"><span>＋</span><h4>Seu carrinho está esperando.</h4><p>Adicione algo que combine com você.</p></div>';
}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2400)}
function openCart(){ $('#cartDrawer').classList.add('open');$('#overlay').classList.add('show');document.body.style.overflow='hidden'}
function closeCart(){ $('#cartDrawer').classList.remove('open');$('#overlay').classList.remove('show');document.body.style.overflow=''}
document.addEventListener('click',e=>{
 const add=e.target.closest('[data-add]');if(add)addToCart(Number(add.dataset.add));
 const qty=e.target.closest('[data-qty]');if(qty){const item=cart.find(p=>p.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<1)cart=cart.filter(p=>p.id!==item.id);saveCart()}}
 const rem=e.target.closest('[data-remove]');if(rem){cart=cart.filter(p=>p.id!==Number(rem.dataset.remove));saveCart()}
 const wish=e.target.closest('[data-wish]');if(wish){wish.classList.toggle('liked');wish.textContent=wish.classList.contains('liked')?'♥':'♡';toast(wish.classList.contains('liked')?'Adicionado aos favoritos':'Removido dos favoritos')}
});
$('#cartToggle').addEventListener('click',openCart);$('#closeCart').addEventListener('click',closeCart);$('#overlay').addEventListener('click',closeCart);
$('#checkoutBtn').addEventListener('click',()=>toast(cart.length?'Checkout demonstrativo: conecte Mercado Pago, Stripe ou sua plataforma.':'Seu carrinho está vazio.'));
$('#showMore').addEventListener('click',()=>{showAll=!showAll;renderProducts()});
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeFilter=b.dataset.filter;showAll=false;renderProducts()}));
document.querySelectorAll('.category-card').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.category;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===activeFilter));showAll=true;renderProducts();$('#produtos').scrollIntoView({behavior:'smooth'})}));
$('#searchToggle').addEventListener('click',()=>{$('#searchBar').classList.toggle('open');if($('#searchBar').classList.contains('open'))$('#searchInput').focus()});
function search(){searchTerm=$('#searchInput').value.trim();showAll=true;renderProducts();$('#produtos').scrollIntoView({behavior:'smooth'})}
$('#searchSubmit').addEventListener('click',search);$('#searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')search()});
$('#menuToggle').addEventListener('click',()=>$('#nav').classList.toggle('open'));document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>$('#nav').classList.remove('open')));
$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();$('#newsletterMessage').textContent='Valeu! Para ativar os envios, conecte este formulário a uma plataforma de e-mail.';$('#email').value='';toast('Cadastro demonstrativo recebido!')});
renderProducts();renderCart();
