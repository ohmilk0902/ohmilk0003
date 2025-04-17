
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("productContainer");
  const addBtn = document.getElementById("addProduct");
  const rushRadio = document.querySelector('[value="rush"]');
  const rushDate = document.getElementById("rushDate");

  rushRadio.addEventListener("change", () => {
    rushDate.style.display = "inline";
  });

  let productIndex = 0;

  function createProductBlock(index) {
    const block = document.createElement("div");
    block.className = "product-block";

    const title = document.createElement("h3");
    title.textContent = `第 ${index + 1} 款商品種類`;
    block.appendChild(title);

    const select = document.createElement("select");
    select.name = `productType_${index}`;
    window.formConfig.products.forEach(p => {
      const option = document.createElement("option");
      option.value = p.name;
      option.textContent = p.name;
      select.appendChild(option);
    });
    block.appendChild(select);

    const imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.multiple = true;
    imageInput.accept = "image/*";
    imageInput.name = `images_${index}`;
    block.appendChild(imageInput);

    const previewArea = document.createElement("div");
    previewArea.className = "preview-area";
    block.appendChild(previewArea);

    imageInput.addEventListener("change", () => {
      previewArea.innerHTML = "";
      Array.from(imageInput.files).forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = e => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style = "width:100px;margin:4px;display:block;";
          previewArea.appendChild(img);

          const note = document.createElement("input");
          note.placeholder = "備註：這款做2個、不要去背...";
          note.name = `note_${index}_${idx}`;
          previewArea.appendChild(note);
        };
        reader.readAsDataURL(file);
      });
    });

    const workingDays = document.createElement("p");
    workingDays.className = "working-days-note";
    workingDays.textContent = "此商品一般件工作天為 5 天";
    block.appendChild(workingDays);

    container.appendChild(block);
  }

  addBtn.addEventListener("click", () => createProductBlock(productIndex++));
  createProductBlock(productIndex++);
});
