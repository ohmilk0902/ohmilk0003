function addImageBlock() {
  const block = document.createElement('div');
  block.className = 'imageBlock';
  block.innerHTML = \`
    <input type="file" name="images[]" accept="image/*,.pdf,.ai" required>
    <textarea name="notes[]" placeholder="請輸入圖片備註，例如：不要去背、滿版、這款做2個⋯⋯"></textarea>
  \`;
  document.getElementById('imageArea').appendChild(block);
}
