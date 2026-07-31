/* Bang san luong theo tung may o Top Page
   Nap SAU js/07 vi dung PROD_CNT / LOSS_TS / PLAN_CT / PLC_MES cua file do. */

/* ══════════ TOP PAGE — BẢNG SẢN LƯỢNG THEO TỪNG MÁY ══════════
   Thay lưới card làm nội dung chính của Top Page: nhiều PLC thì bảng đọc được,
   lưới card thì rối (dự án sau 20–30 máy).

   MỘT NGUỒN SỐ DUY NHẤT: `PROD_CNT` + `LOSS_TS` + `PLAN_CT`, và dùng ĐÚNG công
   thức của màn Sản lượng (`renderProd`) nên 2 màn không bao giờ lệch nhau:
     mục tiêu = phút chạy × 60 ÷ CT kế hoạch     tỷ lệ đạt = OK ÷ mục tiêu
   Phạm vi CỐ ĐỊNH ở ca hiện tại — tra cứu Ngày/Tuần/Tháng nằm ở màn Lịch sử
   sản xuất, Top Page là màn treo xưởng nên không có bộ chọn kỳ. */

/* Ngưỡng màu tỷ lệ đạt. 97% là mức màn Sản lượng đang dùng; thêm bậc vàng để
   ca nào cả line 93–97% không bị đỏ toàn bảng (đỏ hết thì mất tác dụng cảnh báo). */
const RATE_HI = 97, RATE_MID = 94;
const rateTier = r => r>=RATE_HI ? 'hi' : (r>=RATE_MID ? 'mid' : 'low');

/* Tên công đoạn theo ngôn ngữ đang chọn — KHÔNG tự dịch chỗ nào không có nguồn:
     vi → `PLC_LIST.vi`            zh → `nameZh` nguyên văn data khách
     en → `PLC_LIST.stage` (IO MAP)  ja → tạm dùng tiếng Anh
   TODO: tên tiếng Nhật lấy nguyên văn sheet `info` chương 2 (2-1…2-13) khi rà lại. */
function stageName(p, i){
  if(currentLang === 'vi') return p.vi;
  if(currentLang === 'zh') return PLC_MES[i].mesName || p.stage;
  return p.stage;
}

/* Trạng thái máy = ĐÚNG 3 giá trị của tag `Machine.Status` (BIT): 1 run · 2 stop · 3 error.
   Không thêm giá trị thứ tư: "sấy" là thuộc tính công đoạn (không đếm theo sản phẩm),
   không phải trạng thái máy — lò sấy đang chạy thì Machine.Status vẫn = 1. */
function statusChip(st){
  const k = st==='alarm' ? ['alarm','ov.st.alarm']
          : st==='stop'  ? ['off','ov.st.off']
                         : ['run','ov.st.run'];
  return `<span class="ov-st ${k[0]}">${T(k[1])}</span>`;
}

/* Hệ số theo phạm vi đang chọn ở thanh ngữ cảnh chung của Top Page (`rtScope`, js/11).
   PROD_CNT / LOSS_TS là số của MỘT ca ⇒ "cả ngày hôm nay" = nhân số ca theo lịch hôm nay.
   Dùng chung `shiftsInDay()` với màn Sản lượng để 2 màn không ra 2 con số khác nhau. */
function ovScopeFactor(){ return (typeof rtScope!=='undefined' && rtScope==='day') ? shiftsInDay(today0()) : 1; }

function renderOverviewProd(){
  const tb = document.getElementById('ov-prod-rows');
  if(!tb) return;
  const f = ovScopeFactor();

  tb.innerHTML = PLC_LIST.map((p,i)=>{
    const c0 = PROD_CNT[i], planct = PLAN_CT[i], run = LOSS_TS[i][1]*f;
    const c = c0 && {ok:c0.ok*f, ng:c0.ng*f, wip:c0.wip};   // WIP là tồn tức thời, không nhân theo ca
    const mes = PLC_MES[i].mes;
    // Công đoạn không đếm theo sản phẩm (lò sấy giữ hàng ~23 h) — gộp ô, không bịa số
    if(!c || planct===null){
      return `<tr class="ov-oven" onclick="openDetail('${p.code}','${p.stage.replace(/'/g,"&apos;")}')">
        <td class="l"><b>${p.code}</b> — ${stageName(p,i)}</td><td><span class="mono">${mes}</span></td>
        <td>${statusChip(p.status)}</td>
        <td colspan="7" class="l">${T('ov.ovennote')} · ${T('st.run')} ${hm(run)} / ${hm(ACTUAL_MIN*f)}</td></tr>`;
    }
    const input  = c.ok + c.ng + c.wip;
    const target = Math.round(run*60/planct);
    const rate   = target ? c.ok/target*100 : 0;
    const ctAct  = run*60/c.ok;
    const tier   = rateTier(rate);
    return `<tr class="${p.status==='alarm'?'ov-alarm':''}" onclick="openDetail('${p.code}','${p.stage.replace(/'/g,"&apos;")}')">
      <td class="l"><b>${p.code}</b> — ${stageName(p,i)}</td><td><span class="mono">${mes}</span></td>
      <td>${statusChip(p.status)}</td>
      <td class="v-in">${nf(input)}</td>
      <td class="v-ok">${nf(c.ok)}</td>
      <td class="${c.ng ? 'v-ng' : 'v-zero'}">${c.ng}</td>
      <td class="v-in">${c.wip}</td>
      <td>${ctAct.toFixed(1)}s <span class="ov-dim">/ ${planct.toFixed(1)}</span></td>
      <td>${nf(target)}</td>
      <td><div class="ov-ratecell">
        <div class="ov-bar ${tier}"><i style="width:${Math.min(rate,100)}%"></i></div>
        <span class="ov-pct ${tier}">${rate.toFixed(1)}%</span></div></td></tr>`;
  }).join('');

  // Chú thích dưới bảng: nói rõ mục tiêu ở đây suy từ đâu, tránh khách hiểu là số khách nhập
  const foot = document.getElementById('ov-prod-foot');
  if(foot) foot.innerHTML = `${T('ov.formula')}
    · <b>${f>1 ? T('ov.sc.day')+` (${f} ${T('pr.shift').toLowerCase()})` : T('ov.sc.shift')}</b>
    · <b>${T('pd.rate')}</b> ≥ ${RATE_HI}%
    <span class="ov-sw hi"></span> · ${RATE_MID}–${RATE_HI}% <span class="ov-sw mid"></span>
    · &lt; ${RATE_MID}% <span class="ov-sw low"></span>`;
}
