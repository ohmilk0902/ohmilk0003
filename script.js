const appScriptUrl = 'https://script.google.com/macros/s/AKfycbwZhz40mrktX0DDZZhmtxPbDxutMMJnObYNm9bG8GJGBDi_VKl8c9w24gAy-U8UiBhPhg/exec';

document.getElementById('addProductBtn').addEventListener('click', addProduct);
document.getElementById('uploadForm').addEventListener('submit', handleSubmit);
const productArea = document.getElementById('productArea');
let productCount = 0;

function addProduct() {
  productCount++;
  const block = document.createElement('div');
  block.className = 'product-block';
  block.id = `product-${productCount}`;
  block.innerHTML = `
    <label>第 ${productCount} 款商品種類</label>
    <select name="productType">
      <option value="">請選擇</option>
      <option value="badge">客製化徽章</option>
      <option value="film">底片鑰匙圈</option>
      <option value="keychain">壓克力吊飾</option>
    </select>
    <label>上傳圖片（最多 60 張）</label>
    <input type="file" name="images" multiple accept="image/*,.ai,.pdf,.psd"/>
    <div class="image-preview" id="preview-${productCount}"></div>
  `;
  productArea.appendChild(block);
  block.querySelector('input[type=file]').addEventListener('change', (e) => previewImages(e, productCount));
}

function previewImages(event, id) {
  const files = event.target.files;
  const preview = document.getElementById(`preview-${id}`);
  preview.innerHTML = '';
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const div = document.createElement('div');
      div.className = 'image-block';
      div.innerHTML = `<img src="${e.target.result}" alt="Preview"/><textarea name="note"></textarea><button class="remove-btn" onclick="removeImage(this)">×</button>`;
      preview.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

function removeImage(btn) {
  btn.parentElement.remove();
}

function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('uploadForm');
  const data = new FormData(form);
  // Collect images and notes
  const images = [];
  const filenames = [];
  const types = [];
  document.querySelectorAll('.image-block img').forEach(img => {
    const blob = data.get(img.closest('.image-block').previousElementSibling.name);
    images.push(blob);
    filenames.push(blob.name);
    types.push(blob.type);
  });
  // Prepare payload
  const payload = {
    // Map form data
  };
  alert('目前僅模擬提交，正式版會上傳至Drive');
}

