;(function () {
  if (window.__pulpoar_tryon_loaded__) return;
  window.__pulpoar_tryon_loaded__ = true;

  document.addEventListener("DOMContentLoaded", async () => {
    const cfg = document.getElementById("pulpoar-virtual-try-on-config");
    if (!cfg) return;
    const project  = cfg.dataset.project;
    const variants = JSON.parse(cfg.dataset.variants || "[]");
    console.log(variants);
    if (!project || variants.length === 0) return;
    
    await loadPulpoarSdk();

    const btn = document.createElement("button");
    
    btn.id = "pulpoar-tryon-btn";
    btn.innerText = "Try Virtual On";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      padding: "12px 20px",
      background: "#000",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      zIndex: 10000,
    });
    document.body.appendChild(btn);

    const popup = document.createElement("div");
    popup.id = "pulpoar-popup";
    Object.assign(popup.style, {
      position: "fixed",
      top: "50%",
      left: "0",
      width: "50vw",
      height: "70vh",
      transform: "translate(0, -50%)",
      background: "#fff",
      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      borderRadius: "8px",
      display: "none",
      zIndex: 9999,
      overflow: "auto",
      cursor: "move",
    });
    document.body.appendChild(popup);

    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, {
      width: "100%",
      height: "100%",
      border: "none",
    });
    popup.appendChild(iframe);

    let currentSku = getSelectedSku();
    if (currentSku) window.pulpoar.applyVariants([currentSku]);

    const form = document.querySelector('form[action*="/cart/add"]');
    if (form) form.addEventListener("change", onVariantChange);

    btn.addEventListener("click", () => {
      const sku = getSelectedSku();
      if (!sku) return;
      iframe.src = `https://plugin.pulpoar.com/vto/${project}?catalog=true`;
      const isOpen = popup.style.display === "block";
      popup.style.display = isOpen ? "none" : "block";
      btn.innerText = isOpen ? "Try Virtual On" : "Close";
      window.pulpoar.applyVariants([sku]);
    });

    makeDraggable(popup);
  });

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

  function getSelectedSku() {
    const form = document.querySelector('form[action*="/cart/add"]');
    if (!form) return null;
    const vid = form.querySelector('[name="id"]').value;
    const variant = JSON.parse(document.getElementById("pulpoar-virtual-try-on-config").dataset.variants || "[]").find(v => v.id.toString() === vid.toString());
    return variant?.sku || null;
  }

  function makeDraggable(el) {
    let dragging = false, startX, startY, origX, origY;
    el.addEventListener("mousedown", e => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      document.body.style.userSelect = "none";
    });
    document.addEventListener("mousemove", e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = `${origX + dx}px`;
      el.style.top  = `${origY + dy}px`;
      el.style.transform = "";
    });
    document.addEventListener("mouseup", () => {
      dragging = false;
      document.body.style.userSelect = "";
    });
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
