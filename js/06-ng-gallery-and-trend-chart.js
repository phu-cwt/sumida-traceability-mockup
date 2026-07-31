/* Thu vien anh NG (10 controller / 13 head that) + bieu do trend (Chart.js, hien chua dung)
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ============ NG GALLERY — 10 controller / 13 camera head THẬT ============
   Nguồn: sheet `Initial concept` file khách (không phải "19× CV-X350F" như bản Scope cũ).
   Serial trong tên ảnh lấy từ bộ serial THẬT. */
function pad(n,w=4){return String(n).padStart(w,'0')}
const NG_IMGS = (()=>{
  const arr=[];
  const sers = Object.keys(MOCK_DATA.serials);
  const dates=["260408","260408","260409","260409"];
  const seed = (n)=>{ const x=Math.sin(n*12.9898)*43758.5453; return x-Math.floor(x); };  // tất định
  for(let i=0;i<60;i++){
    const c = CAM_LIST[Math.floor(seed(i*3+1)*CAM_LIST.length)];
    const defect = c.defects[Math.floor(seed(i*5+2)*c.defects.length)];
    const date = dates[Math.floor(seed(i*7+3)*dates.length)];
    const hh = pad(9+Math.floor(seed(i*11+4)*8),2);
    const mm = pad(Math.floor(seed(i*13+5)*60),2);
    const ss = pad(Math.floor(seed(i*17+6)*60),2);
    arr.push({
      case: sers[i % sers.length],
      camId:c.id, ctrl:c.ctrl, head:c.head, plc:c.plc, use:c.use, defect,
      time:`${hh}:${mm}:${ss}`,
      dateStr:`${date.slice(4,6)}/${date.slice(2,4)}/20${date.slice(0,2)}`
    });
  }
  return arr;
})();

const PAGE_SIZE = 24;
let curPage = 1;

/* Nạp dropdown camera + loại lỗi từ danh sách camera thật */
function wireGalleryLists(){
  const cam = document.getElementById('gal-cam');
  const nHead = CAM_LIST.reduce((a,c)=>a+c.n,0);
  cam.innerHTML = `<option value="">Tất cả (${CAM_LIST.length} controller · ${nHead} head)</option>` +
    CAM_LIST.map(c=>`<option value="${c.id}">${c.id} — ${c.plc} · ${c.ctrl} (${c.head} ×${c.n}) · ${c.use}</option>`).join('');
  const defs = [...new Set(CAM_LIST.flatMap(c=>c.defects))];
  document.getElementById('gal-defect').innerHTML =
    `<option value="">Tất cả</option>` + defs.map(d=>`<option value="${d}">${d}</option>`).join('');
  document.getElementById('gal-month').textContent = (62250).toLocaleString('en-US');
}
function filteredNG(){
  const cam = document.getElementById('gal-cam');
  const def = document.getElementById('gal-defect');
  const cv = cam ? cam.value : '', dv = def ? def.value : '';
  return NG_IMGS.filter(i => (!cv || i.camId===cv) && (!dv || i.defect===dv));
}

function renderGallery(){
  const rows = filteredNG();
  const total = rows.length;
  const pages = Math.ceil(total/PAGE_SIZE);
  if(curPage>pages) curPage = pages;
  if(curPage<1) curPage = 1;
  const start = (curPage-1)*PAGE_SIZE;
  const end = Math.min(start+PAGE_SIZE, total);
  const slice = rows.slice(start, end);

  document.getElementById('gallery-grid').innerHTML = slice.map((i,k)=>`
    <div class="ng-card" onclick="openImg('${i.case}')" title="${i.ctrl} · ${i.head} · ${TD(i.use)}">
      <div class="img" loading="lazy">
        <div class="defect" style="top:${22+((k*13)%28)}%;left:${20+((k*7)%30)}%"></div>
      </div>
      <div class="info">
        <div class="case">${i.case}</div>
        <div class="meta">${i.camId} · ${i.plc} · ${i.ctrl} · ${i.dateStr} ${i.time}</div>
        <span class="badge">${TD(i.defect)}</span>
      </div>
    </div>
  `).join('');

  document.getElementById('pag-from').textContent = total===0?0:(start+1);
  document.getElementById('pag-to').textContent = end;
  document.getElementById('pag-total').textContent = total;
  document.getElementById('pag-info').textContent = `Trang ${curPage} / ${pages||1}`;
  document.getElementById('pag-prev').disabled = curPage<=1;
  document.getElementById('pag-next').disabled = curPage>=pages;
}
function changePage(d){curPage+=d;renderGallery()}

// Filter-discipline: disable Search until at least one filter is chosen
function wireGalleryFilters(){
  const filterRoot = document.querySelector('#page-gallery .gallery-filters');
  if(!filterRoot) return;
  const searchBtn = filterRoot.querySelector('button[data-i18n="btn.search"]');
  if(!searchBtn) return;
  const inputs = filterRoot.querySelectorAll('input,select');
  const initial = new Map();
  inputs.forEach(el=>initial.set(el, el.value));
  function recheck(){
    let changed = false;
    inputs.forEach(el=>{ if(el.value!==initial.get(el)) changed=true; });
    searchBtn.disabled = !changed;
    searchBtn.title = changed ? "" : "${T('gal.filtertip')}";
  }
  inputs.forEach(el=>el.addEventListener('input',recheck));
  inputs.forEach(el=>el.addEventListener('change',recheck));
  recheck();
}

/* ============ TREND CHART ============ */
let trendChart = null;
function drawTrend(){
  if(trendChart){return}
  if(typeof Chart === 'undefined'){drawTrendFallback();return}
  const ctx = document.getElementById('trend-canvas');
  const labels = [], data = [];
  for(let i=29;i>=0;i--){
    labels.push(`-${i}m`);
    let v = 17.4 + Math.sin(i*0.5)*0.4 + (Math.random()-0.5)*0.3;
    if(i===4) v = 19.82;
    data.push(v.toFixed(2));
  }
  trendChart = new Chart(ctx, {
    type:'line',
    data:{labels, datasets:[
      {label:'Welding current (A)', data, borderColor:'#1E88E5', backgroundColor:'rgba(30,136,229,.1)', tension:.3, fill:true, pointRadius:2, pointBackgroundColor:(c)=>c.parsed.y>18.5||c.parsed.y<16.5?'#C9272F':'#1E88E5'},
      {label:'UCL 18.50A', data:new Array(30).fill(18.5), borderColor:'#C9272F', borderDash:[6,4], pointRadius:0, fill:false},
      {label:'LCL 16.50A', data:new Array(30).fill(16.5), borderColor:'#C9272F', borderDash:[6,4], pointRadius:0, fill:false}
    ]},
    options:{
      responsive:true, maintainAspectRatio:false,
      scales:{y:{min:15.5,max:20.5,title:{display:true,text:'A'}}},
      plugins:{legend:{labels:{font:{size:11}},position:'bottom'}}
    }
  });
}

function drawTrendFallback(){
  // Pure-SVG fallback chart if Chart.js CDN is unavailable
  const w=900,h=160,pad=30;
  const pts=[];
  for(let i=29;i>=0;i--){
    let v = 17.4 + Math.sin(i*0.5)*0.4 + (Math.random()-0.5)*0.3;
    if(i===4) v=19.82;
    pts.push(v);
  }
  const min=15.5,max=20.5;
  const xs = i => pad + i*(w-pad-10)/29;
  const ys = v => h-20 - (v-min)/(max-min)*(h-30);
  const ucl=ys(18.5), lcl=ys(16.5);
  const path = pts.map((v,i)=> (i===0?'M':'L')+xs(i)+','+ys(v)).join(' ');
  const dots = pts.map((v,i)=>`<circle cx="${xs(i)}" cy="${ys(v)}" r="2.5" fill="${v>18.5||v<16.5?'#C9272F':'#1E88E5'}"/>`).join('');
  document.getElementById('trend-canvas').outerHTML = `<svg viewBox="0 0 ${w} ${h}" class="trend-canvas" preserveAspectRatio="none">
    <rect x="0" y="0" width="${w}" height="${h}" fill="#fff"/>
    <line x1="${pad}" y1="${h-20}" x2="${w-10}" y2="${h-20}" stroke="#888"/>
    <line x1="${pad}" y1="10" x2="${pad}" y2="${h-20}" stroke="#888"/>
    <line x1="${pad}" y1="${ucl}" x2="${w-10}" y2="${ucl}" stroke="#C9272F" stroke-dasharray="6,4"/>
    <line x1="${pad}" y1="${lcl}" x2="${w-10}" y2="${lcl}" stroke="#C9272F" stroke-dasharray="6,4"/>
    <text x="${w-12}" y="${ucl-3}" text-anchor="end" font-size="10" fill="#C9272F">UCL 18.50A</text>
    <text x="${w-12}" y="${lcl+12}" text-anchor="end" font-size="10" fill="#C9272F">LCL 16.50A</text>
    <text x="4" y="14" font-size="10" fill="#444">A</text>
    <text x="4" y="${ys(20)+3}" font-size="9" fill="#444">20</text>
    <text x="4" y="${ys(18)+3}" font-size="9" fill="#444">18</text>
    <text x="4" y="${ys(16)+3}" font-size="9" fill="#444">16</text>
    <text x="${pad}" y="${h-6}" font-size="9" fill="#444">-30m</text>
    <text x="${(w+pad)/2}" y="${h-6}" font-size="9" fill="#444" text-anchor="middle">-15m</text>
    <text x="${w-10}" y="${h-6}" font-size="9" fill="#444" text-anchor="end">now</text>
    <path d="${path}" fill="none" stroke="#1E88E5" stroke-width="2"/>
    ${dots}
  </svg>`;
}
