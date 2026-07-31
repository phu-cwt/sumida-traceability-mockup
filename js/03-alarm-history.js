/* Lich su loi: du lieu, bang trong man chi tiet, man tong, xuat CSV
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ============ ALARM HISTORY (Lịch sử lỗi) ============ */
// Mốc thời gian suy từ Machine.Status (3↔1); Nội dung lỗi cần Alarm.Code từ PLC (đề xuất Nittoku).
const ALARMS = [
  {plc:"PLC01", code:"ALM-0002", content:"Áp suất khí nén thấp",            raised:"16/05/2026 15:39:50", resolved:null,                 product:"260408A0190A0"},
  {plc:"PLC04", code:"ALM-1023", content:"Dòng hàn vượt UCL",               raised:"16/05/2026 15:27:26", resolved:null,                 product:"260408A0162A0"},
  {plc:"PLC11", code:"ALM-2104", content:"Camera 3D trigger timeout",       raised:"16/05/2026 14:04:35", resolved:null,                 product:"260408A0050A0"},
  {plc:"PLC01", code:"ALM-0135", content:"Lỗi đọc / in mã BASE 2D",         raised:"16/05/2026 13:20:08", resolved:"16/05/2026 13:21:55", product:"260408A0138A0"},
  {plc:"PLC04", code:"ALM-1010", content:"Mòn điện cực hàn",                raised:"16/05/2026 13:02:10", resolved:"16/05/2026 13:14:40", product:"260408A0137A0"},
  {plc:"PLC13", code:"ALM-1305", content:"Nhiệt độ lò sấy bất thường",      raised:"16/05/2026 12:15:00", resolved:"16/05/2026 12:40:33", product:"—"},
  {plc:"PLC01", code:"ALM-0120", content:"BASE feeder hết phôi",            raised:"16/05/2026 11:05:30", resolved:"16/05/2026 11:08:12", product:"260408A0165A0"},
  {plc:"PLC02", code:"ALM-0210", content:"Đứt dây đồng",                    raised:"16/05/2026 10:22:14", resolved:"16/05/2026 10:31:02", product:"260408A0164A0"},
  {plc:"PLC07", code:"ALM-0705", content:"Quét sai can keo (A/B mismatch)", raised:"16/05/2026 09:48:30", resolved:"16/05/2026 09:52:10", product:"260408A0021A0"}
];
function parseDT(s){
  const m = (s||"").match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/); if(!m) return 0;
  return ((((+m[3])*12 + (+m[2]))*31 + (+m[1]))*24 + (+m[4]))*3600 + (+m[5])*60 + (+m[6]);
}
function alarmDuration(raised, resolved){
  if(!resolved) return "—";
  let d = parseDT(resolved) - parseDT(raised); if(d<0) d=0;
  const h=Math.floor(d/3600), mi=Math.floor((d%3600)/60), se=d%60;
  return (h?h+"h ":"") + (mi||h?mi+"m ":"") + se + "s";
}
function alarmHistoryBlock(code){
  const rows = ALARMS.filter(a=>a.plc===code);
  const body = rows.length===0
    ? `<tr><td colspan="5" style="padding:14px;color:#888">Không có lịch sử lỗi.</td></tr>`
    : rows.map((a,i)=>`
      <tr class="${a.resolved?'':'row-ng'}">
        <td>${i+1}</td>
        <td>${a.raised}</td>
        <td style="text-align:left">${TD(a.content)} <span style="color:#888">(${a.code})</span></td>
        <td>${a.resolved || '<b>(chưa giải quyết)</b>'}</td>
        <td>${alarmDuration(a.raised, a.resolved)}</td>
      </tr>`).join('');
  return `
    <div class="insp-section">
      <h3>${T('dt.alarmhist')} — ${code}</h3>
      <div class="table-scroll" style="max-height:210px;margin:12px;border:1px solid #111">
        <table class="history-table">
          <thead><tr><th>No</th><th>Ngày phát sinh</th><th>Nội dung lỗi</th><th>Ngày giải quyết</th><th>Thời lượng</th></tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </div>`;
}

/* ----- Màn Lịch sử lỗi tổng (toàn 14 PLC) ----- */
function renderAlarmsPage(rows){
  const data = rows || ALARMS;
  const body = document.getElementById('alarms-body');
  if(!body) return;
  if(data.length===0){ body.innerHTML = `<tr><td colspan="7" style="padding:16px;color:#888">Không có lỗi phù hợp bộ lọc.</td></tr>`; return; }
  body.innerHTML = data.map((a,i)=>`
    <tr class="${a.resolved?'':'row-ng'}">
      <td>${i+1}</td>
      <td>${a.plc}</td>
      <td>${a.raised}</td>
      <td style="text-align:left">${TD(a.content)} <span style="color:#888">(${a.code})</span></td>
      <td>${a.resolved || '<b>(chưa giải quyết)</b>'}</td>
      <td>${alarmDuration(a.raised, a.resolved)}</td>
      <td>${a.product || '—'}</td>
    </tr>`).join('');
}
function filteredAlarms(){
  const sel = document.getElementById('alarms-plc');
  const code = sel ? sel.value : 'All';
  return code==='All' ? ALARMS : ALARMS.filter(a=>a.plc===code);
}
function searchAlarms(){ renderAlarmsPage(filteredAlarms()); }
function resetAlarms(){ const s=document.getElementById('alarms-plc'); if(s) s.value='All'; renderAlarmsPage(ALARMS); }
function exportAlarmsCSV(){
  const rows = filteredAlarms();
  const head = ["No","PLC","Ngày phát sinh","Nội dung lỗi","Mã lỗi","Ngày giải quyết","Thời lượng","Mã 2D SP"];
  const esc = v => `"${String(v).replace(/"/g,'""')}"`;
  const lines = [head.map(esc).join(",")];
  rows.forEach((a,i)=>lines.push([i+1,a.plc,a.raised,TD(a.content),a.code,a.resolved||"(chưa giải quyết)",alarmDuration(a.raised,a.resolved),a.product||""].map(esc).join(",")));
  const blob = new Blob(["﻿"+lines.join("\r\n")], {type:"text/csv;charset=utf-8"});
  const x = document.createElement("a"); x.href = URL.createObjectURL(blob); x.download = "alarm_history_export.csv";
  document.body.appendChild(x); x.click(); x.remove(); URL.revokeObjectURL(x.href);
}

/* renderPLCDetail() da chuyen sang js/03b-plc-detail-render.js — render theo
   bang doi chieu PLC_FIELDS (doc 09/07 x IO MAP 260515 x MES export). */
