(function () {
  if (window.__pulpoar_tryon_loaded__) return;
  window.__pulpoar_tryon_loaded__ = true;

  if (!window.location.pathname.startsWith('/products/')) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    console.warn("PulpoAR Try-On: 'slug' parametresi eksik.");
    return;
  }

  // CSS popup container
  const style = document.createElement("style");
  style.textContent = `
    #pulpoar-popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    #pulpoar-popup-iframe {
      border: none;
      width: 480px;
      height: 720px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    #pulpoar-popup-close {
      position: absolute;
      top: 16px;
      right: 20px;
      background: white;
      border: none;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      z-index: 10000;
    }
  `;
    document.head.appendChild(style);
  
    // HTML popup oluştur
    const overlay = document.createElement("div");
    overlay.id = "pulpoar-popup-overlay";
  
    const closeButton = document.createElement("button");
    closeButton.id = "pulpoar-popup-close";
    closeButton.textContent = "×";
    closeButton.onclick = () => document.body.removeChild(overlay);
  
    const iframe = document.createElement("iframe");
    iframe.id = "pulpoar-popup-iframe";
    iframe.src = `https://plugin.pulpoar.com/vto/vxcommerce-test?catalog=false`;
    iframe.allow = "camera *";
  
    overlay.appendChild(closeButton);
    overlay.appendChild(iframe);
    document.body.appendChild(overlay);
  
    // PulpoAR SDK yükle
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
  })
();

