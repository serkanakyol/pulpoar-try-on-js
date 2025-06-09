(function () {
    if (window.__pulpoar_tryon_loaded__) return;
    window.__pulpoar_tryon_loaded__ = true;

    if (!window.location.pathname.startsWith('/products/')) return;

    const cfg = document.getElementById("pulpoar-virtual-try-on-config");
    if (!cfg) return;

    const project = cfg.getAttribute("data-project");
    const sku = cfg.getAttribute("data-sku");

    if (!project || !sku) {
      console.warn("PulpoAR: config eksik (project/sku).");
      return;
    }

    const btn = document.createElement("button");
    btn.id = "pulpoar-virtual-try-on-btn";
    btn.innerText = "Try Virtual On";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      padding: "12px 20px",
      background: "#007aff",
      color: "#fff",
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
      left: "0",
      width: "50vw", 
      height: "70vh",
      transform: "translate(-50%, -50%)",
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
    iframe.src = `https://plugin.pulpoar.com/vto/${project}?catalog=false`;
    iframe.allow = "camera *";
    Object.assign(iframe.style, {
      width: "100%",
      height: "100%",
      border: "none",
    });
    popup.appendChild(iframe);

    const sdkScript = document.createElement("script");
    sdkScript.src = "https://cdn.jsdelivr.net/npm/@pulpoar/plugin-sdk@latest/dist/index.iife.js";
    sdkScript.onload = () => {
      if (window.pulpoar && typeof window.pulpoar.applyVariants === "function") {
        window.pulpoar.applyVariants([slug]);
      } else {
        console.error("PulpoAR SDK yüklenemedi.");
      }
    };
    document.body.appendChild(sdkScript);

    btn.addEventListener("click", () => {
      popup.style.display = popup.style.display === "none" ? "block" : "none";
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
      popup.style.left = `${origX + dx + popup.offsetWidth/2}px`;
      popup.style.top = `${origY + dy + popup.offsetHeight/2}px`;
      popup.style.transform = ""; // reset transform
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = "";
      }
    });
();
