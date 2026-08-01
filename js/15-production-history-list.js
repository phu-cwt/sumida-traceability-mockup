/* Man Lich su san xuat theo line — danh sach san pham (serial) da chay + NVL dau vao,
   click 1 dong -> nhay sang Truy xuat Serial. Chay tren DATA THAT (MOCK_DATA.serials).
   Tach rieng file theo quy tac module hoa; nap sau cac file dinh nghia MOCK_DATA/PLC_MES. */

/* dd/mm/yyyy -> yyyy-mm-dd de so sanh chuoi voi startedAt ("yyyy-mm-dd hh:mm:ss").
   Tra null neu o trong/khong hop le => coi nhu khong gioi han dau do. */
function plDateToIso(s){
  s = String(s || '').trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;              // input type=date đã là yyyy-mm-dd
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);    // hỗ trợ cả dd/mm/yyyy
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
}
/* "yyyy-mm-dd hh:mm:ss" -> "dd/mm/yyyy hh:mm" (ngay/thang/nam gio:phut day du). */
function plFmtDateTime(ts){
  if(!ts) return '';
  const d = ts.slice(0, 10).split('-').reverse().join('/'), t = ts.slice(11, 16);
  return t ? d + ' ' + t : d;
}

/* NVL dau vao = 材料投入信息 — chuoi ngan bang `^`: ma^maVL^tenVL^LOT^SL^donvi^^HSD^^KQ.
   Data that: BASE dau line (N6013-1.C001) chi ghi o 4/35 serial → quet cac cong doan THEO
   THU TU LINE (MOCK_DATA.processes), lay chuoi material SOM NHAT ghi duoc → phu 100%.
   Rut gon "LOT · ten · SL" cho o bang; giu nguyen van o tooltip de khong cut cut LOT NO. */
function plIsMaterial(v){ return typeof v === 'string' && v.split('^').length >= 8; }
/* Tra ve {lot, code, name, qty, raw}:
     lot  = f[3] (ma LOT)      · code = f[1] (ma vat lieu, luon co)
     name = f[2] (ten vat lieu, co the rong) · qty = f[4]+don vi
   null neu serial khong co chuoi material nao. */
function plMaterial(serial){
  for(const proc of MOCK_DATA.processes){
    const rec = serial.recs && serial.recs[proc.code];
    if(!rec || !rec.q) continue;
    for(const k of Object.keys(rec.q)){
      if(!plIsMaterial(rec.q[k])) continue;
      const f = rec.q[k].split('^');
      return { lot: f[3] || '—', code: f[1] || '—', name: f[2] || '',
               qty: (f[4] || '') + (f[5] ? ' ' + f[5] : ''), raw: rec.q[k] };
    }
  }
  return null;
}

/* Ma cong doan MES thuoc 1 PLC (1 PLC co the co nhieu cong doan, vd PLC14). */
function plProcCodesOfPlc(plc){
  return MOCK_DATA.processes.filter(x => x.plc === plc).map(x => x.code);
}

/* Loc + sap xep danh sach san pham theo bo filter hien tai — DUNG CHUNG cho render bang
   va xuat CSV, de file xuat luon khop dung nhung gi dang hien tren man. */
function plFilteredRows(){
  const scopeEl = document.getElementById('pl-scope');
  const scope = (scopeEl && scopeEl.value) || 'all';
  const plcCodes = scope === 'all' ? null : plProcCodesOfPlc(PLC_MES[Number(scope)].code);
  const fromIso = plDateToIso(document.getElementById('pl-from').value);
  const toIso   = plDateToIso(document.getElementById('pl-to').value);
  const q    = (document.getElementById('pl-serial').value || '').trim().toUpperCase();
  const lotQ = (document.getElementById('pl-lot').value    || '').trim().toUpperCase();
  const matQ = (document.getElementById('pl-mat').value    || '').trim().toUpperCase();

  const serials = MOCK_DATA.serials;
  const rows = Object.keys(serials).map(sn => ({ sn, s: serials[sn] })).filter(({ sn, s }) => {
    if(q && !sn.toUpperCase().includes(q)) return false;
    if(plcCodes && !plcCodes.some(c => s.recs && s.recs[c])) return false;   // co chay tren line do
    const d = (s.startedAt || '').slice(0, 10);
    if(fromIso && d && d < fromIso) return false;
    if(toIso   && d && d > toIso)   return false;
    if(lotQ || matQ){
      const m = plMaterial(s);
      if(lotQ && !(m && m.lot.toUpperCase().includes(lotQ))) return false;
      if(matQ && !(m && (m.code.toUpperCase().includes(matQ) || m.name.toUpperCase().includes(matQ)))) return false;
    }
    return true;
  });
  rows.sort((a, b) => (a.s.startedAt || '').localeCompare(b.s.startedAt || ''));
  return rows;
}

function renderProdList(){
  const tb = document.getElementById('pl-rows'); if(!tb) return;
  const rows = plFilteredRows();
  const cnt = document.getElementById('pl-count');
  if(cnt) cnt.textContent = `${rows.length} ${T('pl.unit')}`;

  if(!rows.length){
    tb.innerHTML = `<tr><td colspan="9" style="text-align:center;color:#888;padding:16px">${T('pl.empty')}</td></tr>`;
    return;
  }
  tb.innerHTML = rows.map(({ sn, s }, i) => {
    const startTxt = plFmtDateTime(s.startedAt), endTxt = plFmtDateTime(s.endedAt);
    const dash = '<span style="color:#aaa">—</span>';
    const kq = s.finalJudge && s.finalJudge.trim() ? s.finalJudge : dash;
    const m = plMaterial(s);
    const nm = m && m.name ? (m.name.length > 24 ? m.name.slice(0, 23) + '…' : m.name) : '';
    const matCell = m
      ? `<span style="font-family:Consolas,monospace">${m.code}</span>${nm ? `<br><small style="color:#888">${nm}</small>` : ''}`
      : dash;
    return `<tr style="cursor:pointer" onclick="openProdPanel('${sn}')" title="${TF('ct.clickdetail', sn)}">
      <td>${i + 1}</td>
      <td style="font-family:Consolas,monospace;font-weight:700;color:#1565C0">${sn}</td>
      <td>${startTxt || dash}</td><td>${endTxt || dash}</td>
      <td>${s.nProc || '—'}/14</td>
      <td style="font-family:Consolas,monospace;color:#B8860B;font-weight:700">${m ? m.lot : dash}</td>
      <td style="text-align:left"${m ? ` title="${m.raw.replace(/"/g, '&quot;')}"` : ''}>${matCell}</td>
      <td>${m ? m.qty : dash}</td>
      <td>${kq}</td></tr>`;
  }).join('');
}

/* Click 1 san pham -> mo PANEL tai cho (khong nhay tab): tom tat serial + hanh trinh
   cong doan + NVL dau vao. Co nut mo Truy xuat Serial day du neu can xem chi tiet field. */
function openProdPanel(sn){
  const s = MOCK_DATA.serials[sn]; if(!s) return;
  document.getElementById('pl-panel-title').textContent = sn;
  const m = plMaterial(s);
  const kq = s.finalJudge && s.finalJudge.trim() ? s.finalJudge : '—';
  const matTxt = m
    ? `<b style="color:#B8860B">${m.lot}</b> · ${m.code}${m.name ? ' · ' + m.name : ''}${m.qty ? ' · ' + m.qty : ''}`
    : '—';
  const info = `<div style="display:grid;grid-template-columns:auto 1fr;gap:6px 16px;font-size:13px;margin-bottom:14px">
      <b>${T('pl.start')}</b><span>${plFmtDateTime(s.startedAt) || '—'}</span>
      <b>${T('pl.end')}</b><span>${plFmtDateTime(s.endedAt) || '—'}</span>
      <b>${T('pl.nproc')}</b><span>${s.nProc || '—'}/14</span>
      <b>${T('pl.result')}</b><span>${kq}</span>
      <b>${T('pl.matinput')}</b><span>${matTxt}</span>
    </div>`;
  const passed = MOCK_DATA.processes.filter(p => s.recs && s.recs[p.code]);
  const journey = passed.map(p => {
    const r = s.recs[p.code];
    return `<div style="display:flex;gap:12px;padding:5px 0;border-bottom:1px solid #eee;font-size:12px">
      <span style="font-family:Consolas,monospace;color:#1565C0;min-width:118px">${plFmtDateTime(r.ts)}</span>
      <span style="font-family:Consolas,monospace;color:#777;min-width:80px">${p.code}</span>
      <span>${TD(p.nameVi)}</span></div>`;
  }).join('');
  document.getElementById('pl-panel-body').innerHTML = info
    + `<b style="font-size:13px">${T('pl.journey')} <span style="color:#888;font-weight:400">(${passed.length}/14)</span></b>`
    + `<div style="margin-top:8px">${journey}</div>`
    + `<div style="margin-top:16px;text-align:right">
         <button class="btn" onclick="openProdTraceFull('${sn}')">${T('pl.fulltrace')} →</button>
       </div>`;
  document.getElementById('pl-bd').classList.add('show');
}
function closeProdPanel(){ const b = document.getElementById('pl-bd'); if(b) b.classList.remove('show'); }
/* Nut trong panel: mo tab Truy xuat Serial day du cho serial nay. */
function openProdTraceFull(sn){
  closeProdPanel();
  goTab('trace');
  const inp = document.getElementById('serial-input');
  if(inp) inp.value = sn;
  if(typeof loadTrace === 'function') loadTrace();
}

/* Xuat CSV dung bo filter dang chon (khop bang tren man) — them cot Ten vat lieu de day du.
   BOM UTF-8 (﻿) de Excel doc dung tieng Viet; ngat dong CRLF. */
function exportProdListCSV(){
  const rows = plFilteredRows();
  const head = [T('th.no'), T('th.serial'), T('pl.start'), T('pl.end'), T('pl.nproc'),
                T('pl.lot'), T('pl.matname'), T('pl.matname') + ' (tên)', T('pl.qty'), T('pl.result')];
  const esc = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
  const lines = [head.map(esc).join(',')];
  rows.forEach(({ sn, s }, i) => {
    const m = plMaterial(s);
    lines.push([
      i + 1, sn, s.startedAt || '', s.endedAt || '', `${s.nProc || ''}/14`,
      m ? m.lot : '', m ? m.code : '', m ? m.name : '', m ? m.qty : '',
      (s.finalJudge && s.finalJudge.trim()) ? s.finalJudge : ''
    ].map(esc).join(','));
  });
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tra_cuu_san_pham.csv';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
}
