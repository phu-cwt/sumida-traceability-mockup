/* Khoi tao: nap danh sach serial, ve moi man, chon ngon ngu mac dinh
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ============ INIT ============ */
/* Hai con số nằm GIỮA câu giới thiệu màn Truy xuất Serial. Câu đó dịch bằng
   `data-i18n-html` nên mỗi lần đổi ngôn ngữ cả đoạn bị vẽ lại và 2 số biến mất ⇒ tách
   riêng để setLang() gọi lại được, thay vì chạy cả fillSerialList (sẽ reset ô serial
   người dùng đang gõ dở). */
function fillTraceMeta(){
  const r=document.getElementById('trace-src-rows'), s=document.getElementById('trace-src-serials');
  if(r) r.textContent = nf(MOCK_DATA.meta.srcRows);
  if(s) s.textContent = nf(MOCK_DATA.meta.srcSerials);
}
/* Nhãn gợi ý serial là chuỗi GHÉP ("9/14 công đoạn · giờ") nên không tra từ điển theo
   chuỗi gốc được — phải vẽ lại khi đổi ngôn ngữ. Tách riêng khỏi fillSerialList vì hàm
   đó còn reset ô serial về serial demo, sẽ xoá mất thứ người dùng đang gõ. */
function fillSerialSuggest(){
  const dl=document.getElementById('serial-list'); if(!dl) return;
  const items = Object.entries(MOCK_DATA.serials).sort((a,b)=>b[1].nProc-a[1].nProc);
  dl.innerHTML = items.map(([s,v])=>`<option value="${s}">${v.nProc}/${MOCK_DATA.processes.length} ${T('th.process')} · ${v.startedAt}</option>`).join('');
}
/* Nạp danh sách serial thật vào ô tra cứu (gợi ý sẵn, khách khỏi phải đoán) */
function fillSerialList(){
  if(!document.getElementById('serial-list')) return;
  fillSerialSuggest();
  fillTraceMeta();
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
  /* Ô này đếm SỐ MÁY đang có lỗi chưa xử lý, không phải số bản ghi lỗi: một máy dính
     2 lỗi cùng lúc vẫn chỉ là 1 máy. Đếm theo bản ghi sẽ ra số lớn hơn số máy đỏ trên
     dải trạng thái và người xem không đối chiếu được. */
  vals[4].textContent=nf(new Set(ALARMS.filter(a=>!a.resolved).map(a=>a.plc)).size);
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
/* Nội dung vẽ lại SAU khi đã đổi ngôn ngữ (bấm tab, đổi phạm vi, mở chi tiết máy…) mang
   chữ tiếng Việt gốc. Quan sát DOM và dịch phần mới thêm, thay vì phải nhớ gọi tay ở
   từng chỗ render — sót một chỗ là màn đó lòi tiếng Việt giữa giao diện tiếng Nhật. */
let _dangDich = false;
new MutationObserver(()=>{
  if(_dangDich || currentLang === 'vi') return;
  _dangDich = true;
  try { translateStaticText(); } finally { _dangDich = false; }
}).observe(document.body, {childList:true, subtree:true});
tickClock();
setInterval(tickClock, 1000);
setInterval(renderRt, 30000);   // vạch NOW + phần "chưa tới" luôn cập nhật
