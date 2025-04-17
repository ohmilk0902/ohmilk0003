document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  const statusMessage = document.getElementById('statusMessage');
  const submitBtn = document.getElementById('submitBtn');
  const addProductBtn = document.getElementById('addProductBtn');
  const productContainer = document.getElementById('productGroupsContainer');
  let formConfig = null;
  let productGroups = [];
  let productDoubleFrameMap = {};

  // 載入 JSON 配置並初始化表單
  fetch('form-config.json')
    .then(res => res.json())
    .then(config => {
      formConfig = config;
      // 建立商品 doubleFrame 對照表（標記需橫式提示的商品類型）
      config.products.forEach(prod => {
        productDoubleFrameMap[prod.value] = prod.doubleFrame ? true : false;
      });
      buildStaticFields(config.formFields);
      // 初始載入時新增一組商品上傳模組
      addProductGroup();
    })
    .catch(err => {
      console.error('配置文件載入錯誤: ', err);
      alert('表單配置載入失敗，請稍後重試');
    });

  function buildStaticFields(fields) {
    const staticFieldsDiv = document.getElementById('staticFields');
    fields.forEach(field => {
      if (field.type === 'radio') {
        // 商品製作時效（一般件/急件）單選欄位
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'field-group';
        fieldGroup.innerHTML = '<label>' + field.label + '</label>';
        const optsDiv = document.createElement('div');
        optsDiv.className = 'timing-options';
        field.options.forEach(opt => {
          const radioId = 'field_' + field.name + '_' + opt.value;
          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = field.name;
          radio.id = radioId;
          radio.value = opt.value;
          if (field.required) radio.required = true;
          optsDiv.appendChild(radio);
          const radioLabel = document.createElement('label');
          radioLabel.htmlFor = radioId;
          radioLabel.textContent = opt.label;
          optsDiv.appendChild(radioLabel);
        });
        // 急件日期輸入欄（初始隱藏）
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.name = 'urgentDate';
        dateInput.id = 'urgentDate';
        dateInput.style.display = 'none';
        optsDiv.appendChild(dateInput);
        fieldGroup.appendChild(optsDiv);
        staticFieldsDiv.appendChild(fieldGroup);
        // 切換急件選項時顯示/隱藏日期欄位
        const radios = staticFieldsDiv.querySelectorAll('input[name=' + field.name + ']');
        radios.forEach(radio => {
          radio.addEventListener('change', () => {
            if (radio.value === 'urgent') {
              dateInput.style.display = 'inline-block';
              dateInput.required = true;
              if (field.urgentLabel) {
                dateInput.placeholder = field.urgentLabel;
              }
            } else {
              dateInput.style.display = 'none';
              dateInput.required = false;
              dateInput.value = '';
            }
          });
        });
      } else {
        // 其他一般文字/文字區域欄位
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'field-group';
        if (['name','contact','email','shopee'].includes(field.name)) {
          fieldGroup.classList.add('small');  /* 某些欄位佔用小欄寬，並排顯示 */
        }
        const label = document.createElement('label');
        label.textContent = field.label;
        label.htmlFor = 'field_' + field.name;
        fieldGroup.appendChild(label);
        let inputElem;
        if (field.type === 'textarea') {
          inputElem = document.createElement('textarea');
        } else {
          inputElem = document.createElement('input');
          inputElem.type = field.type || 'text';
        }
        inputElem.name = field.name;
        inputElem.id = 'field_' + field.name;
        if (field.required) inputElem.required = true;
        if (field.note) {
          inputElem.placeholder = field.note;
        }
        fieldGroup.appendChild(inputElem);
        staticFieldsDiv.appendChild(fieldGroup);
      }
    });
  }

  function addProductGroup() {
    const groupIndex = productGroups.length;
    productGroups.push({ files: [], product: '' });
    const groupElem = document.createElement('div');
    groupElem.className = 'product-group';
    // 商品類型下拉選單 + 移除按鈕
    const headerDiv = document.createElement('div');
    headerDiv.className = 'group-header';
    const label = document.createElement('label');
    label.textContent = '商品：';
    headerDiv.appendChild(label);
    const select = document.createElement('select');
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = '請選擇商品類型';
    select.appendChild(placeholderOption);
    formConfig.products.forEach(prod => {
      const opt = document.createElement('option');
      opt.value = prod.value;
      opt.textContent = prod.label;
      select.appendChild(opt);
    });
    headerDiv.appendChild(select);
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '✕';
    removeBtn.className = 'remove-group-btn';
    removeBtn.title = '移除此商品項目';
    if (productGroups.length <= 1) {
      removeBtn.style.display = 'none';
    }
    headerDiv.appendChild(removeBtn);
    groupElem.appendChild(headerDiv);
    // 上傳區域（拖曳 & 點擊）
    const uploadArea = document.createElement('div');
    uploadArea.className = 'upload-area';
    const placeholder = document.createElement('span');
    placeholder.className = 'placeholder';
    placeholder.textContent = '點擊或將圖片拖曳到此處上傳（每組最多 60 張）';
    uploadArea.appendChild(placeholder);
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*';
    fileInput.className = 'file-input';
    fileInput.style.display = 'none';
    uploadArea.appendChild(fileInput);
    const previewList = document.createElement('div');
    previewList.className = 'preview-list';
    uploadArea.appendChild(previewList);
    groupElem.appendChild(uploadArea);
    productContainer.insertBefore(groupElem, addProductBtn);
    // 若超過一組商品，顯示所有組的移除按鈕
    if (productGroups.length > 1) {
      const allGroupElems = productContainer.querySelectorAll('.product-group');
      allGroupElems.forEach(elem => {
        const btn = elem.querySelector('.remove-group-btn');
        if (btn) btn.style.display = 'inline';
      });
    }
    // 監聽商品類型選擇變化
    select.addEventListener('change', () => {
      productGroups[groupIndex].product = select.value;
      const isDoubleFrame = !!productDoubleFrameMap[select.value];
      const imageItems = groupElem.querySelectorAll('.image-item');
      imageItems.forEach((item, idx) => {
        const fileObj = productGroups[groupIndex].files[idx];
        if (!fileObj) return;
        let isLandscape = fileObj.originalLandscape;
        if (fileObj.rotate % 180 !== 0) {
          isLandscape = !isLandscape;
        }
        if (isDoubleFrame && isLandscape) {
          item.classList.add('film-landscape');
        } else {
          item.classList.remove('film-landscape');
        }
      });
    });
    // 移除商品組按鈕
    removeBtn.addEventListener('click', () => {
      const allGroups = productContainer.querySelectorAll('.product-group');
      const gIndex = Array.prototype.indexOf.call(allGroups, groupElem);
      if (gIndex === -1) return;
      if (allGroups.length <= 1) return;
      productGroups.splice(gIndex, 1);
      productContainer.removeChild(groupElem);
      // 若移除後僅剩一組，隱藏剩餘組的移除按鈕
      const remainingGroups = productContainer.querySelectorAll('.product-group');
      if (remainingGroups.length === 1) {
        const btn = remainingGroups[0].querySelector('.remove-group-btn');
        if (btn) btn.style.display = 'none';
      }
    });
    // 點擊上傳區域 -> 觸發檔案選取對話框
    uploadArea.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('image-remark')) {
        return;
      }
      fileInput.click();
    });
    // 拖曳事件
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('hover');
      e.dataTransfer.dropEffect = 'copy';
    });
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('hover');
    });
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('hover');
      const dtFiles = e.dataTransfer.files;
      if (dtFiles && dtFiles.length) {
        handleFiles(groupElem, dtFiles);
      }
    });
    // 檔案選取改變事件
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length) {
        handleFiles(groupElem, e.target.files);
      }
      e.target.value = '';
    });
  }

  function handleFiles(groupElem, files) {
    const groupIndex = Array.prototype.indexOf.call(productContainer.querySelectorAll('.product-group'), groupElem);
    if (groupIndex === -1) return;
    const groupData = productGroups[groupIndex];
    const max = formConfig.maxImagesPerProduct || 60;
    let currentCount = groupData.files.length;
    const totalSelected = files.length;
    let allowedCount = max - currentCount;
    if (allowedCount <= 0) {
      alert('此商品項目已達上傳上限（' + max + ' 張）');
      return;
    }
    if (totalSelected > allowedCount) {
      alert('最多只能上傳 ' + max + ' 張圖片，已忽略多餘的檔案。');
    }
    const toProcessCount = Math.min(totalSelected, allowedCount);
    let nonImageCount = 0;
    for (let i = 0; i < toProcessCount; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) {
        nonImageCount++;
        continue;
      }
      const fileObj = { file: file, rotate: 0, originalLandscape: false };
      groupData.files.push(fileObj);
      // 建立圖片預覽元素
      const imageItem = document.createElement('div');
      imageItem.className = 'image-item';
      const thumbContainer = document.createElement('div');
      thumbContainer.className = 'thumb-container';
      const img = document.createElement('img');
      img.alt = '';
      thumbContainer.appendChild(img);
      const numBadge = document.createElement('span');
      numBadge.className = 'img-number';
      thumbContainer.appendChild(numBadge);
      const rotateBtn = document.createElement('button');
      rotateBtn.type = 'button';
      rotateBtn.className = 'rotate-btn';
      rotateBtn.innerHTML = '&#x21bb;';  // ↻ 符號
      thumbContainer.appendChild(rotateBtn);
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '✕';
      thumbContainer.appendChild(removeBtn);
      const tip = document.createElement('div');
      tip.className = 'double-frame-tip';
      tip.textContent = '橫式將佔兩格';
      thumbContainer.appendChild(tip);
      imageItem.appendChild(thumbContainer);
      const remarkArea = document.createElement('textarea');
      remarkArea.className = 'image-remark';
      remarkArea.placeholder = '備註';
      imageItem.appendChild(remarkArea);
      const previewList = groupElem.querySelector('.preview-list');
      previewList.appendChild(imageItem);
      // 綁定旋轉按鈕事件
      rotateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const gElems = productContainer.querySelectorAll('.product-group');
        const gIndex = Array.prototype.indexOf.call(gElems, groupElem);
        const imgIndex = Array.prototype.indexOf.call(groupElem.querySelectorAll('.image-item'), imageItem);
        const fileData = productGroups[gIndex].files[imgIndex];
        fileData.rotate = (fileData.rotate + 90) % 360;
        img.style.transform = 'rotate(' + fileData.rotate + 'deg)';
        let isLandscape = fileData.originalLandscape;
        if (fileData.rotate % 180 !== 0) {
          isLandscape = !isLandscape;
        }
        const isDoubleFrame = !!productDoubleFrameMap[productGroups[gIndex].product];
        if (isDoubleFrame && isLandscape) {
          imageItem.classList.add('film-landscape');
        } else {
          imageItem.classList.remove('film-landscape');
        }
      });
      // 綁定刪除按鈕事件
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const gElems = productContainer.querySelectorAll('.product-group');
        const gIndex = Array.prototype.indexOf.call(gElems, groupElem);
        const imgIndex = Array.prototype.indexOf.call(groupElem.querySelectorAll('.image-item'), imageItem);
        productGroups[gIndex].files.splice(imgIndex, 1);
        imageItem.parentNode.removeChild(imageItem);
        updateImageNumbers(gIndex);
        if (productGroups[gIndex].files.length === 0) {
          const uploadArea = groupElem.querySelector('.upload-area');
          uploadArea.classList.remove('has-files');
        }
      });
      // 載入影像預覽並檢測原始橫豎比例
      const objectURL = URL.createObjectURL(file);
      img.onload = () => {
        fileObj.originalLandscape = img.naturalWidth > img.naturalHeight;
        const isDoubleFrame = !!productDoubleFrameMap[groupElem.querySelector('select').value];
        if (isDoubleFrame && fileObj.originalLandscape) {
          imageItem.classList.add('film-landscape');
        }
        URL.revokeObjectURL(objectURL);
      };
      img.src = objectURL;
    }
    if (nonImageCount > 0) {
      alert(nonImageCount + ' 個檔案非圖片格式，已被跳過。');
    }
    updateImageNumbers(groupIndex);
    if (groupData.files.length > 0) {
      const uploadArea = groupElem.querySelector('.upload-area');
      uploadArea.classList.add('has-files');
    }
  }

  function updateImageNumbers(groupIndex) {
    const groupElem = productContainer.querySelectorAll('.product-group')[groupIndex];
    if (!groupElem) return;
    const imageItems = groupElem.querySelectorAll('.image-item');
    imageItems.forEach((item, idx) => {
      const numBadge = item.querySelector('.img-number');
      if (numBadge) {
        numBadge.textContent = idx + 1;
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // 表單驗證
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    let totalImages = 0;
    productGroups.forEach(group => {
      totalImages += group.files.length;
    });
    if (totalImages === 0) {
      alert('請至少上傳一張圖片。');
      return;
    }
    for (let i = 0; i < productGroups.length; i++) {
      const group = productGroups[i];
      if (group.files.length > 0 && (!group.product || group.product === '')) {
        alert('有上傳圖片的項目尚未選擇商品類型！');
        return;
      }
      if (group.files.length === 0 && group.product) {
        alert('已選擇商品但尚未上傳圖片，請上傳圖片或移除該商品項目。');
        return;
      }
    }
    // 顯示上傳中提示，禁用送出按鈕避免重複提交
    submitBtn.disabled = true;
    statusMessage.style.color = '#000';
    statusMessage.textContent = '圖片上傳中，請稍候...';
    const formData = new FormData();
    // 附加文字欄位資料
    const fieldsToSend = ['name','contact','email','shopee','orderRemark'];
    fieldsToSend.forEach(fieldName => {
      const fieldElem = form.querySelector('[name="' + fieldName + '"]');
      if (fieldElem) {
        formData.append(fieldName, fieldElem.value.trim());
      }
    });
    const timingChecked = form.querySelector('input[name="timing"]:checked');
    if (timingChecked) {
      formData.append('timing', timingChecked.value);
    }
    const urgentDateField = form.querySelector('[name="urgentDate"]');
    if (urgentDateField && urgentDateField.value) {
      formData.append('urgentDate', urgentDateField.value);
    }
    // 將所有圖片資料（Base64等）依序加入 FormData，然後發送請求
    async function processFilesAndSend() {
      const groupElems = productContainer.querySelectorAll('.product-group');
      for (let gIndex = 0; gIndex < productGroups.length; gIndex++) {
        const group = productGroups[gIndex];
        const productValue = group.product;
        const groupElem = groupElems[gIndex];
        const remarkElems = groupElem.querySelectorAll('.image-remark');
        for (let idx = 0; idx < group.files.length; idx++) {
          const fileObj = group.files[idx];
          const file = fileObj.file;
          const remarkText = remarkElems[idx] ? remarkElems[idx].value.trim() : '';
          try {
            const base64 = await fileToBase64(file);
            let format = '';
            if (file.type) {
              format = (file.type.split('/')[1] || '');
            }
            if (format.indexOf('+') !== -1) {
              format = format.split('+')[0];
            }
            format = format.toUpperCase();
            formData.append('file', base64);
            formData.append('filename', file.name);
            formData.append('imageformat', format);
            formData.append('productType', productValue);
            formData.append('remark', remarkText);
            formData.append('rotate', fileObj.rotate.toString());
          } catch (err) {
            console.error('文件讀取失敗:', err);
            continue;
          }
        }
      }
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxGou2fWP9-uDi0n5EIwE-alJre6Y3NIHW8Xw_5d753X43-O6YeBvcd1zHwt9j75uYA/exec', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        // 上傳成功
        statusMessage.style.color = '#228B22';
        statusMessage.textContent = '圖片傳送完成，等待聯繫...';
        // 清除所有預覽圖片，但保留表單文字欄位與商品選擇
        productContainer.querySelectorAll('.product-group').forEach((groupElem, gIndex) => {
          const previewList = groupElem.querySelector('.preview-list');
          if (previewList) previewList.innerHTML = '';
          productGroups[gIndex].files = [];
          const uploadArea = groupElem.querySelector('.upload-area');
          uploadArea.classList.remove('has-files');
        });
        submitBtn.disabled = false;
        // 捲動回圖片上傳區，方便使用者繼續操作
        const sectionTitle = document.querySelector('.section-title');
        if (sectionTitle) {
          sectionTitle.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (error) {
        console.error('上傳過程發生錯誤: ', error);
        statusMessage.style.color = '#d00000';
        statusMessage.textContent = '上傳失敗，請稍後再試一次。';
        submitBtn.disabled = false;
      }
    }

    function fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          const base64 = dataUrl.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => {
          reject(new Error('FileReader error'));
        };
        reader.readAsDataURL(file);
      });
    }

    processFilesAndSend();
  });
});
