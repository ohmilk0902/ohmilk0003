document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("config/form-config.json");
    const config = await response.json();

    const formContainer = document.getElementById("formContainer");
    if (!formContainer) {
      console.warn("找不到 formContainer 容器");
      return;
    }

    config.fields.forEach((field) => {
      const fieldElement = createField(field);
      formContainer.appendChild(fieldElement);
    });
  } catch (error) {
    console.error("讀取表單配置失敗：", error);
  }
});

function createField(field) {
  const section = document.createElement("section");
  section.classList.add("form-section");

  const label = document.createElement("label");
  label.textContent = field.label;

  // 處理標準欄位
  if (["text", "email"].includes(field.type)) {
    const input = document.createElement("input");
    input.type = field.type;
    input.name = field.name;
    input.required = !!field.required;
    if (field.placeholder) input.placeholder = field.placeholder;

    section.appendChild(label);
    section.appendChild(input);
    return section;
  }

  // 處理 product 自訂欄位（你 v4.5 的重點）
  if (field.type === "product") {
    const title = document.createElement("h3");
    title.textContent = field.label;
    title.style.marginBottom = "6px";

    const note = document.createElement("p");
    note.innerHTML = `${field.note} <a href="${field.link}" target="_blank" style="color:blue;">點我加LINE</a>`;

    const select = document.createElement("select");
    select.name = field.name;
    select.required = !!field.required;

    field.options.forEach((optionText) => {
      const opt = document.createElement("option");
      opt.value = optionText;
      opt.textContent = optionText;
      select.appendChild(opt);
    });

    section.appendChild(title);
    section.appendChild(note);
    section.appendChild(select);
    return section;
  }

  // 若類型未處理，提示警告
  const warning = document.createElement("p");
  warning.textContent = `⚠️ 尚未支援的欄位類型：${field.type}`;
  section.appendChild(warning);
  return section;
}
