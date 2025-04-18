document.getElementById('uploadForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  // TODO: 这里你把 FormData 发到 Apps Script Web App
  const res = await fetch('你的 GAS WebApp URL', {
    method: 'POST',
    body: data
  });
  if (res.ok) {
    document.getElementById('status').textContent =
      '圖片傳送完成！請等待我們聯繫您確認細節～';
    setTimeout(() => location.reload(), 5000);
  } else {
    document.getElementById('status').textContent =
      '傳送失敗，請稍後重試';
  }
});
