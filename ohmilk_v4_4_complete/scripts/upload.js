document.getElementById("uploadForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  document.getElementById("status").textContent = "圖片傳送中，請稍候…";

  fetch("YOUR_GOOGLE_APPS_SCRIPT_URL", {
    method: "POST",
    body: formData
  })
    .then(res => res.text())
    .then(data => {
      document.getElementById("status").textContent = "圖片傳送完成，請等待我們聯繫您確認細節～";
    })
    .catch(err => {
      document.getElementById("status").textContent = "發生錯誤，請稍後再試！";
    });
});