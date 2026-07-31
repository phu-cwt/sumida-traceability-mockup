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
  // Nội dung render bằng JS phải vẽ lại để đổi nhãn theo ngôn ngữ mới
  renderLegends(); renderLoss(); renderProd(); renderAgg(); renderCT(); renderRt();
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
