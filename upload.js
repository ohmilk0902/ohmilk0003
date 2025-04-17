
document.getElementById('uploadForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', document.querySelector('[name="name"]').value);
  formData.append('contact', document.querySelector('[name="contact"]').value);
  formData.append('email', document.querySelector('[name="email"]').value);
  formData.append('orderId', document.querySelector('[name="orderId"]').value);
  formData.append('note', document.querySelector('[name="note"]').value);
  const files = document.getElementById('fileInput').files;
  for (let i = 0; i < files.length; i++) {
    formData.append('image' + (i + 1), files[i]);
    formData.append('image' + (i + 1) + '_name', files[i].name);
    formData.append('image' + (i + 1) + '_type', files[i].type);
  }
  document.getElementById('status').innerText = '📤 傳送中...';
  fetch('https://script.google.com/macros/s/AKfycbxGou2fWP9-uDi0n5EIwE-alJre6Y3NIHW8Xw_5d753X43-O6YeBvcd1zHwt9j75uYA/exec', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      document.getElementById('status').innerText = '✅ 傳送完成！請等待我們聯繫您～';
    } else {
      document.getElementById('status').innerText = '❌ 發生錯誤：' + data.message;
    }
  })
  .catch(err => {
    document.getElementById('status').innerText = '❌ 網路錯誤：' + err;
  });
});
