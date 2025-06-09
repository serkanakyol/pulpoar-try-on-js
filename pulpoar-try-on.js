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


(function () {

  if (window.__pulpoar_tryon_loaded__) return;
  window.__pulpoar_tryon_loaded__ = true;

  if (!window.location.pathname.startsWith('/products/')) return;
  
  const sku =
    window.__PULPOAR_SKU__ ||
    document.querySelector('#pulpoar-sku')?.getAttribute('data-sku');

  if (!sku) {
    console.warn('PulpoAR Try-On: SKU bulunamadı.');
    return;
  }

  // PulpoAR SDK yüklü değilse yükle
  function loadSdk(callback) {
    if (window.pulpoar && window.pulpoar.applyVariants) {
      return callback();
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@pulpoar/plugin-sdk@latest/dist/index.iife.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  function showPopup() {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.zIndex = '9999';
    popup.style.width = '480px';
    popup.style.height = '720px';
    popup.style.background = '#fff';
    popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    popup.style.borderRadius = '8px';
    popup.innerHTML = `
      <iframe
        src="https://plugin.pulpoar.com/vto/vxcommerce-test?catalog=false"
        allow="camera *;"
        width="100%" height="100%" style="border:none;border-radius:8px;"></iframe>
      <button id="pulpoar-close-btn" style="
        position:absolute;top:10px;right:10px;background:#fff;border:none;font-size:18px;cursor:pointer;
      ">✕</button>
    `;
    document.body.appendChild(popup);

    document.getElementById('pulpoar-close-btn').addEventListener('click', () => {
      popup.remove();
    });

    // Variantları uygula
    window.pulpoar.applyVariants([sku]);
  }

  // Açma butonu oluştur
  function createButton() {
    const button = document.createElement('button');
    button.innerText = 'Try On';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#000';
    button.style.color = '#fff';
    button.style.cursor = 'pointer';

    button.addEventListener('click', showPopup);
    document.body.appendChild(button);
  }

  loadSdk(createButton);
})();

