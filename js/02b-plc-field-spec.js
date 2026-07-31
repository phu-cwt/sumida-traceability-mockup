/* BẢNG ĐỐI CHIẾU TRƯỜNG DỮ LIỆU TỪNG MÁY — 3 nguồn:
 *   ① Yêu cầu Sumida 09/07  `260709 … .xlsx` sheet `info` chương 2 (mục 2-1 → 2-13)
 *   ② Tag đã có             `【IO MAP】…260515.xlsx` (14 sheet PLC)
 *   ③ Data thật             `Worksheet in 260709 … .xlsx` sheet MES export (20.747 dòng)
 *
 * Vì sao cần bảng này: `PLC_DETAIL` dựng từ ① + ② TRƯỚC khi có ③, nên số hiển thị
 * là số minh hoạ và lệch data thật rất xa (trọng lượng 4,82 g vs thật 41,88 g;
 * cảm kháng 12,42 µH vs thật ~164,3). Nay mỗi trường tự khai báo nguồn để màn hình
 * hiện ĐÚNG cái đang có, và chỉ rõ cái còn thiếu — không bịa số.
 *
 * TRẠNG THÁI mỗi trường (suy ra tự động, xem resolveField):
 *   data   ③ có giá trị thật        → hiện số thật
 *   iomap  ② có tag, ③ chưa có      → "chưa có trong data export"
 *   need   ① yêu cầu, ② chưa có tag → "cần bổ sung tag PLC"
 *
 * Định dạng: [ mục doc, nhãn, tag IO MAP, mã công đoạn MES, khoá QData, {tuỳ chọn} ]
 *   tag=''            → ② chưa có tag  ⇒ need
 *   khoá QData=''     → ③ không có     ⇒ iomap
 *   khoá='$serial'    → lấy chính serial của bản ghi
 *   {} : key(khoá chính) · unit · dev(thiết bị đo theo doc) · note · grp('trace'|'insp')
 */
const PLC_FIELDS = {

  /* ══ 2-1 Base Feeding Machine ── MES N6013-1 印字-1 ══ */
  PLC01: [
    ['2-1-1','Thông tin vật liệu (BASE)','Trace.MaterialLot','N6013-1','C001',{grp:'trace'}],
    ['2-1-3','Mã 2D Carrier','Trace.Carrier2D','N6013-1','C002',{grp:'trace'}],
    ['2-1-4','Mã 2D Winding Chuck','Trace.WindingChuck2D','N6013-1','C003',{grp:'trace',
      note:'Export gọi trường này là 嗦咀编号 (mã nozzle) — cần xác nhận có cùng là 1 thứ với Winding Chuck'}],
    ['2-1-5','Mã 2D BASE','Trace.Base2D','N6013-1','$serial',{grp:'trace',key:true}],
    ['2-1-2','KT lắp BASE (CCD)','Quality.CCD_Result','N6013-1','',{grp:'insp',dev:'CV-X350F · CA-H500MX',
      note:'IO MAP cấp cờ OK/NG; export lại cấp số đo kích thước (dòng dưới) — không có cờ OK/NG'}],
    ['—','Kích thước lắp BASE','','N6013-1','D001',{grp:'insp',
      note:'Export CÓ nhưng IO MAP chưa có tag ⇒ nếu muốn đọc realtime phải bổ sung'}],
    ['—','Mức khớp mã 2D BASE','Quality.Base2DMatching','N6013-1','D002',{grp:'insp',
      note:'⚠ LỆCH THANG ĐO: IO MAP ghi grade ISO 15415 thang 0–40; export trả 90–93 (thang 0–100). Cần chốt.'}]
  ],

  /* ══ 2-2 Winding Machine ── MES N3001 卷线 ══ */
  PLC02: [
    ['2-2-1','Thông tin vật liệu (dây đồng)','Trace.MaterialLot','N3001','C003',{grp:'trace'}],
    ['2-2-2','Mã 2D Winding Chuck','Trace.WindingChuck2D','N3001','C001',{grp:'trace'}],
    ['2-2-3','Mã 2D BASE','Trace.Base2D','N3001','$serial',{grp:'trace',key:true}],
    ['—','Mã 2D Carrier','Trace.Carrier2D','N3001','C002',{grp:'trace',
      note:'IO MAP có tag và export có data, nhưng doc 09/07 KHÔNG liệt kê ở máy này — cần xác nhận giữ hay bỏ'}],
    ['2-2-4','Lực căng quấn dây','Inspection.WindingTension','N3001','D001',{grp:'insp',
      note:'⚠ LỆCH ĐƠN VỊ: IO MAP ghi 0,01 cN (×100) ⇒ giá trị export 2740–3290 tương đương 27,4–32,9 cN. Cần chốt đơn vị.'}],
    ['—','Trục quấn','','N3001','I001',{grp:'insp',note:'Export CÓ, IO MAP chưa có tag'}]
  ],

  /* ══ 2-3 Welding Machine (doc GỘP kiểm tra dây + hàn) ── phần KT vị trí dây
        IO MAP tách riêng thành PLC03; MES export KHÔNG có công đoạn này ══ */
  PLC03: [
    ['2-3-1','Mã 2D Winding Chuck','Trace.WindingChuck2D','','',{grp:'trace'}],
    ['2-3-2','Mã 2D BASE','Trace.Base2D','','',{grp:'trace',key:true}],
    ['2-3-3','KT đi dây (CCD)','Inspection.WirePos_Result','','',{grp:'insp',dev:'CV-X450F · CA-H500MX'}],
    ['—','Toạ độ X','Inspection.WirePos_X','','',{grp:'insp'}],
    ['—','Toạ độ Y','Inspection.WirePos_Y','','',{grp:'insp'}]
  ],

  /* ══ 2-3 Welding Machine ── phần hàn ── MES N1103 熔接 ══ */
  PLC04: [
    ['2-3-1','Mã 2D Winding Chuck','Trace.WindingChuck2D','','',{grp:'trace'}],
    ['2-3-2','Mã 2D BASE','Trace.Base2D','N1103','$serial',{grp:'trace',key:true,
      note:'Export KHÔNG ghi serial vào cột "Mã theo dõi sản phẩm" — serial nằm trong QData C001'}],
    ['2-3-4','Điện áp hàn','Inspection.WeldVoltage','','',{grp:'insp'}],
    ['2-3-4','Dòng hàn','Inspection.WeldCurrent','','',{grp:'insp'}],
    ['2-3-4','Lực ép phía F','Inspection.BendPressure_F','','',{grp:'insp'}],
    ['2-3-4','Lực ép phía S','Inspection.BendPressure_S','','',{grp:'insp'}],
    ['2-3-4','Áp lực sau hàn','Inspection.PressureAfterWeld','','',{grp:'insp'}],
    ['2-3-4','Độ dày trước hàn','Inspection.ThicknessBefore','','',{grp:'insp'}],
    ['2-3-4','Độ dày sau hàn','Inspection.ThicknessAfter','','',{grp:'insp'}],
    ['2-3-4','Độ thay đổi độ dày','Inspection.ThicknessDelta','','',{grp:'insp'}]
  ],

  /* ══ 2-4 Core Assembly Machine ── MES N4003-1 组装-1 (sheet KHÔNG có legend) ══ */
  PLC05: [
    ['2-4-1','Thông tin vật liệu (Core)','Trace.MaterialLot','','',{grp:'trace'}],
    ['2-4-2','Mã 2D Winding Chuck','Trace.WindingChuck2D','N4003-1','C001',{grp:'trace'}],
    ['2-4-3','Mã 2D BASE','Trace.Base2D','N4003-1','$serial',{grp:'trace',key:true,
      note:'Export KHÔNG ghi serial vào cột chuẩn — serial nằm trong QData J001'}],
    ['—','Mã 2D Carrier','Trace.Carrier2D','N4003-1','C002',{grp:'trace',
      note:'IO MAP có tag; doc 09/07 không liệt kê; export trả rỗng'}],
    ['2-4-4','Cảm kháng','Inspection.Inductance','N4003-1','D002',{grp:'insp',dev:'LCR Meter',
      note:'⚠ SUY ĐOÁN: sheet công đoạn này KHÔNG có legend. Giá trị 164,5–165,1 khớp dải LS ở KT điện cuối nên tạm hiểu là cảm kháng — CẦN XÁC NHẬN.'}],
    ['2-4-5','KT lắp CORE (CCD)','Quality.CCD_Result','N4003-1','J002',{grp:'insp',dev:'CV-X350F · CA-H500MX ×2',
      note:'⚠ SUY ĐOÁN: J002 trả "OK" nhưng không có legend — cần xác nhận đúng là cờ CCD'}]
  ],

  /* ══ 2-5 Case Feeding Machine ── MES N4003-2 组装-2 ══ */
  PLC06: [
    ['2-5-1','Thông tin vật liệu (CASE)','Trace.MaterialLot_CASE','N4003-2','C001',{grp:'trace',
      note:'⚠ Export trả đúng chữ "ERROR" ở 100% / 1.848 dòng — trường này hiện vô dụng'}],
    ['2-5-2','Thông tin vật liệu (Bush-A)','','','',{grp:'trace',
      note:'Doc 09/07 tách BUSH thành A và B; IO MAP chỉ có 1 tag chung Trace.MaterialLot_BUSH ⇒ cần tách'}],
    ['2-5-3','Thông tin vật liệu (Bush-B)','','','',{grp:'trace',
      note:'Doc 09/07 tách BUSH thành A và B; IO MAP chỉ có 1 tag chung Trace.MaterialLot_BUSH ⇒ cần tách'}],
    ['2-5-4','Mã 2D CASE','Trace.Case2D','N4003-2','$serial',{grp:'trace',key:true}],
    ['2-5-5','Cao lắp vòng sắt dài','Inspection.BushHeight','N4003-2','D002',{grp:'insp',dev:'GT2',
      note:'IO MAP chỉ có 1 tag BushHeight; export trả 2 giá trị (vòng dài + vòng tròn) ⇒ cần 2 tag'}],
    ['2-5-5','Cao lắp vòng sắt tròn','','N4003-2','D003',{grp:'insp',dev:'GT2'}],
    ['2-5-6','KT nứt CASE','Quality.CCD_Result','','',{grp:'insp',dev:'IV4-CP70 · IV4-G500CA ×2',
      note:'Doc 09/07 ghi rõ dùng IV4 (mockup cũ ghi sai là "Vision CAM06")'}],
    ['—','Mức khớp mã 2D CASE','Quality.Case2DMatching','N4003-2','D001',{grp:'insp',
      note:'IO MAP có tag; doc 09/07 không liệt kê. Export trả 91–99 (thang 0–100) vs IO MAP 0–40 ⇒ lệch thang'}]
  ],

  /* ══ 2-6 Potting Machine ── MES N6012 灌胶 ══ */
  PLC07: [
    ['2-6-1','Thông tin vật liệu (Tank A)','Trace.MaterialLot_A','N6012','C002',{grp:'trace'}],
    ['2-6-2','Thông tin vật liệu (Tank B)','Trace.MaterialLot_B','N6012','C003',{grp:'trace'}],
    ['2-6-3','Mã 2D Potting Carrier','Trace.PottingCarrier2D','N6012','C001',{grp:'trace',
      note:'Export gọi là 治具编号 (mã đồ gá) — cần xác nhận có cùng là Potting Carrier'}],
    ['2-6-4','Mã 2D CASE','Trace.Case2D','N6012','$serial',{grp:'trace',key:true}],
    ['2-6-5','Lượng keo A','Inspection.FlowQty_A','N6012','D001',{grp:'insp',dev:'FD-XS20'}],
    ['2-6-5','Lượng keo B','Inspection.FlowQty_B','N6012','D002',{grp:'insp',dev:'FD-XS20',
      note:'⚠ Data thật A:B ≈ 1:2 (A 1,78–1,87 · B 3,48–3,57). Mockup cũ ghi A≈B (1,42/1,40 ml) là SAI.'}],
    ['—','Tỉ lệ A/B','','N6012','D003',{grp:'insp',note:'Export CÓ, IO MAP chưa có tag'}],
    ['—','Thời điểm đổ keo','','N6012','T001',{grp:'insp',note:'Export CÓ, IO MAP chưa có tag'}]
  ],

  /* ══ 2-7 Coil-Case Assembly ── MES N4003-3 组装-3 (export chỉ có {"C001":" "}) ══ */
  PLC08: [
    ['2-7-1','Mã 2D CASE','Trace.Case2D','','',{grp:'trace',key:true,
      note:'⚠ Export 1.864 dòng nhưng KHÔNG dòng nào đọc được serial — công đoạn này hiện không truy vết được'}],
    ['2-7-2','Mã 2D Coil','','','',{grp:'trace',
      note:'Doc 09/07 yêu cầu; IO MAP CHƯA có tag'}],
    ['2-7-3','Mã 2D Potting Carrier','Trace.PottingCarrier2D','','',{grp:'trace'}],
    ['2-7-4','Lực ép lắp','Inspection.AssyPressure','','',{grp:'insp'}],
    ['2-7-5','Chiều cao Case-Coil','Inspection.AssyHeight','','',{grp:'insp'}]
  ],

  /* ══ 2-8 Hoop-C Assembly ── MES N4003-4 组装-4 ══ */
  PLC09: [
    ['2-8-1','Thông tin vật liệu (Hoop reel)','Trace.MaterialLot','N4003-4','C002',{grp:'trace',
      note:'Export có trường nhưng legend ghi "无内容" (không nội dung) và giá trị rỗng'}],
    ['2-8-2','Mã 2D CASE','Trace.Case2D','N4003-4','$serial',{grp:'trace',key:true}],
    ['2-8-3','Mã 2D Potting Carrier','Trace.PottingCarrier2D','N4003-4','C001',{grp:'trace',
      note:'Export gọi là 治具编号 (mã đồ gá) — cần xác nhận'}],
    ['2-8-4','KT trạng thái lắp (CCD)','Quality.CCD_Result','','',{grp:'insp',dev:'CV-X450F · CA-H500MX'}],
    ['—','Khoảng cách HOOP dài → mép CASE','','N4003-4','D001',{grp:'insp',note:'Export CÓ, IO MAP chưa có tag'}],
    ['—','Khoảng cách HOOP ngắn → mép CASE','','N4003-4','D002',{grp:'insp',note:'Export CÓ, IO MAP chưa có tag'}]
  ],

  /* ══ 2-9 Soldering Machine ── MES N1102 焊接 ══ */
  PLC10: [
    ['2-9-1','Thông tin vật liệu (dây thiếc)','Trace.MaterialLot','N1102','C002',{grp:'trace'}],
    ['2-9-2','Mã 2D CASE','Trace.Case2D','N1102','$serial',{grp:'trace',key:true}],
    ['2-9-3','Mã 2D Potting Carrier','Trace.PottingCarrier2D','N1102','C001',{grp:'trace',
      note:'Export gọi là 治具编号 (mã đồ gá) — cần xác nhận'}],
    ['—','Lượng thiếc đẩy ra','Inspection.WireSupplyLength','','',{grp:'insp'}]
  ],

  /* ══ 2-10 Soldering Inspection ── MES N7001-2 检查-2 (3D) ══ */
  PLC11: [
    ['2-10-1','Mã 2D CASE','Trace.Case2D','N7001-2','$serial',{grp:'trace',key:true}],
    ['2-10-2','Mã 2D Potting Carrier','Trace.PottingCarrier2D','N7001-2','C001',{grp:'trace',
      note:'Export gọi là 治具编号 (mã đồ gá) — cần xác nhận'}],
    ['2-10-3','KT hàn thiếc (ảnh 3D)','Quality.Cam3D_Result','','',{grp:'insp',dev:'XG-X2900 ×2 · XT-060 ×2',
      note:'Doc 09/07 ghi 2 camera. Export CHỈ có mã đồ gá — toàn bộ kết quả 3D không có trong data.'}],
    ['—','Chiều cao mối hàn','Inspection.SolderHeight','','',{grp:'insp'}],
    ['—','Thể tích mối hàn','Inspection.SolderVolume','','',{grp:'insp'}]
  ],

  /* ══ 2-11 Cover Assembly ── MES N4003-5 组装-5 + N4004 过条 (lật đảo) ══ */
  PLC12: [
    ['2-11-1','Mã 2D CASE','Trace.Case2D','N4003-5','$serial',{grp:'trace',key:true}],
    ['2-11-2','Mã 2D Potting Carrier','Trace.PottingCarrier2D','N4003-5','C001',{grp:'trace',
      note:'Export gọi là 治具编号 (mã đồ gá) — cần xác nhận'}],
    ['—','Thông tin vật liệu (COVER)','Trace.MaterialLot','N4003-5','C002',{grp:'trace'}],
    ['2-11-4','Mã 2D CASE SAU KHI LẬT','','','',{grp:'trace',
      note:'Doc 09/07 yêu cầu; IO MAP CHƯA có tag. Thiếu tag này thì không nối được sản phẩm trước/sau khi lật.'}],
    ['2-11-3','Cao lắp CASE','Inspection.AssyHeight','N4003-5','D002',{grp:'insp',dev:'IX-CP50 · IX-055 ×2',
      note:'IO MAP chỉ 1 tag; export trả 8 giá trị 组立高度-1…8 ⇒ cần 8 tag. Doc ghi rõ đo bằng IX.'}],
    ['—','Áp lực ép','','N4003-5','D001',{grp:'insp',note:'Export CÓ, IO MAP chưa có tag'}],
    ['2-11-5','Thời gian POTTING → lật','Inspection.PotToInvertTime','','',{grp:'insp',
      note:'Ràng buộc 30 phút. Export không có; IO MAP đã có tag.'}],
    ['—','Kết quả timer 30 phút','Inspection.PotToInvertResult','','',{grp:'insp'}],
    ['—','Mã đồ gá công đoạn lật','','N4004','C001',{grp:'trace',
      note:'Export CÓ (công đoạn N4004 过条) nhưng 208/1.052 dòng trả "ERROR"'}]
  ],

  /* ══ 2-12 Auto Drying Shelf ── khách để TRỐNG cả 5 ô 2-12-1…2-12-5 ══ */
  PLC13: [],

  /* ══ 2-13 Final Inspection ── MES N4003-6 组装-6 + N7004-2 电气特性检查-2 ══ */
  PLC14: [
    ['2-13-1','Mã 2D CASE (đầu vào)','Trace.Case2D_Input','N7004-2','$serial',{grp:'trace'}],
    ['2-13-7','Mã 2D CASE (đầu ra — ghi DB)','Trace.Case2D_Output','N7004-2','$serial',{grp:'trace',key:true}],
    ['2-13-2','Trọng lượng sản phẩm','Inspection.Weight','N4003-6','D001',{grp:'insp',unit:'g',
      note:'⚠ Mockup cũ ghi 4,82 g — data thật 41,65–41,99 g (lệch ~8,7×)'}],
    ['—','Kết quả kiểm trọng lượng','Inspection.Weight_Result','','',{grp:'insp',
      note:'Cột OK/NG của công đoạn N4003-6 trả True ở 100% / 44 dòng ⇒ cố định, không dùng được'}],
    ['2-13-3','Cảm kháng (LS)','Inspection.Electric1','N7004-2','D003',{grp:'insp',
      note:'⚠ Mockup cũ ghi 12,45 µH — data thật 164,15–164,90 (lệch ~13×). Cần chốt đơn vị.'}],
    ['2-13-3','Trở kháng (RS)','Inspection.Electric2','N7004-2','D004',{grp:'insp',
      note:'⚠ Mockup cũ ghi 0,18 Ω — data thật 0,878–0,902'}],
    ['2-13-4','Độ bền điện môi','Inspection.ElectricStrength','N7004-2','D007',{grp:'insp',
      note:'⚠ Mockup cũ ghi 500 V — data thật 102,56–102,63'}],
    ['—','Điện áp ra','','N7004-2','D005',{grp:'insp',note:'Export CÓ, IO MAP chưa có tag'}],
    ['—','Dòng điện','','N7004-2','D006',{grp:'insp',note:'Export CÓ, IO MAP chưa có tag'}],
    ['2-13-5','KT vị trí PIN (CCD)','Inspection.PinPos_Result','','',{grp:'insp',dev:'CV-X350F · CA-H500MX'}],
    ['2-13-6','KT in ấn (CCD)','Quality.DateMark_Exist','N7004-2','C001',{grp:'insp',dev:'CV-X320F · CA-H200MX',
      note:'IO MAP chỉ cấp cờ có/không in; export trả chính mã in (捺印密番) — dùng được nhiều hơn'}]
  ]
};

/* Trường export CÓ nhưng KHÔNG có legend ⇒ không được đặt tên, chỉ hiện mã gốc.
   Liệt kê riêng để khách thấy đúng khối lượng dữ liệu chưa được định nghĩa. */
const PLC_UNDEFINED_FIELDS = {
  PLC04: { proc:'N1103',   note:'sheet 熔接 KHÔNG có cột giải thích trường QData' },
  PLC05: { proc:'N4003-1', note:'sheet 组装-1 (CORE) KHÔNG có cột giải thích trường QData' },
  PLC12: { proc:'N4003-5', note:'8 giá trị 组立高度-1…8 + các trường khác' },
  PLC14: { proc:'N7004-2', note:'T2-U/D · T5-U/D và 7 phán định J001…J007 chưa rõ nghĩa' }
};
