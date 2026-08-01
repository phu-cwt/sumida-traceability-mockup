/* Truy vet serial-level tren data that: 3 trang thai the, tach chuoi 材料投入信息
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ============ SERIAL TRACE — chạy trên DATA THẬT (mock-data.js) ============
   Truy vết SERIAL-LEVEL (per-product) — chốt 30/07/2026.
   Mỗi thẻ = 1 công đoạn MES thật (mã N-xxxx), có 3 trạng thái, không chỉ 2:
     1. có dữ liệu           → hiện số đo thật (+ phán định OK/NG nếu công đoạn có)
     2. không đọc được mã    → ERROR / CCD OFF / NUL (công đoạn CÓ chạy)
     3. chưa tới công đoạn   → không có dòng nào trong MES export
   Ranh giới 2 vs 3 quan trọng: (2) là mất mã, (3) là chưa gia công. */
const PROCS = MOCK_DATA.processes;

/* Chỉ số camera lưu ảnh NG theo PLC (nguồn: sheet `Initial concept` — 10 controller / 13 head) */
const CAM_LIST = [
  {id:'CCD-2', plc:'PLC01', ctrl:'CV-X350F', head:'CA-H500MX', n:1, use:'KT lắp BASE',            defects:['Lệch lắp BASE','Mã 2D BASE không đọc được']},
  {id:'CCD-3', plc:'PLC03', ctrl:'CV-X450F', head:'CA-H500MX', n:1, use:'KT đi dây (wiring)',     defects:['Sai vị trí dây','Dây chồng']},
  {id:'CCD-4', plc:'PLC05', ctrl:'CV-X350F', head:'CA-H500MX', n:2, use:'KT lắp CORE',            defects:['CORE chưa vào hết','Nghiêng CORE']},
  {id:'IV4',   plc:'PLC06', ctrl:'IV4-CP70', head:'IV4-G500CA', n:2, use:'KT nứt CASE',           defects:['Nứt CASE','Xước CASE']},
  {id:'CCD-7', plc:'PLC09', ctrl:'CV-X450F', head:'CA-H500MX', n:1, use:'KT lắp HOOP',            defects:['HOOP lệch','HOOP thiếu']},
  {id:'3D',    plc:'PLC11', ctrl:'XG-X2900', head:'XT-060',    n:2, use:'KT hàn thiếc 3D',        defects:['Chiều cao thiếc thấp','Thể tích thiếc thiếu','Thiếc lệch chân']},
  {id:'IX',    plc:'PLC12', ctrl:'IX-CP50',  head:'IX-055',    n:2, use:'Đo cao COVER',           defects:['Cao lắp COVER vượt dải','COVER hở']},
  {id:'CCD-8', plc:'PLC14', ctrl:'CV-X350F', head:'CA-H500MX', n:1, use:'KT vị trí PIN connector',defects:['Lệch vị trí PIN','PIN cong']},
  {id:'CCD-9', plc:'PLC14', ctrl:'CV-X320F', head:'CA-H200MX', n:1, use:'KT in ấn',               defects:['Mất nét in','In lệch']}
];

function traceKey(v){ return String(v||'').trim().toUpperCase(); }
function isNoCode(v){
  const s = String(v==null?'':v).replace(/\u0000/g,'').trim();
  return s==='' || s==='ERROR' || s==='CCD OFF';
}
/* Công đoạn có dữ liệu nhưng mọi trường nhận dạng đều rỗng/ERROR/CCD OFF → "không đọc được mã" */
function recNoCode(rec){
  const vals = Object.values(rec.q);
  if(!vals.length) return true;
  return vals.every(v => v===null || isNoCode(v));
}
function fmtQVal(v){
  if(v===null) return 'null';
  if(typeof v === 'number') return String(v);
  const s = String(v);
  return s.length > 26 ? s.slice(0,24)+'…' : (s===''? '(rỗng)' : s);
}
/* 材料投入信息 — data thật đóng gói nhiều thông tin trong 1 chuỗi ngăn bằng `^`:
     B04^0070015699^BASE-AS11423-F2P-CS^H512185901K2^364^PC^^2026-04-04^^Pass
      0      1(mã VL)      2(tên VL)        3(LOT NO)  4(SL) 5(đv) 6/7(ngày) 9(KQ)
   KHÔNG được cắt cụt chuỗi này: `LOT NO` là thứ dùng để khoanh vùng thu hồi khi
   phát hiện lô vật liệu lỗi. Tách ra hiển thị, giữ nguyên văn ở tooltip. */
function isMaterialStr(v){ return typeof v==='string' && v.split('^').length >= 8; }
function materialRows(v){
  const f = String(v).split('^');
  const lot = f[3]||'—', name = f[2]||f[1]||'—', qty = f[4]||'', unit = f[5]||'';
  const dates = [f[6],f[7]].filter(Boolean);
  const res = f[9]||'';
  const out = [`<div class="qrow"><span>LOT NO</span><span style="color:#B8860B">${lot}</span></div>`];
  out.push(`<div class="qrow"><span>${T('mt.name')}</span><span>${name.length>16?name.slice(0,15)+'…':name}</span></div>`);
  if(qty)         out.push(`<div class="qrow"><span>${T('mt.qty')}</span><span>${qty}${unit?' '+unit:''}</span></div>`);
  if(dates.length)out.push(`<div class="qrow"><span>${T('mt.exp')}</span><span>${dates[dates.length-1]}</span></div>`);
  if(res)         out.push(`<div class="qrow"><span>${T('mt.result')}</span><span style="color:${/pass/i.test(res)?'#1E8A2E':'#C9272F'}">${res}</span></div>`);
  return out.join('');
}
function fieldLabel(proc, k){
  const f = proc.fields[k];
  if(!f) return k;
  const lang = currentLang;
  const txt = (lang==='zh' && f.zh) ? f.zh : (f.vi || k);
  return `${k} · ${txt}`;
}
function loadTrace(){
  const raw = traceKey(document.getElementById('serial-input').value);
  const S = MOCK_DATA.serials[raw];
  const T = k => I18N[currentLang][k] || I18N.vi[k] || k;

  if(!S){
    document.getElementById('trace-meta').innerHTML =
      `<div style="grid-column:1/-1;color:#C9272F;font-weight:700">${TF('tr.notfound', `<span style="font-family:Consolas,monospace">${raw||'—'}</span>`, MOCK_DATA.meta.srcSerials.toLocaleString('en-US'))}</div>`;
    document.getElementById('trace-track').innerHTML = '';
    document.getElementById('trace-notes').innerHTML = '';
    return;
  }

  const nWith  = Object.keys(S.recs).length;
  const nNoCode = Object.values(S.recs).filter(recNoCode).length;
  document.getElementById('trace-meta').innerHTML = `
    <div><div class="lbl">${T('th.serial')}</div><div class="val">${raw}</div></div>
    <div><div class="lbl">Model / mã SP</div><div class="val">${MOCK_DATA.meta.model} · ${MOCK_DATA.meta.partNo}</div></div>
    <div><div class="lbl">Lô sản xuất (tham chiếu)</div><div class="val" style="color:#888">${MOCK_DATA.meta.project} · ${MOCK_DATA.meta.shiftCode}</div></div>
    <div><div class="lbl">Bắt đầu</div><div class="val">${S.startedAt||'—'}</div></div>
    <div><div class="lbl">Công đoạn ghi nhận</div><div class="val">${nWith} / ${PROCS.length}</div></div>
    <div><div class="lbl">${T('th.judge')}</div><div class="val">${
      S.finalJudge==='NG' ? '<span class="pill ng">NG</span>'
      : S.finalJudge==='OK' ? '<span class="pill ok">OK</span>'
      : `<span class="pill stop">${T('tr.nojudge')}</span>`}</div></div>`;

  document.getElementById('trace-track').innerHTML = PROCS.map((p,i)=>{
    const rec = S.recs[p.code];
    let cls, tag, body;
    if(!rec){
      cls='nodata'; tag=`<span class="tag" style="background:#B0B0B0">—</span>`;
      body = `<div class="data" style="color:#9a9a9a">${T('tag.notyet')}</div>`;
    } else if(recNoCode(rec)){
      cls='nocode'; tag=`<span class="tag" style="background:#7a7a7a">?</span>`;
      const shown = Object.entries(rec.q).map(([k,v])=>String(v==null?'':v).replace(/\u0000/g,'')||'(rỗng)')[0];
      body = `<div class="data"><b>${shown||'(rỗng)'}</b><br><span style="color:#666">${T('tag.nocode')} — ${T('tr.nocodetail')}</span></div>`;
    } else {
      cls = rec.judge==='NG' ? 'ng' : (rec.judge==='OK' ? 'ok' : '');
      tag = rec.judge ? `<span class="tag ${rec.judge==='NG'?'ng':'ok'}">${rec.judge}</span>` : '';
      const rows = Object.entries(rec.q).map(([k,v])=>{
        const f = p.fields[k] || {};
        const lab = (currentLang==='zh' && f.zh) ? f.zh : (f.vi ? TD(f.vi) : k);
        const tip = `${k} · ${(f.zh||'')}${f.vi?' / '+TD(f.vi):''}`;
        // Chuỗi 材料投入信息 (ngăn bằng ^) → tách ra, KHÔNG cắt cụt làm mất LOT NO
        if(isMaterialStr(v))
          return `<div class="qrow" style="border-bottom:none;padding-top:3px" title="${tip}
${v}"><span style="font-weight:700;color:#333">${lab}</span><span></span></div>` + materialRows(v);
        return `<div class="qrow${isNoCode(v)?' warn':''}" title="${tip}">
                  <span>${lab}</span><span>${fmtQVal(v)}${f.unit?' '+f.unit:''}</span></div>`;
      }).join('');
      body = `<div class="data">${rows}</div>`;
    }
    const cam = CAM_LIST.find(c=>c.plc===p.plc);
    return `<div class="step ${cls}">
      <div class="no">${p.code}</div>
      <div class="plcref">${p.plc}${p.serialFrom!=='serial'?' · serial ở '+p.serialFrom:''}</div>
      <div class="nm">${p.nameZh} · ${currentLang==='en'?p.nameEn:TD(p.nameVi)}</div>
      <div class="res"><span>${rec? rec.ts.slice(11,16) : '—'}</span>${tag}</div>
      ${(cam && rec && cls!=='nodata')?`<div class="thumb" onclick="openImg('${raw}')">📷 ${cam.id} ${cam.ctrl}</div>`:''}
      ${body}
    </div>`;
  }).join('');

  /* Note caveat chất lượng data đã gỡ khỏi UI cho gọn — chi tiết vẫn ở Q&A doc. */
  const tn=document.getElementById('trace-notes'); if(tn) tn.innerHTML='';
}
function printTrace(){ window.print(); }
