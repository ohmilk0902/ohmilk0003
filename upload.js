
document.getElementById("uploadForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData();
  const form = e.target;

  formData.append("email", form.email.value);
  formData.append("contact", form.contact.value);
  formData.append("orderId", form.orderId.value);
  formData.append("urgency", form.urgency.value);
  formData.append("rushDate", form.rushDate.value);

  const productBlocks = document.querySelectorAll(".product-block");

  productBlocks.forEach((block, i) => {
    const productType = block.querySelector("select").value;
    formData.append(`productType_${i}`, productType);

    const fileInput = block.querySelector("input[type='file']");
    const files = fileInput.files;

    const noteInputs = block.querySelectorAll("input[placeholder^='備註']");
    Array.from(files).forEach((file, j) => {
      formData.append(`image${i}_${j}`, file);
      const note = noteInputs[j]?.value || "";
      formData.append(`note_${i}_${j}`, note);
    });
  });

  document.getElementById("status").innerText = "📤 上傳中，請稍候...";

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycby6YQYgZiDuPxIPkJ_yxiVp718nkA-mtzbWbkei8tEfJHSijIWuq7_MHEWjZmjQFOpd/exec", {
      method: "POST",
      body: formData
    });

    const result = await res.json();
    if (result.status === "success") {
      document.getElementById("status").innerText = "✅ 傳送成功，感謝您！";
    } else {
      document.getElementById("status").innerText = "❌ 發生錯誤：" + result.message;
    }
  } catch (err) {
    document.getElementById("status").innerText = "❌ 上傳失敗：" + err.message;
  }
});
