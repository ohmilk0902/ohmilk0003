// 讀取 JSON 配置
const config = JSON.parse(document.getElementById('form-config').textContent);

function createField(field, container, idx) {
  const id = idx != null ? `${field.name}_${idx}` : field.name;
  const wrapper = document.createElement('div');
  wrapper.className = 'form-field';

  // Label
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = field.label;
  wrapper.appendChild(label);

  let input;
  switch (field.type) {
    case 'text':
    case 'email':
    case 'date':
      input = document.createElement('input');
      input.type = field.type;
      input.id = id;
      input.name = field.name;
      if (field.placeholder) input.placeholder = field.placeholder;
      if (field.required)  input.required = true;
      break;

    case 'textarea':
      input = document.createElement('textarea');
      input.id = id;
      input.name = field.name;
      if (field.placeholder) input.placeholder = field.placeholder;
      break;

    case 'radio':
      input = document.createElement('div');
      field.options.forEach(opt => {
        const rlbl = document.createElement('label');
        rlbl.innerHTML = `<input type="radio" name="${field.name}" value="${opt.value}"> ${opt.label}`;
        input.appendChild(rlbl);
      });
      break;

    case 'select':
      input = document.createElement('select');
      input.id = id;
      input.name = field.name;
      const opts = Array.isArray(config[field.optionsSource]) ?
        config[field.optionsSource] : field.options;
      opts.forEach(o => {
        const optEl = document.createElement('option');
        if (typeof o === 'string') {
          optEl.value = optEl.textContent = o;
        } else {
          optEl.value = o.value;
          optEl.textContent = o.label;
        }
        input.appendChild(optEl);
      });
      break;

    case 'file':
      input = document.createElement('input');
      input.type = 'file';
      input.id = id;
      input.name = field.name;
      input.multiple = field.maxCount > 1;
      input.accept = field.accept.join(',');
      break;
  }

  wrapper.appendChild(input);

  // File preview & numbering
  if (field.type === 'file' && field.preview) {
    const info = document.createElement('div');
    info.className = 'file-info';
    wrapper.appendChild(info);

    input.addEventListener('change', e => {
      info.innerHTML = '';
      Array.from(e.target.files).forEach((f, i) => {
        const p = document.createElement('p');
        p.textContent = `第${i+1}張：${f.name}`;
        info.appendChild(p);
      });
    });
  }

  container.appendChild(wrapper);
}

function renderForm(form, cfg) {
  form.innerHTML = '';

  // 先渲染通用欄位
  cfg.fields.forEach(field => createField(field, form));

  // 商品區
  const prodContainer = document.createElement('div');
  prodContainer.id = 'productContainer';
  form.appendChild(prodContainer);

  // 新增商品按鈕
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn-add';
  addBtn.textContent = '+ 新增一款商品';
  form.appendChild(addBtn);

  // 送出按鈕
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = '送出表單';
  form.appendChild(submit);

  let idx = 0;
  addBtn.addEventListener('click', () => {
    idx++;
    const sec = document.createElement('section');
    sec.innerHTML = `<h2>第 ${idx} 款商品</h2>`;
    cfg.product.fields.forEach(f => createField(f, sec, idx));
    prodContainer.appendChild(sec);
  });

  // 頁面載入時先新增第一組
  addBtn.click();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  renderForm(form, config);
});