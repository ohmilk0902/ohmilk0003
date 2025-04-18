document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("config/form-config.json");
    const config = await response.json();

    const formContainer = document.getElementById("formContainer");

    config.fields.forEach((field) => {
      const fieldElement = createField(field);
      formContainer.appendChild(fieldElement);
    });
  } catch (error) {
    console.error("無法載入表單配置：", error);
  }
});

// ✅ 建立欄位 DOM 元素
function createField(field) {
  const section = document.createElement("section");
  section.classList.add("form-section");

  const label = document.createElement("label");
  label.textContent = field.label;

  if (field.type === "radio") {
    const group = document.createElement("div");
    group.classList.add("radio-group");

    field.options.forEach(opt => {
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = field.name;
      radio.value = opt.value;
      if (field.required) radio.required = true;

      const radioLabel = document.createElement("span");
      radioLabel.textContent = opt.label;

      const wrapper = document.createElement("label");
      wrapper.appendChild(radio);
      wrapper.appendChild(radioLabel);

      group.appendChild(wrapper);
    });

    section.appendChild(label);
    section.appendChild(group);
  } else {
    const input = document.createElement("input");
    input.type = field.type || "text";
    input.name = field.name;
    if (field.required) input.required = true;
    input.placeholder = field.placeholder || "";

    section.appendChild(label);
    section.appendChild(input);
  }

  return section;
}
