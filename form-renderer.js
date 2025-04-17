document.addEventListener("DOMContentLoaded", () => {
  const config = JSON.parse(document.getElementById("form-config").textContent);
  const formContainer = document.getElementById("formContainer");

  config.fields.forEach(field => {
    const section = document.createElement("section");
    const label = document.createElement("label");
    label.textContent = field.label;

    if (field.type === "radio") {
      field.options.forEach(opt => {
        const input = document.createElement("input");
        input.type = "radio";
        input.name = field.name;
        input.value = opt.value;
        if (field.required) input.required = true;
        section.appendChild(input);
        section.appendChild(document.createTextNode(opt.label));
      });
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.name = field.name;
      input.placeholder = field.label;
      if (field.required) input.required = true;
      section.appendChild(label);
      section.appendChild(input);
    }

    formContainer.appendChild(section);
  });
});