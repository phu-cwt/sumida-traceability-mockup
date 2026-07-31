/* Tab con, popup anh NG, panel De xuat tag can Nittoku bo sung
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ══════════ TAB CON ══════════ */
function showTab(group, id){
  // Nút tab nằm TRONG .subtabs nên bản thân nút không có data-tabgroup —
  // phải chọn qua container, nếu không thì panel đổi mà highlight nút đứng im.
  document.querySelectorAll(`.subtabs[data-tabgroup="${group}"] .subtab`).forEach(b=>
    b.classList.toggle('active', b.dataset.tab === id));
  document.querySelectorAll(`.subpanel[data-tabgroup="${group}"]`).forEach(p=>
    p.classList.toggle('active', p.dataset.tab === id));
  // vẽ lại nội dung khi mở tab (lazy — tab đóng không tốn công vẽ)
  if(id==='tab-ov-rt')       renderRt();
  if(id==='tab-hist-output') renderProd();
  if(id==='tab-hist-agg')    renderAgg();
  if(id==='tab-set-target')  renderCT();
}

/* ============ MISC ============ */
function openImg(code){
  const rec = NG_IMGS.find(x=>x.case===code) || NG_IMGS[0];
  document.getElementById('img-title').textContent=T('gal.imgtitle')+' — '+code;
  const b=document.getElementById('img-detail');
  if(b && rec){
    b.innerHTML = `
      <tr><td class="k">${T('th.serial')}</td><td class="mono">${code}</td></tr>
      <tr><td class="k">${T('gal.camctrl')}</td><td>${rec.camId} — ${rec.plc} · <b>${rec.ctrl}</b> · head ${rec.head}</td></tr>
      <tr><td class="k">${T('gal.inspuse')}</td><td>${TD(rec.use)}</td></tr>
      <tr><td class="k">${T('gal.defect')}</td><td><span class="pill ng">${rec.defect}</span></td></tr>
      <tr><td class="k">${T('gal.shotat')}</td><td>${rec.dateStr} ${rec.time}</td></tr>
      <tr><td class="k">${T('gal.naspath')}</td><td class="mono" style="font-size:11px">\\\\NAS-SUMIDA\\NG\\${rec.plc}\\${rec.dateStr.split('/').reverse().join('-')}\\${code}_${rec.camId}.jpg</td></tr>`;
    document.getElementById('img-filename').textContent = `${code}_${rec.camId}.jpg`;
  }
  document.getElementById('img-bd').classList.add('show');
}
function closeImg(){document.getElementById('img-bd').classList.remove('show')}

/* ============ FAB: ĐỀ XUẤT DỮ LIỆU (tag cần Nittoku bổ sung) ============ */
/* Hướng truy vết ĐÃ CHỐT 30/07/2026: theo từng sản phẩm (serial-level), không theo
   Job card / lô-ca ⇒ không cần tag Job card / PO / OP ID. Phần còn chờ là Nittoku
   bổ sung tag, không phải chờ Sumida quyết định nữa. */
const SUGGEST_PENDING = "Truy vết theo từng sản phẩm (serial-level) — ĐÃ CHỐT 30/07/2026, trả lời Q28/Q32. Để chạy được serial-level cần Nittoku bổ sung tag handshake (DataReady) + CavityIndex + SeqNo — đọc 1 chiều, KHÔNG cần ACK vì phần mềm chỉ READ. Ngoài ra cần Coil2D, Case2D (sau lật), và tách BUSH A/B. IO MAP 26T01 không có tag Job card/PO/OP ID — đúng như hướng đã chốt nên không cần bổ sung.";

/* 3 bộ đếm + 5 timer: IO MAP 260515 (14 sheet) KHÔNG có bộ đếm nào — chỉ có cờ
   1:OK / 0:NG theo từng sản phẩm. Muốn hiện 投入数 / OK排出数 / NG排出数 và
   phân bổ 5 trạng thái thời gian thì PLC phải cấp sẵn, không để SW tự suy:
   PC tắt / mất mạng là mất khoảng đó, và nghiệm thu sẽ lệch với HMI của PLC.
   Tiền lệ: IO MAP NTKE25T01 đã cấp Total good / Total NG + time. */
const SUGGEST_COUNTERS = [
  ["Count.Input",        "生産状況 1-2-1 — 投入数 (bộ đếm tích luỹ)"],
  ["Count.OK",           "生産状況 1-2-2 — OK排出数"],
  ["Count.NG",           "生産状況 1-2-3 — NG排出数"],
  ["Time.Wait",          "ロス解析 1-1-1 — 待機時間 (timer tích luỹ)"],
  ["Time.Run",           "ロス解析 1-1-2 — 動作時間"],
  ["Time.Error",         "ロス解析 1-1-3 — Error出力時間"],
  ["Time.Adjust",        "ロス解析 1-1-4 — 調整時間"],
  ["Time.PreCheck",      "ロス解析 1-1-5 — 始業前点検時間"],
  ["Quality.CycleTime",  "生産状況 1-2-4 — OK排出Cycleタイム thực"]
];
const SUGGEST_PLC = {
  PLC01: {
    ns: "PLC01_BASE",
    have: [
      ["Machine.Status",         "Machine Status (Run/Stop/Error) — chỉ 3 giá trị, tách được 1/5 trạng thái thời gian"],
      ["Trace.MaterialLot",      "Traceability — Mã NVL BASE (carton/pallet)"],
      ["Trace.Carrier2D",        "Traceability — Mã 2D carrier"],
      ["Trace.WindingChuck2D",   "Traceability — Mã 2D winding chuck"],
      ["Trace.Base2D",           "Traceability — Mã 2D BASE (khóa chính truy xuất)"],
      ["Quality.Base2DMatching", "Inspection — Điểm matching mã 2D BASE (grade ISO 15415)"],
      ["Quality.CCD_Result",     "Inspection — Kết quả CCD cắm phôi (OK/NG)"]
    ],
    need: [
      ["Alarm.Code", "Lịch sử lỗi — Nội dung lỗi (kèm bảng mã → nội dung)"],
      ...SUGGEST_COUNTERS,
      ["Trace.DataReady", "Trigger 1 chiều — báo phần mềm đọc khi dữ liệu 1 sản phẩm đã sẵn"],
      ["Trace.CavityIndex", "Truy vết serial-level — line ra hàng theo lô 4 cavity"],
      ["Trace.SeqNo", "Truy vết serial-level — số thứ tự để phát hiện đọc trùng / bỏ sót"]
    ]
  }
};
const SUGGEST_GENERAL = [
  ["Alarm.Code", "Lịch sử lỗi — Nội dung lỗi (kèm bảng mã → nội dung)"],
  ...SUGGEST_COUNTERS,
  ["Trace.DataReady",   "Trigger 1 chiều — báo phần mềm đọc khi dữ liệu 1 sản phẩm đã sẵn"],
  ["Trace.CavityIndex", "Truy vết serial-level — line ra hàng theo lô 4 cavity"],
  ["Trace.SeqNo",       "Truy vết serial-level — phát hiện đọc trùng / bỏ sót"]
];
function openSuggest(){
  const onDetail = document.getElementById('page-detail').classList.contains('active');
  const code = onDetail ? activePLC : null;
  const conf = code && SUGGEST_PLC[code];
  let html = `<p style="margin:0 0 12px;color:#555;font-size:12px">Dữ liệu để màn hình hiển thị đầy đủ — phần <b>Cần bổ sung</b> cần Nittoku thêm tag trên PLC:</p>`;
  const needRow = (tag,use)=>`<tr><td><code>${tag}</code></td><td><span class="pill adj">Cần bổ sung</span></td><td>${use}</td></tr>`;
  const haveRow = (tag,use)=>`<tr><td><code>${tag}</code></td><td><span class="pill ok">Có sẵn</span></td><td>${use}</td></tr>`;
  if(conf){
    const ns = conf.ns;
    html += `<table class="sg-table"><thead><tr><th>Tag</th><th>Trạng thái</th><th>Phục vụ / Ghi chú</th></tr></thead><tbody>`
      + conf.need.map(n=>needRow(`${ns}.${n[0]}`, n[1])).join('')
      + conf.have.map(h=>haveRow(`${ns}.${h[0]}`, h[1])).join('')
      + `</tbody></table>`;
    html += `<div style="font-size:11px;color:#888;margin-top:8px">Ngữ cảnh: <b>${code}</b> · namespace <code>${ns}</code></div>`;
  } else {
    html += `<table class="sg-table"><thead><tr><th>Tag (mọi PLC, namespace PLCxx_&lt;Stage&gt;)</th><th>Trạng thái</th><th>Phục vụ / Ghi chú</th></tr></thead><tbody>`
      + SUGGEST_GENERAL.map(n=>needRow(`PLCxx_<Stage>.${n[0]}`, n[1])).join('')
      + `</tbody></table>`;
    html += `<div style="font-size:11px;color:#888;margin-top:8px">Mở chi tiết 1 PLC để xem danh sách tag cụ thể của trạm đó.</div>`;
  }
  html += `<div class="sg-pending">⏳ <b>Chờ Sumida chốt:</b> ${SUGGEST_PENDING}</div>`;
  html += `<div class="sg-nodep">ℹ KHÔNG cần thêm tag: <b>Connection (PC↔PLC)</b> và phát hiện dữ liệu cũ/stale — lấy từ <b>quality flag của OPC</b> (Comm Failure / Last Known). Xác nhận theo manual DeviceXPlorer.</div>`;
  document.getElementById('suggest-body').innerHTML = html;
  document.getElementById('suggest-bd').classList.add('show');
}
function closeSuggest(){ document.getElementById('suggest-bd').classList.remove('show'); }
