// ==========================================================================
// BG'S JEWELLERY - LUXURY STORE APPLICATION LOGIC
// ==========================================================================

let currentCurrency = 'INR';
let activeFilter = 'all';
let activePurity = 'all';
let cart = JSON.parse(localStorage.getItem('bgs_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('bgs_wishlist') || '[]');

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initGoldRateTicker();
  initGoldCalculator();
  initSavingsSchemeCalculator();
  renderProducts();
  renderCollections();
  updateCartBadge();
  updateWishlistBadge();
  initEventListeners();
});

// Helper: Format Price
function formatPrice(amountInINR) {
  const curr = CURRENCIES[currentCurrency] || CURRENCIES.INR;
  const converted = amountInINR * curr.rate;
  
  if (currentCurrency === 'INR') {
    return curr.symbol + Math.round(converted).toLocaleString('en-IN');
  } else {
    return curr.symbol + converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
}

// Calculate live product price based on weight, karat, and making charges
function calculateProductPrice(product) {
  const ratePerGram = product.purity === '18KT' ? GOLD_RATES.rate18K : GOLD_RATES.rate22K;
  const rawGoldValue = product.netWeight * ratePerGram;
  const makingCharges = rawGoldValue * (product.makingChargePct / 100);
  const subtotal = rawGoldValue + makingCharges;
  const gst = subtotal * 0.03; // 3% Indian GST on Gold Jewellery
  return Math.round(subtotal + gst);
}

// Navbar scroll effects
function initNavbarScroll() {
  const nav = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// Update Gold Rate Display
function initGoldRateTicker() {
  const r24 = document.getElementById('rate24kValue');
  const r22 = document.getElementById('rate22kValue');
  const r18 = document.getElementById('rate18kValue');
  const rSilver = document.getElementById('rateSilverValue');

  if (r24) r24.innerText = formatPrice(GOLD_RATES.rate24K);
  if (r22) r22.innerText = formatPrice(GOLD_RATES.rate22K);
  if (r18) r18.innerText = formatPrice(GOLD_RATES.rate18K);
  if (rSilver) rSilver.innerText = formatPrice(GOLD_RATES.silverRate);

  // Top bar ticker rates
  const top22 = document.getElementById('topTicker22k');
  const top24 = document.getElementById('topTicker24k');
  if (top22) top22.innerText = `${formatPrice(GOLD_RATES.rate22K)}/g`;
  if (top24) top24.innerText = `${formatPrice(GOLD_RATES.rate24K)}/g`;
}

// Gold Value Live Calculator
function initGoldCalculator() {
  const weightInput = document.getElementById('calcWeight');
  const puritySelect = document.getElementById('calcPurity');
  const unitSelect = document.getElementById('calcUnit');
  const calcResult = document.getElementById('calcResult');
  const calcBreakdown = document.getElementById('calcBreakdown');

  if (!weightInput || !calcResult) return;

  function updateCalc() {
    let weight = parseFloat(weightInput.value) || 0;
    const unit = unitSelect ? unitSelect.value : 'grams';
    
    // Unit conversion to grams
    if (unit === 'sovereign') {
      weight = weight * 8; // 1 sovereign / pavan = 8 grams
    } else if (unit === 'tola') {
      weight = weight * 11.6638; // 1 tola = 11.66 grams
    }

    const purity = puritySelect ? puritySelect.value : '22';
    let rate = GOLD_RATES.rate22K;
    if (purity === '24') rate = GOLD_RATES.rate24K;
    if (purity === '18') rate = GOLD_RATES.rate18K;

    const goldVal = weight * rate;
    const estMaking = goldVal * 0.12; // average 12% making charge
    const gst = (goldVal + estMaking) * 0.03;
    const total = goldVal + estMaking + gst;

    calcResult.innerText = formatPrice(total);
    if (calcBreakdown) {
      calcBreakdown.innerHTML = `
        <div class="flex justify-between py-1 border-b border-white/5 text-xs">
          <span class="text-stone-400">Pure Gold Value (${weight.toFixed(2)}g @ ${purity}KT):</span>
          <span class="text-white font-medium">${formatPrice(goldVal)}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-white/5 text-xs">
          <span class="text-stone-400">Est. Artistry & Making Charges (12%):</span>
          <span class="text-white font-medium">${formatPrice(estMaking)}</span>
        </div>
        <div class="flex justify-between py-1 text-xs">
          <span class="text-stone-400">Applicable GST (3%):</span>
          <span class="text-white font-medium">${formatPrice(gst)}</span>
        </div>
      `;
    }
  }

  weightInput.addEventListener('input', updateCalc);
  if (puritySelect) puritySelect.addEventListener('change', updateCalc);
  if (unitSelect) unitSelect.addEventListener('change', updateCalc);
  updateCalc();
}

// Swarna Samriddhi Monthly Gold Savings Scheme Calculator
function initSavingsSchemeCalculator() {
  const slider = document.getElementById('savingsSlider');
  const displayMonthly = document.getElementById('savingsMonthlyDisplay');
  const userTotalEl = document.getElementById('savingsUserTotal');
  const bonusEl = document.getElementById('savingsBonus');
  const grandTotalEl = document.getElementById('savingsGrandTotal');
  const goldEquivEl = document.getElementById('savingsGoldEquiv');

  if (!slider) return;

  function updateSavings() {
    const monthly = parseInt(slider.value, 10);
    if (displayMonthly) displayMonthly.innerText = formatPrice(monthly);

    const userPaid11Months = monthly * 11;
    const bonus12thMonth = monthly; // 1 month bonus paid by BG's
    const totalRedemption = userPaid11Months + bonus12thMonth;
    const approxGoldGrams = (totalRedemption / GOLD_RATES.rate22K).toFixed(2);

    if (userTotalEl) userTotalEl.innerText = formatPrice(userPaid11Months);
    if (bonusEl) bonusEl.innerText = `+ ${formatPrice(bonus12thMonth)} (FREE Bonus)`;
    if (grandTotalEl) grandTotalEl.innerText = formatPrice(totalRedemption);
    if (goldEquivEl) goldEquivEl.innerText = `≈ ${approxGoldGrams} grams of 22KT Gold`;
  }

  slider.addEventListener('input', updateSavings);
  updateSavings();
}

// Render Collections Row
function renderCollections() {
  const container = document.getElementById('collectionsContainer');
  if (!container) return;

  container.innerHTML = COLLECTIONS_DATA.map(col => `
    <div class="group relative overflow-hidden border border-amber-900/40 bg-stone-900/50 hover:border-amber-400/60 transition-all duration-500 cursor-pointer flex flex-col justify-between"
         onclick="filterCollection('${col.categoryFilter}')">
      <div class="relative h-72 overflow-hidden">
        <img src="${col.image}" alt="${col.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <span class="absolute top-4 left-4 hallmark-badge uppercase text-[10px] tracking-wider">${col.badge}</span>
        <span class="absolute top-4 right-4 text-xs font-mono text-amber-200/80 bg-black/60 px-2.5 py-1 rounded-sm">${col.itemCount}</span>
      </div>
      <div class="p-6 relative">
        <span class="text-xs uppercase tracking-widest text-amber-400/90 font-serif block mb-1">${col.subtitle}</span>
        <h3 class="text-xl font-serif text-white group-hover:text-amber-200 transition-colors">${col.title}</h3>
        <p class="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">${col.description}</p>
        <div class="mt-4 pt-3 border-t border-amber-500/15 flex items-center justify-between text-xs font-serif text-amber-300">
          <span>Explore Suite</span>
          <i class="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Products Grid
function renderProducts() {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  const filtered = PRODUCTS_DATA.filter(p => {
    const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
    const matchesPurity = activePurity === 'all' || p.purity === activePurity;
    return matchesCategory && matchesPurity;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <i class="fa-solid fa-gem text-4xl text-amber-500/40 mb-3"></i>
        <h4 class="text-lg font-serif text-stone-300">No pieces found in this category</h4>
        <p class="text-xs text-stone-500 mt-1">Try resetting your filters or request a bespoke creation.</p>
        <button onclick="resetFilters()" class="mt-4 btn-glass text-xs">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const price = calculateProductPrice(item);
    const isHero = item.id === 'bg-hero-01';
    const inWishlist = wishlist.includes(item.id);

    return `
      <div class="product-card group flex flex-col justify-between ${isHero ? 'border-amber-400/50 shadow-2xl shadow-amber-950/20' : ''}">
        <!-- Image & Tags -->
        <div class="relative overflow-hidden bg-stone-950 aspect-[4/5] cursor-pointer" onclick="openQuickView('${item.id}')">
          <img src="${item.image}" alt="${item.name}" class="img-zoom w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <button class="w-full py-2.5 bg-stone-900/90 hover:bg-amber-500 hover:text-stone-950 text-white text-xs font-medium tracking-wider uppercase transition-all backdrop-blur-sm border border-amber-500/30">
              Quick View & Specs
            </button>
          </div>

          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            <span class="hallmark-badge text-[10px]">
              <i class="fa-solid fa-award text-amber-400"></i> ${item.purityCode}
            </span>
            ${item.tag ? `<span class="bg-amber-600/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 tracking-wider uppercase font-semibold">${item.tag}</span>` : ''}
          </div>

          <!-- Wishlist Heart Button -->
          <button onclick="event.stopPropagation(); toggleWishlist('${item.id}')"
                  class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-stone-300 hover:text-amber-400 transition-colors">
            <i class="${inWishlist ? 'fa-solid fa-heart text-amber-400' : 'fa-regular fa-heart'}"></i>
          </button>
        </div>

        <!-- Details -->
        <div class="p-5 flex flex-col flex-1 justify-between bg-gradient-to-b from-stone-900/60 to-stone-950/90">
          <div>
            <div class="flex items-center justify-between text-[11px] text-amber-300/80 font-mono mb-1">
              <span>Net Gold: <strong>${item.netWeight.toFixed(2)}g</strong></span>
              <span>${item.purity}</span>
            </div>
            <h4 class="font-serif text-lg text-white group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-1" onclick="openQuickView('${item.id}')">
              ${item.name}
            </h4>
            <p class="text-stone-400 text-xs line-clamp-1 mt-0.5">${item.subtitle}</p>
          </div>

          <div class="mt-4 pt-3 border-t border-white/10">
            <div class="flex items-baseline justify-between mb-3">
              <div>
                <span class="text-[10px] uppercase tracking-wider text-stone-400 block">Estimated Price</span>
                <span class="text-lg font-serif font-semibold text-amber-200">${formatPrice(price)}</span>
              </div>
              <div class="text-right">
                <span class="text-[10px] text-stone-500 block">Making ${item.makingChargePct}%</span>
                <span class="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
                  <i class="fa-solid fa-circle-check text-[8px]"></i> 100% Exchange
                </span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="grid grid-cols-2 gap-2">
              <button onclick="addToCart('${item.id}')" class="w-full py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs tracking-wider uppercase transition-colors border border-stone-700">
                <i class="fa-solid fa-bag-shopping mr-1.5 text-amber-400"></i> Add to Bag
              </button>
              <button onclick="inquireWhatsApp('${item.id}')" class="w-full py-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs tracking-wider uppercase transition-colors border border-emerald-500/30 flex items-center justify-center gap-1">
                <i class="fa-brands fa-whatsapp text-emerald-400"></i> Inquire
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Category filter trigger
function filterCategory(cat) {
  activeFilter = cat;
  document.querySelectorAll('.filter-tab-btn').forEach(btn => {
    if (btn.dataset.category === cat) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderProducts();
}

function filterPurity(purity) {
  activePurity = purity;
  document.querySelectorAll('.purity-tab-btn').forEach(btn => {
    if (btn.dataset.purity === purity) {
      btn.classList.add('active', 'border-amber-400', 'text-amber-300');
      btn.classList.remove('border-stone-700', 'text-stone-400');
    } else {
      btn.classList.remove('active', 'border-amber-400', 'text-amber-300');
      btn.classList.add('border-stone-700', 'text-stone-400');
    }
  });
  renderProducts();
}

function filterCollection(cat) {
  filterCategory(cat);
  const target = document.getElementById('catalogueSection');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function resetFilters() {
  activeFilter = 'all';
  activePurity = 'all';
  filterCategory('all');
}

// Quick View Modal
function openQuickView(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickViewModal');
  const content = document.getElementById('quickViewContent');
  const price = calculateProductPrice(product);
  const ratePerGram = product.purity === '18KT' ? GOLD_RATES.rate18K : GOLD_RATES.rate22K;
  const rawGoldVal = product.netWeight * ratePerGram;
  const makingCharge = rawGoldVal * (product.makingChargePct / 100);
  const gst = (rawGoldVal + makingCharge) * 0.03;

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <!-- Media Gallery -->
      <div class="space-y-4">
        <div class="relative overflow-hidden bg-stone-950 aspect-square border border-amber-900/40 rounded-sm">
          <img id="modalMainImg" src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
          <div class="absolute bottom-3 left-3 hallmark-badge text-xs">
            <i class="fa-solid fa-certificate text-amber-400"></i> ${product.purityCode}
          </div>
        </div>

        ${product.gallery && product.gallery.length > 1 ? `
          <div class="flex gap-2">
            ${product.gallery.map(img => `
              <button onclick="document.getElementById('modalMainImg').src='${img}'" class="w-16 h-16 border border-stone-700 hover:border-amber-400 overflow-hidden">
                <img src="${img}" class="w-full h-full object-cover">
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Specs & Purchase -->
      <div class="space-y-5 text-left">
        <div>
          <span class="text-xs uppercase font-serif tracking-widest text-amber-400">${product.purity} Gold &middot; ${product.category}</span>
          <h2 class="text-2xl font-serif text-white mt-1">${product.name}</h2>
          <p class="text-xs text-stone-400 mt-1">${product.subtitle}</p>
        </div>

        <div class="p-4 bg-stone-900/80 border border-amber-500/20 rounded-sm space-y-2">
          <div class="flex items-baseline justify-between">
            <span class="text-xs text-stone-400">Calculated Atelier Value:</span>
            <span class="text-2xl font-serif text-amber-300 font-semibold">${formatPrice(price)}</span>
          </div>
          <div class="pt-2 border-t border-white/5 space-y-1 text-xs text-stone-300">
            <div class="flex justify-between">
              <span class="text-stone-400">Net 22K Gold (${product.netWeight}g @ ${formatPrice(ratePerGram)}/g):</span>
              <span>${formatPrice(rawGoldVal)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-400">Artisan Making (${product.makingChargePct}%):</span>
              <span>${formatPrice(makingCharge)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-400">Applicable GST (3%):</span>
              <span>${formatPrice(gst)}</span>
            </div>
          </div>
        </div>

        <p class="text-xs text-stone-300 leading-relaxed">${product.description}</p>

        <!-- Specifications Table -->
        <div class="border border-stone-800 rounded-sm overflow-hidden text-xs">
          <div class="bg-stone-900 px-3 py-2 font-serif text-amber-200 border-b border-stone-800">
            Certificate & Material Specifications
          </div>
          <div class="divide-y divide-stone-800">
            ${Object.entries(product.specifications || {}).map(([key, val]) => `
              <div class="grid grid-cols-2 px-3 py-1.5">
                <span class="text-stone-400">${key}</span>
                <span class="text-white font-medium">${val}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- CTAs -->
        <div class="grid grid-cols-2 gap-3 pt-2">
          <button onclick="addToCart('${product.id}'); closeModal('quickViewModal')" class="btn-gold-solid text-xs py-3">
            <i class="fa-solid fa-bag-shopping mr-2"></i> Add to Bag
          </button>
          <button onclick="inquireWhatsApp('${product.id}')" class="py-3 bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider border border-emerald-500/40 transition-colors flex items-center justify-center gap-2">
            <i class="fa-brands fa-whatsapp text-emerald-400 text-sm"></i> Concierge Chat
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

// Modal closing helper
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Currency Switcher
function setCurrency(currCode) {
  if (!CURRENCIES[currCode]) return;
  currentCurrency = currCode;
  
  const label = document.getElementById('currentCurrencyLabel');
  if (label) label.innerText = currCode;

  initGoldRateTicker();
  initGoldCalculator();
  initSavingsSchemeCalculator();
  renderProducts();
  renderCart();
  renderWishlist();

  showToast(`Currency updated to ${currCode}`);
}

// Wishlist Functionality
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast("Removed from Wishlist");
  } else {
    wishlist.push(productId);
    showToast("Added to your Private Wishlist");
  }
  localStorage.setItem('bgs_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  renderProducts();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistCount');
  if (badge) {
    badge.innerText = wishlist.length;
    badge.style.display = wishlist.length > 0 ? 'inline-flex' : 'none';
  }
}

function openWishlist() {
  const drawer = document.getElementById('wishlistDrawer');
  if (!drawer) return;
  renderWishlist();
  drawer.classList.add('active');
}

function renderWishlist() {
  const container = document.getElementById('wishlistItemsList');
  if (!container) return;

  const items = PRODUCTS_DATA.filter(p => wishlist.includes(p.id));
  if (items.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center text-stone-500">
        <i class="fa-regular fa-heart text-4xl mb-3 text-stone-600"></i>
        <p class="font-serif text-stone-300">Your wishlist is empty</p>
        <p class="text-xs mt-1">Save pieces you love while exploring our bridal suites.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="flex gap-4 p-3 border-b border-stone-800 items-center justify-between">
      <img src="${item.image}" class="w-16 h-16 object-cover border border-amber-900/40">
      <div class="flex-1 min-w-0">
        <h5 class="text-sm font-serif text-white truncate">${item.name}</h5>
        <span class="text-xs text-amber-300">${formatPrice(calculateProductPrice(item))}</span>
        <span class="text-[10px] text-stone-400 block">${item.netWeight}g &middot; ${item.purity}</span>
      </div>
      <div class="flex flex-col gap-2">
        <button onclick="addToCart('${item.id}')" class="text-xs text-amber-400 hover:text-white p-1">
          <i class="fa-solid fa-bag-shopping"></i>
        </button>
        <button onclick="toggleWishlist('${item.id}')" class="text-xs text-stone-500 hover:text-red-400 p-1">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Cart Functionality
function addToCart(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  localStorage.setItem('bgs_cart', JSON.stringify(cart));
  updateCartBadge();
  showToast(`Added "${product.name}" to your Bag`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('bgs_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    localStorage.setItem('bgs_cart', JSON.stringify(cart));
    renderCart();
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if (badge) {
    badge.innerText = totalItems;
    badge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
  }
}

function openCart() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  renderCart();
  drawer.classList.add('active');
}

function renderCart() {
  const container = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalWeightEl = document.getElementById('cartTotalWeight');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center text-stone-500">
        <i class="fa-solid fa-bag-shopping text-4xl mb-3 text-stone-600"></i>
        <p class="font-serif text-stone-300">Your shopping bag is empty</p>
        <p class="text-xs mt-1">Explore our bridal collection to add items.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.innerText = formatPrice(0);
    if (totalWeightEl) totalWeightEl.innerText = '0.00g';
    return;
  }

  let totalAmount = 0;
  let totalWeight = 0;

  container.innerHTML = cart.map(cartItem => {
    const product = PRODUCTS_DATA.find(p => p.id === cartItem.id);
    if (!product) return '';

    const price = calculateProductPrice(product);
    const lineTotal = price * cartItem.qty;
    totalAmount += lineTotal;
    totalWeight += product.netWeight * cartItem.qty;

    return `
      <div class="flex gap-4 p-4 border-b border-stone-800 items-center justify-between">
        <img src="${product.image}" class="w-16 h-16 object-cover border border-amber-900/40 rounded-sm">
        <div class="flex-1 min-w-0">
          <h5 class="text-sm font-serif text-white truncate">${product.name}</h5>
          <span class="text-xs text-amber-300 font-medium">${formatPrice(lineTotal)}</span>
          <span class="text-[10px] text-stone-400 block">${(product.netWeight * cartItem.qty).toFixed(2)}g Net Gold &middot; ${product.purity}</span>
        </div>
        <div class="flex items-center gap-2 border border-stone-800 px-2 py-1">
          <button onclick="updateCartQty('${product.id}', -1)" class="text-xs text-stone-400 hover:text-white px-1">-</button>
          <span class="text-xs font-mono text-white px-1">${cartItem.qty}</span>
          <button onclick="updateCartQty('${product.id}', 1)" class="text-xs text-stone-400 hover:text-white px-1">+</button>
        </div>
        <button onclick="removeFromCart('${product.id}')" class="text-xs text-stone-500 hover:text-red-400 ml-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.innerText = formatPrice(totalAmount);
  if (totalWeightEl) totalWeightEl.innerText = `${totalWeight.toFixed(2)}g Net Gold`;
}

// Inquire on WhatsApp for a specific product
function inquireWhatsApp(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const price = calculateProductPrice(product);
  const text = `Namaste BG's Jewellery Atelier,%0A%0AI am interested in purchasing/viewing the following piece from your collection:%0A%0A*Piece:* ${encodeURIComponent(product.name)}%0A*Category:* ${encodeURIComponent(product.category)}%0A*Purity:* ${encodeURIComponent(product.purityCode)}%0A*Net Gold Weight:* ${product.netWeight}g%0A*Estimated Value:* ${encodeURIComponent(formatPrice(price))}%0A%0APlease connect me with a Master Concierge.`;

  window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
}

// Checkout through WhatsApp
function checkoutViaWhatsApp() {
  if (cart.length === 0) {
    showToast("Your bag is empty");
    return;
  }

  let text = `Namaste BG's Jewellery,%0A%0AI would like to place an order / book an atelier consultation for my selected pieces:%0A%0A`;
  let total = 0;
  let weight = 0;

  cart.forEach((cItem, i) => {
    const p = PRODUCTS_DATA.find(item => item.id === cItem.id);
    if (p) {
      const pPrice = calculateProductPrice(p);
      total += pPrice * cItem.qty;
      weight += p.netWeight * cItem.qty;
      text += `${i + 1}. *${p.name}* (Qty: ${cItem.qty}, Net: ${(p.netWeight * cItem.qty).toFixed(2)}g, ${formatPrice(pPrice * cItem.qty)})%0A`;
    }
  });

  text += `%0A*Total Net Gold:* ${weight.toFixed(2)}g%0A*Grand Estimated Total:* ${formatPrice(total)}%0A%0APlease confirm availability and schedule my insured dispatch or private lounge appointment.`;

  window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
}

// Consultation Modal
function openConsultationModal() {
  const modal = document.getElementById('consultationModal');
  if (modal) modal.classList.add('active');
}

function handleConsultationSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('consName')?.value || 'Guest';
  const salon = document.getElementById('consSalon')?.value || 'Flagship';
  const date = document.getElementById('consDate')?.value || 'Upcoming';
  const id = 'BG-APP-' + Math.floor(100000 + Math.random() * 900000);

  closeModal('consultationModal');
  
  const passModal = document.getElementById('bookingPassModal');
  const passContent = document.getElementById('bookingPassContent');
  if (passModal && passContent) {
    passContent.innerHTML = `
      <div class="text-center p-6 space-y-4">
        <div class="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 text-2xl">
          <i class="fa-solid fa-crown"></i>
        </div>
        <div>
          <span class="text-xs uppercase tracking-widest text-amber-400 font-serif">Appointment Confirmed</span>
          <h3 class="text-xl font-serif text-white mt-1">Welcome to the BG's Bridal Suite</h3>
          <p class="text-xs text-stone-400 mt-1">We look forward to hosting you, <strong class="text-white">${name}</strong>.</p>
        </div>

        <div class="p-4 bg-stone-900 border border-amber-900/50 rounded-sm text-left text-xs space-y-2">
          <div class="flex justify-between">
            <span class="text-stone-400">Atelier Pass ID:</span>
            <span class="font-mono text-amber-300 font-semibold">${id}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-400">Atelier Location:</span>
            <span class="text-white">${salon}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-400">Date & Slot:</span>
            <span class="text-white">${date}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-400">Assigned Concierge:</span>
            <span class="text-amber-200">Senior Bridal Gemologist</span>
          </div>
        </div>

        <button onclick="closeModal('bookingPassModal')" class="btn-gold-solid w-full text-xs py-2.5">
          Done & Save Pass
        </button>
      </div>
    `;
    passModal.classList.add('active');
  }
}

// Instant Search Modal
function openSearch() {
  const modal = document.getElementById('searchModal');
  if (modal) {
    modal.classList.add('active');
    setTimeout(() => {
      document.getElementById('searchInput')?.focus();
    }, 150);
  }
}

function handleSearch(query) {
  const resultsContainer = document.getElementById('searchResults');
  if (!resultsContainer) return;

  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    resultsContainer.innerHTML = `
      <div class="p-6 text-center text-xs text-stone-500">
        Type to search bridal sets, necklaces, bangles, rings, or 22K gold...
      </div>
    `;
    return;
  }

  const matches = PRODUCTS_DATA.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.purity.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    resultsContainer.innerHTML = `
      <div class="p-8 text-center text-xs text-stone-500">
        No jewellery pieces matching "${query}".
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = matches.map(item => `
    <div class="flex items-center gap-4 p-3 hover:bg-stone-800/80 cursor-pointer border-b border-stone-800 transition-colors"
         onclick="closeModal('searchModal'); openQuickView('${item.id}')">
      <img src="${item.image}" class="w-12 h-12 object-cover border border-amber-900/40">
      <div class="flex-1 min-w-0">
        <h5 class="text-xs font-serif text-white truncate">${item.name}</h5>
        <span class="text-[11px] text-amber-300">${formatPrice(calculateProductPrice(item))} &middot; ${item.netWeight}g</span>
      </div>
      <i class="fa-solid fa-angle-right text-stone-600 text-xs"></i>
    </div>
  `).join('');
}

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById('bgsToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'bgsToast';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 border border-amber-500/50 text-amber-200 px-5 py-2.5 rounded-sm shadow-2xl text-xs font-serif tracking-wider flex items-center gap-2 pointer-events-none transition-all duration-300 opacity-0 translate-y-4';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check text-amber-400"></i> ${message}`;
  toast.classList.remove('opacity-0', 'translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-4');
  }, 2800);
}

// Event Listeners initialization
function initEventListeners() {
  // Mobile drawer toggle
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
    });
  }

  // Close modals on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });

  // Close modals on clicking overlay backdrop
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}
