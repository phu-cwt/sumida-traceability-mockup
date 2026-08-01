/* Man san luong & muc tieu, man tong hop ky, bang Cycle time + muc tieu o Cau hinh
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ══════════ MÀN SẢN LƯỢNG & MỤC TIÊU (info 1-2) ══════════ */
let prodPeriod='shift', prodDate=today0(), prodShift=currentShiftId(), prodWeekOff=0, prodMonthOff=5;
function setProdPeriod(p, btn){
  prodPeriod=p;
  btn.parentNode.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  renderProd();
}
function stepProdDate(n){ prodDate=new Date(prodDate); prodDate.setDate(prodDate.getDate()+n); renderProd(); }
function setProdDate(v){ if(v){ prodDate=dateFromIso(v); renderProd(); } }
function setProdShift(v){ prodShift=v; renderProd(); }
function stepProdWeek(n){ prodWeekOff+=n; renderProd(); }
function stepProdMonth(n){ prodMonthOff=Math.max(0,Math.min(MONTHS.length-1,prodMonthOff+n)); renderProd(); }

function renderProd(){
  const rowsEl=document.getElementById('prod-rows'); if(!rowsEl) return;
  const scope=document.getElementById('prod-scope').value || 'all';
  document.getElementById('prod-ctx').innerHTML = ctxHtml(prodPeriod, {
    stepDate:'stepProdDate', setDate:'setProdDate', setShift:'setProdShift',
    stepWeek:'stepProdWeek', stepMonth:'stepProdMonth',
    date:prodDate, shift:prodShift, weekOff:prodWeekOff, monthOff:prodMonthOff });

  const P = periodShifts(prodPeriod, prodDate, prodShift, prodWeekOff, prodMonthOff);
  const f = P.n;
  const idx = scope==='all' ? PLC_MES.map((_,i)=>i) : [Number(scope)];
  document.getElementById('prod-sub').innerHTML = `${P.sub}`
    + (P.off ? ` · <span style="color:#C9272F;font-weight:700">⚠ ${P.off}</span>` : '');

  rowsEl.innerHTML = PLC_MES.map((p,i)=>{
    const inScope = idx.includes(i);
    const c = PROD_CNT[i], run = LOSS_TS[i][1]*f, planct = PLAN_CT[i];
    if(!c || planct===null){
      return `<tr style="opacity:.7"><td class="l">${p.code} — ${p.stage}</td><td><span class="mono">${p.mes}</span></td>
        <td colspan="8" style="background:#F2F2F2;color:#777;text-align:left">
          (${T('ct.ovenna')})</td></tr>`;
    }
    if(!inScope){
      return `<tr style="opacity:.5"><td class="l">${p.code} — ${p.stage}</td><td><span class="mono">${p.mes}</span></td>
        <td colspan="8" style="background:#F6F6F6;color:#999;text-align:left">${T('ct.outscope')}</td></tr>`;
    }
    if(f===0){
      return `<tr style="opacity:.6"><td class="l">${p.code} — ${p.stage}</td><td><span class="mono">${p.mes}</span></td>
        <td colspan="8" style="background:#f0f0f0;color:#888;text-align:left">Line nghỉ kỳ này</td></tr>`;
    }
    const ok=c.ok*f, ng=c.ng*f, wip=c.wip*f, input=ok+ng+wip;
    const ctAct = run*60/ok;
    const target = Math.round(run*60/planct);
    const rate = target ? (ok/target*100) : 0;
    return `<tr class="${ng>0?'row-under':''}">
      <td class="l">${p.code} — ${p.stage}</td><td><span class="mono">${p.mes}</span></td>
      <td>${nf(input)}</td><td class="v-ok">${nf(ok)}</td><td class="v-ng">${nf(ng)}</td>
      <td style="color:#1565C0;font-weight:700">${nf(wip)}</td>
      <td>${ctAct.toFixed(1)}s</td><td>${planct.toFixed(1)}s</td><td>${nf(target)}</td>
      <td style="font-weight:800;color:${rate<97?'#C9272F':'#1E8A2E'}">${rate.toFixed(1)}%</td></tr>`;
  }).join('');

  /* KPI = sản lượng đo tại 1 điểm (không cộng dồn nhiều trạm — cộng ngang trạm là vô nghĩa) */
  const ki = scope==='all' ? LAST_PLC : Number(scope);
  const kc = PROD_CNT[ki], krun = LOSS_TS[ki][1]*f, kct = PLAN_CT[ki];
  if(!kc || kct===null || f===0){
    document.getElementById('prod-kpi').innerHTML =
      `<div class="la-kpi" style="grid-column:1/-1"><div class="lbl">Không có số liệu</div>
       <div class="val" style="font-size:14px">${f===0?'Line nghỉ kỳ này':'Công đoạn không đếm theo sản phẩm'}</div></div>`;
    return;
  }
  const ok=kc.ok*f, ng=kc.ng*f, wip=kc.wip*f, input=ok+ng+wip;
  const ctAct=krun*60/ok, target=Math.round(krun*60/kct), rate=target?(ok/target*100):0;
  document.getElementById('prod-kpi').innerHTML = `
    <div class="la-kpi"><div class="lbl">${T('pd.input')}</div><div class="jp">投入数</div><div class="val">${nf(input)}</div></div>
    <div class="la-kpi ok"><div class="lbl">${T('pd.ok')}</div><div class="jp">OK排出数</div><div class="val">${nf(ok)}</div></div>
    <div class="la-kpi ng"><div class="lbl">${T('pd.ng')}</div><div class="jp">NG排出数</div><div class="val">${nf(ng)}</div></div>
    <div class="la-kpi blue"><div class="lbl">${T('pd.ct')}</div><div class="jp">OK排出Cycleタイム</div><div class="val">${ctAct.toFixed(1)}<span style="font-size:12px">s</span></div></div>
    <div class="la-kpi warn"><div class="lbl">${T('pd.target')}</div><div class="jp">目標排出数量</div><div class="val">${nf(target)}</div></div>
    <div class="la-kpi"><div class="lbl">${T('pd.rate')}</div><div class="jp">達成率</div>
      <div class="val ov-pct ${rateTier(rate)}">${rate.toFixed(1)}%</div>
      <div class="ov-bar ${rate>=RATE_HI?'':(rate>=RATE_MID?'mid':'low')}" style="margin-top:3px"><i style="width:${Math.min(rate,100)}%"></i></div></div>`;
}

/* ══════════ MÀN TỔNG HỢP KỲ (info 1-1-7 & 1-2-6) ══════════ */
/* State kỳ RIÊNG của tab Tổng hợp (mirror tab Sản lượng) — để 3 tab dùng chung mẫu
   điều khiển ctxHtml: Phạm vi → nút Ca/Ngày/Tuần/Tháng → điều hướng 1 ngày + chọn ca. */
let aggPeriod='daily', aggDate=today0(), aggShift=currentShiftId(), aggWeekOff=0, aggMonthOff=5;
function setAggPeriod(p, btn){
  aggPeriod=p;
  btn.parentNode.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  renderAgg();
}
function stepAggDate(n){ aggDate=new Date(aggDate); aggDate.setDate(aggDate.getDate()+n); renderAgg(); }
function setAggDate(v){ if(v){ aggDate=dateFromIso(v); renderAgg(); } }
function setAggShift(v){ aggShift=v; renderAgg(); }
function stepAggWeek(n){ aggWeekOff+=n; renderAgg(); }
function stepAggMonth(n){ aggMonthOff=Math.max(0,Math.min(MONTHS.length-1,aggMonthOff+n)); renderAgg(); }
/* Suy từ CÙNG bộ số của 2 màn trên (LOSS_TS + PROD_CNT) để 3 màn không lệch nhau. */
function aggRows(){
  const scope=document.getElementById('agg-scope');
  const sv = scope ? (scope.value||'all') : 'all';
  const ki = sv==='all' ? LAST_PLC : Number(sv);
  const c = PROD_CNT[ki] || PROD_CNT[LAST_PLC];
  const run1 = LOSS_TS[ki][1];
  const out=[];
  if(aggPeriod==='shift'){
    for(let k=5;k>=0;k--){
      const d=new Date(aggDate); d.setDate(d.getDate()-Math.floor(k/2));
      const s=SHIFT_LIST[k%2]; if(!lineRuns(s,d)) continue;
      out.push(mk(`${s}<br>${ddmm(d)}`, 1, k));
    }
  } else if(aggPeriod==='daily'){
    for(let k=6;k>=0;k--){ const d=new Date(aggDate); d.setDate(d.getDate()-k);
      const n=shiftsInDay(d); if(!n) continue; out.push(mk(ddmm(d), n, k)); }
  } else if(aggPeriod==='weekly'){
    for(let k=6;k>=0;k--){ const w=weekDates(aggWeekOff-k); const n=shiftsInWeek(aggWeekOff-k);
      if(!n) continue; out.push(mk(`${ddmm(w[0])}–${ddmm(w[6])}`, n, k)); }
  } else {
    for(let k=6;k>=0;k--){ const mi=aggMonthOff-k; if(mi<0) continue;
      out.push(mk(MONTHS[mi], shiftsInMonth(mi), k)); }
  }
  function mk(lab, nShift, k){
    const w = 0.94 + jit(k,3)*0.12;                 // dao động tất định giữa các kỳ
    const ok  = Math.round(c.ok  * nShift * w);
    const ng  = Math.round(c.ng  * nShift * (2.1-w));
      const runH = +(run1 * nShift * w / 60).toFixed(1);
    const A = Math.round(run1*w/ACTUAL_MIN*100);
    const wip = Math.round(c.wip * nShift);
    return {lab, nShift, ok, ng, wip, runH, A, alm: Math.round(2 + jit(k,7)*9) * Math.max(1,Math.round(nShift/2))};
  }
  return out;
}
let aggCur=[];
function renderAgg(){
  const chart=document.getElementById('agg-chart'); if(!chart) return;
  const ctx=document.getElementById('agg-ctx');
  if(ctx) ctx.innerHTML = ctxHtml(aggPeriod, {
    stepDate:'stepAggDate', setDate:'setAggDate', setShift:'setAggShift',
    stepWeek:'stepAggWeek', stepMonth:'stepAggMonth',
    date:aggDate, shift:aggShift, weekOff:aggWeekOff, monthOff:aggMonthOff });
  const A = aggRows(); aggCur = A;
  const jp = {shift:'シフト別', daily:'日別', weekly:'週別', monthly:'月別'}[aggPeriod];
  document.getElementById('agg-chart-jp').textContent = jp;
  /* Ghi chú phạm vi + 3 điểm ranh giới kỳ cần Sumida xác nhận (ca đêm tính vào ngày nào,
     tuần bắt đầu Thứ 2, tháng dương lịch) đã chuyển sang Q&A tracker — mục B2/Q35.
     UI chỉ hiện số; thứ chờ khách trả lời theo dõi ở tracker. */
  if(!A.length){ chart.innerHTML='<div style="padding:14px;color:#888">Không có kỳ nào có ca chạy.</div>';
    document.getElementById('agg-oee-chart').innerHTML=''; document.getElementById('agg-rows').innerHTML=''; return; }

  const maxTot = Math.max(...A.map(d=>d.ok+d.ng+d.wip));
  chart.innerHTML = A.map((d,i)=>`<div class="grp" data-idx="${i}"><div class="bars">
      <div class="bar ok" style="height:${Math.round(d.ok/maxTot*160)}px"></div>
      <div class="bar ng" style="height:${Math.max(2,d.ng/maxTot*160)}px"></div>
    </div><div class="xlab">${d.lab}</div></div>`).join('');
  document.getElementById('agg-oee-chart').innerHTML = A.map((d,i)=>
    `<div class="grp" data-idx="${i}"><div class="bars">
      <div class="bar" style="height:${d.A/100*160}px;width:26px;background:${d.A<85?'#39A6D6':'#1E8A2E'}"></div>
    </div><div class="xlab">${d.lab}<br>${d.A}%</div></div>`).join('');
  document.getElementById('agg-rows').innerHTML = A.map(d=>{
    const input=d.ok+d.ng+d.wip, ngr=(d.ng/input*100).toFixed(2);
    return `<tr><td>${d.lab.replace('<br>',' ')}</td><td>${nf(input)}</td><td class="v-ok">${nf(d.ok)}</td>
      <td class="v-ng">${nf(d.ng)}</td><td>${nf(d.wip)}</td><td>${ngr}%</td><td>${nf(d.runH)}</td>
      <td style="font-weight:800;color:${d.A<85?'#B8860B':'#1E8A2E'}">${d.A}%</td><td>${nf(d.alm)}</td></tr>`;
  }).join('');
  wireAggTip();
}
let aggTipWired=false;
function wireAggTip(){
  if(aggTipWired) return; aggTipWired=true;
  ['agg-chart','agg-oee-chart'].forEach(id=>{
    const el=document.getElementById(id); if(!el) return;
    el.addEventListener('mousemove', e=>{
      const grp=e.target.closest('.grp'); if(!grp){ hideTip(); return; }
      const d=aggCur[+grp.dataset.idx]; if(!d){ hideTip(); return; }
      const input=d.ok+d.ng+d.wip;
      showTip(`<div style="font-weight:800;margin-bottom:4px">${d.lab.replace('<br>',' ')} · ${d.nShift} ca</div>`+
        `<span class="tt-sw" style="background:#2ECC40"></span>${T('th.ok')} <b>${nf(d.ok)}</b><br>`+
        `<span class="tt-sw" style="background:#E63946"></span>${T('th.ng')} <b>${nf(d.ng)}</b> <span style="color:#bbb">(${(d.ng/input*100).toFixed(2)}%)</span><br>`+
        `<span class="tt-sw" style="background:#39A6D6"></span>${T('pd.wip')} <b>${nf(d.wip)}</b><br>`+
        `<span class="tt-sw" style="background:#39A6D6"></span>${T('oee.a')} <b>${d.A}%</b> · ${T('st.actual')} ${nf(d.runH)}h · ${T('th.alarms')} ${d.alm}`, e);
    });
    el.addEventListener('mouseleave', hideTip);
  });
}
function exportAggCSV(){
  const A=aggRows();
  const head=[T('th.period'),'Số ca',T('pd.input'),T('th.ok'),T('th.ng'),T('pd.wip'),T('th.ngrate'),T('th.runh'),T('oee.a'),T('th.alarms')];
  const esc=v=>`"${String(v).replace(/"/g,'""')}"`;
  const lines=[head.map(esc).join(',')];
  A.forEach(d=>{ const input=d.ok+d.ng+d.wip;
    lines.push([d.lab.replace('<br>',' '),d.nShift,input,d.ok,d.ng,d.wip,(d.ng/input*100).toFixed(2)+'%',d.runH,d.A+'%',d.alm].map(esc).join(',')); });
  const blob=new Blob(["﻿"+lines.join("\r\n")],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='aggregation_export.csv';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
}

/* ══════════ SETTINGS — 計画Cycleタイム + 目標生産数量 mỗi PLC (info 1-4-2 · 1-4-3) ══════════ */
function setPlanCT(i,v){
  const n=parseFloat(String(v).replace(',','.'));
  if(!isNaN(n) && n>0 && n<600){ PLAN_CT[i]=+n.toFixed(1); }
  renderCT(); renderProd();
}
function setTargetQty(i,v){
  const n=parseInt(String(v).replace(/[^0-9]/g,''),10);
  if(!isNaN(n) && n>=0){ TARGET_QTY[i]=n; }
  renderCT();
}
function renderCT(){
  const el=document.getElementById('ct-rows'); if(!el) return;
  const inpCss='text-align:center;border:1px solid #bbb;border-radius:4px;padding:4px;font-family:Consolas,monospace';
  el.innerHTML = PLC_MES.map((p,i)=>{
    if(PLAN_CT[i]===null){
      return `<tr style="opacity:.75"><td class="l"><b>${p.code}</b></td><td class="l">${p.stage} <span class="mono">${p.mes}</span></td>
        <td colspan="3" style="background:#F2F2F2;color:#777;text-align:left">
          — <i>(${T('ct.ovenna')})</i></td></tr>`;
    }
    const derived = Math.round(LOSS_TS[i][1]*60/PLAN_CT[i]);
    const gap = TARGET_QTY[i]!==null ? TARGET_QTY[i]-derived : 0;
    return `<tr><td class="l"><b>${p.code}</b></td><td class="l">${p.stage} <span class="mono">${p.mes}</span></td>
      <td><input type="text" value="${PLAN_CT[i].toFixed(1)}" onchange="setPlanCT(${i},this.value)"
        title="計画Cycleタイム — ${T('set.ctunit')}" style="width:62px;${inpCss}"> <span class="small">s/pc</span></td>
      <td><input type="text" value="${nf(TARGET_QTY[i])}" onchange="setTargetQty(${i},this.value)"
        title="目標生産数量入力 — ${T('set.targetnote')}" style="width:82px;${inpCss}"></td>
      <td title="動作時間 ${LOSS_TS[i][1]}m × 60 ÷ ${PLAN_CT[i].toFixed(1)}s">${nf(derived)}
        ${gap? `<span class="small" style="color:${Math.abs(gap)>derived*0.05?'#C9272F':'#888'}">(${gap>0?'+':''}${nf(gap)})</span>`:''}</td></tr>`;
  }).join('');
}
