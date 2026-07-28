const canvas = document.getElementById('stickerCanvas');
const ctx = canvas.getContext('2d');
const CANVAS_W = 960;
const CANVAS_H = 960;

let bgImg = null;
let originalBgImg = null;
let textList = [];
let selectedText = null;
let dragTarget = null;
let dragOffX = 0;
let dragOffY = 0;

// 介面控制項
const el = {
  uploadBg: document.getElementById('uploadBg'),
  addText: document.getElementById('addText'),
  exportSingle: document.getElementById('exportSingle'),
  txtContent: document.getElementById('txtContent'),
  txtSize: document.getElementById('txtSize'),
  sizeValue: document.getElementById('sizeValue'),
  txtColor: document.getElementById('txtColor'),
  strokeColor: document.getElementById('strokeColor'),
  strokeWidth: document.getElementById('strokeWidth'),
  strokeValue: document.getElementById('strokeValue'),
  sharpLevel: document.getElementById('sharpLevel'),
  brightness: document.getElementById('brightness'),
  contrast: document.getElementById('contrast'),
  applyFilter: document.getElementById('applyFilter'),
};

// 匯入底圖
el.uploadBg.onclick = ()=>{
  const ipt = document.createElement('input');
  ipt.type='file';
  ipt.accept='image/png,image/webp';
  ipt.onchange = e=>{
    const f = e.target.files[0];
    const r = new FileReader();
    r.onload = ev=>{
      const img = new Image();
      img.onload = ()=>{
        originalBgImg = img;
        bgImg = img;
        render();
      }
      img.src = ev.target.result;
    }
    r.readAsDataURL(f);
  }
  ipt.click();
};

// 新增文字
el.addText.onclick = ()=>{
  const newTxt = {
    text:'文字',
    x:480,y:480,
    size:72,
    color:'#ffffff',
    strokeColor:'#000000',
    strokeWidth:4
  };
  textList.push(newTxt);
  selectedText = newTxt;
  syncUiFromText(selectedText);
  render();
};

// 同步UI面板資料
function syncUiFromText(t){
  if(!t) return;
  el.txtContent.value = t.text;
  el.txtSize.value = t.size;
  el.sizeValue.textContent = t.size;
  el.txtColor.value = t.color;
  el.strokeColor.value = t.strokeColor;
  el.strokeWidth.value = t.strokeWidth;
  el.strokeValue.textContent = t.strokeWidth;
}

// 面板修改 → 更新選取文字
el.txtContent.oninput = ()=>{
  if(!selectedText) return;
  selectedText.text = el.txtContent.value;
  render();
};
el.txtSize.oninput = ()=>{
  if(!selectedText) return;
  selectedText.size = Number(el.txtSize.value);
  el.sizeValue.textContent = selectedText.size;
  render();
};
el.txtColor.oninput = ()=>{
  if(!selectedText) return;
  selectedText.color = el.txtColor.value;
  render();
};
el.strokeColor.oninput = ()=>{
  if(!selectedText) return;
  selectedText.strokeColor = el.strokeColor.value;
  render();
};
el.strokeWidth.oninput = ()=>{
  if(!selectedText) return;
  selectedText.strokeWidth = Number(el.strokeWidth.value);
  el.strokeValue.textContent = selectedText.strokeWidth;
  render();
};

// 影像濾鏡：銳化、亮度對比
el.applyFilter.onclick = ()=>{
  if(!originalBgImg) return alert('請先匯入底圖');
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = CANVAS_W;
  tempCanvas.height = CANVAS_H;
  const tctx = tempCanvas.getContext('2d');
  tctx.drawImage(originalBgImg,0,0,CANVAS_W,CANVAS_H);

  // 亮度對比
  const
