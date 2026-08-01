/* NHÂN BẢN DỮ LIỆU SERIAL MẪU CHO DEMO
 * Export thật khách gửi có 2.120 serial / 20.747 dòng, nhưng mock chỉ NHÚNG 35 serial
 * (giữ file JS gọn). Danh sách "Tra cứu sản phẩm" vì thế chỉ 35 dòng — quá ít để demo.
 *
 * File này sinh thêm bản sao TỪ CHÍNH 35 serial thật: mỗi bản sao lấy nguyên cấu trúc +
 * giá trị đo + chuỗi vật liệu THẬT của 1 serial gốc, chỉ đổi:
 *   - Mã serial (ID mới, không trùng)
 *   - Toàn bộ mốc thời gian (dịch ngày 08–09/04 + dịch phút trong ca)
 * ⇒ số liệu vẫn "thật" ở cấp giá trị, chỉ nhân số lượng cho danh sách trông đầy.
 * Nạp NGAY SAU 00-mock-data để mọi màn (Tra cứu SP, Truy xuất Serial, chi tiết máy) đều thấy.
 *
 * Muốn đổi tổng số: sửa TARGET. Muốn tắt hẳn: không nạp file này (danh sách về 35). */
(function augmentSampleSerials(){
  if(typeof MOCK_DATA === 'undefined' || !MOCK_DATA.serials) return;
  const S = MOCK_DATA.serials;
  const TARGET = 250;
  const templates = Object.values(S).map(v => v);
  if(!templates.length || Object.keys(S).length >= TARGET) return;

  const pad = (n, w) => String(n).padStart(w, '0');
  /* "yyyy-mm-dd hh:mm:ss" + dịch ngày + dịch phút → chuỗi cùng định dạng (giữ nội bộ nhất quán). */
  function shiftTs(ts, dayOff, minOff){
    if(!ts) return ts;
    const d = new Date(ts.replace(' ', 'T'));
    d.setDate(d.getDate() + dayOff);
    d.setMinutes(d.getMinutes() + minOff);
    const p = n => pad(n, 2);
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  let counter = 300, i = 0;
  while(Object.keys(S).length < TARGET && i < TARGET * 3){
    const src = templates[i % templates.length];
    const dayOff = Math.floor(i / 120) % 2;          // rải qua 08–09/04 (khớp bộ lọc mặc định)
    const minOff = (i * 13) % 460;                    // dịch phút trong ca cho khác giờ
    const newSn = `2604${pad(8 + dayOff, 2)}A0${pad(counter++, 3)}A0`;
    i++;
    if(S[newSn]) continue;

    const recs = {};
    for(const [pc, r] of Object.entries(src.recs)){
      recs[pc] = { ts: shiftTs(r.ts, dayOff, minOff), judgeRaw: r.judgeRaw, q: { ...r.q }, judge: r.judge };
    }
    S[newSn] = {
      startedAt: shiftTs(src.startedAt, dayOff, minOff),
      endedAt:   shiftTs(src.endedAt, dayOff, minOff),
      finalJudge: src.finalJudge,
      nProc: src.nProc,
      recs
    };
  }
})();
