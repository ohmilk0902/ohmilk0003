document.getElementById("uploadForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  document.getElementById("status").textContent = "圖片傳送中，請稍候…";

  fetch("https://script.google.com/macros/s/AKfycby6YQYgZiDuPxIPkJ_yxiVp718nkA-mtzbWbkei8tEfJHSijIWuq7_MHEWjZmjQFOpd/exec", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("status").textContent = "圖片傳送完成，請等待我們聯繫您確認細節～";
    setTimeout(() => {
      // clear only files, keep other inputs
      document.getElementById("productContainer").innerHTML = "";
      window.location.reload();
    }, 5000);
  })
  .catch(err => {
    document.getElementById("status").textContent = "發生錯誤，請稍後再試！";
  });
});