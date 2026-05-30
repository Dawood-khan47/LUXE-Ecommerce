/* ============================================
   LUXE E-COMMERCE — SCRIPT.JS
   ============================================ */

// ── DATA ────────────────────────────────────────

const categories = [
  { name: 'Electronics', count: 128, img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80', tag: 'Trending' },
  { name: 'Fashion',     count: 245, img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80', tag: 'New' },
  { name: 'Home',        count:  89, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', tag: null },
  { name: 'Beauty',      count:  67, img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', tag: 'Hot' },
];

const products = [
  {
    id: 1, name: 'Pro Wireless Headphones',
    category: 'Electronics', price: 299, oldPrice: 399,
    rating: 4.8, reviews: 312, badge: 'Best Seller',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  },
  {
    id: 2, name: 'Minimal Leather Watch',
    category: 'Fashion', price: 189, oldPrice: null,
    rating: 4.9, reviews: 204, badge: 'New',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  },
  {
    id: 3, name: 'Smart 4K Camera',
    category: 'Electronics', price: 549, oldPrice: 699,
    rating: 4.7, reviews: 178, badge: 'Sale',
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
  },
  {
    id: 4, name: 'Linen Throw Pillow Set',
    category: 'Home', price: 79, oldPrice: null,
    rating: 4.6, reviews: 95, badge: null,
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
  },
  {
    id: 5, name: 'Luxury Fragrance',
    category: 'Beauty', price: 129, oldPrice: 159,
    rating: 4.9, reviews: 441, badge: 'Hot',
    img: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80',
  },
  {
    id: 6, name: 'Sneaker Cloud White',
    category: 'Fashion', price: 149, oldPrice: null,
    rating: 4.5, reviews: 267, badge: 'New',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
  {
    id: 7, name: 'Ceramic Mug Set',
    category: 'Home', price: 55, oldPrice: 75,
    rating: 4.7, reviews: 133, badge: 'Sale',
    img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80',
  },
  {
    id: 8, name: 'Rose Gold Skincare Kit',
    category: 'Beauty', price: 95, oldPrice: null,
    rating: 4.8, reviews: 189, badge: null,
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
  },
];

// ── STATE ────────────────────────────────────────

let cart = [];
let activeFilter = 'all';
let searchQuery  = '';

// ── RENDER CATEGORIES ────────────────────────────

function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  grid.innerHTML = categories.map(cat => `
    <div class="category-card reveal" onclick="filterByCategory('${cat.name}')">
      <img src="${cat.img}" alt="${cat.name}" loading="lazy" />
      <div class="category-card-overlay">
        <h3>${cat.name}</h3>
        <span>${cat.count} Products</span>
      </div>
      ${cat.tag ? `<div class="cat-tag">${cat.tag}</div>` : ''}
    </div>
  `).join('');
  revealOnScroll();
}

function filterByCategory(cat) {
  activeFilter = cat;
  searchQuery  = '';
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === cat);
  });
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  renderProducts();
}

// ── RENDER PRODUCTS ──────────────────────────────

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');

  let filtered = products;

  if (activeFilter !== 'all') {
    filtered = filtered.filter(p => p.category === activeFilter);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  grid.innerHTML = filtered.map(p => {
    const stars = renderStars(p.rating);
    const badgeClass = p.badge === 'New' ? 'new-badge' : p.badge === 'Sale' ? 'sale-badge' : '';
    const inCart = cart.find(c => c.id === p.id);

    return `
      <div class="product-card reveal" data-id="${p.id}">
        <div class="product-img-wrap">
          <img src="${p.img}" alt="${p.name}" loading="lazy" />
          ${p.badge ? `<span class="product-badge ${badgeClass}">${p.badge}</span>` : ''}
          <button class="product-wishlist"><i class="fa-regular fa-heart"></i></button>
        </div>
        <div class="product-body">
          <p class="product-cat">${p.category}</p>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-rating">
            <span class="stars">${stars}</span>
            <span class="rating-count">${p.rating} (${p.reviews})</span>
          </div>
          <div class="product-price-row">
            <div>
              <span class="product-price">$${p.price}</span>
              ${p.oldPrice ? `<span class="product-price-old"> $${p.oldPrice}</span>` : ''}
            </div>
            <button class="btn-cart ${inCart ? 'added' : ''}" onclick="addToCart(${p.id})" data-btn="${p.id}">
              <i class="fa-solid ${inCart ? 'fa-check' : 'fa-bag-shopping'}"></i>
              ${inCart ? 'Added' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  revealOnScroll();
}

function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  let stars   = '★'.repeat(full);
  if (half) stars += '½';
  return stars;
}

// ── FILTER BUTTONS ───────────────────────────────

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts();
  });
});

// ── SEARCH ───────────────────────────────────────

const searchToggle  = document.getElementById('searchToggle');
const searchBarWrap = document.getElementById('searchBarWrap');
const searchInput   = document.getElementById('searchInput');
const searchClear   = document.getElementById('searchClear');

searchToggle.addEventListener('click', () => {
  searchBarWrap.classList.toggle('open');
  if (searchBarWrap.classList.contains('open')) searchInput.focus();
});

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  renderProducts();
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  renderProducts();
  searchInput.focus();
});

// ── CART ─────────────────────────────────────────

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
    showToast(`${product.name} qty updated`);
  } else {
    cart.push({ ...product, qty: 1 });
    showToast(`${product.name} added to cart`);
  }

  // update button
  const btn = document.querySelector(`[data-btn="${id}"]`);
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Added`;
  }

  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
  renderCartItems();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const countEl  = document.getElementById('cartCount');
  const badgeEl  = document.getElementById('cartBadgeSidebar');

  countEl.textContent  = total;
  badgeEl.textContent  = total;
  countEl.style.display = total > 0 ? 'flex' : 'none';

  renderCartItems();
  renderProducts(); // refresh "added" state on buttons
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const emptyEl   = document.getElementById('cartEmpty');
  const footerEl  = document.getElementById('cartFooter');
  const totalEl   = document.getElementById('cartTotalPrice');

  if (cart.length === 0) {
    container.innerHTML = '';
    container.appendChild(emptyEl);
    emptyEl.style.display = 'flex';
    footerEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  footerEl.style.display = 'block';

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  totalEl.textContent = `$${subtotal.toFixed(2)}`;

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}" />
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</p>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `).join('');
}

// ── CART OPEN / CLOSE ────────────────────────────

const cartToggle  = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose   = document.getElementById('cartClose');

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ── NAVBAR ───────────────────────────────────────

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNavLink();
  revealOnScroll();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current    = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  links.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
}

// ── SMOOTH SCROLL ────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
  });
});

// ── REVEAL ON SCROLL ─────────────────────────────

function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}

// ── TOAST ────────────────────────────────────────

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── CONTACT FORM ─────────────────────────────────

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  showToast('Message sent! We\'ll get back to you soon.');
  e.target.reset();
});

// ── WISHLIST TOGGLE ──────────────────────────────

document.addEventListener('click', e => {
  if (e.target.closest('.product-wishlist')) {
    const btn  = e.target.closest('.product-wishlist');
    const icon = btn.querySelector('i');
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');
    icon.style.color = icon.classList.contains('fa-solid') ? '#f87171' : '';
    showToast(icon.classList.contains('fa-solid') ? 'Added to wishlist' : 'Removed from wishlist');
  }
});

// ── INIT ─────────────────────────────────────────

renderCategories();
renderProducts();
revealOnScroll();