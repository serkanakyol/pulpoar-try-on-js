(function () {
  // Zaten eklenmişse tekrar ekleme
  if (window.__pulpoar_tryon_loaded__) return;
  window.__pulpoar_tryon_loaded__ = true;

  // Kamera açma butonu oluştur
  const button = document.createElement('button');
  button.innerText = '📷 Try-On Başlat';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.padding = '12px 16px';
  button.style.backgroundColor = '#111827';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '8px';
  button.style.fontSize = '16px';
  button.style.cursor = 'pointer';
  button.style.zIndex = 9999;

  // Tıklanınca kamera aç
  button.onclick = async () => {
    if (document.getElementById('pulpoar-video')) return;

    const video = document.createElement('video');
    video.id = 'pulpoar-video';
    video.autoplay = true;
    video.style.position = 'fixed';
    video.style.bottom = '70px';
    video.style.right = '20px';
    video.style.width = '240px';
    video.style.height = 'auto';
    video.style.borderRadius = '12px';
    video.style.zIndex = 9999;
    video.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      document.body.appendChild(video);
    } catch (e) {
      alert('Kamera erişimi reddedildi veya desteklenmiyor.');
    }
  };

  document.body.appendChild(button);
})();
