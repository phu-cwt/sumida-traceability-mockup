/* Bieu do phu man ton that: thoi gian/thiet bi, heatmap, pareto, donut, xu huong, drill-down, tooltip
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
function renderTsRows(idx, nShift){
  const root=document.getElementById('ts-rows');
  root.innerHTML = PLC_MES.map((p,i)=>{
    if(!idx.includes(i)){
      return `<div class="ts-row" style="opacity:.55;cursor:default">
        <div class="name">${p.code}<small>${p.mes}</small></div>
        <div class="ts-bar" style="background:#E0E0E0;justify-content:center;color:#777;font-weight:700">${T('ct.outscope')}</div>
        <div class="oee" style="color:#aaa">—</div></div>`;
    }
    const t=LOSS_TS[i], idleV=LOSS_IDLE[i], plan=ACTUAL_MIN+idleV;
    /* Mẫu số bề rộng = 実稼働(425) + downtime riêng của máy: 5 trạng thái + "Máy không
       hoạt động" (idleV, khác nhau theo máy) khớp trọn thanh. Tổng phút 14 thanh =
       Σ(425+idleV) = 5950+770 = 112h, khớp thanh toàn line. data-pct tính theo 実稼働. */
    const segs=[0,1,2,3,4].map(j=>{
      const v=t[j]; if(v===0) return '';
      const w=v/plan*100;
      return `<div class="seg" style="width:${w}%;${w<3?'min-width:6px;':''}background:${ST_HEX[j]};color:${ST_TXT[j]}"
        data-j="${j}" data-dur="${dur(v*nShift)}" data-pct="${(v/ACTUAL_MIN*100).toFixed(1)}">${dur(v*nShift)}</div>`;
    }).join('')
    + `<div class="seg" style="width:${idleV/plan*100}%;background:var(--st-idle);color:#fff"
        data-j="5" data-dur="${dur(idleV*nShift)}" data-pct="—">${dur(idleV*nShift)}</div>`;
    const o=Math.round(t[1]/ACTUAL_MIN*100);
    return `<div class="ts-row" onclick="openMachine(${i})" title="${TF('ct.clickdetail', p.code)}">
      <div class="name">${p.code}<small>${p.mes}</small></div>
      <div class="ts-bar">${segs}</div>
      <div class="oee" style="color:${o<75?'#C9272F':(o<85?'#B8860B':'#1E8A2E')}">${o}%</div></div>`;
  }).join('');
  fitLabels();
}
function fitLabels(){
  document.querySelectorAll('#ts-rows .seg').forEach(el=>{
    el.textContent = el.dataset.dur;
    if(el.scrollWidth > el.clientWidth + 1) el.textContent = '';
  });
}
let fitRAF;
window.addEventListener('resize', ()=>{ cancelAnimationFrame(fitRAF); fitRAF=requestAnimationFrame(fitLabels); });

/* 7 kỳ gần nhất — dùng chung cho Heatmap & Xu hướng */
function recentCols(){
  const cols=[];
  if(lossPeriod==='shift' || lossPeriod==='daily'){
    for(let k=6;k>=0;k--){ const dt=new Date(lossDate); dt.setDate(dt.getDate()-k);
      cols.push({lab:`${WDAYS[wdIdx(dt)]}<br>${ddmm(dt)}`, dt}); }
  } else if(lossPeriod==='weekly'){
    for(let k=6;k>=0;k--){ const w=weekDates(lossWeekOff-k); cols.push({lab:`${ddmm(w[0])}`}); }
  } else {
    const [mm,yy]=MONTHS[lossMonthOff].split('/').map(Number);
    for(let k=6;k>=0;k--){ const d=new Date(yy,mm-1-k,1); cols.push({lab:`${String(d.getMonth()+1).padStart(2,'0')}<br>${d.getFullYear()}`}); }
  }
  return cols;
}
function periodCap(){
  return lossPeriod==='shift'  ? `7 ngày gần nhất · cùng ca ${lossShift}`
       : lossPeriod==='daily'  ? `7 ngày gần nhất`
       : lossPeriod==='weekly' ? `7 tuần gần nhất` : `7 tháng gần nhất`;
}
function renderHeat(){
  const cols=recentCols();
  document.getElementById('loss-heat-ttl').textContent = periodCap();
  const head=`<tr><th class="plc" style="text-align:left">PLC</th>${cols.map(c=>`<th>${c.lab}</th>`).join('')}</tr>`;
  const body=PLC_MES.map((p,i)=>{
    const baseA=LOSS_TS[i][1]/ACTUAL_MIN;
    const cells=cols.map((c,ci)=>{
      let off=false;
      if(c.dt){ off = lossPeriod==='shift' ? !lineRuns(lossShift,c.dt) : shiftsInDay(c.dt)===0; }
      if(off) return `<td class="off" title="${p.code}: ${T('ct.lineoffperiod')}">–</td>`;
      let o=baseA*(0.92+jit(i,ci)*0.14); if(o>0.985)o=0.985;
      const v=Math.round(o*100), col=v<75?'#C9272F':(v<85?'#E8A33D':'#2E9E4F');
      return `<td class="hm" style="background:${col}" title="${p.code}: 実稼働率 ${v}%">${v}</td>`;
    }).join('');
    return `<tr><td class="plc">${p.code}</td>${cells}</tr>`;
  }).join('');
  document.getElementById('loss-heat').innerHTML=`<table class="heat">${head}${body}</table>`;
}
function renderPareto(sum, actual, idle){
  /* Xếp hạng nguyên nhân tổn thất: chờ/lỗi/điều chỉnh/kiểm tra (bỏ 'chạy'=1) +
     "Máy không hoạt động" (idle) — coi là tổn thất khả dụng (Availability loss).
     Chỉ ảnh hưởng bảng Pareto; công thức 実稼働率/OEE ở renderLoss giữ nguyên. */
  const cats=[0,2,3,4].map(j=>({k:T(ST_KEYS[j]), v:sum[j], c:ST_HEX[j]}))
    .concat([{k:T('st.idle'), v:idle, c:'var(--st-idle)'}])
    .sort((a,b)=>b.v-a.v);
  const total=cats.reduce((s,x)=>s+x.v,0)||1, max=cats[0].v||1;
  document.getElementById('loss-pareto').innerHTML=cats.map(x=>{
    const share=(x.v/total*100).toFixed(0);
    return `<div class="par-row" title="${x.k}: ${hm(x.v)} (${share}% ${T('lo.lossword')})">
      <div class="plbl">${x.k}</div>
      <div class="par-bar"><div class="fill" style="width:${x.v/max*100}%;background:${x.c}"></div></div>
      <div class="pval">${dur(x.v)} · ${share}%</div></div>`;
  }).join('');
  /* Idle nằm ngoài 実稼働 → khi tính nó là tổn thất, mẫu số tham chiếu của dòng
     chú thích phải là 計画稼動 (actual+idle) mới có nghĩa; công thức 実稼働率/OEE
     ở renderLoss không đổi. */
  document.getElementById('loss-pareto-note').innerHTML =
    `${T('lo.totalloss')} <b>${dur(total)}</b> / ${T('st.planned')} ${dur(actual+idle)} · ${T('lo.topcause')} <b>${cats[0].k}</b> (${(cats[0].v/total*100).toFixed(0)}%).`;
}
function renderDonut(sum, idle, planned, A){
  let acc=0; const pc=v=>v/planned*100;
  const stop=v=>{const a=acc,b=acc+pc(v);acc=b;return `${a}% ${b}%`;};
  document.getElementById('loss-donut').style.background =
    `conic-gradient(${ST_HEX[0]} ${stop(sum[0])},${ST_HEX[1]} ${stop(sum[1])},${ST_HEX[2]} ${stop(sum[2])},${ST_HEX[3]} ${stop(sum[3])},${ST_HEX[4]} ${stop(sum[4])},var(--st-idle) ${stop(idle)})`;
  document.getElementById('loss-oee').textContent = (A*100).toFixed(1)+'%';
  document.getElementById('loss-legend').innerHTML =
    [0,1,2,3,4].map(j=>`<div><i class="sw" style="background:${ST_HEX[j]}"></i>${T(ST_KEYS[j])} · ${dur(sum[j])} (${pc(sum[j]).toFixed(1)}%)</div>`).join('')
    + `<div><i class="sw" style="background:var(--st-idle)"></i>${T('st.idle')} · ${dur(idle)} (${pc(idle).toFixed(1)}%)</div>`;
}
function renderLossTrend(){
  const cols=recentCols();
  document.getElementById('loss-trend-ttl').textContent = periodCap();
  document.getElementById('loss-trend').innerHTML = cols.map((c,ci)=>{
    let v=Math.round((0.82 + (jit(5,ci)-0.5)*0.14)*100); v=Math.max(70,Math.min(90,v));
    const col=v<75?'#C9272F':(v<85?'#F2C014':'#2ECC40');
    return `<div class="tg" title="${c.lab.replace('<br>',' ')} · 実稼働率 ${v}%">
      <div class="tb" style="height:${v/100*215}px;background:${col}"></div>
      <div class="tx">${c.lab}<br><b>${v}%</b></div></div>`;
  }).join('');
}
function openMachine(i){
  const p=PLC_MES[i], t=LOSS_TS[i], tot=ACTUAL_MIN, c=PROD_CNT[i];
  const A=t[1]/tot;
  const cats=[0,2,3,4].map(j=>[T(ST_KEYS[j]),t[j],ST_HEX[j]]).sort((a,b)=>b[1]-a[1]);
  const maxL=cats[0][1]||1;
  const trend=Array.from({length:7},(_,d)=>{let o=A*(0.92+jit(i,d)*0.14);if(o>0.985)o=0.985;return Math.round(o*100);});
  const ct = c ? (t[1]*60/c.ok) : null;
  document.getElementById('mc-title').textContent=`${p.code} — ${p.stage}  ·  ${p.mes} ${p.mesName}`;
  document.getElementById('mc-body').innerHTML=`
    <div class="la-kpi-bar" style="grid-template-columns:repeat(4,1fr);border-width:1px;padding:8px;margin-bottom:14px">
      <div class="la-kpi blue"><div class="lbl">${T('oee.a')}</div><div class="val">${(A*100).toFixed(1)}%</div></div>
      <div class="la-kpi ok"><div class="lbl">${T('st.run')}</div><div class="val">${hm(t[1])}</div></div>
      <div class="la-kpi ng"><div class="lbl">${T('st.loss')}</div><div class="val">${hm(tot-t[1])}</div></div>
      <div class="la-kpi"><div class="lbl">${T('pd.ct')}</div><div class="val">${ct?ct.toFixed(1)+'s':'—'}</div></div>
    </div>
    <b style="font-size:13px">${T('mc.causes')}</b>
    <div style="margin-top:8px">${cats.map(x=>`<div class="par-row"><div class="plbl">${x[0]}</div>
      <div class="par-bar"><div class="fill" style="width:${x[1]/maxL*100}%;background:${x[2]}"></div></div>
      <div class="pval">${hm(x[1])}</div></div>`).join('')}</div>
    <b style="font-size:13px;display:block;margin-top:14px">${T('mc.trend')}</b>
    <div class="trend" style="height:120px;margin-top:6px">${trend.map((v,d)=>`<div class="tg">
      <div class="tb" style="height:${v/100*95}px;background:${v<75?'#C9272F':(v<85?'#E8A33D':'#2E9E4F')}"></div>
      <div class="tx">${WDAYS[d]}<br><b>${v}%</b></div></div>`).join('')}</div>
    <div class="note" style="margin-top:14px">${TF('mc.links', p.code, p.mes)}</div>`;
  document.getElementById('mc-bd').classList.add('show');
}
function closeMachine(){ document.getElementById('mc-bd').classList.remove('show'); }

/* ══════════ Tooltip cho segment thời gian ══════════ */
let tsTipWired=false;
function wireTsTip(){
  if(tsTipWired) return; tsTipWired=true;
  ['ts-rows','loss-bar','rt-timeline'].forEach(id=>{
    const root=document.getElementById(id); if(!root) return;
    root.addEventListener('mousemove', e=>{
      const fut=e.target.closest('.tl-future');
      if(fut){ showTip(`<span class="tt-sw" style="background:var(--st-future)"></span>${T('tl.future')} — chưa chạy tới, còn trong kế hoạch <span style="color:#bbb">(còn ${fut.dataset.dur})</span>`, e); return; }
      const idl=e.target.closest('.tl-idle');
      if(idl){ showTip(`<span class="tt-sw" style="background:var(--st-idle)"></span>${T('st.idle')}<br><span class="tt-time">${idl.dataset.from} → ${idl.dataset.to}</span> <span style="color:#bbb">(${idl.dataset.dur})</span>`, e); return; }
      const off=e.target.closest('.tl-off');
      if(off){ showTip(`<span class="tt-sw" style="background:#E2E2E2"></span>Line nghỉ ca này`, e); return; }
      const tl=e.target.closest('.tl-seg');
      if(tl){ const s=+tl.dataset.s;
        showTip(`<span class="tt-sw" style="background:${ST_HEX[s]}"></span>${T(ST_KEYS[s])}<br><span class="tt-time">${tl.dataset.from} → ${tl.dataset.to}</span> <span style="color:#bbb">(${tl.dataset.dur})</span>`, e); return; }
      const seg=e.target.closest('.seg,.lb-seg');
      if(!seg){ hideTip(); return; }
      const j=+seg.dataset.j;
      const name = j===5 ? T('st.idle') : T(ST_KEYS[j]);
      showTip(`<span class="tt-sw" style="background:${j===5?'var(--st-idle)':ST_HEX[j]}"></span>${name} · <span class="tt-time">${seg.dataset.dur}</span>`
        + (seg.dataset.pct && seg.dataset.pct!=='—' ? ` <span style="color:#bbb">(${seg.dataset.pct}% ${T('st.actual')})</span>` : ''), e);
    });
    root.addEventListener('mouseleave', hideTip);
  });
}
function showTip(html, e){
  const tip=document.getElementById('ts-tip');
  tip.innerHTML=html; tip.style.display='block';
  let x=e.clientX+14, y=e.clientY+16;
  if(x+tip.offsetWidth>window.innerWidth-8)  x=e.clientX-tip.offsetWidth-14;
  if(y+tip.offsetHeight>window.innerHeight-8) y=e.clientY-tip.offsetHeight-16;
  tip.style.left=x+'px'; tip.style.top=y+'px';
}
function hideTip(){ const t=document.getElementById('ts-tip'); if(t) t.style.display='none'; }
