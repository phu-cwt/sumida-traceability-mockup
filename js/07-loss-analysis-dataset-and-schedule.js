/* Mo hinh thoi gian 5 trang thai, bo dem, lich van hanh line, so ca trong ky
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ══════════════════════════════════════════════════════════════════════════════
   PHÂN TÍCH TỔN THẤT · SẢN LƯỢNG · TỔNG HỢP KỲ · TIMELINE REALTIME
   (gộp từ mes-loss-analysis-wireframe.html, vẽ 100% bằng CSS/div — không canvas)

   MÔ HÌNH THỜI GIAN — đúng ví dụ khách đưa trong sheet `info` 1-1:
     5 trạng thái cộng lại = 実稼働時間 (thời gian vận hành thực)
     実稼働時間 + phần xám (nghỉ trưa) = 計画稼動時間 (cả ca)
     % của từng trạng thái tính trên 実稼働時間, KHÔNG tính trên cả ca.
   PLC01 ca 1 đặt đúng bộ số ví dụ của khách: 50/200/70/60/45 = 425' · ca 480'.
   ══════════════════════════════════════════════════════════════════════════════ */

const SHIFT_MIN   = 480;            // 計画稼動時間 1 ca (phút)
const IDLE_MIN    = 55;             // phần xám: nghỉ trưa — ngoài 実稼働時間
const ACTUAL_MIN  = SHIFT_MIN - IDLE_MIN;   // 実稼働時間 = 425'

/* Thứ tự trạng thái dùng THỐNG NHẤT mọi nơi: [chờ, chạy, lỗi, điều chỉnh, kiểm tra] */
const ST_KEYS = ['st.wait','st.run','st.error','st.adj','st.check'];
const ST_VARS = ['--st-wait','--st-run','--st-error','--st-adj','--st-check'];
const ST_HEX  = ['#9EC7E8','#2ECC40','#E63946','#F2C014','#8E7CC3'];
const ST_TXT  = ['#1B1B1B','#fff','#fff','#1B1B1B','#fff'];

/* Phân bổ thời gian 1 ca / 1 máy — [chờ, chạy, lỗi, điều chỉnh, kiểm tra], tổng = 425'.
   Đặc thù máy khác nhau: máy hàn / vision cần hiệu chỉnh nhiều, máy lắp ráp chạy êm. */
const LOSS_TS = [
  [ 50,200, 70, 60, 45],  // PLC01 In ấn / cấp BASE — ĐÚNG ví dụ khách
  [ 22,370,  6,  7, 20],  // PLC02 Quấn dây — chạy êm
  [ 23,380,  3,  4, 15],  // PLC03 KT vị trí dây — chạy êm
  [ 32,280, 28, 40, 45],  // PLC04 Hàn nóng chảy — nhiều lỗi (hiệu chỉnh dòng/điện cực)
  [ 28,325, 21, 21, 30],  // PLC05 Lắp CORE / KT điện
  [ 24,372,  4,  5, 20],  // PLC06 CASE 2D / BUSH
  [ 27,338,  9, 11, 40],  // PLC07 Đổ keo — hâm keo A/B lâu
  [ 18,386,  3,  3, 15],  // PLC08 Lắp Coil-CASE
  [ 16,391,  1,  2, 15],  // PLC09 Lắp HOOP — êm nhất
  [ 36,270, 29, 42, 48],  // PLC10 Hàn thiếc — nhiều lỗi
  [ 40,262, 33, 40, 50],  // PLC11 KT hàn thiếc 3D — nhiều lỗi nhất (hiệu chuẩn camera)
  [ 18,384,  3,  5, 15],  // PLC12 COVER / lật đảo
  [ 18,395,  2,  0, 10],  // PLC13 Sấy — lò chạy liền, hầu như không lỗi
  [ 32,300, 23, 30, 40]   // PLC14 KT cuối — nhiều lỗi
];

/* 計画Cycleタイム (giây/sản phẩm) — nhập ở Settings. PLC13 (sấy) không áp dụng. */
const PLAN_CT = [10.0, 9.8, 9.6, 10.4, 10.0, 9.7, 10.2, 9.6, 9.5, 10.3, 10.6, 9.7, null, 10.2];

/* Bộ đếm 1 ca / 1 máy — PLC lấy trực tiếp từ counter, KHÔNG suy ra nhau.
   投入数 ≠ OK + NG: chênh lệch = hàng còn trong máy (WIP).
   PLC01 đặt đúng ví dụ khách: 1,140 OK · 32 NG · WIP 8 → 投入 1,180. */
const PROD_CNT = [
  {ok:1140, ng:32, wip:8},   // PLC01
  {ok:2180, ng:12, wip:6},   // PLC02
  {ok:2290, ng:18, wip:5},   // PLC03
  {ok:1520, ng:24, wip:9},   // PLC04
  {ok:1868, ng:11, wip:7},   // PLC05
  {ok:2210, ng: 8, wip:6},   // PLC06
  {ok:1900, ng:14, wip:10},  // PLC07
  {ok:2330, ng: 6, wip:5},   // PLC08
  {ok:2390, ng: 3, wip:4},   // PLC09
  {ok:1480, ng:17, wip:8},   // PLC10
  {ok:1390, ng:41, wip:7},   // PLC11
  {ok:2290, ng: 5, wip:5},   // PLC12
  null,                              // PLC13 sấy — không đếm theo sản phẩm
  {ok:1680, ng:29, wip:6}    // PLC14 — công đoạn cuối = sản lượng toàn line
];
const LAST_PLC = 13;                 // index PLC14 — đo sản lượng toàn line ở đây

/* 目標生産数量入力 — nhập tay ở Settings; khởi tạo = 動作時間 × 60 ÷ 計画Cycleタイム */
const TARGET_QTY = LOSS_TS.map((t,i)=> PLAN_CT[i] ? Math.round(t[1]*60/PLAN_CT[i]) : null);

/* ----- Danh sách 14 PLC + ánh xạ sang mã công đoạn MES thật ----- */
const PLC_MES = PLC_LIST.map(p=>{
  const procs = MOCK_DATA.processes.filter(x=>x.plc===p.code);
  return {code:p.code, stage:p.stage, mes: procs.map(x=>x.code).join(' + ') || '—',
          mesName: procs.map(x=>x.nameZh).join(' + ') || ''};
});

/* ----- Tiện ích ----- */
const nf = n => Number(n).toLocaleString('en-US');
function hm(mins){ mins=Math.round(mins); if(mins<60) return mins+'m';
  const h=Math.floor(mins/60), r=mins%60; return r? `${nf(h)}h${r}m` : `${nf(h)}h`; }
/* Mọi thời lượng đều quy ra giờ-phút. Số gộp nhiều máy × nhiều ca lên tới hàng
   nghìn phút (4653m), đọc thô không ra được độ lớn. hm() tự giữ nguyên phút khi
   <60 nên giá trị nhỏ vẫn hiện dạng phút. */
function dur(mins){ return hm(mins); }
function T(k){ return (I18N[currentLang]&&I18N[currentLang][k]) || I18N.vi[k] || k; }
function jit(a,b){ const x=Math.sin(a*12.9898+b*78.233)*43758.5453; return x-Math.floor(x); }

/* ══════════ LỊCH VẬN HÀNH LINE (cả line chạy chung ca — cấu hình ở Settings) ══════════ */
const WDAYS = ['T2','T3','T4','T5','T6','T7','CN'];
const SHIFT_LIST = ['S1','S2','S3'];
const SHIFT_HM = { S1:'06:00–14:00', S2:'14:00–22:00', S3:'22:00–06:00' };
const SHIFT_START = { S1:360, S2:840, S3:1320 };      // phút từ 00:00
const BASE_MONDAY = new Date(2026,4,11);              // 11/05/2026 = mốc Thứ 2
const LINE_TPL = [['S1','S2'],['S1','S2'],['S1','S2'],['S1','S2'],['S1','S2'],['S1'],[]];
const LINE_OVR = {};                                  // "yyyy-mm-dd" → mảng ca (ngoại lệ)

function iso(dt){ return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0'); }
function ddmm(dt){ return String(dt.getDate()).padStart(2,'0')+'/'+String(dt.getMonth()+1).padStart(2,'0'); }
function fmtD(dt){ return ddmm(dt)+'/'+dt.getFullYear(); }
function dateFromIso(s){ const [Y,M,D]=s.split('-').map(Number); return new Date(Y,M-1,D); }
function wdIdx(dt){ const ms=Math.round((dt-BASE_MONDAY)/86400000); return ((ms%7)+7)%7; }
function weekDates(off){ const a=[]; for(let d=0;d<7;d++){ const dt=new Date(BASE_MONDAY); dt.setDate(dt.getDate()+off*7+d); a.push(dt);} return a; }
function sameSet(a,b){ return a.length===b.length && a.every(x=>b.includes(x)); }
function lineShiftsOn(dt){ const k=iso(dt); return (k in LINE_OVR)?LINE_OVR[k]:LINE_TPL[wdIdx(dt)]; }
function lineRuns(shift,dt){ return lineShiftsOn(dt).includes(shift); }

/* Lưới lịch bấm bật/tắt ca ở màn Cấu hình đã gỡ theo yêu cầu.
   MÔ HÌNH lịch thì GIỮ — `LINE_TPL` + `LINE_OVR` là nguồn của shiftsInDay/Week/Month,
   5 chỗ đang dùng để quy ra "so ca trong ky": Top Page (ca ngay hom nay) · Phan tich
   ton that · San luong · Tong hop ky · Timeline. Nay la cau hinh trong code, khong
   sua duoc tren UI. Muon bo han khai niem lich thi phai doi cach tinh o ca 5 cho do. */

/* Ngoại lệ mẫu để khách thấy ngay cơ chế ★ theo cả 2 chiều:
     T4 13/05 → tăng ca đêm S3   ·   T6 15/05 → nghỉ cả ngày   ·   T7 16/05 → tăng ca S2
   (KHÔNG đặt ngoại lệ "nghỉ" lên đúng ngày demo 16/05, vì khi đó mọi màn phân
   tích sẽ trống — ngày demo phải là ngày line có chạy.) */
(function(){ const w=weekDates(0);
  LINE_OVR[iso(w[2])]=['S1','S2','S3'];
  LINE_OVR[iso(w[4])]=[];
  LINE_OVR[iso(w[5])]=['S1','S2'];
})();

/* ══════════ MỐC "HIỆN TẠI" cho demo — cố định 19:00 (trong ca S2) ══════════
   Để ví dụ luôn ổn định, không phụ thuộc giờ mở máy. Muốn dùng giờ thực:
   đổi nowMin() thành new Date().getHours()*60 + new Date().getMinutes(). */
const DEMO_NOW_MIN = 19*60;
function nowMin(){ return DEMO_NOW_MIN; }
function currentShiftId(){ const h=Math.floor(nowMin()/60)%24; if(h>=6&&h<14) return 'S1'; if(h>=14&&h<22) return 'S2'; return 'S3'; }
function today0(){ const d=new Date(2026,4,16); d.setHours(0,0,0,0); return d; }   // 16/05/2026 — ngày demo
function minToClock(m){ m=((Math.round(m)%1440)+1440)%1440; return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); }

/* ══════════ SỐ CA TRONG KỲ — suy từ đúng lịch vận hành ở Settings ══════════ */
const MONTHS = ['12/2025','01/2026','02/2026','03/2026','04/2026','05/2026'];
function shiftsInDay(dt){ return lineShiftsOn(dt).length; }
function shiftsInWeek(off){ return weekDates(off).reduce((a,dt)=>a+shiftsInDay(dt),0); }
function shiftsInMonth(mIdx){
  const [mm,yy]=MONTHS[mIdx].split('/').map(Number);
  const days=new Date(yy,mm,0).getDate(); let n=0;
  for(let d=1;d<=days;d++) n+=shiftsInDay(new Date(yy,mm-1,d));
  return n;
}

/* Phân tích tổn thất chỉ có nghĩa với ca ĐÃ KẾT THÚC (ca đang chạy dở thì số liệu
   chưa đủ). Mặc định mở ở ca hoàn tất gần nhất mà line THỰC SỰ chạy. */
function lastCompletedRunningShift(){
  const now = nowMin();
  for(let back=0; back<21; back++){
    const d=today0(); d.setDate(d.getDate()-back);
    for(let k=SHIFT_LIST.length-1;k>=0;k--){
      const s=SHIFT_LIST[k];
      if(!lineRuns(s,d)) continue;
      if(back>0 || SHIFT_START[s]+SHIFT_MIN <= now) return {date:d, shift:s};
    }
  }
  return {date:today0(), shift:'S1'};
}
function isShiftRunning(date, shift){
  return iso(date)===iso(today0()) && nowMin() > SHIFT_START[shift]
         && nowMin() < SHIFT_START[shift]+SHIFT_MIN;
}
