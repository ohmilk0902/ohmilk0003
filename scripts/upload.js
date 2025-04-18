document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    try {
      const res = await fetch("https://script.google.com/macros/s/你的-ID/exec", {
        method: "POST",
        body: data,
      });

      const statusEl = document.getElementById("status");
      if (res.ok) {
        if (statusEl) statusEl.textContent = "✅ 圖片傳送完成！請等待我們聯繫您確認細節～";
        setTimeout(() => location.reload(), 5000);
      } else {
        if (statusEl) statusEl.textContent = "❌ 傳送失敗，請稍後重試";
      }
    } catch (err) {
      console.error("發送錯誤：", err);
      const statusEl = document.getElementById("status");
      if (statusEl) statusEl.textContent = "❌ 發送錯誤，請稍後重試";
    }
  });
});
