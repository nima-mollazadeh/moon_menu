(() => {
  "use strict";
  const CONFIG = window.MOON_CONFIG || {};
  const CATEGORIES = window.MOON_CATEGORIES || [];
  const PRODUCTS = window.MOON_PRODUCTS || [];
  const fmt = new Intl.NumberFormat("fa-IR");
  const money = value => `${fmt.format(Math.max(0, Number(value) || 0))} ${CONFIG.currency || "تومان"}`;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const byId = id => PRODUCTS.find(product => product.id === id);
  const state = { cart: [], currentCustomProduct: null, toastTimer: null, lastFocused: null };
  const STORAGE_KEY = "moon-menu-cart-v1";

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.filter(line => byId(line.productId) && Number(line.qty) > 0).map(line => ({
        key: String(line.key || `${line.productId}-${Date.now()}-${Math.random()}`),
        productId: line.productId,
        qty: Math.max(1, Math.floor(Number(line.qty) || 1)),
        unitPrice: Number(line.unitPrice) || byId(line.productId).price,
        choices: Array.isArray(line.choices) ? line.choices : [],
        optionSummary: String(line.optionSummary || "")
      }));
    } catch (_) { return []; }
  }
  state.cart = loadCart();
  function saveCart() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart)); } catch (_) {} }
  function cartCount() { return state.cart.reduce((sum, line) => sum + line.qty, 0); }
  function subtotal() { return state.cart.reduce((sum, line) => sum + line.unitPrice * line.qty, 0); }
  function displayImage(product, className = "product-image") {
    return `<div class="product-image-wrap"><img class="${className}" src="${esc(product.image)}" alt="${esc(product.alt || product.name)}" loading="lazy" decoding="async" data-image-fallback></div>`;
  }
  function priceMarkup(value) {
    return `<span class="price-number">${fmt.format(Math.max(0, Number(value) || 0))}</span><small>تومان</small>`;
  }
  function productCard(product, compact = false) {
    const badgeClass = product.badge === "پیشنهاد ما" ? "product-badge red" : "product-badge";
    const badge = product.badge ? `<span class="${badgeClass}">${esc(product.badge)}</span>` : "";
    const cls = compact ? "product-card" : "product-card menu-product-card";
    return `<article class="${cls}" data-product-card="${esc(product.id)}">
      ${displayImage(product)}${badge}
      <div class="product-body"><div class="product-title-row"><h3 class="product-title">${esc(product.name)}</h3></div>
      <p class="product-desc">${esc(product.desc)}</p>
      <div class="product-bottom"><span class="price">${priceMarkup(product.price)}</span>
      <button class="add-button" type="button" data-add-product="${esc(product.id)}" aria-label="افزودن ${esc(product.name)} به سبد">افزودن <span aria-hidden="true">+</span></button></div></div></article>`;
  }
  function renderBestSellers() {
    const container = $("#bestProducts");
    const popular = PRODUCTS.filter(product => product.popular);
    container.innerHTML = popular.map(product => productCard(product, true)).join("");
  }
  const CATEGORY_ICONS = {
    bestsellers: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 17h30l-4 22H13L9 17Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M7 17h34l-4-7-7 4-6-8-6 8-7-4-4 7Z" fill="none" stroke="#f04438" stroke-width="2.6" stroke-linejoin="round"/><path d="M19 25v7m10-7v7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    burgers: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 21c0-8 7-13 17-13s17 5 17 13H7Z" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linejoin="round"/><path d="M13 15h.1M21 12h.1M29 15h.1M36 17h.1" stroke="#f04438" stroke-width="3.4" stroke-linecap="round"/><path d="M7 25h34v5H7z" fill="none" stroke="#f04438" stroke-width="2.7"/><path d="m8 31 5 4h22l5-4M8 39h32" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    pizzas: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m9 7 31 10-21 25L9 7Z" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linejoin="round"/><path d="m9 7 31 10" stroke="#f04438" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="17" r="2.4" fill="#f04438"/><circle cx="29" cy="20" r="2.4" fill="#f04438"/><circle cx="24" cy="28" r="2.4" fill="#f04438"/><path d="M17 36 11 40" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/></svg>`,
    sandwiches: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 17c3-7 10-10 17-10s14 3 17 10l-3 5H10l-3-5Z" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linejoin="round"/><path d="M9 24h30l-4 7H13l-4-7Z" fill="none" stroke="#f04438" stroke-width="2.7" stroke-linejoin="round"/><path d="M13 34h22l5 6H8l5-6Z" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linejoin="round"/><path d="M16 17h.1M24 14h.1M32 17h.1" stroke="#f04438" stroke-width="3.4" stroke-linecap="round"/></svg>`,
    fried: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 33c-4-4-4-10 1-15l8-8c5-5 12-5 17 0s5 12 0 17l-8 8c-5 5-11 5-15 1l-3-3Z" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linejoin="round"/><path d="m12 33-5 5m7-1-1 6m5-7-4 5" fill="none" stroke="#f04438" stroke-width="2.7" stroke-linecap="round"/><path d="m21 15 12 12m-8-15 10 10" stroke="#f04438" stroke-width="2.3" stroke-linecap="round"/></svg>`,
    sides: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m10 21 4 22h20l4-22H10Z" fill="none" stroke="#f04438" stroke-width="2.7" stroke-linejoin="round"/><path d="M14 22V8m7 14V5m7 17V9m6 13V7" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M16 30h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    salads: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 27h34c-1 9-8 14-17 14S8 36 7 27Z" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linejoin="round"/><path d="M12 25c-2-8 5-13 11-12-1 7-4 11-11 12Zm12 1c-1-9 5-15 13-13 0 7-5 12-13 13Zm-2 0c-7-1-10-5-10-10 7 0 11 4 10 10Z" fill="none" stroke="#f04438" stroke-width="2.5" stroke-linejoin="round"/><path d="M17 32h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    drinks: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m14 15 3 28h14l3-28H14Z" fill="none" stroke="#f04438" stroke-width="2.7" stroke-linejoin="round"/><path d="M12 15h24M24 15 29 4h7" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 27h10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    desserts: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 22h32L35 41H13L8 22Z" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linejoin="round"/><path d="M8 22c0-4 4-6 8-4 3-7 8-7 11 0 5-2 10 0 13 4" fill="none" stroke="#f04438" stroke-width="2.7" stroke-linejoin="round"/><path d="M24 10V6m0 0c-3-2-6 0-6 3 3 2 6 0 6-3Zm0 0c3-2 6 0 6 3-3 2-6 0-6-3Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M17 29h.1M24 29h.1M31 29h.1" stroke="#f04438" stroke-width="3" stroke-linecap="round"/></svg>`
  };
  function renderCategoryNav() {
    const all = [{ id: "bestsellers", label: "پرفروش‌ها" }, ...CATEGORIES];
    $("#categoryNav").innerHTML = all.map((category, index) => {
      const icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS.bestsellers;
      return `<button type="button" class="category-tab${index === 0 ? " active" : ""}" data-category-target="${esc(category.id)}" aria-pressed="${index === 0 ? "true" : "false"}"><span class="category-icon">${icon}</span><span class="category-label">${esc(category.label)}</span></button>`;
    }).join("");
  }
  function renderMenu() {
    const container = $("#menuSections");
    const sections = CATEGORIES.map(category => {
      const products = PRODUCTS.filter(product => product.category === category.id);
      if (!products.length) return "";
      return `<section class="menu-section-block" id="category-${esc(category.id)}" data-menu-category="${esc(category.id)}" aria-labelledby="heading-${esc(category.id)}">
        <div class="category-heading"><h3 id="heading-${esc(category.id)}">${esc(category.title)}</h3>${category.intro ? `<p>${esc(category.intro)}</p>` : ""}</div>
        <div class="menu-product-grid">${products.map(product => productCard(product, false)).join("")}</div></section>`;
    }).join("");
    container.innerHTML = sections;
    container.hidden = false;
    $$("#categoryNav [data-category-target]").forEach(tab => {
      const id = tab.dataset.categoryTarget;
      const sectionExists = id === "bestsellers" ? true : Boolean($(`#category-${CSS.escape(id)}`, container));
      tab.hidden = false;
    });
    attachImageFallbacks();
    updateActiveCategory();
  }
  function attachImageFallbacks() {
    $$('img[data-image-fallback]').forEach(image => {
      if (image.dataset.fallbackBound === "true") return;
      image.dataset.fallbackBound = "true";
      image.addEventListener("error", () => {
        image.closest(".product-image-wrap")?.classList.add("image-failed");
        image.alt = image.alt || "تصویر غذا";
        if (!image.dataset.fallbackAttempted) {
          image.dataset.fallbackAttempted = "true";
          image.src = "assets/images/food-placeholder.svg";
        } else {
          image.style.display = "none";
        }
      });
    });
    const hero = $(".hero-photo");
    if (hero && hero.dataset.fallbackBound !== "true") {
      hero.dataset.fallbackBound = "true";
      hero.addEventListener("error", () => {
        if (!hero.dataset.fallbackAttempted) {
          hero.dataset.fallbackAttempted = "true";
          hero.src = "assets/images/food-placeholder.svg";
        }
      });
    }
  }
  function updateActiveCategory() {
    const tabs = $$("#categoryNav [data-category-target]").filter(tab => !tab.hidden);
    if (!tabs.length) return;
    let active = "bestsellers";
    {
      const threshold = 190;
      const sections = $$('[data-menu-category]');
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= threshold) active = section.dataset.menuCategory;
      }
      if (window.scrollY < $("#menu").offsetTop - 250) active = "bestsellers";
    }
    tabs.forEach(tab => {
      const selected = tab.dataset.categoryTarget === active;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-pressed", String(selected));
    });
  }
  function renderCart() {
    const count = cartCount();
    const sum = subtotal();
    $("#headerCartCount").textContent = fmt.format(count);
    $("#mobileCartCount").textContent = fmt.format(count);
    $("#mobileCartSubtotal").textContent = money(sum);
    $("#cartSubtotal").textContent = money(sum);
    $("#checkoutSubtotal").textContent = money(sum);
    $("#checkoutTotal").textContent = CONFIG.deliveryFee == null ? `${money(sum)} + هزینه ارسال تأییدشده` : money(sum + (Number(CONFIG.deliveryFee) || 0));
    const mobileBar = $("#mobileCartBar");
    mobileBar.hidden = count === 0;
    $("#cartEmpty").hidden = count > 0;
    $("#cartSummary").hidden = count === 0;
    $("#cartItems").hidden = count === 0;
    $("#cartItems").innerHTML = state.cart.map(line => {
      const product = byId(line.productId);
      return `<div class="cart-line" data-cart-key="${esc(line.key)}">
        <img src="${esc(product.image)}" alt="${esc(product.alt || product.name)}" loading="lazy" data-image-fallback>
        <div class="cart-line-info"><strong>${esc(product.name)}</strong>${line.optionSummary ? `<p>${esc(line.optionSummary)}</p>` : ""}<div class="quantity-control"><button type="button" data-qty-change="-1" data-cart-key="${esc(line.key)}" aria-label="کم کردن تعداد ${esc(product.name)}">−</button><span>${fmt.format(line.qty)}</span><button type="button" data-qty-change="1" data-cart-key="${esc(line.key)}" aria-label="زیاد کردن تعداد ${esc(product.name)}">+</button><button type="button" data-remove-line="${esc(line.key)}" aria-label="حذف ${esc(product.name)}" title="حذف">×</button></div></div>
        <span class="cart-line-price">${money(line.unitPrice * line.qty)}</span></div>`;
    }).join("");
    const fee = CONFIG.deliveryFee;
    $("#cartDelivery").textContent = fee == null ? "پس از تأیید" : money(Number(fee));
    $("#checkoutDelivery").textContent = fee == null ? "پس از تأیید" : money(Number(fee));
    $("#deliveryHint").textContent = fee == null ? "هزینه ارسال هنوز در تنظیمات وارد نشده است." : "هزینه ارسال بر اساس تنظیمات فعلی نمایش داده شده است.";
    $("#checkoutItems").innerHTML = state.cart.map(line => {
      const product = byId(line.productId);
      const suffix = line.optionSummary ? ` — ${esc(line.optionSummary)}` : "";
      return `<div class="checkout-item"><span>${esc(product.name)} × ${fmt.format(line.qty)}${suffix}</span><span>${money(line.unitPrice * line.qty)}</span></div>`;
    }).join("");
    saveCart();
    attachImageFallbacks();
  }
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
  }
  function openDrawer() {
    state.lastFocused = document.activeElement;
    const drawer = $("#cartDrawer");
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    drawer.inert = false;
    $("#drawerBackdrop").hidden = false;
    document.body.classList.add("dialog-open");
    $("#closeCart").focus();
  }
  function closeDrawer() {
    const drawer = $("#cartDrawer");
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    drawer.inert = true;
    $("#drawerBackdrop").hidden = true;
    document.body.classList.remove("dialog-open");
    if (state.lastFocused && typeof state.lastFocused.focus === "function") state.lastFocused.focus();
  }
  function showDialog(dialog) {
    closeDrawer();
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("dialog-open");
  }
  function closeDialog(dialog) {
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    if (!$$("dialog[open]").length) document.body.classList.remove("dialog-open");
  }
  function addLine(product, choices = [], optionSummary = "", unitPrice = product.price) {
    const normalized = choices.map(choice => `${choice.groupId}:${choice.value}`).sort().join("|");
    const key = `${product.id}::${normalized}`;
    const existing = state.cart.find(line => line.key === key);
    if (existing) existing.qty += 1;
    else state.cart.push({ key, productId: product.id, qty: 1, unitPrice, choices, optionSummary });
    renderCart();
    showToast(`${product.name} به سبد اضافه شد`);
  }
  function addProduct(id) {
    const product = byId(id);
    if (!product) return;
    if (product.customizations?.length) { openCustomization(product); return; }
    addLine(product);
  }
  function openCustomization(product) {
    state.currentCustomProduct = product;
    $("#customProduct").innerHTML = `<img src="${esc(product.image)}" alt="${esc(product.alt || product.name)}" data-image-fallback><div><strong>${esc(product.name)}</strong><p>${esc(product.desc)}</p></div>`;
    attachImageFallbacks();
    $("#customOptions").innerHTML = product.customizations.map(group => {
      const choices = group.options.map((option, index) => {
        const inputType = group.type === "checkbox" ? "checkbox" : "radio";
        const isChecked = group.type === "radio" && index === 0;
        const extra = option.price ? ` <span class="option-price">(+${money(option.price)})</span>` : "";
        return `<label class="option-choice"><input type="${inputType}" name="custom-${esc(group.id)}" value="${esc(option.value)}" data-group-id="${esc(group.id)}" data-group-label="${esc(group.label)}" data-option-label="${esc(option.label)}" data-option-price="${Number(option.price) || 0}" ${isChecked ? "checked" : ""}><span>${esc(option.label)}${extra}</span></label>`;
      }).join("");
      return `<fieldset class="option-group"><legend>${esc(group.label)}</legend><div class="option-list">${choices}</div></fieldset>`;
    }).join("");
    $("#customPrice").textContent = money(calculateCustomizationPrice());
    showDialog($("#customDialog"));
    attachImageFallbacks();
  }
  function selectedCustomizationInputs() {
    return $$("#customOptions input:checked");
  }
  function calculateCustomizationPrice() {
    const product = state.currentCustomProduct;
    return (product?.price || 0) + selectedCustomizationInputs().reduce((sum, input) => sum + (Number(input.dataset.optionPrice) || 0), 0);
  }
  function confirmCustomization() {
    const product = state.currentCustomProduct;
    if (!product) return;
    const inputs = selectedCustomizationInputs();
    const choices = inputs.map(input => ({ groupId: input.dataset.groupId, groupLabel: input.dataset.groupLabel, value: input.value, label: input.dataset.optionLabel, price: Number(input.dataset.optionPrice) || 0 }));
    const summary = choices.map(choice => choice.label).join("، ");
    addLine(product, choices, summary, calculateCustomizationPrice());
    closeDialog($("#customDialog"));
    state.currentCustomProduct = null;
  }
  function updateQuantity(key, delta) {
    const line = state.cart.find(item => item.key === key);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) state.cart = state.cart.filter(item => item.key !== key);
    renderCart();
  }
  function removeLine(key) {
    state.cart = state.cart.filter(item => item.key !== key);
    renderCart();
    showToast("آیتم از سبد حذف شد");
  }
  function openCheckout() {
    if (!state.cart.length) { showToast("اول یه غذا به سبد اضافه کن"); return; }
    $("#checkoutError").hidden = true;
    $("#checkoutResult").hidden = true;
    $("#checkoutForm").reset();
    updateAddressVisibility();
    renderCart();
    showDialog($("#checkoutDialog"));
    $("#customerName").focus();
  }
  function updateAddressVisibility() {
    const fulfillment = $("input[name='fulfillment']:checked")?.value || "delivery";
    const addressField = $("#addressField");
    const addressInput = $("#customerAddress");
    const delivery = fulfillment === "delivery";
    addressField.hidden = !delivery;
    addressInput.required = delivery;
    $("#checkoutTotal").textContent = fulfillment === "pickup" || CONFIG.deliveryFee != null
      ? money(subtotal() + (fulfillment === "delivery" ? (Number(CONFIG.deliveryFee) || 0) : 0))
      : `${money(subtotal())} + هزینه ارسال تأییدشده`;
    $("#checkoutDelivery").textContent = fulfillment === "pickup" ? "۰ تومان (تحویل حضوری)" : (CONFIG.deliveryFee == null ? "پس از تأیید" : money(Number(CONFIG.deliveryFee) || 0));
    $("#checkoutDisclaimer").textContent = CONFIG.whatsappNumber
      ? "با ادامه، متن سفارش در واتساپ باز می‌شود. تأیید نهایی و هزینه ارسال با رستوران هماهنگ می‌شود. پرداخت آنلاین در این صفحه فعال نیست."
      : "این صفحه هنوز به سیستم سفارش یا درگاه پرداخت متصل نیست. با وارد کردن شماره واتساپ در config.js می‌توان ارسال سفارش را فعال کرد.";
  }
  function validateCheckout() {
    const name = $("#customerName").value.trim();
    const phone = $("#customerPhone").value.trim();
    const fulfillment = $("input[name='fulfillment']:checked")?.value || "delivery";
    const address = $("#customerAddress").value.trim();
    const phoneDigits = phone.replace(/[\s()+-]/g, "");
    if (!name) return "لطفاً اسم خودت رو وارد کن.";
    if (!/^[0-9۰-۹٠-٩]{8,15}$/.test(phoneDigits)) return "شماره تماس رو به شکل درست وارد کن.";
    if (fulfillment === "delivery" && !address) return "برای ارسال، آدرس کامل لازمه.";
    if (!state.cart.length) return "سبد خرید خالیه. اول غذا انتخاب کن.";
    return "";
  }
  function buildOrderMessage() {
    const name = $("#customerName").value.trim();
    const phone = $("#customerPhone").value.trim();
    const fulfillment = $("input[name='fulfillment']:checked")?.value || "delivery";
    const address = $("#customerAddress").value.trim();
    const notes = $("#orderNotes").value.trim();
    const lines = state.cart.map(line => {
      const product = byId(line.productId);
      return `• ${product.name} × ${line.qty}${line.optionSummary ? ` (${line.optionSummary})` : ""} — ${money(line.unitPrice * line.qty)}`;
    });
    const fee = fulfillment === "pickup" ? "بدون هزینه ارسال (تحویل حضوری)" : (CONFIG.deliveryFee == null ? "پس از تأیید رستوران" : money(Number(CONFIG.deliveryFee) || 0));
    return [`سفارش جدید از منوی ${CONFIG.restaurantName || "MOON"}`, `نام: ${name}`, `شماره تماس: ${phone}`, `روش تحویل: ${fulfillment === "pickup" ? "تحویل حضوری" : "ارسال"}`, ...(fulfillment === "delivery" ? [`آدرس: ${address}`] : []), "", "اقلام سفارش:", ...lines, "", `جمع سفارش: ${money(subtotal())}`, `هزینه ارسال: ${fee}`, `مبلغ نهایی: ${fulfillment === "pickup" || CONFIG.deliveryFee != null ? money(subtotal() + (fulfillment === "delivery" ? (Number(CONFIG.deliveryFee) || 0) : 0)) : `${money(subtotal())} + هزینه ارسال تأییدشده`}`, ...(notes ? [`توضیحات: ${notes}`] : []), "", "لطفاً سفارش و زمان تحویل را تأیید کنید."].join("\n");
  }
  function submitOrder(event) {
    event.preventDefault();
    const error = validateCheckout();
    if (error) { $("#checkoutError").textContent = error; $("#checkoutError").hidden = false; return; }
    $("#checkoutError").hidden = true;
    const message = buildOrderMessage();
    const result = $("#checkoutResult");
    const number = String(CONFIG.whatsappNumber || "").replace(/\D/g, "");
    if (number.length >= 8) {
      const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      const orderLink = document.createElement("a");
      orderLink.href = url; orderLink.target = "_blank"; orderLink.rel = "noopener noreferrer";
      orderLink.hidden = true; document.body.appendChild(orderLink); orderLink.click(); orderLink.remove();
      result.innerHTML = `<strong>متن سفارش آماده است.</strong><br>واتساپ باید در برگه‌ی جدید باز شود. پیام را آنجا ارسال کن؛ سپس منتظر تأیید رستوران بمان. این سایت خودش پرداخت انجام نمی‌دهد.<br><button type="button" class="button button-quiet" id="copyOrderText">کپی متن سفارش</button>`;
      result.hidden = false;
      $("#copyOrderText").addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(message); showToast("متن سفارش کپی شد"); }
        catch (_) { showToast("کپی خودکار در این مرورگر در دسترس نیست"); }
      });
    } else {
      result.innerHTML = `<strong>این نسخه هنوز نمایشی است.</strong><br>برای ارسال سفارش واقعی، شماره واتساپ رستوران را در فایل <code>config.js</code> وارد کن. اطلاعات سفارش ثبت یا به رستوران ارسال نشده است.<br><button type="button" class="button button-quiet" id="copyOrderText">کپی متن سفارش</button>`;
      result.hidden = false;
      $("#copyOrderText").addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(message); showToast("متن سفارش کپی شد"); }
        catch (_) { showToast("کپی خودکار در این مرورگر در دسترس نیست"); }
      });
    }
  }
  function applyRestaurantConfig() {
    const setLink = (id, url, label, fallback) => {
      const el = $(id);
      if (url) { el.href = url; el.target = "_blank"; el.rel = "noopener noreferrer"; if (label) el.textContent = label; el.hidden = false; }
      else { el.removeAttribute("href"); el.hidden = Boolean(fallback === false); if (label) el.textContent = label; }
    };
    const digits = String(CONFIG.phoneNumber || "").replace(/\D/g, "");
    if (digits) { $("#footerPhone").href = `tel:${digits}`; $("#footerPhone").textContent = CONFIG.phoneNumber; }
    else { $("#footerPhone").removeAttribute("href"); $("#footerPhone").textContent = "شماره تماس تنظیم نشده"; }
    setLink("#footerInstagram", CONFIG.instagramUrl, null);
    const instagramLink = $("#footerInstagram");
    if (CONFIG.instagramUrl) {
      instagramLink.removeAttribute("aria-disabled");
      instagramLink.classList.remove("is-unconfigured");
    } else {
      instagramLink.setAttribute("aria-disabled", "true");
      instagramLink.classList.add("is-unconfigured");
    }
    setLink("#footerTelegram", CONFIG.telegramUrl, "تلگرام", false);
    const wa = String(CONFIG.whatsappNumber || "").replace(/\D/g, "");
    setLink("#footerWhatsApp", wa ? `https://wa.me/${wa}` : "", "واتساپ", false);
    if (CONFIG.address) $("#footerAddress").textContent = CONFIG.address;
    if (CONFIG.mapUrl) { $("#footerMap").href = CONFIG.mapUrl; $("#footerMap").hidden = false; }
    if (CONFIG.openingHours) { $("#footerHours").textContent = CONFIG.openingHours; $("#footerHours").hidden = false; }
    if (CONFIG.deliveryFee != null && (!Number.isFinite(Number(CONFIG.deliveryFee)) || Number(CONFIG.deliveryFee) < 0)) CONFIG.deliveryFee = null;
  }

  // Event delegation keeps buttons functional after each menu/search render.
  document.addEventListener("click", event => {
    const add = event.target.closest("[data-add-product]");
    if (add) { addProduct(add.dataset.addProduct); return; }
    const nav = event.target.closest("[data-category-target]");
    if (nav) {
      const target = nav.dataset.categoryTarget;
      if (target === "bestsellers") { $("#bestsellers").scrollIntoView({ behavior: "smooth", block: "start" }); }
      else { const section = $(`#category-${CSS.escape(target)}`); if (section) section.scrollIntoView({ behavior: "smooth", block: "start" }); }
      $$("#categoryNav .category-tab").forEach(tab => { const selected = tab === nav; tab.classList.toggle("active", selected); tab.setAttribute("aria-pressed", String(selected)); });
      return;
    }
    const qty = event.target.closest("[data-qty-change]");
    if (qty) { updateQuantity(qty.dataset.cartKey, Number(qty.dataset.qtyChange)); return; }
    const remove = event.target.closest("[data-remove-line]");
    if (remove) { removeLine(remove.dataset.removeLine); return; }
    const close = event.target.closest("[data-close-dialog]");
    if (close) { closeDialog(close.closest("dialog")); return; }
  });
  $("#openCart").addEventListener("click", openDrawer);
  $("#mobileCartOpen").addEventListener("click", openDrawer);
  $("#closeCart").addEventListener("click", closeDrawer);
  $("#drawerBackdrop").addEventListener("click", closeDrawer);
  $("#browseMenu").addEventListener("click", () => { closeDrawer(); $("#menu").scrollIntoView({ behavior: "smooth" }); });
  $("#goCheckout").addEventListener("click", openCheckout);
  $("#confirmCustomization").addEventListener("click", confirmCustomization);
  $("#customOptions").addEventListener("change", () => { $("#customPrice").textContent = money(calculateCustomizationPrice()); });
  $("#checkoutForm").addEventListener("submit", submitOrder);
  $$('input[name="fulfillment"]').forEach(input => input.addEventListener("change", updateAddressVisibility));
  $$('dialog').forEach(dialog => {
    dialog.addEventListener("close", () => { if (!$$("dialog[open]").length && !$("#cartDrawer").classList.contains("open")) document.body.classList.remove("dialog-open"); });
    dialog.addEventListener("click", event => { if (event.target === dialog) closeDialog(dialog); });
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && $("#cartDrawer").classList.contains("open")) closeDrawer();
  });
  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => { updateActiveCategory(); scrollTicking = false; });
  }, { passive: true });
  applyRestaurantConfig();
  renderBestSellers();
  renderCategoryNav();
  renderMenu();
  renderCart();
  updateAddressVisibility();
})();
