/* Cong tac SQL/OPC/NAS, du lieu 14 PLC + card, dang nhap, dieu huong trang
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ===== SYS TAG TOGGLE ===== */
const TAG_LABELS = {
  'tag-opc': {on:'OPC Server Connection', off:'OPC Server Connection — Disconnected'},
  'tag-db':  {on:'SQL Server Connection', off:'SQL Server Connection — Disconnected'},
  'tag-nas': {on:'NAS Server Connection', off:'NAS Server Connection — Disconnected'},
};
function toggleTag(el){
  const isOff = el.classList.toggle('offline');
  const cfg = TAG_LABELS[el.id];
  if(cfg) el.title = isOff ? cfg.off : cfg.on;
}

/* ============ DANH SÁCH 14 PLC theo IO MAP ============
   KHÔNG chứa bộ đếm sản lượng — số đếm chỉ có MỘT nguồn duy nhất là `PROD_CNT`
   (js/07). Trước đây danh sách này mang bộ đếm riêng nên Top Page hiện 2 con số
   khác nhau cho cùng 1 máy: KPI đo tại PLC14 ra 1.680 OK còn card PLC14 ra 240.
   `vi` = tên công đoạn tiếng Việt; `stage` giữ nguyên văn tiếng Anh của IO MAP.
   `status` chỉ nhận 3 giá trị theo tag `Machine.Status` (BIT): run(1) · stop(2) · alarm(3). */
const PLC_LIST = [
  {no:1, code:"PLC01", vi:"In ấn / cấp BASE",   stage:"BASE feeding / BASE 2D code", status:"alarm", case2d:"260408A0190A0"},
  {no:2, code:"PLC02", vi:"Quấn dây",           stage:"Winding", status:"run", case2d:"260408A0142A0"},
  {no:3, code:"PLC03", vi:"KT vị trí dây",      stage:"Wire position check", status:"run", case2d:"260408A0153A0"},
  {no:4, code:"PLC04", vi:"Hàn nóng chảy",      stage:"Resistance welding", status:"alarm", case2d:"260408A0162A0"},
  {no:5, code:"PLC05", vi:"Lắp CORE / KT điện", stage:"Core assy / Electric insp.", status:"run", case2d:"260408A0165A0"},
  {no:6, code:"PLC06", vi:"CASE 2D / BUSH",     stage:"CASE 2D code / BUSH assy", status:"run", case2d:"260408A0192A0"},
  {no:7, code:"PLC07", vi:"Đổ keo",             stage:"Resin potting", status:"run", case2d:"260408A0041A0"},
  {no:8, code:"PLC08", vi:"Lắp Coil-CASE",      stage:"Coil-CASE assy", status:"run", case2d:"260408A0043A0"},
  {no:9, code:"PLC09", vi:"Lắp HOOP",           stage:"Hoop-C assy", status:"run", case2d:"260408A0044A0"},
  {no:10, code:"PLC10", vi:"Hàn thiếc",         stage:"Soldering", status:"run", case2d:"260408A0049A0"},
  {no:11, code:"PLC11", vi:"KT hàn thiếc 3D",   stage:"Solder inspection", status:"alarm", case2d:"260408A0050A0"},
  {no:12, code:"PLC12", vi:"COVER / lật đảo",   stage:"COVER assy / Inversion", status:"run", case2d:"260408A0051A0"},
  {no:13, code:"PLC13", vi:"Sấy (lò ~23 h)",    stage:"Drying", status:"run", case2d:"(oven)"},
  {no:14, code:"PLC14", vi:"KT cuối",           stage:"Final inspection (Weight/Elec/Pin/Date)", status:"run", case2d:"260408A0052A0"}
];


/* ============ AUTH / LOGIN (giống NTKE25T01) ============ */
// Dashboard (Overview) mở tự do; History/Trace/Gallery chỉ hiện sau khi đăng nhập.
let authed = false;
let lastAdvPage = 'history';   // nhớ tab nâng cao cuối cùng để quay lại đúng chỗ
let activePLC = null;          // PLC đang xem ở detail (cho FAB đề xuất theo ngữ cảnh)

function showLogin(){
  document.getElementById('login-error').classList.remove('show');
  document.getElementById('login-bd').classList.add('show');
  const p = document.getElementById('login-pass'); if(p) setTimeout(()=>p.focus(),50);
}
// Nút bánh răng: chưa login → hiện form; đã login (đang ở Dashboard) → vào lại khu vực nâng cao, không cần login lại
function settingsBtn(){ if(authed) goTab(lastAdvPage); else showLogin(); }
function closeLogin(){
  document.getElementById('login-bd').classList.remove('show');
}
function doLogin(){
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;
  if(u === 'Admin' && p === '1'){                   // demo credential (giống 25T01)
    authed = true;
    document.body.classList.add('authed');
    document.getElementById('login-bd').classList.remove('show');
    document.getElementById('login-pass').value = '1';
    document.getElementById('login-error').classList.remove('show');
    goTab('history');   // sau khi đăng nhập → vào thông tin nâng cao
  } else {
    document.getElementById('login-error').classList.add('show');
  }
}
function doLogout(){
  authed = false;
  document.body.classList.remove('authed');
  document.getElementById('login-pass').value = '1';
  goTab('overview');   // quay về Dashboard, ẩn lại các tab nâng cao
}

/* ============ NAVIGATION ============ */
const ADV_PAGES = ['history','alarms','loss','settings','trace','gallery'];
function goTab(t){
  if(t !== 'overview' && t !== 'detail' && !authed){ showLogin(); return; }   // khu vực nâng cao cần đăng nhập
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-'+t).classList.add('active');
  if(t==='loss') renderLoss();          // vẽ lại theo phạm vi/kỳ đang chọn
  // Menu subnav: hiện ở khu vực đã login (History/Settings/Trace/Gallery), ẩn ở Dashboard/Detail
  const adv = ADV_PAGES.includes(t);
  if(adv) lastAdvPage = t;   // ghi nhớ tab nâng cao đang xem
  const sub = document.getElementById('subnav');
  sub.style.display = adv ? 'flex' : 'none';
  sub.querySelectorAll('.snav[data-go]').forEach(b=>b.classList.toggle('active', b.dataset.go===t));
  // Nút bánh răng chỉ vô hiệu khi đang Ở TRONG khu vực nâng cao; về Dashboard thì bật lại
  document.getElementById('gear-btn').disabled = adv;
}
let activeStage = '';                  // giữ để vẽ lại khi đổi ngôn ngữ
function openDetail(code,stage){
  activePLC = code; activeStage = stage;
  document.getElementById('detail-title').textContent = `${code} — ${stage}`;
  renderPLCDetail(code, stage);
  goTab('detail');
}
