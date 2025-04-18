document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  const statusDiv = document.getElementById("status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // ❗️若你有動態產生圖片欄位、備註欄位，也需手動 append：
    // formData.append("image0_0", fileObject);
    // formData.append("note_0_0", "這是備註");

    try {
      const response = await fetch("https://script.google.com/macros/s/你的SCRIPT_ID/exec", {
        method: "POST",
        body: formData
      });

      const result = await response.text();
      console.log("伺服器回應：", result);
      statusDiv.textContent = "✅ 上傳成功";
    } catch (error) {
      console.error("❌ 發生錯誤：", error);
      statusDiv.textContent = "❌ 上傳失敗，請稍後再試";
    }
  });
});
