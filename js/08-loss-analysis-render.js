/* Man phan tich ton that: thanh bar 5 trang thai + 2 dau ngoac + KPI
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ══════════ MÀN PHÂN TÍCH TỔN THẤT ══════════ */
const _lc = lastCompletedRunningShift();
let lossPeriod='shift', lossDate=_lc.date, lossShift=_lc.shift, lossWeekOff=0, lossMonthOff=5;

function fillScopeSelects(){
  const opts = `<option value="all">Toàn line (14 PLC)</option>` +
    PLC_MES.map((p,i)=>`<option value="${i}">${p.code} — ${p.stage}</option>`).join('');
  ['loss-scope','prod-scope'].forEach(id=>{
    const el=document.getElementById(id); if(!el) return;
    const keep = el.value; el.innerHTML = opts; if(keep) el.value = keep;
  });
  const agg=document.getElementById('agg-scope');
  if(agg){ const keep=agg.value; agg.innerHTML=opts; if(keep) agg.value=keep; }
}
/* Chú giải chỉ liệt kê TRẠNG THÁI MÁY. Ô xám nhạt "chưa tới" không nằm ở đây: nó không
   phải trạng thái, chỉ là phần thời gian chưa xảy ra — bản thân ô đã ghi sẵn chữ
   "Chưa tới" nên không cần chú giải nhắc lại. */
function renderLegends(){
  const html = ST_KEYS.map((k,j)=>`<span><i class="sw" style="background:${ST_HEX[j]}"></i>${T(k)}</span>`).join('')
    + `<span><i class="sw" style="background:var(--st-idle)"></i>${T('st.idle')}</span>`;
  ['legend-rt','legend-loss'].forEach(id=>{ const el=document.getElementById(id); if(el) el.innerHTML=html; });
}
function setLossPeriod(p, btn){
  lossPeriod=p;
  btn.parentNode.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  renderLoss();
}
function stepLossDate(n){ lossDate=new Date(lossDate); lossDate.setDate(lossDate.getDate()+n); renderLoss(); }
function setLossDate(v){ if(v){ lossDate=dateFromIso(v); renderLoss(); } }
function setLossShift(v){ lossShift=v; renderLoss(); }
function stepLossWeek(n){ lossWeekOff+=n; renderLoss(); }
function stepLossMonth(n){ lossMonthOff=Math.max(0,Math.min(MONTHS.length-1,lossMonthOff+n)); renderLoss(); }

function ctxHtml(period, o){
  const dstep=(fn,lbl)=>`<button class="dstep" onclick="${fn}(-1)">‹</button><b style="min-width:112px;text-align:center;display:inline-block">${lbl}</b><button class="dstep" onclick="${fn}(1)">›</button>`;
  const dnav=(stepFn,setFn,dt)=>`<button class="dstep" onclick="${stepFn}(-1)">‹</button>`+
    `<input type="date" class="ctx-date" value="${iso(dt)}" onchange="${setFn}(this.value)">`+
    `<button class="dstep" onclick="${stepFn}(1)">›</button>`;
  if(period==='shift')
    return dnav(o.stepDate,o.setDate,o.date) + `<span style="margin-left:6px">${T('pr.shift')}:</span>`+
      `<select class="ctx-sel" onchange="${o.setShift}(this.value)">`+
      SHIFT_LIST.map(s=>`<option value="${s}"${s===o.shift?' selected':''}>${s} ${SHIFT_HM[s]}</option>`).join('')+`</select>`;
  if(period==='daily')  return dnav(o.stepDate,o.setDate,o.date) + `<span style="color:#888;margin-left:6px">(gộp mọi ca trong ngày)</span>`;
  if(period==='weekly'){ const w=weekDates(o.weekOff); return dstep(o.stepWeek, `${T('pr.weekly')} ${ddmm(w[0])}–${ddmm(w[6])}`); }
  return dstep(o.stepMonth, `${T('pr.monthly')} ${MONTHS[o.monthOff]}`);
}

/* Số ca của kỳ đang chọn + nhãn phụ */
function periodShifts(period, date, shift, weekOff, monthOff){
  if(period==='shift')  return { n: lineRuns(shift,date)?1:0,
                                 sub:`${T('pr.shift')} ${shift} (${SHIFT_HM[shift]}) · ${fmtD(date)}`
                                     + (lineRuns(shift,date) && !isShiftRunning(date,shift)
                                        ? ` · <span style="color:#1E8A2E;font-weight:700">${T('ct.shiftdone')}</span>` : ''),
                                 off: !lineRuns(shift,date) ? `line KHÔNG chạy ca ${shift} ngày này (xem lịch ở Cấu hình → Ca làm việc)`
                                      : (isShiftRunning(date,shift) ? T('ct.shiftrun') : '') };
  if(period==='daily')  return { n: shiftsInDay(date), sub:`${fmtD(date)} · ${shiftsInDay(date)} ca theo lịch` };
  if(period==='weekly'){ const w=weekDates(weekOff);
                         return { n: shiftsInWeek(weekOff), sub:`${T('pr.weekly')} ${ddmm(w[0])}–${ddmm(w[6])}/${w[6].getFullYear()} · ${shiftsInWeek(weekOff)} ca theo lịch` }; }
  return { n: shiftsInMonth(monthOff), sub:`${T('pr.monthly')} ${MONTHS[monthOff]} · ${shiftsInMonth(monthOff)} ca theo lịch` };
}

/* Gộp phân bổ thời gian theo phạm vi (1 PLC hoặc toàn line) × số ca trong kỳ */
function lossAgg(scope, nShift){
  const sum=[0,0,0,0,0];
  const idx = scope==='all' ? LOSS_TS.map((_,i)=>i) : [Number(scope)];
  idx.forEach(i=>LOSS_TS[i].forEach((v,j)=>sum[j]+=v*nShift));
  return {sum, nMachine: idx.length, idx};
}

function renderLoss(){
  const bar=document.getElementById('loss-bar'); if(!bar) return;
  const scope = document.getElementById('loss-scope').value || 'all';
  document.getElementById('loss-ctx').innerHTML = ctxHtml(lossPeriod, {
    stepDate:'stepLossDate', setDate:'setLossDate', setShift:'setLossShift',
    stepWeek:'stepLossWeek', stepMonth:'stepLossMonth',
    date:lossDate, shift:lossShift, weekOff:lossWeekOff, monthOff:lossMonthOff });

  const P = periodShifts(lossPeriod, lossDate, lossShift, lossWeekOff, lossMonthOff);
  const {sum, nMachine, idx} = lossAgg(scope, P.n);
  const actual  = sum.reduce((a,b)=>a+b,0);
  const idle    = IDLE_MIN * P.n * nMachine;
  const planned = actual + idle;
  const scopeLbl = scope==='all' ? `${T('ct.allline').replace('14',nMachine)}` : `${PLC_MES[Number(scope)].code} — ${PLC_MES[Number(scope)].stage}`;

  document.getElementById('loss-sub').innerHTML = `${P.sub} · <b>${scopeLbl}</b>`
    + (P.off ? ` · <span style="color:#C9272F;font-weight:700">⚠ ${P.off}</span>` : '');
  document.getElementById('loss-bar-ttl').textContent =
    `${T('lo.alloc')} — ${scopeLbl}`;

  if(planned === 0 || P.n === 0){
    bar.innerHTML = `<div style="padding:18px;color:#C9272F;font-weight:700">Kỳ đang chọn không có ca nào chạy — chọn ca/ngày khác, hoặc bật ca ở <b>Cấu hình → Ca làm việc</b>.</div>`;
    document.getElementById('loss-kpi').innerHTML = '';
    document.getElementById('ts-rows').innerHTML = '';
    document.getElementById('loss-heat').innerHTML = '';
    document.getElementById('loss-pareto').innerHTML = '';
    document.getElementById('loss-trend').innerHTML = '';
    return;
  }

  /* ---- ① Thanh bar 5 trạng thái + 2 dấu ngoặc ----
     width tính theo 計画稼動時間; nhãn % tính theo 実稼働時間 (mẫu số khách dùng). */
  const wPlan = v => v/planned*100;
  const segs = [0,1,2,3,4].map(j=>{
    const v=sum[j], w=wPlan(v), pct=Math.floor(v/actual*100);
    return `<div class="lb-seg" style="width:${w}%;background:${ST_HEX[j]};color:${ST_TXT[j]}"
      data-j="${j}" data-dur="${dur(v)}" data-pct="${pct}">
      ${w>4?`<b>${dur(v)}</b>`:''}${w>7?`<i>${pct}%</i>`:''}</div>`;
  }).join('');
  bar.innerHTML = `
    <div class="lb-bar" id="loss-bar-bar">${segs}
      <div class="lb-seg" style="width:${wPlan(idle)}%;background:var(--st-idle);color:#fff"
           data-j="5" data-dur="${dur(idle)}" data-pct="—">${wPlan(idle)>5?`<b>${dur(idle)}</b>`:''}</div>
    </div>
    <div class="lb-bkrow"><div class="lb-bk" style="width:${wPlan(actual)}%"><span>${T('st.actual')} = ${dur(actual)}</span></div></div>
    <div class="lb-bkrow"><div class="lb-bk plan" style="width:100%"><span>${T('st.planned')} = ${dur(planned)}</span></div></div>
`;

  /* ---- KPI: OEE = A × P × Q ----
       A 稼働率  = 動作時間 ÷ 実稼働時間                    (từ LOSS_TS — nguồn duy nhất)
       P 性能    = thời gian chạy LÝ TƯỞNG ÷ 動作時間
                 = (Σ OK × CT kế hoạch) ÷ 動作時間          (PROD_CNT + PLAN_CT)
       Q 品質    = OK ÷ (OK + NG)
     Máy không đếm theo sản phẩm (PLC13 sấy, PLAN_CT null) bị loại khỏi P và Q —
     nhân nó vào sẽ kéo P xuống bằng 0 dù lò vẫn chạy đúng.
     ⚠ P và Q là CÁCH HIỂU CỦA COWATECH: tài liệu khách chỉ định nghĩa 5 trạng thái
     thời gian, chưa chốt nguồn của P/Q → câu hỏi Q36 trong Q&A tracker. */
  const [wait,run,err,adj,chk]=sum;
  const A = run/actual;                                  // 実稼働率 trên mẫu số 実稼働時間
  const loss = actual - run;

  const cnt = idx.filter(i=>PROD_CNT[i] && PLAN_CT[i]!==null);
  const okQty  = cnt.reduce((a,i)=>a+PROD_CNT[i].ok*P.n, 0);
  const ngQty  = cnt.reduce((a,i)=>a+PROD_CNT[i].ng*P.n, 0);
  const idealMin = cnt.reduce((a,i)=>a+PROD_CNT[i].ok*P.n*PLAN_CT[i]/60, 0);   // phút chạy lý tưởng
  const runCnt = cnt.reduce((a,i)=>a+LOSS_TS[i][1]*P.n, 0);                    // 動作時間 của các máy có đếm
  /* Phạm vi không có máy nào đếm theo sản phẩm (vd chỉ chọn PLC13 lò sấy) ⇒ P và Q
     KHÔNG ÁP DỤNG. Hiện "—" chứ không hiện 0% — 0% đọc ra thành "máy chạy tệ", sai hẳn. */
  const hasCnt = cnt.length > 0 && runCnt > 0 && (okQty+ngQty) > 0;
  const Pf = hasCnt ? Math.min(idealMin/runCnt, 1) : null;
  const Q  = hasCnt ? okQty/(okQty+ngQty) : null;
  const OEE = hasCnt ? A*Pf*Q : null;
  const pc = v => v===null ? '—' : (v*100).toFixed(1)+'%';
  const naNote = hasCnt ? '' : `<div class="f-state" style="margin-top:2px">${T('ov.nocount')}</div>`;

  document.getElementById('loss-kpi').innerHTML = `
    <div class="la-kpi oee"><div class="lbl">OEE</div><div class="jp">A × P × Q</div>
      <div class="val">${pc(OEE)}</div>${naNote}</div>
    <div class="la-kpi blue"><div class="lbl">${T('oee.a')}</div><div class="jp">稼働率 = 動作 ÷ 実稼働</div><div class="val">${(A*100).toFixed(1)}%</div></div>
    <div class="la-kpi blue"><div class="lbl">${T('oee.p')}</div>
      <div class="jp">性能 = 理想時間 ÷ 動作時間</div><div class="val">${pc(Pf)}</div>
      <div class="kpi-chip"><span class="cfmchip">ⓘ ${T('tag.confirm')}</span></div></div>
    <div class="la-kpi blue"><div class="lbl">${T('oee.q')}</div>
      <div class="jp">品質 = OK ÷ (OK+NG)</div><div class="val">${pc(Q)}</div>
      <div class="kpi-chip"><span class="cfmchip">ⓘ ${T('tag.confirm')}</span></div></div>
    <div class="la-kpi ok"><div class="lbl">${T('st.run')}</div><div class="jp">動作時間</div><div class="val">${dur(run)}</div></div>
    <div class="la-kpi ng"><div class="lbl">${T('st.loss')}</div><div class="jp">ロス時間</div><div class="val">${dur(loss)}</div></div>`;

  document.getElementById('loss-total').textContent = `合計 計画稼動 ${dur(planned)}`;

  renderTsRows(idx, P.n);
  renderHeat();
  renderPareto(sum, actual);
  renderDonut(sum, idle, planned, A);
  renderLossTrend();
  wireTsTip();
}

/* Thời gian theo từng thiết bị — thanh tỷ lệ gộp, bấm để drill-down */
