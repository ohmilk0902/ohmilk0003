const form = document.getElementById('uploadForm');
const statusBox = document.getElementById('status');

form.addEventListener('submit', async e => {
  e.preventDefault();
  statusBox.textContent = '正在傳送中…請不要離開此頁面';

  const data = new FormData(form);

  try {
    const res = await fetch(
      'https://script.google.com/macros/s/AKfycbxGou2fWP9-uDi0n5EIwE-alJre6Y3NIHW8Xw_5d753X43-O6YeBvcd1zHwt9j75uYA/exec',
      { method: 'POST', body: data }
    );

    if (!res.ok) throw new Error('Network response was not ok');

    statusBox.textContent = '✅ 圖片傳送完成！請等待我們聯繫您確認細節～';
    setTimeout(() => {
      statusBox.textContent = '';
      form.reset();
      document.querySelectorAll('.file-info').forEach(n => (n.innerHTML = ''));
    }, 5000);
  } catch (err) {
    console.error(err);
    statusBox.textContent = '❌ 傳送失敗，請稍後再試';
  }
});