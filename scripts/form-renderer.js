document.addEventListener("DOMContentLoaded", () => {
  const config = JSON.parse(document.getElementById("form-config").textContent);
  const productContainer = document.getElementById("productContainer");

  config.products.forEach(product => {
    const group = document.createElement("div");
    group.className = "product-group";
    const title = document.createElement("h3");
    title.textContent = product.title;
    const hint = document.createElement("p");
    hint.textContent = product.noteHint;
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = product.accept.join(",");
    input.dataset.maxUnits = product.maxUnits;
    group.appendChild(title);
    group.appendChild(hint);
    group.appendChild(input);
    productContainer.appendChild(group);
  });
});