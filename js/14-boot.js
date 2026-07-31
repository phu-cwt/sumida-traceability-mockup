/* Khoi tao: nap danh sach serial, ve moi man, chon ngon ngu mac dinh
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ============ INIT ============ */
/* Nạp danh sách serial thật vào ô tra cứu (gợi ý sẵn, khách khỏi phải đoán) */
function fillSerialList(){
  const dl=document.getElementById('serial-list'); if(!dl) return;
  const items = Object.entries(MOCK_DATA.serials).sort((a,b)=>b[1].nProc-a[1].nProc);
  dl.innerHTML = items.map(([s,v])=>`<option value="${s}">${v.nProc}/${MOCK_DATA.processes.length} công đoạn · ${v.startedAt}</option>`).join('');
  document.getElementById('trace-src-rows').textContent    = nf(MOCK_DATA.meta.srcRows);
  document.getElementById('trace-src-serials').textContent = nf(MOCK_DATA.meta.srcSerials);
  document.getElementById('serial-input').value = MOCK_DATA.meta.demoSerial;
}
/* Overview KPI = sản lượng toàn line, đo tại công đoạn cuối (PLC14) — không cộng ngang trạm */
function renderOverviewKpi(){
  const f=ovScopeFactor();                       // theo phạm vi chọn ở thanh ngữ cảnh chung
  const c0=PROD_CNT[LAST_PLC];
  const c={ok:c0.ok*f, ng:c0.ng*f, wip:c0.wip};  // WIP là tồn tức thời, không nhân theo ca
  const input=c.ok+c.ng+c.wip;
  const bar=document.querySelector('#page-overview .kpi-bar');
  if(!bar) return;
  const vals=bar.querySelectorAll('.kpi .val');
  vals[0].textContent=nf(input); vals[1].textContent=nf(c.ok);
  vals[2].textContent=nf(c.ng);  vals[3].textContent=nf(c.wip);
  vals[4].textContent=nf(ALARMS.filter(a=>!a.resolved).length);
}

renderOverviewProd();
renderOverviewKpi();
renderAlarmsPage();
fillScopeSelects();
renderLegends();
wireGalleryLists();
renderGallery();
wireGalleryFilters();
fillSerialList();
loadTrace();
renderCT();
renderLoss();
renderProd();
renderAgg();
renderRt();
setLang('vi');
tickClock();
setInterval(tickClock, 1000);
setInterval(renderRt, 30000);   // vạch NOW + phần "chưa tới" luôn cập nhật
