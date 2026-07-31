/* Timeline trang thai may realtime (theo ca / ca ngay)
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ══════════ TIMELINE REALTIME (dải ở Top Page) ══════════ */
const DAY_START = 360;                       // ngày sản xuất bắt đầu 06:00
const SHIFT_ORDER = ['S1','S2','S3'];
const RT_CYC = [4,2,2,6,3,2,3,1,1,5,6,2,1,5];  // số chu kỳ trạng thái / ca — máy hay lỗi thì nhiều hơn
const RT_ORDER = [0,1,2,3,4];                  // chờ → chạy → lỗi → điều chỉnh → kiểm tra (đúng thứ tự info 1-1-1→1-1-5)
let rtScope='shift';
function nowDayOffset(){ let o=nowMin()-DAY_START; if(o<0) o+=1440; return o; }
function gridBg(total){ const p=60/total*100; return `repeating-linear-gradient(90deg,#f4f4f4 0,#f4f4f4 calc(${p}% - 1px),#dcdcdc calc(${p}% - 1px),#dcdcdc ${p}%)`; }
/* Nhãn giờ căn giữa mốc, nhưng mốc đầu/cuối phải kéo hẳn vào trong — để căn giữa thì
   một nửa nhãn tràn ra ngoài và đè lên viền khung biểu đồ. */
function tickHtml(m, total, label){
  const cls = m===0 ? ' start' : (m===total ? ' end' : '');
  return `<div class="tl-tick${cls}" style="left:${m/total*100}%">${label}</div>`;
}
/* Phạm vi này áp cho CẢ Top Page — đổi thì KPI và bảng sản lượng phải đổi theo,
   không chỉ mỗi timeline (thanh chọn nằm ngoài tab con). */
function setRtScope(v){
  rtScope=v;
  document.querySelectorAll('[data-scope-btn]').forEach(b=>b.classList.toggle('active', b.dataset.scopeBtn===v));
  renderRt(); renderOverviewKpi(); renderOverviewProd();
}
/* Chuỗi trạng thái 1 máy trong 1 ca (tất định) — rải đều theo chu kỳ, scale về 480'.
   始業前点検 không phải "check 1 lần đầu ca" mà là chạy kiểm tra SAU mỗi lần lỗi/điều
   chỉnh trước khi máy được vào lại vận hành ⇒ luôn đứng cuối chu kỳ, lặp lại. */
function buildTimeline(i){
  const t=LOSS_TS[i], reps=RT_CYC[i]||2;
  const order=[]; for(let r=0;r<reps;r++) order.push(...RT_ORDER);
  const counts=[0,0,0,0,0]; order.forEach(s=>counts[s]++);
  const per=t.map((v,s)=>counts[s]?v/counts[s]:0);
  const segs=[]; let acc=0;
  order.forEach(s=>{ const d=per[s]; if(d<=0) return; segs.push({s,from:acc,len:d}); acc+=d; });
  const scale=acc?SHIFT_MIN/acc:1; segs.forEach(g=>{ g.from*=scale; g.len*=scale; });
  return segs;
}
function renderRt(){
  const root=document.getElementById('rt-timeline'); if(!root) return;
  const date=today0();
  if(rtScope==='day'){
    const nowOff=nowDayOffset(), total=1440;
    document.getElementById('rt-now').innerHTML =
      `<span class="live-dot"></span>${T('ov.today')} <b>${fmtD(date)}</b> · ${T('ov.allday')} <b>${currentShiftId()}</b>`;
    document.getElementById('rt-sub').innerHTML =
      `${T('ov.elapsed')} ${hm(nowOff)} / 24h · ${SHIFT_ORDER.filter((s,si)=>(si+1)*SHIFT_MIN<=nowOff).length} ${T('ov.shiftsdone')} · ${T('ov.sched')} ${lineShiftsOn(date).join(', ')||T('ov.dayoff')}`;
    let ticks=''; for(let m=0;m<=total;m+=SHIFT_MIN) ticks+=tickHtml(m, total, minToClock(DAY_START+m));
    SHIFT_ORDER.forEach((s,k)=>{ ticks+=`<div class="tl-tick" style="left:${(k*SHIFT_MIN+240)/total*100}%;color:#1E88E5;font-weight:800">${s}</div>`; });
    const marks=[SHIFT_MIN,SHIFT_MIN*2].map(m=>`<div class="tl-shiftmark" style="left:${m/total*100}%"></div>`).join('');
    const nowHTML=`<div class="tl-now" style="left:${nowOff/total*100}%"></div>`;
    root.innerHTML = `<div class="tl-ruler-row"><div></div><div class="tl-ruler">${ticks}</div></div>`
      + PLC_MES.map((p,i)=>{
        let cells='';
        SHIFT_ORDER.forEach((sid,si)=>{
          const base=si*SHIFT_MIN; if(base>=nowOff) return;
          const cap=base+Math.min(SHIFT_MIN, nowOff-base);
          if(!lineRuns(sid,date)){
            cells += `<div class="tl-off" style="left:${base/total*100}%;width:${(cap-base)/total*100}%">${(cap-base)/total*100>4?'nghỉ '+sid:''}</div>`;
            return;
          }
          const isCur = nowOff > base && nowOff < base + SHIFT_MIN;   // ca đang chạy
          cells += shiftHtml(i, sid, base, cap, total, DAY_START, 3, isCur ? nowOff - base : null);
        });
        cells += tailHtml(nowOff, total, 6);
        return `<div class="tl-row"><div class="tl-name">${p.code}<small>${p.mes}</small></div>
          <div class="tl-track" style="background:${gridBg(total)}">${marks}${cells}${nowHTML}</div></div>`;
      }).join('');
  } else {
    const shift=currentShiftId(), total=SHIFT_MIN, shiftStart=SHIFT_START[shift];
    const elapsed=Math.max(0, Math.min(total, nowMin()-shiftStart));
    document.getElementById('rt-now').innerHTML =
      `<span class="live-dot"></span>${T('pr.shift')} ${T('ov.curshift')} <b>${shift} (${SHIFT_HM[shift]})</b> · ${fmtD(date)}`;
    document.getElementById('rt-sub').innerHTML =
      `${T('ov.elapsed')} ${hm(elapsed)} / ${hm(total)} · ${T('ov.schedtoday')} ${lineShiftsOn(date).join(', ')||T('ov.dayoff')}`;
    let ticks=''; for(let m=0;m<=total;m+=60) ticks+=tickHtml(m, total, minToClock(shiftStart+m));
    const nowHTML = (elapsed>0 && elapsed<total) ? `<div class="tl-now" style="left:${elapsed/total*100}%"></div>` : '';
    root.innerHTML = `<div class="tl-ruler-row"><div></div><div class="tl-ruler">${ticks}</div></div>`
      + PLC_MES.map((p,i)=>{
        let cells;
        if(!lineRuns(shift,date)) cells = `<div class="tl-off" style="left:0;width:100%">Line nghỉ ca ${shift}</div>`;
        else {
          cells = shiftHtml(i, shift, 0, elapsed, total, shiftStart, 6, elapsed<total ? elapsed : null);
          cells += tailHtml(elapsed, total, 10);
        }
        return `<div class="tl-row"><div class="tl-name">${p.code}<small>${p.mes}</small></div>
          <div class="tl-track" style="background:${gridBg(total)}">${cells}${nowHTML}</div></div>`;
      }).join('');
  }
  wireTsTip();
}
/* Trạng thái của máy TẠI thời điểm hiện tại phải khớp thẻ trạng thái và KPI "Số lỗi" —
   hai chỗ đó đọc PLC_LIST[i].status, còn buildTimeline() sinh chuỗi từ LOSS_TS nên
   không hề biết máy nào đang báo lỗi. Hai nguồn độc lập ⇒ dải từng vẽ 4 máy đỏ trong
   khi KPI đếm 3, và con số lệch đổi theo từng phút. Ở đây ép đoạn đang phủ thời điểm
   hiện tại về đúng trạng thái của thẻ; phần quá khứ giữ nguyên. */
const ST_OF_STATUS = { alarm:2, run:1 };            // 2 = dừng lỗi (đỏ) · 1 = đang chạy (xanh)
function timelineAt(i, nowIn){
  const segs = buildTimeline(i);
  if(nowIn === null) return segs;
  const want = ST_OF_STATUS[PLC_LIST[i].status];
  if(want === undefined) return segs;
  return segs.map(g => (nowIn >= g.from && nowIn < g.from + g.len) ? {...g, s:want} : g);
}

/* Máy TẮT giữa ca (mất điện, bảo trì, hết lệnh sản xuất...) rồi BẬT LẠI.
   Bật lên KHÔNG chạy ngay: phải chờ máy sẵn sàng rồi 始業前点検 (kiểm tra trước khi vận
   hành lại) mới vào 動作 — đúng trình tự xưởng. Quãng tắt cần giờ CHÍNH XÁC nên phải
   khai ở đây, không suy được từ LOSS_TS.
   {i: chỉ số máy · shift: ca · at: phút tính từ đầu ca · dur: tắt bao lâu}. */
const RESTART_WAIT  = 10;      // phút chờ máy sẵn sàng sau khi bật lại
const RESTART_CHECK = 15;      // phút kiểm tra trước khi cho chạy lại
const EARLY_STOP = [
  {i:7, shift:'S1', at:360, dur:80}    // PLC08 tắt 12:00–13:20, bật lại rồi chờ + kiểm tra
];
/* Một đoạn trạng thái bất kỳ trên trục dài `total` (dùng cho trình tự bật lại) */
function stateHtml(s, from, to, total, clockBase, lblMinPct){
  if(to <= from) return '';
  const w = (to - from) / total * 100;
  return `<div class="tl-seg" style="left:${from/total*100}%;width:${w}%;background:${ST_HEX[s]};color:${ST_TXT[s]}"
    data-s="${s}" data-from="${minToClock(clockBase+from)}" data-to="${minToClock(clockBase+to)}"
    data-dur="${hm(to-from)}">${w>lblMinPct?hm(to-from):''}</div>`;
}
/* Ô "máy không hoạt động" — máy có mặt nhưng không chạy, ĐÃ đo được. Khác hẳn ô
   "chưa tới" (tailHtml) là thời gian chưa xảy ra nên chưa đo được gì. */
function idleHtml(from, to, total, clockBase, lblMinPct){
  if(to <= from) return '';
  const w = (to - from) / total * 100;
  return `<div class="tl-idle" style="left:${from/total*100}%;width:${w}%"
    data-from="${minToClock(clockBase+from)}" data-to="${minToClock(clockBase+to)}"
    data-dur="${hm(to-from)}">${w>lblMinPct?hm(to-from):''}</div>`;
}
/* Vẽ 1 ca của 1 máy. Máy không tắt thì vẽ thẳng chuỗi trạng thái; có tắt thì cắt tại giờ
   tắt rồi nối: tắt → chờ → kiểm tra trước khi vận hành lại → chạy tới hết ca. */
function shiftHtml(i, sid, base, cap, total, clockBase, lblMinPct, nowIn){
  const es = EARLY_STOP.find(x => x.i === i && x.shift === sid);
  if(!es || base + es.at >= cap)
    return segHtml(i, base, cap, total, clockBase, lblMinPct, nowIn);
  const clip = t => Math.min(t, cap);
  const tOff = base + es.at, tOn = tOff + es.dur;          // tắt → bật lại
  const tRdy = tOn + RESTART_WAIT, tRun = tRdy + RESTART_CHECK;
  return segHtml(i, base, clip(tOff), total, clockBase, lblMinPct, null)
    + idleHtml (clip(tOff), clip(tOn),  total, clockBase, lblMinPct)
    + stateHtml(0, clip(tOn),  clip(tRdy), total, clockBase, lblMinPct)   // 待機 chờ
    + stateHtml(4, clip(tRdy), clip(tRun), total, clockBase, lblMinPct)   // 始業前点検
    + stateHtml(1, clip(tRun), clip(base + SHIFT_MIN), total, clockBase, lblMinPct);  // 動作
}

/* Đuôi dải sau vạch NOW = thời gian CHƯA XẢY RA ⇒ luôn là "chưa tới" (xám).
   Không được tô đen "máy không hoạt động": chưa chạy tới đó thì chưa biết máy chạy hay
   dừng. Màu đen chỉ dành cho máy đã TẮT SỚM, và nó nằm TRƯỚC vạch NOW — xem timelineAt(). */
function tailHtml(from, total, lblMinPct){
  if(from >= total) return '';
  const w = (total - from) / total * 100;
  return `<div class="tl-future" style="left:${from/total*100}%;width:${w}%"
    data-dur="${hm(total-from)}">${w>lblMinPct?T('tl.future'):''}</div>`;
}

/* Vẽ các đoạn trạng thái của máy i trong khoảng [base, cap) của trục dài `total`.
   `nowIn` = vị trí thời điểm hiện tại tính từ đầu ca đang vẽ, null nếu ca đã xong. */
function segHtml(i, base, cap, total, clockBase, lblMinPct, nowIn){
  let out='';
  timelineAt(i, nowIn ?? null).forEach(g=>{
    const s0=base+g.from, s1=s0+g.len;
    if(s0>=cap) return;
    const end=Math.min(s1,cap), len=end-s0;
    const left=s0/total*100, width=len/total*100;
    out += `<div class="tl-seg" style="left:${left}%;width:${width}%;background:${ST_HEX[g.s]};color:${ST_TXT[g.s]}"
      data-s="${g.s}" data-from="${minToClock(clockBase+s0)}" data-to="${minToClock(clockBase+end)}"
      data-dur="${hm(len)}">${width>lblMinPct?hm(len):''}</div>`;
  });
  return out;
}
