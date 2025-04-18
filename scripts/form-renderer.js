document.addEventListener('DOMContentLoaded', async () => {
  let config;
  try {
    const resp = await fetch('config/form-config.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    config = await resp.json();
  } catch (e) {
    console.error('載入表單配置失敗：', e);
    document.getElementById('status').textContent = '表單載入失敗，請稍後重試';
    return;
  }

  const formContainer = document.getElementById('formContainer');
  const productContainer = document.getElementById('productContainer');

  // 建立一般欄位
  config.fields.forEach((field, i) => {
    if (field.type !== 'product') {
      createField(field, formContainer, null);
    }
  });

  // 新增第一個商品區塊
  addProductBlock();

  // 綁「新增商品」按鈕
  document.getElementById('uploadForm').addEventListener('click', e => {
    if (e.target.id === 'addProduct') {
      e.preventDefault();
      addProductBlock();
    }
  });

  function addProductBlock() {
    const idx = productContainer.children.length + 1;
    const wrapper = document.createElement('section');
    wrapper.className = 'product-block';
    wrapper.innerHTML = `
      <h3>第 ${idx} 款商品</h3>
      <button id="addProduct" type="button">+ 新增一款商品</button>
    `;
    productContainer.appendChild(wrapper);
    // render each product field under wrapper
    config.fields.filter(f => f.type === 'product').forEach(f =>
      createField(f, wrapper, idx)
    );
  }

  // createField 逻辑（略，可用你原本的，每个 field.type case 下做 input/dropzone）
});
