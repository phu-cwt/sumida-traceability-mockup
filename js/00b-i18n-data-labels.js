/* Ban dich cho nhan nam TRONG DU LIEU (khong phai chrome giao dien)
   Tach tu js/00-i18n.js — KHONG sua thu tu nap file, phai nap NGAY SAU 00-i18n.js. */
/* ══════════ NHÃN NẰM TRONG DỮ LIỆU ══════════
   Tên trường theo spec máy, nội dung lỗi, loại lỗi ảnh NG… đến thẳng từ bảng spec của
   khách nên nằm rải trong các mảng dữ liệu, không tách được thành khoá i18n gọn như
   chrome giao diện. Ở đây tra cứu THEO CHÍNH CHUỖI TIẾNG VIỆT: thêm bản dịch không phải
   sửa mảng dữ liệu, và thiếu bản dịch thì giữ nguyên gốc chứ không bao giờ vỡ màn hình.
   Trong hệ thống thật những chuỗi này lấy từ DB/PLC — bảng dưới chỉ phục vụ demo. */
const DATA_I18N = {
  en:{
    /* ----- Nội dung lỗi (ALARMS) ----- */
    "Áp suất khí nén thấp":"Low air pressure",
    "Dòng hàn vượt UCL":"Welding current above UCL",
    "Camera 3D trigger timeout":"3D camera trigger timeout",
    "Lỗi đọc / in mã BASE 2D":"BASE 2D code read/print error",
    "Mòn điện cực hàn":"Welding electrode wear",
    "Nhiệt độ lò sấy bất thường":"Abnormal drying oven temperature",
    "BASE feeder hết phôi":"BASE feeder out of blanks",
    "Đứt dây đồng":"Copper wire break",
    "Quét sai can keo (A/B mismatch)":"Wrong resin can scanned (A/B mismatch)",
    /* ----- Loại lỗi ảnh NG ----- */
    "Mất nét in":"Blurred print", "Nứt CASE":"Cracked CASE",
    "Sai vị trí dây":"Wire position error", "In lệch":"Misaligned print",
    "CORE chưa vào hết":"CORE not fully seated", "Thiếc lệch chân":"Solder off-pin",
    "Dây chồng":"Overlapping wire", "COVER hở":"COVER gap",
    "Chiều cao thiếc thấp":"Solder height too low", "Nghiêng CORE":"Tilted CORE",
    "Lệch vị trí PIN":"PIN position offset", "Lệch lắp BASE":"BASE assembly offset",
    "Mã 2D BASE không đọc được":"BASE 2D code unreadable", "Xước CASE":"Scratched CASE",
    /* ----- Tên trường theo spec máy ----- */
    "Điện áp hàn":"Welding voltage", "Dòng hàn":"Welding current",
    "Lực ép phía F":"Pressure force side F", "Lực ép phía S":"Pressure force side S",
    "Áp lực sau hàn":"Post-weld pressure", "Độ dày trước hàn":"Thickness before welding",
    "Độ dày sau hàn":"Thickness after welding", "Độ thay đổi độ dày":"Thickness change",
    "Mã 2D Winding Chuck":"Winding chuck 2D code", "Mã 2D BASE":"BASE 2D code",
    "Vật liệu":"Material", "SL nạp":"Qty loaded", "Hạn":"Expiry",
    "Mã xe / carrier":"Carrier code", "Mã nozzle":"Nozzle code",
    "Kích thước lắp BASE":"BASE assembly dimension",
    "Mức khớp mã 2D (matching)":"2D code matching level",
    "Trục quấn":"Winding spindle", "Lực căng quấn dây":"Winding tension",
    "Cao độ lắp vòng sắt dài":"Long iron ring assembly height",
    "Cao độ lắp vòng sắt tròn":"Round iron ring assembly height",
    "Thời điểm đổ keo":"Potting time", "Liều keo A":"Resin dose A",
    "Liều keo B":"Resin dose B", "Tỉ lệ A/B":"A/B ratio", "Mã đồ gá (jig)":"Jig code",
    "Khoảng cách HOOP dài → mép CASE":"Long HOOP to CASE edge distance",
    "Khoảng cách HOOP ngắn → mép CASE":"Short HOOP to CASE edge distance",
    "Thông tin NVL nạp (tên vật liệu, LOT NO, số lượng, hạn dùng)":
      "Loaded material info (name, LOT NO, qty, expiry)",
    "Thông tin lô keo A (mã vật liệu, LOT NO, số lượng, hạn dùng)":
      "Resin A lot info (material code, LOT NO, qty, expiry)",
    "Thông tin lô keo B (mã vật liệu, LOT NO, số lượng, hạn dùng)":
      "Resin B lot info (material code, LOT NO, qty, expiry)",
    /* ----- Chú thích trạng thái trường ----- */
    "sheet 熔接 KHÔNG có cột giải thích trường QData": "sheet 熔接 has NO column explaining the QData fields",
    "sheet 组装-1 (CORE) KHÔNG có cột giải thích trường QData": "sheet 组装-1 (CORE) has NO column explaining the QData fields",
    "cần bổ sung tag PLC":"PLC tag to be added",
    "export trả rỗng":"export returns empty",
    "chưa có trong data export":"not present in export data",
    "(chưa có định nghĩa)":"(no definition yet)", "(rỗng)":"(empty)",
    "Không có nội dung":"No content",
    "Không rõ — toàn bộ data đều là \"ERROR\"":"Unknown — all data is \"ERROR\"",
    "Có dữ liệu, không có phán định OK/NG":"Has data, no OK/NG judgement",
    "chưa có phán định":"no judgement yet",
    "Code not read — công đoạn CÓ chạy nhưng không ghi được mã nhận dạng":
      "Code not read — the process DID run but no identification code was recorded",
  },
  ja:{
    "Áp suất khí nén thấp":"エア圧低下",
    "Dòng hàn vượt UCL":"溶接電流 UCL 超過",
    "Camera 3D trigger timeout":"3Dカメラ トリガタイムアウト",
    "Lỗi đọc / in mã BASE 2D":"BASE 2Dコード 読取／印字エラー",
    "Mòn điện cực hàn":"溶接電極の摩耗",
    "Nhiệt độ lò sấy bất thường":"乾燥炉 温度異常",
    "BASE feeder hết phôi":"BASEフィーダ 材料切れ",
    "Đứt dây đồng":"銅線断線",
    "Quét sai can keo (A/B mismatch)":"樹脂缶の読取誤り (A/B 不一致)",
    "Mất nét in":"印字かすれ", "Nứt CASE":"CASE 割れ",
    "Sai vị trí dây":"線材位置ずれ", "In lệch":"印字ずれ",
    "CORE chưa vào hết":"CORE 挿入不足", "Thiếc lệch chân":"はんだ 端子ずれ",
    "Dây chồng":"線材重なり", "COVER hở":"COVER 浮き",
    "Chiều cao thiếc thấp":"はんだ高さ不足", "Nghiêng CORE":"CORE 傾き",
    "Lệch vị trí PIN":"PIN 位置ずれ", "Lệch lắp BASE":"BASE 組付けずれ",
    "Mã 2D BASE không đọc được":"BASE 2Dコード 読取不可", "Xước CASE":"CASE キズ",
    "Điện áp hàn":"溶接電圧", "Dòng hàn":"溶接電流",
    "Lực ép phía F":"加圧力 F側", "Lực ép phía S":"加圧力 S側",
    "Áp lực sau hàn":"溶接後加圧力", "Độ dày trước hàn":"溶接前厚み",
    "Độ dày sau hàn":"溶接後厚み", "Độ thay đổi độ dày":"厚み変化量",
    "Mã 2D Winding Chuck":"巻線チャック 2Dコード", "Mã 2D BASE":"BASE 2Dコード",
    "Vật liệu":"材料", "SL nạp":"投入数", "Hạn":"使用期限",
    "Mã xe / carrier":"キャリア番号", "Mã nozzle":"ノズル番号",
    "Kích thước lắp BASE":"BASE 組付け寸法",
    "Mức khớp mã 2D (matching)":"2Dコード 一致度",
    "Trục quấn":"巻線スピンドル", "Lực căng quấn dây":"巻線テンション",
    "Cao độ lắp vòng sắt dài":"長鉄環 組付け高さ",
    "Cao độ lắp vòng sắt tròn":"丸鉄環 組付け高さ",
    "Thời điểm đổ keo":"樹脂注入時刻", "Liều keo A":"樹脂A 吐出量",
    "Liều keo B":"樹脂B 吐出量", "Tỉ lệ A/B":"A/B 比率", "Mã đồ gá (jig)":"治具番号",
    "Khoảng cách HOOP dài → mép CASE":"長HOOP → CASE 端 距離",
    "Khoảng cách HOOP ngắn → mép CASE":"短HOOP → CASE 端 距離",
    "Thông tin NVL nạp (tên vật liệu, LOT NO, số lượng, hạn dùng)":
      "投入材料情報 (材料名・LOT NO・数量・使用期限)",
    "Thông tin lô keo A (mã vật liệu, LOT NO, số lượng, hạn dùng)":
      "樹脂A ロット情報 (材料コード・LOT NO・数量・使用期限)",
    "Thông tin lô keo B (mã vật liệu, LOT NO, số lượng, hạn dùng)":
      "樹脂B ロット情報 (材料コード・LOT NO・数量・使用期限)",
    "sheet 熔接 KHÔNG có cột giải thích trường QData": "シート 熔接 には QData 項目の説明列がありません",
    "sheet 组装-1 (CORE) KHÔNG có cột giải thích trường QData": "シート 组装-1 (CORE) には QData 項目の説明列がありません",
    "cần bổ sung tag PLC":"PLCタグの追加が必要",
    "export trả rỗng":"エクスポートが空",
    "chưa có trong data export":"エクスポートデータに無し",
    "(chưa có định nghĩa)":"(定義なし)", "(rỗng)":"(空)",
    "Không có nội dung":"内容なし",
    "Không rõ — toàn bộ data đều là \"ERROR\"":"不明 — データが全て「ERROR」",
    "Có dữ liệu, không có phán định OK/NG":"データ有り・OK/NG 判定なし",
    "chưa có phán định":"判定なし",
    "Code not read — công đoạn CÓ chạy nhưng không ghi được mã nhận dạng":
      "Code not read —工程は稼働したが識別コードが記録されず",
  },
  zh:{
    "Áp suất khí nén thấp":"气压过低",
    "Dòng hàn vượt UCL":"焊接电流超出 UCL",
    "Camera 3D trigger timeout":"3D相机触发超时",
    "Lỗi đọc / in mã BASE 2D":"BASE 2D码 读取／打印错误",
    "Mòn điện cực hàn":"焊接电极磨损",
    "Nhiệt độ lò sấy bất thường":"干燥炉温度异常",
    "BASE feeder hết phôi":"BASE 供料器缺料",
    "Đứt dây đồng":"铜线断线",
    "Quét sai can keo (A/B mismatch)":"胶罐扫描错误 (A/B 不匹配)",
    "Mất nét in":"打印模糊", "Nứt CASE":"CASE 开裂",
    "Sai vị trí dây":"线材位置错误", "In lệch":"打印偏移",
    "CORE chưa vào hết":"CORE 未装到位", "Thiếc lệch chân":"锡偏离引脚",
    "Dây chồng":"线材重叠", "COVER hở":"COVER 未闭合",
    "Chiều cao thiếc thấp":"锡高不足", "Nghiêng CORE":"CORE 倾斜",
    "Lệch vị trí PIN":"PIN 位置偏移", "Lệch lắp BASE":"BASE 装配偏移",
    "Mã 2D BASE không đọc được":"BASE 2D码 无法读取", "Xước CASE":"CASE 划伤",
    "Điện áp hàn":"焊接电压", "Dòng hàn":"焊接电流",
    "Lực ép phía F":"加压力 F侧", "Lực ép phía S":"加压力 S侧",
    "Áp lực sau hàn":"焊后压力", "Độ dày trước hàn":"焊前厚度",
    "Độ dày sau hàn":"焊后厚度", "Độ thay đổi độ dày":"厚度变化量",
    "Mã 2D Winding Chuck":"绕线夹头 2D码", "Mã 2D BASE":"BASE 2D码",
    "Vật liệu":"材料", "SL nạp":"投入数量", "Hạn":"有效期",
    "Mã xe / carrier":"载具编号", "Mã nozzle":"喷嘴编号",
    "Kích thước lắp BASE":"BASE 装配尺寸",
    "Mức khớp mã 2D (matching)":"2D码 匹配度",
    "Trục quấn":"绕线主轴", "Lực căng quấn dây":"绕线张力",
    "Cao độ lắp vòng sắt dài":"长铁环装配高度",
    "Cao độ lắp vòng sắt tròn":"圆铁环装配高度",
    "Thời điểm đổ keo":"注胶时间", "Liều keo A":"胶A 用量",
    "Liều keo B":"胶B 用量", "Tỉ lệ A/B":"A/B 比例", "Mã đồ gá (jig)":"治具编号",
    "Khoảng cách HOOP dài → mép CASE":"长HOOP → CASE 边距",
    "Khoảng cách HOOP ngắn → mép CASE":"短HOOP → CASE 边距",
    "Thông tin NVL nạp (tên vật liệu, LOT NO, số lượng, hạn dùng)":
      "投入物料信息 (名称、LOT NO、数量、有效期)",
    "Thông tin lô keo A (mã vật liệu, LOT NO, số lượng, hạn dùng)":
      "胶A 批次信息 (物料码、LOT NO、数量、有效期)",
    "Thông tin lô keo B (mã vật liệu, LOT NO, số lượng, hạn dùng)":
      "胶B 批次信息 (物料码、LOT NO、数量、有效期)",
    "sheet 熔接 KHÔNG có cột giải thích trường QData": "工作表 熔接 没有解释 QData 字段的列",
    "sheet 组装-1 (CORE) KHÔNG có cột giải thích trường QData": "工作表 组装-1 (CORE) 没有解释 QData 字段的列",
    "cần bổ sung tag PLC":"需补充 PLC 标签",
    "export trả rỗng":"导出为空",
    "chưa có trong data export":"导出数据中不存在",
    "(chưa có định nghĩa)":"(尚无定义)", "(rỗng)":"(空)",
    "Không có nội dung":"无内容",
    "Không rõ — toàn bộ data đều là \"ERROR\"":"不明 — 数据全部为「ERROR」",
    "Có dữ liệu, không có phán định OK/NG":"有数据，无 OK/NG 判定",
    "chưa có phán định":"尚无判定",
    "Code not read — công đoạn CÓ chạy nhưng không ghi được mã nhận dạng":
      "Code not read — 工序确实运行但未记录识别码",
  }
};
/* Dịch một chuỗi NẰM TRONG DỮ LIỆU. Tiếng Việt là bản gốc nên không cần bảng. */
function TD(s){
  /* Tra UI_I18N trước: js/00c gộp sẵn DATA_I18N vào đó, nên một chuỗi chỉ cần khai ở
     MỘT bảng là cả TD() lẫn bộ duyệt DOM đều dịch được — khỏi phải chép sang hai nơi.
     Vẫn giữ nhánh DATA_I18N phòng khi 00c chưa nạp. */
  const m = (typeof UI_I18N !== 'undefined' && UI_I18N[currentLang]) || DATA_I18N[currentLang];
  return (m && m[s]) || s;
}
