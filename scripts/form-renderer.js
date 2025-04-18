{
  "fields": [
    {
      "label": "姓名",
      "name": "name",
      "type": "text",
      "required": true,
      "placeholder": "請填寫您的名字"
    },
    {
      "label": "LINE／電話",
      "name": "contact",
      "type": "text",
      "required": true,
      "placeholder": "聯絡方式，用於確認與出貨"
    },
    {
      "label": "訂購方式",
      "name": "orderType",
      "type": "radio",
      "required": true,
      "options": [
        { "label": "蝦皮聊聊", "value": "shopee" },
        { "label": "Pinkoi", "value": "pinkoi" },
        { "label": "私訊下單", "value": "dm" }
      ]
    },
    {
      "label": "是否需要包裝",
      "name": "package",
      "type": "radio",
      "required": false,
      "options": [
        { "label": "要包裝", "value": "yes" },
        { "label": "不用包裝", "value": "no" }
      ]
    },
    {
      "label": "是否需要列印出貨訂單",
      "name": "print",
      "type": "radio",
      "required": false,
      "options": [
        { "label": "列印", "value": "yes" },
        { "label": "不列印", "value": "no" }
      ]
    },
    {
      "label": "備註",
      "name": "note",
      "type": "text",
      "required": false,
      "placeholder": "其他想說的都可以填這裡哦～"
    }
  ]
}

  return section;
}
