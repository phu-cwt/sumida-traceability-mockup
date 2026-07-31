/* Doi 4 ngon ngu (tu dien o i18n.js) + dong ho footer
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ============ LANG — 4 ngôn ngữ VI / EN / JA / ZH ============
   Từ điển nằm ở `i18n.js` (nhãn tiếng Nhật lấy nguyên văn sheet `info` của khách).
   Giữ nguyên tên biến `currentLang` và hàm `setLang()` của bản gốc — không thêm
   cơ chế i18n thứ hai. */
/* Icon nút header = cờ của ngôn ngữ ĐANG chọn.
   (Bản cũ map vi/ja/zh về `world.png` — file này thực chất là cờ Việt Nam chứ
   không phải quả địa cầu, nên chọn 日本語/中文 vẫn hiện cờ VN.) */
const LANG_ICONS = {
  vi: 'assets/vn.svg', en: 'assets/gb.svg',
  ja: 'assets/jp.svg', zh: 'assets/cn.svg'
};
let currentLang = 'vi';
function toggleLangMenu(ev){
  ev.stopPropagation();
  document.getElementById('lang-menu').classList.toggle('show');
}
document.addEventListener('click', ()=>{
  const m = document.getElementById('lang-menu'); if(m) m.classList.remove('show');
});
/* Chữ tĩnh trong HTML (ghi chú dài, nhãn bảng, chú thích…) quá nhiều để gắn `data-i18n`
   cho từng thẻ. Ở đây duyệt các NODE VĂN BẢN và tra đúng chuỗi gốc tiếng Việt trong
   UI_I18N — cùng cách tra của TD(). Giữ bản gốc để lần đổi ngôn ngữ sau còn tra được,
   nếu không thì từ tiếng Anh sẽ không quay lại được tiếng Việt. */
function translateStaticText(){
  const map = UI_I18N[currentLang];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while((n = w.nextNode())){
    const el = n.parentElement;
    if(!el || el.closest('#lang-menu')) continue;          // menu ngôn ngữ vốn đa ngữ
    if(n.__vi === undefined){
      const t = (n.nodeValue||'').trim();
      if(!t || !UI_I18N.__keys.has(t)) continue;           // không phải chuỗi cần dịch
      n.__vi = t;                                          // nhớ bản gốc tiếng Việt
    }
    const src = n.__vi;
    const out = map ? (map[src] || src) : src;             // vi: không có bảng ⇒ về gốc
    if(n.nodeValue.trim() !== out) n.nodeValue = n.nodeValue.replace(n.nodeValue.trim(), out);
  }
}

function setLang(l){
  if(!I18N[l]) return;
  currentLang = l;
  const btn = document.getElementById('lang-btn');
  btn.src = LANG_ICONS[l]; btn.alt = l.toUpperCase();
  btn.parentElement.title = 'Language / 言語 / 语言';
  document.documentElement.lang = l;
  document.querySelectorAll('#lang-menu button').forEach(b=>b.classList.toggle('active', b.dataset.lang===l));
  document.getElementById('lang-menu').classList.remove('show');
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.dataset.i18n, v = I18N[l][k];
    if(v) el.textContent = v;
  });
  /* Ghi chú dài có sẵn thẻ <b>/<span> bên trong: đặt bằng textContent sẽ xoá mất markup,
     nên các khối đó khai `data-i18n-html` và nhận nguyên đoạn HTML từ từ điển. */
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{
    const v = I18N[l][el.dataset.i18nHtml];
    if(v) el.innerHTML = v;
  });
  /* placeholder / title là THUỘC TÍNH, không phải node văn bản nên bộ duyệt DOM không
     chạm tới. Khai `data-i18n-ph` / `data-i18n-title` cho những chỗ người dùng đọc được. */
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const v = I18N[l][el.dataset.i18nPh]; if(v) el.placeholder = v;
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el=>{
    const v = I18N[l][el.dataset.i18nTitle]; if(v) el.title = v;
  });
  fillTraceMeta();      // 2 số nằm trong câu vừa bị vẽ lại ở trên — phải điền lại
  fillSerialSuggest();  // nhãn gợi ý serial là chuỗi ghép, phải vẽ lại theo ngôn ngữ
  // Nội dung render bằng JS phải vẽ lại để đổi nhãn theo ngôn ngữ mới
  renderLegends(); renderLoss(); renderProd(); renderAgg(); renderCT(); renderRt();
  /* Ảnh NG + Lịch sử lỗi vẽ 1 lần lúc khởi động; nhãn của chúng nằm trong thuộc tính
     `title` nên bộ duyệt DOM (chỉ đi qua node văn bản) không sửa được ⇒ phải vẽ lại. */
  renderGallery(); renderAlarmsPage();
  translateStaticText();   // chữ tĩnh trong HTML — chạy SAU các render ở trên
  renderOverviewProd();   // nhãn nằm trong chuỗi JS nên phải vẽ lại
  if(activePLC) renderPLCDetail(activePLC, activeStage);   // màn chi tiết đang mở cũng phải vẽ lại
  if(document.getElementById('trace-track').children.length) loadTrace();
}

/* ============ CLOCK (footer — giống FormMain WinForms) ============ */
function tickClock(){
  const d = new Date();
  const p = n => String(n).padStart(2,'0');
  document.getElementById('sb-clock').textContent =
    `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
