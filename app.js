/**
 * app.js — Karachi Foods Ordering Site Logic
 * Mapped to the specific DOM structure of index.html
 */
(function() {
    const config = window.KF_CONFIG;
    if (!config) {
        console.error("Missing window.KF_CONFIG");
        return;
    }

    // State
    let cart = {}; // { itemId: quantity }
    let userLocationStr = "";

    // Derived menu data
    const categories = [...new Set(config.menu.map(item => item.cat))];
    let currentCategory = categories[0];

    // DOM Elements
    const els = {
        menuGrid: document.getElementById('menu-grid'),
        catTabs: document.getElementById('cat-tabs'),
        cartItems: document.getElementById('cart-items'),
        cartSubtotal: document.getElementById('cart-subtotal'),
        cartFee: document.getElementById('cart-fee'),
        cartTotal: document.getElementById('cart-total'),
        sendOrderBtn: document.getElementById('send-order'),
        minOrderWarning: document.getElementById('min-order-warning'),
        cartFab: document.getElementById('cart-fab'),
        cartCount: document.getElementById('cart-count'),
        cartOverlay: document.getElementById('cart-overlay'),
        ticketWrap: document.getElementById('ticket-wrap'),
        closeCartBtn: document.getElementById('close-cart'),
        locateBtn: document.getElementById('locate-btn'),
        manualArea: document.getElementById('manual-area'),
        locateResult: document.getElementById('locate-result'),
        dineinFlag: document.getElementById('dinein-flag'),
        dineinBeacon: document.getElementById('dinein-beacon'),
        dineinText: document.getElementById('dinein-text'),
        orderNotes: document.getElementById('order-notes'),
        ticketLoc: document.getElementById('ticket-loc'),
        hero: document.querySelector('.hero'),
        signParallax: document.getElementById('sign-parallax')
    };

    function init() {
        renderTabs();
        renderGrid();
        checkStatus();
        
        // Auto-locate if no saved location, else load saved
        if (!safeStorageGet('kf_last_area')) {
            handleLocate(true);
        } else {
            loadStoredLocation();
        }
        
        bindEvents();
        initParallaxEffects();
        initScrollReveal();
        updateCart(); // initialize empty state
    }

    // 1. Menu Rendering
    function renderTabs() {
        els.catTabs.innerHTML = '';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `cat-tab ${cat === currentCategory ? 'active' : ''}`;
            btn.textContent = cat;
            btn.onclick = () => {
                document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = cat;
                renderGrid();
            };
            els.catTabs.appendChild(btn);
        });
    }

    function renderGrid() {
        els.menuGrid.innerHTML = '';
        const items = config.menu.filter(item => item.cat === currentCategory);
        
        items.forEach(item => {
            const qty = cart[item.id] || 0;
            const card = document.createElement('div');
            card.className = 'food-card';
            
            let btnHTML = '';
            if (qty > 0) {
                btnHTML = `
                    <div class="qty-controls">
                        <button class="minus-btn" data-id="${item.id}">-</button>
                        <span>${qty}</span>
                        <button class="plus-btn" data-id="${item.id}">+</button>
                    </div>
                `;
            } else {
                btnHTML = `<button class="add-btn" data-id="${item.id}">+ Add</button>`;
            }

            card.innerHTML = `
                <div class="food-tag">${item.tag}</div>
                <img src="${item.img}" alt="${item.name}" loading="lazy">
                <div class="food-name">${item.name}</div>
                ${item.desc ? `<div style="font-size:clamp(11px, 2.5vw, 13px); opacity:0.7; font-weight:700; margin-top:-4px; margin-bottom:8px;">${item.desc}</div>` : ''}
                <div class="qty-row" style="margin-top:auto;">
                    <div class="food-price">Rs ${item.price}</div>
                    ${btnHTML}
                </div>
            `;

            // 3D Tilt Effect
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                card.addEventListener('mousemove', (e) => {
                    const r = card.getBoundingClientRect();
                    const x = (e.clientX - r.left) / r.width - 0.5;
                    const y = (e.clientY - r.top) / r.height - 0.5;
                    card.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`;
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
                });
            }

            els.menuGrid.appendChild(card);
        });

        // Bind buttons
        els.menuGrid.querySelectorAll('.add-btn, .plus-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.getAttribute('data-id');
                cart[id] = (cart[id] || 0) + 1;
                renderGrid();
                updateCart();
                triggerTicketPunch();
            };
        });
        els.menuGrid.querySelectorAll('.minus-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.getAttribute('data-id');
                if (cart[id] > 1) {
                    cart[id]--;
                } else {
                    delete cart[id];
                }
                renderGrid();
                updateCart();
            };
        });
    }

    // 2. Cart & Ticket Logic
    function updateCart() {
        els.cartItems.innerHTML = '';
        let subtotal = 0;
        let count = 0;

        const cartKeys = Object.keys(cart);
        
        if (cartKeys.length === 0) {
            els.cartItems.innerHTML = '<div class="cart-empty">No items yet — add something from the menu.</div>';
            els.cartCount.textContent = '0';
        } else {
            cartKeys.forEach(id => {
                const item = config.menu.find(i => i.id === id);
                if (!item) return;
                const qty = cart[id];
                subtotal += item.price * qty;
                count += qty;

                const line = document.createElement('div');
                line.className = 'cart-line';
                line.innerHTML = `
                    <div>
                        <div class="name">${item.name}</div>
                        ${item.desc ? `<div style="font-size:11px; opacity:0.6; margin-top:2px; max-width:180px; line-height:1.2; font-weight:700;">${item.desc}</div>` : ''}
                        <div class="meta">Rs ${item.price}</div>
                    </div>
                    <div class="line-right">
                        <div style="font-weight:700;">Rs ${item.price * qty}</div>
                        <div class="mini-qty">
                            <button class="cart-minus" data-id="${id}">-</button>
                            <span>${qty}</span>
                            <button class="cart-plus" data-id="${id}">+</button>
                        </div>
                    </div>
                `;
                els.cartItems.appendChild(line);
            });
            els.cartCount.textContent = count;
        }

        // Rebind mini-qty buttons
        els.cartItems.querySelectorAll('.cart-plus').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.getAttribute('data-id');
                cart[id]++;
                renderGrid();
                updateCart();
            };
        });
        els.cartItems.querySelectorAll('.cart-minus').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.getAttribute('data-id');
                if (cart[id] > 1) cart[id]--; else delete cart[id];
                renderGrid();
                updateCart();
            };
        });

        const fee = subtotal > 0 ? config.deliveryFee : 0;
        const total = subtotal + fee;

        els.cartSubtotal.textContent = `Rs ${subtotal}`;
        els.cartFee.textContent = `Rs ${fee}`;
        els.cartTotal.textContent = `Rs ${total}`;

        if (subtotal > 0 && subtotal < config.minOrder) {
            els.sendOrderBtn.disabled = true;
            els.minOrderWarning.hidden = false;
            els.minOrderWarning.textContent = `Minimum order is Rs ${config.minOrder}. Add Rs ${config.minOrder - subtotal} more.`;
        } else if (subtotal === 0) {
            els.sendOrderBtn.disabled = true;
            els.minOrderWarning.hidden = true;
        } else {
            els.sendOrderBtn.disabled = false;
            els.minOrderWarning.hidden = true;
        }
        
        updateTicketLocationDisplay();
    }

    function triggerTicketPunch() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        els.ticketWrap.classList.remove('just-added');
        void els.ticketWrap.offsetWidth; // force reflow
        els.ticketWrap.classList.add('just-added');
    }

    // 3. Location & Geocoding
    function safeStorageSet(k, v) { try { localStorage.setItem(k, v); } catch(e){} }
    function safeStorageGet(k) { try { return localStorage.getItem(k); } catch(e){ return null; } }

    function loadStoredLocation() {
        const saved = safeStorageGet('kf_last_area');
        if (saved) {
            els.manualArea.value = saved;
            userLocationStr = saved;
            els.locateResult.className = 'ok';
            els.locateResult.textContent = "Using saved area.";
            updateTicketLocationDisplay();
        }
    }

    function updateTicketLocationDisplay() {
        const finalArea = els.manualArea.value.trim() || userLocationStr;
        if (finalArea) {
            els.ticketLoc.innerHTML = `📍 Delivering to: <strong>${finalArea}</strong>`;
        } else {
            els.ticketLoc.innerHTML = `📍 Location not checked yet — <a href="#locate" style="color:var(--maroon);">check delivery range</a>.`;
        }
    }

    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    }

    async function handleLocate(silent = false) {
        if (!silent) {
            els.locateResult.className = '';
            els.locateResult.textContent = "Checking location...";
        }
        
        if (!navigator.geolocation) {
            if (!silent) {
                els.locateResult.className = 'warn';
                els.locateResult.textContent = "GPS not supported. Please type your area.";
            }
            return;
        }

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude: lat, longitude: lng } = pos.coords;
            const dist = haversine(lat, lng, config.shop.lat, config.shop.lng);
            
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                const data = await res.json();
                const area = data.address.suburb || data.address.neighbourhood || data.address.road || "Unknown Area";
                
                userLocationStr = area;
                els.manualArea.value = area;
                safeStorageSet('kf_last_area', area);
                
                if (!silent) {
                    els.locateResult.className = 'ok';
                    els.locateResult.innerHTML = `Located near <strong>${area}</strong> (~${dist.toFixed(1)}km away).`;
                }
                updateTicketLocationDisplay();
            } catch (err) {
                userLocationStr = "GPS Location Used";
                if (!silent) {
                    els.locateResult.className = 'warn';
                    els.locateResult.textContent = `GPS found (~${dist.toFixed(1)}km away).`;
                }
                updateTicketLocationDisplay();
            }
        }, () => {
            if (!silent) {
                els.locateResult.className = 'warn';
                els.locateResult.textContent = "Could not get GPS. Please type your area.";
            }
        });
    }

    // 4. Send Order
    function sendOrder() {
        const finalArea = els.manualArea.value.trim() || userLocationStr || "Not provided";
        let msg = `*NEW ORDER - KARACHI FOODS*\n`;
        msg += `------------------------\n`;
        
        let subtotal = 0;
        Object.keys(cart).forEach(id => {
            const item = config.menu.find(i => i.id === id);
            const qty = cart[id];
            const lineTotal = item.price * qty;
            subtotal += lineTotal;
            msg += `${qty}x ${item.name} - Rs ${lineTotal}\n`;
            if (item.desc) {
                msg += `   (${item.desc})\n`;
            }
        });
        
        const total = subtotal + config.deliveryFee;
        msg += `------------------------\n`;
        msg += `Subtotal: Rs ${subtotal}\n`;
        msg += `Delivery: Rs ${config.deliveryFee}\n`;
        msg += `*TOTAL: Rs ${total}*\n`;
        msg += `------------------------\n`;
        msg += `*Deliver To:* ${finalArea}\n`;
        
        const notes = els.orderNotes.value.trim();
        if (notes) {
            msg += `*Notes:* ${notes}\n`;
        }
        
        msg += `\n_Please confirm my order and delivery time._`;
        
        const clicks = parseInt(safeStorageGet('kf_order_clicks') || '0', 10);
        safeStorageSet('kf_order_clicks', clicks + 1);

        const encodedMsg = encodeURIComponent(msg);
        window.open(`https://wa.me/${config.waNumber}?text=${encodedMsg}`, '_blank');
    }

    // 5. Status & Interactions
    function checkStatus() {
        const now = new Date();
        const hr = now.getHours();
        const isOpen = config.hours.dineInOpen === 0 && config.hours.dineInClose === 24 
            ? true 
            : (hr >= config.hours.dineInOpen && hr < config.hours.dineInClose);
        
        if (isOpen) {
            els.dineinText.textContent = "Open now";
            els.dineinFlag.classList.remove('closed');
            els.dineinBeacon.classList.remove('closed');
        } else {
            els.dineinText.textContent = "Closed now";
            els.dineinFlag.classList.add('closed');
            els.dineinBeacon.classList.add('closed');
        }
    }

    function initParallaxEffects() {
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const wantsMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (canHover && wantsMotion && els.hero && els.signParallax) {
            els.hero.addEventListener('mousemove', (e) => {
                const rect = els.hero.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cX = rect.width / 2;
                const cY = rect.height / 2;
                
                const rotX = ((y - cY) / cY) * -5;
                const rotY = ((x - cX) / cX) * 5;
                
                els.signParallax.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            });
            els.hero.addEventListener('mouseleave', () => {
                els.signParallax.style.transform = `rotateX(0deg) rotateY(0deg)`;
            });
        }
    }

    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    function bindEvents() {
        els.cartFab.onclick = () => {
            els.cartOverlay.classList.add('open');
            els.ticketWrap.classList.add('open');
        };
        const closeCart = () => {
            els.cartOverlay.classList.remove('open');
            els.ticketWrap.classList.remove('open');
        };
        els.closeCartBtn.onclick = closeCart;
        els.cartOverlay.onclick = closeCart;
        
        els.locateBtn.onclick = () => handleLocate(false);
        els.manualArea.oninput = (e) => {
            userLocationStr = e.target.value;
            safeStorageSet('kf_last_area', userLocationStr);
            updateTicketLocationDisplay();
        };
        
        els.sendOrderBtn.onclick = sendOrder;
    }

    init();
})();