;(function () {
  if (window.__pulpoar_tryon_loaded__) return;
  window.__pulpoar_tryon_loaded__ = true;
console.log("initialized");
  if (!window.location.pathname.startsWith("/products/")) return;

  const cfg = document.getElementById("pulpoar-virtual-try-on-config");
console.log(cfg);  
  if (!cfg) return;

  const project  = cfg.dataset.project;
  const variants = JSON.parse(cfg.dataset.variants || "[]");
  console.log(project);  
  console.log(variants);  
  if (!project || variants.length === 0) {
    console.warn("PulpoAR: Missing config (project/variants).");
    return;
  }

  loadPulpoarSdk().then(initTryOn).catch((err) => {
    console.error("PulpoAR SDK failed to load:", err);
  });

  function initTryOn() {
    const btn = document.createElement("button");
    btn.id = "pulpoar-virtual-try-on-btn";
    btn.innerText = "Try Virtual On";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "24px",
      left: "24px",
      padding: "12px 20px",
      background: "#000000",
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      zIndex: 10000,
    });
    document.body.appendChild(btn);
    
    const popup = document.createElement("div");
    popup.id = "pulpoar-virtual-try-on-popup";
    Object.assign(popup.style, {
      position: "fixed",
      top: "50%",
      left: "24px",
      width: "360px",
      height: "70vh",
      transform: "translateY(-50%)",
      background: "#fff",
      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      borderRadius: "8px",
      display: "none",
      zIndex: 9999,
      overflow: "hidden",
      cursor: "move",
    });
    document.body.appendChild(popup);

    const iframe = document.createElement("iframe");
    iframe.allow = "camera *";
    Object.assign(iframe.style, {
      width: "100%",
      height: "100%",
      border: "none",
    });
    popup.appendChild(iframe);
    
    let currentSku = getSelectedSku();
    if (currentSku) window.pulpoar.applyVariants([currentSku]);

    function onVariantChange() {
      const newSku = getSelectedSku();     
      if (newSku) {
        const cfg = document.getElementById("pulpoar-virtual-try-on-config");
        cfg.setAttribute("data-sku", newSku);
        if (window.pulpoar?.applyVariants) {
          window.pulpoar.applyVariants([newSku]);
        }
      }
    } 
    
    const form = document.querySelector('form[action*="/cart/add"]');
    if (form) {
      form.addEventListener("change", onVariantChange);
    }

    const observer = new MutationObserver(onVariantChange);
    observer.observe(cfg, { attributes: true, attributeFilter: ["data-sku"] });

    btn.addEventListener("click", () => {
      const sku = getSelectedSku();
      if (!sku) return;
      if (popup.style.display === "none") {
        iframe.src = `https://plugin.pulpoar.com/vto/${project}`;
        popup.style.display = "block";
        btn.innerText = "Close";
      } else {
        popup.style.display = "none";
        btn.innerText = "Try Virtual On";
      }
      window.pulpoar.applyVariants([sku]);
    });

    let isDragging = false, startX, startY, origX, origY;
    popup.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = popup.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      document.body.style.userSelect = "none";
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      popup.style.left = `${origX + dx}px`;
      popup.style.top = `${origY + dy}px`;
      popup.style.transform = ""; 
    });
    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = "";
      }
    });
  }

  function getSelectedSku() {
    const form = document.querySelector('form[action*="/cart/add"]');
    if (!form) return null;
    const variantId = form.querySelector('[name="id"]').value;
    const variant = variants.find((v) => v.id.toString() === variantId.toString());
    return variant?.sku || null;
  }

  function loadPulpoarSdk() {
    return new Promise((resolve, reject) => {
      if (window.pulpoar?.applyVariants) return resolve();
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@pulpoar/plugin-sdk@latest/dist/index.iife.js";
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
})();
