(function () {
  if (window.__pulpoar_tryon_loaded__) return;
  window.__pulpoar_tryon_loaded__ = true;

  let stream = null;

  // Try-On Başlat Butonu
  const startBtn = document.createElement('button');
  startBtn.innerText = '📷 Try-On Başlat';
  startBtn.style.position = 'fixed';
  startBtn.style.bottom = '20px';
  startBtn.style.right = '20px';
  startBtn.style.padding = '12px 16px';
  startBtn.style.backgroundColor = '#111827';
  startBtn.style.color = 'white';
  startBtn.style.border = 'none';
  startBtn.style.borderRadius = '8px';
  startBtn.style.fontSize = '16px';
  startBtn.style.cursor = 'pointer';
  startBtn.style.zIndex = 9999;

  // Try-On Kapat Butonu
  const stopBtn = document.createElement('button');
  stopBtn.innerText = '❌ Try-On Kapat';
  stopBtn.style.position = 'fixed';
  stopBtn.style.bottom = '20px';
  stopBtn.style.right = '20px';
  stopBtn.style.padding = '12px 16px';
  stopBtn.style.backgroundColor = '#991b1b';
  stopBtn.style.color = 'white';
  stopBtn.style.border = 'none';
  stopBtn.style.borderRadius = '8px';
  stopBtn.style.fontSize = '16px';
  stopBtn.style.cursor = 'pointer';
  stopBtn.style.zIndex = 9999;
  stopBtn.style.display = 'none';

  // Kamera açma
  startBtn.onclick = async () => {
    if (document.getElementById('pulpoar-video')) return;

    const video = document.createElement('video');
    video.id = 'pulpoar-video';
    video.autoplay = true;
    video.playsInline = true;
    video.style.position = 'fixed';
    video.style.bottom = '70px';
    video.style.right = '20px';
    video.style.width = '240px';
    video.style.height = 'auto';
    video.style.borderRadius = '12px';
    video.style.zIndex = 9999;
    video.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      document.body.appendChild(video);
      startBtn.style.display = 'none';
      stopBtn.style.display = 'block';
    } catch (e) {
      alert('Kamera erişimi reddedildi veya desteklenmiyor.');
    }
  };

  // Kamera kapama
  stopBtn.onclick = () => {
    const video = document.getElementById('pulpoar-video');
    if (video) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
      video.remove();
      startBtn.style.display = 'block';
      stopBtn.style.display = 'none';
    }
  };

  document.body.appendChild(startBtn);
  document.body.appendChild(stopBtn);
})();
