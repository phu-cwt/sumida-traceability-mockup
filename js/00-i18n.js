/* i18n.js — từ điển 4 ngôn ngữ cho mockup Sumida Traceability.
 *
 * NGUỒN NHÃN (không tự dịch phần đã có nguồn):
 *  - ja : NGUYÊN VĂN sheet `info` của file khách
 *         01_Docs/docs-update/260709 Sumida Traceability system for SEV.xlsx
 *         (稼動状況 · 待機時間 · 動作時間 · Error出力時間 · 調整時間 · 始業前点検時間 ·
 *          実稼働時間 · 投入数 · OK排出数 · NG排出数 · OK排出Cycleタイム ·
 *          目標排出数量 · 情報収集 · 警報履歴 · タイムスケジュール · shift入力 ·
 *          目標生産数量入力 · 計画Cycleタイム入力)
 *  - zh : NGUYÊN VĂN legend QData / tên công đoạn trong file data khách gửi
 *         (印字 · 卷线 · 熔接 · 组装 · 灌胶 · 焊接 · 检查 · 过条 · 电气特性检查 ·
 *          治具编号 · 匹配水平 · 卷线张力 · 制品重量 · 材料投入信息)
 *  - Khoá nào KHÔNG có nguồn trong tài liệu khách thì tự dịch và đánh dấu
 *    `TODO review ZH` / `TODO review JA` để người bản ngữ soát lại.
 *
 * PHẠM VI (chốt ở Validation Session 1): nhãn điều hướng · tiêu đề màn ·
 * 5 trạng thái thời gian · header bảng. KHÔNG dịch nội dung dữ liệu
 * (mã lô, mã jig, số đo) — đó là mã kỹ thuật.
 */
const I18N = {
  vi: {
    /* điều hướng */
    "nav.overview":"Tổng quan Line", "nav.detail":"Trạng thái từng thiết bị",
    "nav.history":"Lịch sử sản xuất", "nav.alarms":"Lịch sử lỗi",
    "nav.trace":"Truy xuất Serial", "nav.gallery":"Ảnh NG", "nav.settings":"Cấu hình",
    "btn.prodhist":"Lịch sử sản xuất", "btn.alarms":"Lịch sử lỗi", "btn.settings":"Cấu hình",
    "btn.back":"Quay lại", "btn.logout":"Đăng xuất",
    /* tab con */
    "tab.mprod":"Sản lượng theo máy", "tab.rt":"Trạng thái máy theo thời gian",
    /* Top Page — bảng sản lượng theo máy */
    "th.status":"Trạng thái",
    "ct.scope":"Phạm vi:",
    "ct.allline":"Toàn line (14 PLC)",
    "ov.lineinfo":"Thông tin toàn line — 14 PLC",
    "dt.devtip":"Thiết bị đo theo doc 09/07", "dt.msconn":"Kết nối PC ↔ PLC",
    "dt.msrun":"Trạng thái chạy", "dt.msalarm":"Lỗi",
    "gal.filtertip":"Chọn ít nhất 1 filter (time / camera / defect) để tìm",
    "sg.fabtip":"Dữ liệu đề xuất bổ sung từ Nittoku",
    "lg.user":"Tài khoản", "lg.pass":"Mật khẩu",
    "tr.lottip":"Không còn là khoá tra cứu — truy vết theo từng sản phẩm (serial). Giữ để nhóm báo cáo theo lô.",
    "dt.tagtip":"Tag OPC UA trong IO MAP 260515", "dt.notag":"chưa có tag",
    "dt.notagtip":"IO MAP 260515 chưa có tag cho trường này",
    "mc.causes":"Nguyên nhân tổn thất (thời gian / 1 ca)",
    "mc.trend":"Xu hướng tỷ lệ vận hành thực 7 kỳ gần nhất",
    "mc.links":"→ Liên kết: <b>Lịch sử lỗi</b> của {0} · <b>Truy xuất Serial</b> (mã công đoạn {1}) · <b>Chi tiết máy</b>.",
    "ct.lineoffperiod":"line nghỉ kỳ này", "ct.clickdetail":"Bấm để xem chi tiết {0}",
    "lo.lossword":"tổn thất", "set.ctunit":"giây / sản phẩm",
    "set.targetnote":"nhập tay, dùng tính 達成率",
    "ct.outscope":"Ngoài phạm vi đang chọn",
    "gal.imgtitle":"Ảnh NG", "gal.camctrl":"Camera / controller",
    "gal.inspuse":"Nội dung kiểm tra", "gal.defect":"Loại lỗi",
    "gal.shotat":"Thời điểm chụp", "gal.naspath":"Đường dẫn NAS",
    "tr.nocodetail":"công đoạn CÓ chạy nhưng không ghi được mã nhận dạng",
    "dt.rawtitle":"TRƯỜNG EXPORT CHƯA CÓ ĐỊNH NGHĨA — {0} · {1} trường",
    "dt.askmeaning":"Đề nghị Sumida cấp bảng nghĩa để đưa các số này vào truy vết.",
    "dt.notinmes":"công đoạn này KHÔNG xuất hiện trong MES export",
    "note.traceintro":"<span class=\"ic\">ⓘ</span><span>Dữ liệu màn này là <b>data sản xuất thật</b> do Sumida gửi (<b id=\"trace-src-rows\">—</b> dòng MES export, <b id=\"trace-src-serials\">—</b> serial) — không phải số minh hoạ. Serial nào thiếu ở một công đoạn thì hiển thị đúng lý do, không ẩn đi.</span>",
    "note.target1":"ⓘ <b>Cột \"Mục tiêu suy ra\"</b> = thời gian chạy × 60 ÷ Cycle time kế hoạch — cập nhật ngay khi đổi Cycle. Cột <b>Sản lượng mục tiêu</b> nhập tay là số dùng tính <b>Tỷ lệ đạt</b> ở màn Lịch sử sản xuất.",
    "note.target2":"<span class=\"cfmchip\">ⓘ cần xác nhận</span> Đơn vị Cycle time là <b>giây / 1 sản phẩm</b> hay <b>giây / 1 lô 4 sản phẩm</b>? Data thật cho thấy line ra hàng theo <b>lô 4</b> (4 cavity), ~40 s/lô ≈ 10 s/pc.",
    "tr.note1":"ⓘ Serial này ghi nhận <b>{0}/{1}</b> công đoạn{2}. Độ phủ cao nhất trong toàn bộ data khách gửi là <b>9/14</b> công đoạn.",
    "tr.note1b":", trong đó <b>{0}</b> công đoạn có chạy nhưng <b>không đọc được mã</b>",
    "tr.note2":"{0} công đoạn <b>không ghi serial vào trường \"Mã theo dõi sản phẩm\"</b> — hiện phải đọc từ trường khác trong QData: {1}.",
    "tr.noserialfield":"không có trường nào chứa serial",
    "tr.note3":"Cột <b>\"Kết quả OK/NG\"</b> chỉ dùng được ở <b>{0}/{1}</b> công đoạn ({2}) — {3} công đoạn còn lại trả về 1 giá trị cố định nên <b>không suy được OK/NG</b>.",
    "tr.note4":"ⓘ Hai công đoạn <b>PLC03</b> (KT vị trí dây, N7001-1) và <b>PLC13</b> (sấy) <b>không xuất hiện</b> trong MES export khách gửi.",
    "dt.rawnote":"Hiển thị nguyên mã gốc — <b>không đặt tên suy đoán</b>.",
    "dt.covered":"phủ",
    "ov.today":"Hôm nay:",
    "ov.allday":"toàn ngày (S1→S2→S3) · đang ở ca",
    "ov.elapsed":"Đã trôi qua",
    "ov.shiftsdone":"ca đã xong",
    "ov.sched":"lịch:",
    "ov.schedtoday":"lịch hôm nay:",
    "ov.curshift":"hiện tại:",
    "ov.dayoff":"nghỉ",
    "note.rt":"<span class=\"cfmchip\">ⓘ cần bổ sung tag PLC</span> Rê chuột 1 đoạn để xem <b>từ mấy giờ → mấy giờ</b> · vạch <b style=\"color:#1E88E5\">NOW</b> = hiện tại · vạch đứt = ranh giới ca · tự làm mới 30 s. IO MAP hiện chỉ có <b class=\"la-tag\">Machine.Status</b> 3 giá trị — chưa tách được 5 trạng thái, xem <b>💡 Đề xuất</b>.",
    "note.pareto":"Nếu WPF phát sinh chi phí thư viện chart: thay bằng <b>bảng xếp hạng có thanh nền</b> — số liệu không đổi.",
    "note.trend":"Trục 0–100% · mục tiêu 85%.",
    "note.shift":"ⓘ Thêm được mẫu ca giờ bất kỳ (VD S1 08:00–16:00). Mục tiêu &amp; Cycle time cài <b>theo từng PLC</b> ở tab kế bên.",
    "note.trace":"ⓘ Truy vết <b>theo từng sản phẩm (serial-level)</b> — chốt 30/07/2026. Ô <b>Lô sản xuất</b> chỉ còn để tham chiếu / nhóm báo cáo, không phải khoá tra cứu.",
    "note.gallery":"ⓘ 8 PLC có camera lưu ảnh: <b>PLC01 · 03 · 05 · 06 · 09 · 11 · 12 · 14</b>. Chính sách lưu: <b>chỉ ảnh NG</b>, 1 ảnh tại trạm phát hiện lỗi.",
    "ct.shiftdone":"✓ ca đã kết thúc",
    "ct.shiftrun":"ca đang chạy dở — số liệu chỉ đủ khi ca kết thúc",
    "ct.ovenna":"không áp dụng — công đoạn sấy: lò giữ sản phẩm ~23 giờ, không đếm theo chu kỳ sản phẩm",
    "lo.alloc":"PHÂN BỔ THỜI GIAN",
    "lo.trend":"XU HƯỚNG TỶ LỆ VẬN HÀNH TOÀN LINE",
    "lo.heat":"HEATMAP TỶ LỆ VẬN HÀNH — máy ×",
    "lo.perdev":"THỜI GIAN THEO TỪNG THIẾT BỊ",
    "lo.pareto":"PARETO TỔN THẤT — xếp hạng nguyên nhân",
    "lo.struct":"CƠ CẤU THỜI GIAN",
    "lo.click":"bấm 1 máy để xem chi tiết",
    "lo.heatnote":"Màu: đỏ <75% · vàng 75–85% · xanh ≥85% (mục tiêu 85%). Ô xám",
    "lo.heatnote2":"= máy không chạy kỳ đó.",
    "lo.trendnote":"Mỗi cột = tỷ lệ vận hành thực toàn line từng kỳ (cùng ca). Màu: đỏ <75% · vàng 75–85% · xanh ≥85% (mục tiêu 85%).",
    "lo.totalloss":"Tổng tổn thất",
    "lo.topcause":"nguyên nhân lớn nhất:",
    "dt.trace":"TRUY XUẤT NGUỒN GỐC — mã định danh & vật liệu",
    "dt.counter":"BỘ ĐẾM SẢN LƯỢNG",
    "dt.insp":"DỮ LIỆU KIỂM TRA / GIA CÔNG",
    "dt.alarmhist":"LỊCH SỬ LỖI",
    "dt.srcserial":"serial gần nhất",
    "dt.coverage":"trường",
    "dt.now":"Đang chạy",
    "dt.prev":"Lần chạy trước",
    "dt.counterlbl":"Bộ đếm",
    "dt.start":"Bắt đầu",
    "dt.stop":"Kết thúc",
    "dt.noalarm":"Không có alarm",
    "st.data":"có data thật",
    "st.empty2":"export rỗng / ERROR",
    "st.iomapd":"có tag, export chưa có",
    "st.needd":"doc 09/07 yêu cầu, chưa có tag",
    "set.mockup":"Bản mockup",
    "set.mockup2":"— mọi thao tác nhập/lưu ở màn này chỉ phản hồi trên giao diện, không ghi vào hệ thống.",
    "set.shifttpl":"MẪU CA — định nghĩa giờ ca dùng chung",
    "ov.sc.shift":"Ca hiện tại", "ov.sc.day":"Cả ngày hôm nay",
    "ov.st.run":"ĐANG CHẠY", "ov.st.alarm":"BÁO LỖI", "ov.st.off":"DỪNG / OFF",
    "pd.input.s":"Vào",                 // nhãn NGẮN cho card — ô hẹp, không đủ chỗ cho nhãn đầy đủ
    "ov.nocount":"Không đếm theo sản phẩm",
    "ov.ovennote":"Lò giữ sản phẩm ~23 giờ — không đếm theo chu kỳ sản phẩm",
    "ov.formula":"Mục tiêu = thời gian chạy × 60 ÷ Cycle time kế hoạch",
    "tab.detail":"Chi tiết máy", "tab.loss":"Phân tích tổn thất",
    "tab.output":"Sản lượng & mục tiêu", "tab.agg":"Tổng hợp kỳ", "tab.prodlist":"Tra cứu sản phẩm",
    "pl.start":"Bắt đầu", "pl.end":"Kết thúc", "pl.nproc":"Số công đoạn", "pl.result":"Kết quả",
    "pl.matinput":"Nguyên vật liệu đầu vào", "pl.journey":"Hành trình công đoạn", "pl.fulltrace":"Mở Truy xuất Serial đầy đủ",
    "pl.lot":"Mã LOT vật liệu", "pl.matname":"Mã vật liệu", "pl.lotf":"Mã LOT", "pl.matf":"Mã vật liệu", "pl.qty":"Số lượng", "pl.from":"Từ", "pl.to":"Đến",
    "pl.serialph":"lọc theo serial…", "pl.empty":"Không có sản phẩm khớp bộ lọc.", "pl.unit":"sản phẩm",
    "tab.shift":"Ca làm việc", "tab.target":"Mục tiêu & Cycle time",
    /* 5 trạng thái thời gian + 2 tổng */
    "st.wait":"Thời gian chờ", "st.run":"Thời gian chạy", "st.error":"Thời gian dừng lỗi",
    "st.adj":"Thời gian điều chỉnh", "st.check":"Kiểm tra trước khi vận hành lại",
    "st.idle":"Máy không hoạt động", "st.actual":"Thời gian vận hành thực", "st.actrate":"Vận hành thực",
    "st.planned":"Thời gian kế hoạch (cả ca)", "st.loss":"Thời gian tổn thất",
    "tl.future":"Chưa tới",
    /* chỉ số sản xuất */
    "pd.input":"Hàng vào", "pd.ok":"Hàng đạt (OK)", "pd.ng":"Hàng lỗi (NG)",
    "pd.ct":"Cycle time thực (OK)", "pd.target":"Sản lượng mục tiêu",
    "pd.rate":"Tỷ lệ đạt", "pd.wip":"Đang trong chuyền (WIP)",
    "pd.planct":"Cycle time kế hoạch", "pd.targetqty":"Sản lượng mục tiêu (nhập tay)",
    /* OEE */
    "oee.oee":"OEE", "oee.a":"Tỷ lệ vận hành (A)", "oee.p":"Hiệu suất (P)", "oee.q":"Chất lượng (Q)",
    /* kỳ */
    "pr.shift":"Ca", "pr.daily":"Ngày", "pr.weekly":"Tuần", "pr.monthly":"Tháng",
    /* header bảng */
    "th.timestart":"Bắt đầu", "th.timestop":"Kết thúc", "th.plc":"PLC", "th.stage":"Công đoạn",
    "th.ok":"OK", "th.ng":"NG", "th.total":"Tổng",
    "th.no":"STT", "th.raised":"Ngày phát sinh", "th.content":"Nội dung lỗi",
    "th.resolved":"Ngày giải quyết", "th.duration":"Thời lượng", "th.product2d":"Mã 2D SP lúc lỗi",
    "th.process":"Công đoạn", "th.code":"Mã công đoạn", "th.period":"Kỳ",
    "th.ngrate":"Tỷ lệ NG", "th.runh":"Vận hành thực (h)", "th.alarms":"Số lần báo lỗi",
    /* Ô KPI Top Page đếm SỐ MÁY đang có lỗi chưa xử lý — khác `th.alarms` là số LẦN
       báo lỗi cộng dồn trong kỳ ở bảng tổng hợp. Trước đây dùng chung một nhãn "Số lỗi",
       lại nằm cạnh "Hàng lỗi (NG)" nên rất dễ đọc nhầm thành hàng hỏng. */
    "ov.alarmopen":"Máy lỗi chưa xử lý",
    "th.serial":"Serial", "th.ts":"Thời điểm", "th.judge":"Phán định",
    "th.field":"Trường dữ liệu", "th.value":"Giá trị", "th.camera":"Camera",
    /* nút + chú thích */
    "btn.search":"Tìm", "btn.reset":"Đặt lại", "btn.exportcsv":"Xuất CSV",
    "btn.exportpdf":"Xuất báo cáo PDF",
    "btn.lookup":"Tra cứu",
    "lg.ok":"OK", "lg.ng":"NG",
    "tag.opt":"tuỳ chọn", "tag.confirm":"cần xác nhận", "tag.needtag":"cần bổ sung tag PLC",
    "tag.nodata":"Không có dữ liệu", "tag.nocode":"Không đọc được mã", "tag.notyet":"Chưa tới công đoạn"
  },

  en: {
    "nav.overview":"Line Overview", "nav.detail":"Status of each Equipment",
    "nav.history":"Production History", "nav.alarms":"Alarm History",
    "nav.trace":"Serial Trace", "nav.gallery":"NG Images", "nav.settings":"Settings",
    "btn.prodhist":"Production History", "btn.alarms":"Alarm History", "btn.settings":"Settings",
    "btn.back":"Back", "btn.logout":"Logout",
    "tab.mprod":"Output by machine", "tab.rt":"Machine status over time",
    "th.status":"Status",
    "ct.scope":"Scope:",
    "ct.allline":"Whole line (14 PLC)",
    "ov.lineinfo":"Whole line overview — 14 PLC",
    "dt.devtip":"Measuring device per the 09/07 document", "dt.msconn":"PC ↔ PLC connection",
    "dt.msrun":"Run status", "dt.msalarm":"Alarm",
    "gal.filtertip":"Select at least 1 filter (time / camera / defect) to search",
    "sg.fabtip":"Data proposed to be added by Nittoku",
    "lg.user":"Account", "lg.pass":"Password",
    "tr.lottip":"No longer a lookup key — traceability is per product (serial). Kept for grouping reports by lot.",
    "dt.tagtip":"OPC UA tag in IO MAP 260515", "dt.notag":"no tag yet",
    "dt.notagtip":"IO MAP 260515 has no tag for this field",
    "mc.causes":"Loss causes (time / 1 shift)",
    "mc.trend":"実稼働率 trend over the last 7 periods",
    "mc.links":"→ Links: <b>Alarm history</b> of {0} · <b>Serial trace</b> (process code {1}) · <b>Equipment detail</b>.",
    "ct.lineoffperiod":"line not running in this period", "ct.clickdetail":"Click to see {0} in detail",
    "lo.lossword":"of loss", "set.ctunit":"seconds / piece",
    "set.targetnote":"entered manually, used to compute 達成率",
    "ct.outscope":"Outside the selected scope",
    "gal.imgtitle":"NG image", "gal.camctrl":"Camera / controller",
    "gal.inspuse":"Inspection purpose", "gal.defect":"Defect type",
    "gal.shotat":"Captured at", "gal.naspath":"NAS path",
    "tr.nocodetail":"the process DID run but no identification code was recorded",
    "dt.rawtitle":"EXPORT FIELDS WITHOUT DEFINITION — {0} · {1} fields",
    "dt.askmeaning":"We ask Sumida to provide a definition table so these values can be used in traceability.",
    "dt.notinmes":"this process does NOT appear in the MES export",
    "note.traceintro":"<span class=\"ic\">ⓘ</span><span>This screen uses <b>real production data</b> supplied by Sumida (<b id=\"trace-src-rows\">—</b> MES export rows, <b id=\"trace-src-serials\">—</b> serials) — not illustrative figures. Where a serial is missing at a process, the actual reason is shown rather than hidden.</span>",
    "note.target1":"ⓘ The <b>\"Derived target\" column</b> = operating time × 60 ÷ planned cycle time — updates as soon as the cycle time changes. The manually entered <b>Target output</b> column is the figure used for the <b>achievement rate</b> on the Production History screen.",
    "note.target2":"<span class=\"cfmchip\">ⓘ needs confirmation</span> Is the cycle time unit <b>seconds / 1 piece</b> or <b>seconds / 1 batch of 4 pieces</b>? The real data shows the line producing in <b>batches of 4</b> (4 cavities), ~40 s/batch ≈ 10 s/pc.",
    "tr.note1":"ⓘ This serial was recorded at <b>{0}/{1}</b> processes{2}. The highest coverage in the whole data set supplied is <b>9/14</b> processes.",
    "tr.note1b":", of which <b>{0}</b> processes did run but <b>could not read the code</b>",
    "tr.note2":"{0} processes <b>do not write the serial into the \"product tracking code\" field</b> — it currently has to be read from another QData field: {1}.",
    "tr.noserialfield":"no field contains the serial",
    "tr.note3":"The <b>\"OK/NG result\"</b> column is usable at only <b>{0}/{1}</b> processes ({2}) — the other {3} processes return a single fixed value, so <b>OK/NG cannot be derived</b>.",
    "tr.note4":"ⓘ Two processes, <b>PLC03</b> (wire position check, N7001-1) and <b>PLC13</b> (drying), <b>do not appear</b> in the MES export supplied.",
    "dt.rawnote":"The raw codes are shown as-is — <b>no guessed names are assigned</b>.",
    "dt.covered":"covered",
    "ov.today":"Today:",
    "ov.allday":"whole day (S1→S2→S3) · currently in shift",
    "ov.elapsed":"Elapsed",
    "ov.shiftsdone":"shifts completed",
    "ov.sched":"schedule:",
    "ov.schedtoday":"today's schedule:",
    "ov.curshift":"current:",
    "ov.dayoff":"off",
    "note.rt":"<span class=\"cfmchip\">ⓘ PLC tag to be added</span> Hover a segment to see <b>from when → to when</b> · the <b style=\"color:#1E88E5\">NOW</b> line = current time · dashed line = shift boundary · auto-refresh every 30 s. The IO MAP currently only has <b class=\"la-tag\">Machine.Status</b> with 3 values — the 5 states cannot be separated yet, see <b>💡 Proposal</b>.",
    "note.pareto":"If a chart library incurs a cost in WPF: replace with a <b>ranking table with background bars</b> — the figures stay the same.",
    "note.trend":"Axis 0–100% · target 85%.",
    "note.shift":"ⓘ Any shift pattern can be added (e.g. S1 08:00–16:00). Target &amp; cycle time are set <b>per PLC</b> on the next tab.",
    "note.trace":"ⓘ Traceability is <b>per product (serial-level)</b> — decided 30/07/2026. The <b>Production lot</b> field is now only for reference / report grouping, not a lookup key.",
    "note.gallery":"ⓘ 8 PLCs have cameras storing images: <b>PLC01 · 03 · 05 · 06 · 09 · 11 · 12 · 14</b>. Retention policy: <b>NG images only</b>, 1 image at the station that detected the defect.",
    "ct.shiftdone":"✓ shift finished",
    "ct.shiftrun":"shift in progress — figures complete only when it ends",
    "ct.ovenna":"n/a — drying: oven holds products ~23 h, not counted per product cycle",
    "lo.alloc":"TIME ALLOCATION",
    "lo.trend":"LINE OPERATING-RATE TREND",
    "lo.heat":"OPERATING-RATE HEATMAP — machine ×",
    "lo.perdev":"TIME BY MACHINE",
    "lo.pareto":"LOSS PARETO — causes ranked",
    "lo.struct":"TIME BREAKDOWN",
    "lo.click":"click a machine for detail",
    "lo.heatnote":"Colour: red <75% · amber 75–85% · green ≥85% (target 85%). Grey cell",
    "lo.heatnote2":"= machine not running in that period.",
    "lo.trendnote":"Each bar = whole-line operating rate per period (same shift). Colour: red <75% · amber 75–85% · green ≥85% (target 85%).",
    "lo.totalloss":"Total loss",
    "lo.topcause":"top cause:",
    "dt.trace":"TRACEABILITY — identifiers & material",
    "dt.counter":"OUTPUT COUNTERS",
    "dt.insp":"INSPECTION / PROCESS DATA",
    "dt.alarmhist":"ALARM HISTORY",
    "dt.srcserial":"latest serial",
    "dt.coverage":"fields",
    "dt.now":"Running",
    "dt.prev":"Previous run",
    "dt.counterlbl":"Counter",
    "dt.start":"Start",
    "dt.stop":"End",
    "dt.noalarm":"No alarm",
    "st.data":"real data",
    "st.empty2":"export empty / ERROR",
    "st.iomapd":"tag exists, no export data",
    "st.needd":"required by 09/07 doc, no tag",
    "set.mockup":"Mock-up build",
    "set.mockup2":"— input/save here only echoes in the UI, nothing is written to the system.",
    "set.shifttpl":"SHIFT TEMPLATES — shared shift hours",
    "ov.sc.shift":"Current shift", "ov.sc.day":"Whole day today",
    "ov.st.run":"RUNNING", "ov.st.alarm":"ALARM", "ov.st.off":"STOPPED / OFF",
    "pd.input.s":"In",
    "ov.nocount":"Not counted per product",
    "ov.ovennote":"Oven holds products ~23 h — not counted per product cycle",
    "ov.formula":"Target = operating minutes × 60 ÷ planned cycle time",
    "tab.detail":"Equipment detail", "tab.loss":"Loss analysis",
    "tab.output":"Output & target", "tab.agg":"Period aggregation", "tab.prodlist":"Product lookup",
    "pl.start":"Start", "pl.end":"End", "pl.nproc":"Processes", "pl.result":"Result",
    "pl.matinput":"Input material", "pl.journey":"Process journey", "pl.fulltrace":"Open full Serial Trace",
    "pl.lot":"Material lot no.", "pl.matname":"Material code", "pl.lotf":"Lot no.", "pl.matf":"Material code", "pl.qty":"Quantity", "pl.from":"From", "pl.to":"To",
    "pl.serialph":"filter by serial…", "pl.empty":"No products match the filter.", "pl.unit":"products",
    "tab.shift":"Shift schedule", "tab.target":"Target & cycle time",
    "st.wait":"Waiting time", "st.run":"Operating time", "st.error":"Error stop time",
    "st.adj":"Adjustment time", "st.check":"Pre-operation check time",
    "st.idle":"Machine not operating", "st.actual":"Actual operating time", "st.actrate":"Operating rate",
    "st.planned":"Planned operating time (shift)", "st.loss":"Loss time",
    "tl.future":"Not yet reached",
    "pd.input":"Units in", "pd.ok":"Good (OK)", "pd.ng":"Defective (NG)",
    "pd.ct":"Actual OK cycle time", "pd.target":"Target output qty",
    "pd.rate":"Achievement rate", "pd.wip":"In line (WIP)",
    "pd.planct":"Planned cycle time", "pd.targetqty":"Target output qty (manual input)",
    "oee.oee":"OEE", "oee.a":"Availability (A)", "oee.p":"Performance (P)", "oee.q":"Quality (Q)",
    "pr.shift":"Shift", "pr.daily":"Daily", "pr.weekly":"Weekly", "pr.monthly":"Monthly",
    "th.timestart":"Time start", "th.timestop":"Time stop", "th.plc":"PLC", "th.stage":"Process",
    "th.ok":"OK", "th.ng":"NG", "th.total":"Total",
    "th.no":"No", "th.raised":"Raised at", "th.content":"Alarm content",
    "th.resolved":"Resolved at", "th.duration":"Duration", "th.product2d":"Product 2D at alarm",
    "th.process":"Process", "th.code":"Process code", "th.period":"Period",
    "th.ngrate":"NG rate", "th.runh":"Actual operating (h)", "th.alarms":"Alarm count",
    "ov.alarmopen":"Machines with open alarms",
    "th.serial":"Serial", "th.ts":"Timestamp", "th.judge":"Judgement",
    "th.field":"Data field", "th.value":"Value", "th.camera":"Camera",
    "btn.search":"Search", "btn.reset":"Reset", "btn.exportcsv":"Export CSV",
    "btn.exportpdf":"Export PDF report",
    "btn.lookup":"Look up",
    "lg.ok":"OK", "lg.ng":"NG",
    "tag.opt":"optional", "tag.confirm":"to be confirmed", "tag.needtag":"needs extra PLC tag",
    "tag.nodata":"No data", "tag.nocode":"Code not read", "tag.notyet":"Not reached yet"
  },

  /* ja — nhãn lấy NGUYÊN VĂN sheet `info`; chỉ phần điều hướng/nút là tự dịch. */
  ja: {
    "nav.overview":"ライン全体",                 // TODO review JA
    "nav.detail":"Status of each Equipment",     // nguyên văn tên sheet review của NITTOKU
    "nav.history":"Production History",          // nguyên văn tên sheet review
    "nav.alarms":"警報履歴",                     // info 1-3
    "nav.trace":"Serial Trace",                  // nguyên văn tên sheet review
    "nav.gallery":"NG画像",                      // info 2. NG画像保存
    "nav.settings":"タイムスケジュール(Setting)", // info 1-4
    "btn.prodhist":"生産状況", "btn.alarms":"警報履歴",
    "btn.settings":"Setting", "btn.back":"戻る", "btn.logout":"ログアウト",
    "tab.mprod":"機械別 生産数",                // nguyên văn wireframe khách xem
    "th.status":"状態",
    "ct.scope":"範囲:",
    "ct.allline":"ライン全体 (14 PLC)",
    "ov.lineinfo":"ライン全体情報 — 14 PLC",     // TODO review JA
    "dt.devtip":"09/07資料に基づく測定機器", "dt.msconn":"PC ↔ PLC 接続",
    "dt.msrun":"運転状態", "dt.msalarm":"異常",
    "gal.filtertip":"検索するにはフィルタを1つ以上選択 (time / camera / defect)",
    "sg.fabtip":"Nittoku 様への追加提案データ",
    "lg.user":"アカウント", "lg.pass":"パスワード",
    "tr.lottip":"検索キーではありません — トレーサビリティは製品単位 (シリアル)。帳票のロット別集計用に残しています。",
    "dt.tagtip":"IO MAP 260515 の OPC UA タグ", "dt.notag":"タグ未設定",
    "dt.notagtip":"IO MAP 260515 にこの項目のタグがありません",
    "mc.causes":"ロス要因 (1シフトあたりの時間)",
    "mc.trend":"実稼働率の推移 直近7期間",
    "mc.links":"→ リンク: {0} の <b>異常履歴</b> · <b>シリアルトレース</b> (工程コード {1}) · <b>設備詳細</b>。",
    "ct.lineoffperiod":"当期はライン休止", "ct.clickdetail":"{0} の詳細を表示",
    "lo.lossword":"のロス", "set.ctunit":"秒 / 個",
    "set.targetnote":"手入力・達成率の計算に使用",
    "ct.outscope":"選択範囲外",                  // TODO review JA
    "gal.imgtitle":"NG画像", "gal.camctrl":"カメラ / コントローラ",
    "gal.inspuse":"検査内容", "gal.defect":"不良種別",
    "gal.shotat":"撮像日時", "gal.naspath":"NAS パス",
    "tr.nocodetail":"工程は稼働したが識別コードが記録されず",        // TODO review JA
    "dt.rawtitle":"定義未確定のエクスポート項目 — {0} · {1}項目",     // TODO review JA
    "dt.askmeaning":"これらの値をトレーサビリティで使えるよう、Sumida 様に項目定義表のご提供をお願いします。",  // TODO review JA
    "dt.notinmes":"この工程は MES エクスポートに存在しません",   // TODO review JA
    "note.traceintro":"<span class=\"ic\">ⓘ</span><span>この画面のデータは Sumida 提供の <b>実生産データ</b> です (<b id=\"trace-src-rows\">—</b> 行の MES エクスポート、<b id=\"trace-src-serials\">—</b> シリアル) — 参考値ではありません。ある工程でシリアルが欠けている場合は、隠さず理由をそのまま表示します。</span>",
    "note.target1":"ⓘ <b>「算出目標」列</b> = 動作時間 × 60 ÷ 計画サイクルタイム — サイクルタイムを変更すると即時に更新されます。手入力の <b>目標生産数</b> 列は、生産履歴画面の <b>達成率</b> の計算に使われる値です。",
    "note.target2":"<span class=\"cfmchip\">ⓘ 要確認</span> サイクルタイムの単位は <b>秒 / 1個</b> ですか、<b>秒 / 4個1ロット</b> ですか？実データではラインは <b>4個ロット</b> (4キャビティ) で排出しており、約40秒/ロット ≈ 10秒/個 です。",
    "tr.note1":"ⓘ このシリアルは <b>{0}/{1}</b> 工程で記録されています{2}。提供データ全体での最大カバー率は <b>9/14</b> 工程です。",
    "tr.note1b":"。うち <b>{0}</b> 工程は稼働したものの <b>コードを読み取れませんでした</b>",
    "tr.note2":"{0} 工程は <b>シリアルを「製品追跡コード」項目に書き込みません</b> — 現状は QData の別項目から読む必要があります: {1}。",
    "tr.noserialfield":"シリアルを含む項目なし",
    "tr.note3":"<b>「OK/NG 判定」</b>列が使えるのは <b>{0}/{1}</b> 工程のみ ({2}) — 残り {3} 工程は固定値を返すため <b>OK/NG を判定できません</b>。",
    "tr.note4":"ⓘ <b>PLC03</b> (線材位置検査, N7001-1) と <b>PLC13</b> (乾燥) の2工程は、提供された MES エクスポートに <b>存在しません</b>。",
    "dt.rawnote":"元のコードをそのまま表示しています — <b>推測による名称は付けません</b>。",
    "dt.covered":"カバー",
    "ov.today":"本日:",
    "ov.allday":"一日全体 (S1→S2→S3) · 現在のシフト",
    "ov.elapsed":"経過",
    "ov.shiftsdone":"シフト完了",
    "ov.sched":"予定:",
    "ov.schedtoday":"本日の予定:",
    "ov.curshift":"現在:",
    "ov.dayoff":"休止",
    "note.rt":"<span class=\"cfmchip\">ⓘ PLCタグの追加が必要</span> 区間にマウスを乗せると <b>何時から→何時まで</b> を表示 · <b style=\"color:#1E88E5\">NOW</b> 線 = 現在時刻 · 破線 = シフト境界 · 30秒ごとに自動更新。IO MAP には現在 <b class=\"la-tag\">Machine.Status</b> の3値しかなく、5状態に分離できません。<b>💡 提案</b> を参照。",
    "note.pareto":"WPF でチャートライブラリの費用が発生する場合: <b>背景バー付きランキング表</b> で代替 — 数値は変わりません。",
    "note.trend":"軸 0–100% · 目標 85%。",
    "note.shift":"ⓘ 任意のシフトパターンを追加できます (例 S1 08:00–16:00)。目標 &amp; サイクルタイムは隣のタブで <b>PLC毎</b> に設定します。",
    "note.trace":"ⓘ トレーサビリティは <b>製品単位 (シリアル単位)</b> — 2026/07/30 決定。<b>製造ロット</b> 欄は参照・帳票のグループ用のみで、検索キーではありません。",
    "note.gallery":"ⓘ 画像を保存するカメラ付きPLCは8台: <b>PLC01 · 03 · 05 · 06 · 09 · 11 · 12 · 14</b>。保存方針: <b>NG画像のみ</b>、検出した工程で1枚。",
    "ct.shiftdone":"✓ シフト終了",
    "ct.shiftrun":"シフト進行中 — 終了後に数値が確定",
    "ct.ovenna":"対象外 — 乾燥炉は製品を約23時間保持、製品サイクル単位で計数しない",
    "lo.alloc":"時間配分",
    "lo.trend":"ライン実稼働率 傾向",
    "lo.heat":"実稼働率ヒートマップ — 設備 ×",
    "lo.perdev":"機械別 時間配分",
    "lo.pareto":"ロス Pareto — 要因ランキング",
    "lo.struct":"時間構成",
    "lo.click":"設備をクリックで詳細",
    "lo.heatnote":"色: 赤 <75% · 黄 75–85% · 緑 ≥85% (目標 85%)。灰色セル",
    "lo.heatnote2":"= その期間は稼働なし。",
    "lo.trendnote":"各棒 = 期間ごとのライン実稼働率（同一シフト）。色: 赤 <75% · 黄 75–85% · 緑 ≥85% (目標 85%)。",
    "lo.totalloss":"ロス合計",
    "lo.topcause":"最大要因:",
    "dt.trace":"トレーサビリティ — 識別コード・材料",
    "dt.counter":"生産カウンタ",
    "dt.insp":"検査・加工データ",
    "dt.alarmhist":"警報履歴",
    "dt.srcserial":"直近シリアル",
    "dt.coverage":"項目",
    "dt.now":"稼働中",
    "dt.prev":"前回運転",
    "dt.counterlbl":"カウンタ",
    "dt.start":"開始",
    "dt.stop":"終了",
    "dt.noalarm":"アラームなし",
    "st.data":"実データあり",
    "st.empty2":"エクスポート空 / ERROR",
    "st.iomapd":"タグ有・データ未取得",
    "st.needd":"09/07資料要求・タグ無",
    "set.mockup":"モックアップ版",
    "set.mockup2":"— この画面の入力・保存は画面上の反応のみで、システムには書き込まれません。",
    "set.shifttpl":"シフト定義 — 共通の時間帯",                          // TODO review JA
    "ov.sc.shift":"当シフト", "ov.sc.day":"本日全体",
    "ov.st.run":"運転中", "ov.st.alarm":"異常", "ov.st.off":"停止",  // TODO review JA
    "pd.input.s":"投入",
    "ov.nocount":"製品単位で計数しない",           // TODO review JA
    "ov.ovennote":"乾燥炉は製品を約23時間保持 — 製品サイクル単位で計数しない",  // TODO review JA
    "ov.formula":"目標排出数量 = 動作時間 × 60 ÷ 計画Cycleタイム",
    "tab.rt":"稼働タイムライン",                 // nguyên văn wireframe khách xem
    "tab.detail":"設備詳細",                    // TODO review JA
    "tab.loss":"稼動状況 (ロス解析)",            // info 1. ロス解析 + 1-1
    "tab.output":"生産状況",                    // info 1-2
    "tab.agg":"情報収集",                       // info 1-1-7 / 1-2-6
    "tab.prodlist":"製品照会",
    "pl.start":"開始", "pl.end":"終了", "pl.nproc":"工程数", "pl.result":"結果",
    "pl.matinput":"投入材料", "pl.journey":"工程履歴", "pl.fulltrace":"シリアル追跡を開く",
    "pl.lot":"材料ロット番号", "pl.matname":"材料コード", "pl.lotf":"ロット番号", "pl.matf":"材料コード",
    "pl.qty":"数量", "pl.from":"開始日", "pl.to":"終了日",
    "pl.serialph":"シリアルで絞込…", "pl.empty":"条件に一致する製品がありません。", "pl.unit":"製品",
    "tab.shift":"shift入力",                    // info 1-4-1
    "tab.target":"目標生産数量・計画Cycleタイム入力", // info 1-4-2 + 1-4-3
                    // TODO review JA
    /* 5 trạng thái — NGUYÊN VĂN info 1-1-1 → 1-1-6 */
    "st.wait":"待機時間 (自動運転中)",
    "st.run":"動作時間 (自動運転中)",
    "st.error":"Error出力時間 (停止中)",
    "st.adj":"調整時間 (手動運転中)",
    "st.check":"始業前点検時間 (始業前点検中)",
    "st.idle":"非稼働時間",                     // TODO review JA
    "st.actual":"実稼働時間",                    // info 1-1-6
    "st.actrate":"実稼働率",
    "st.planned":"計画稼動時間",
    "st.loss":"ロス時間",
    "tl.future":"未到達",                       // TODO review JA
    /* chỉ số — NGUYÊN VĂN info 1-2-1 → 1-2-5 */
    "pd.input":"投入数", "pd.ok":"OK排出数", "pd.ng":"NG排出数",
    "pd.ct":"OK排出Cycleタイム", "pd.target":"目標排出数量",
    "pd.rate":"達成率", "pd.wip":"機内在庫 (WIP)",   // TODO review JA
    "pd.planct":"計画Cycleタイム",                    // info 1-4-3
    "pd.targetqty":"目標生産数量入力(生産目標)",       // info 1-4-2
    "oee.oee":"OEE", "oee.a":"稼働率 (A)", "oee.p":"性能 (P)", "oee.q":"品質 (Q)",
    "pr.shift":"shift", "pr.daily":"Daily", "pr.weekly":"Weekly", "pr.monthly":"Monthly", // info 1-1-7
    "th.timestart":"開始時刻", "th.timestop":"終了時刻", "th.plc":"PLC", "th.stage":"工程",
    "th.ok":"OK", "th.ng":"NG", "th.total":"合計",
    "th.no":"No", "th.raised":"発生日時", "th.content":"警報内容",
    "th.resolved":"復旧日時", "th.duration":"継続時間", "th.product2d":"発生時の製品2D",
    "th.process":"工程", "th.code":"工程コード", "th.period":"期間",
    "th.ngrate":"不良率", "th.runh":"実稼働 (h)", "th.alarms":"警報件数",
    "ov.alarmopen":"異常発生中の設備",            // TODO review JA
    "th.serial":"シリアル", "th.ts":"収集時刻", "th.judge":"判定",
    "th.field":"データ項目", "th.value":"値", "th.camera":"カメラ",
    "btn.search":"検索", "btn.reset":"リセット", "btn.exportcsv":"CSV出力",
    "btn.exportpdf":"PDFレポート出力",
    "btn.lookup":"照会",
    "lg.ok":"OK", "lg.ng":"NG",
    "tag.opt":"オプション", "tag.confirm":"要確認", "tag.needtag":"PLCタグ追加が必要",
    "tag.nodata":"データなし", "tag.nocode":"コード読取不可", "tag.notyet":"未到達"
  },

  /* zh — tên công đoạn + tên trường lấy NGUYÊN VĂN file data khách gửi;
     thuật ngữ MES (ロス解析/OEE/kỳ tổng hợp) không có nguồn ZH → tự dịch, cần soát. */
  zh: {
    "nav.overview":"产线总览",                 // TODO review ZH
    "nav.detail":"各设备状态",                 // TODO review ZH
    "nav.history":"生产履历",                  // TODO review ZH
    "nav.alarms":"报警履历",                   // TODO review ZH
    "nav.trace":"序列号追溯",                  // TODO review ZH
    "nav.gallery":"NG图像",                    // TODO review ZH
    "nav.settings":"设定",                     // TODO review ZH
    "btn.prodhist":"生产履历", "btn.alarms":"报警履历", "btn.settings":"设定",
    "btn.back":"返回", "btn.logout":"退出登录",
    "tab.mprod":"各设备产量",                  // TODO review ZH
    "th.status":"状态",
    "ct.scope":"范围:",
    "ct.allline":"整线 (14 PLC)",
    "ov.lineinfo":"整线信息 — 14 PLC",           // TODO review ZH
    "dt.devtip":"依 09/07 文件的测量设备", "dt.msconn":"PC ↔ PLC 连接",
    "dt.msrun":"运行状态", "dt.msalarm":"报警",
    "gal.filtertip":"请至少选择1个筛选条件 (time / camera / defect) 再搜索",
    "sg.fabtip":"建议由 Nittoku 补充的数据",
    "lg.user":"账号", "lg.pass":"密码",
    "tr.lottip":"不再是查询键 — 追溯按单件产品 (序列号)。保留用于报表按批次分组。",
    "dt.tagtip":"IO MAP 260515 中的 OPC UA 标签", "dt.notag":"尚无标签",
    "dt.notagtip":"IO MAP 260515 中没有该字段的标签",
    "mc.causes":"损失原因 (每班时间)",
    "mc.trend":"実稼働率 最近7期趋势",
    "mc.links":"→ 链接: {0} 的 <b>报警历史</b> · <b>序列号追溯</b> (工序码 {1}) · <b>设备详情</b>。",
    "ct.lineoffperiod":"本期产线停产", "ct.clickdetail":"点击查看 {0} 详情",
    "lo.lossword":"的损失", "set.ctunit":"秒 / 件",
    "set.targetnote":"手工录入，用于计算 達成率",
    "ct.outscope":"所选范围之外",                // TODO review ZH
    "gal.imgtitle":"NG图像", "gal.camctrl":"相机 / 控制器",
    "gal.inspuse":"检查内容", "gal.defect":"不良类型",
    "gal.shotat":"拍摄时间", "gal.naspath":"NAS 路径",
    "tr.nocodetail":"工序确实运行但未记录识别码",                    // TODO review ZH
    "dt.rawtitle":"尚无定义的导出字段 — {0} · {1} 个字段",            // TODO review ZH
    "dt.askmeaning":"建议 Sumida 提供字段含义表，以便将这些数值纳入追溯。",                              // TODO review ZH
    "dt.notinmes":"该工序未出现在 MES 导出中",                    // TODO review ZH
    "note.traceintro":"<span class=\"ic\">ⓘ</span><span>本页数据为 Sumida 提供的 <b>真实生产数据</b> (<b id=\"trace-src-rows\">—</b> 行 MES 导出、<b id=\"trace-src-serials\">—</b> 个序列号) — 并非示意数字。某工序缺少序列号时，会如实显示原因而不隐藏。</span>",
    "note.target1":"ⓘ <b>「推算目标」列</b> = 运行时间 × 60 ÷ 计划节拍时间 — 修改节拍后立即更新。手工录入的 <b>目标产量</b> 列，是生产履历页面计算 <b>达成率</b> 所用的数值。",
    "note.target2":"<span class=\"cfmchip\">ⓘ 需确认</span> 节拍时间的单位是 <b>秒 / 1件</b> 还是 <b>秒 / 1批4件</b>？真实数据显示产线按 <b>4件一批</b> (4腔) 出料，约40秒/批 ≈ 10秒/件。",
    "tr.note1":"ⓘ 该序列号在 <b>{0}/{1}</b> 道工序有记录{2}。所提供数据中最高覆盖为 <b>9/14</b> 道工序。",
    "tr.note1b":"，其中 <b>{0}</b> 道工序确实运行但 <b>未能读取到码</b>",
    "tr.note2":"{0} 道工序 <b>未将序列号写入「产品追踪码」字段</b> — 目前须从 QData 的其他字段读取: {1}。",
    "tr.noserialfield":"没有任何字段包含序列号",
    "tr.note3":"<b>「OK/NG 结果」</b>列仅在 <b>{0}/{1}</b> 道工序可用 ({2}) — 其余 {3} 道工序返回固定值，因此 <b>无法推断 OK/NG</b>。",
    "tr.note4":"ⓘ <b>PLC03</b> (线材位置检查, N7001-1) 与 <b>PLC13</b> (干燥) 两道工序 <b>未出现</b> 在客户提供的 MES 导出中。",
    "dt.rawnote":"按原样显示原始代码 — <b>不臆测命名</b>。",
    "dt.covered":"覆盖",
    "ov.today":"今日:",
    "ov.allday":"全天 (S1→S2→S3) · 当前班次",
    "ov.elapsed":"已过",
    "ov.shiftsdone":"班次已完成",
    "ov.sched":"排班:",
    "ov.schedtoday":"今日排班:",
    "ov.curshift":"当前:",
    "ov.dayoff":"停产",
    "note.rt":"<span class=\"cfmchip\">ⓘ 需补充 PLC 标签</span> 将鼠标移到某段可查看 <b>从几点 → 到几点</b> · <b style=\"color:#1E88E5\">NOW</b> 线 = 当前时刻 · 虚线 = 班次分界 · 每 30 秒自动刷新。IO MAP 目前只有 <b class=\"la-tag\">Machine.Status</b> 的 3 个值 — 尚无法拆分 5 种状态，见 <b>💡 建议</b>。",
    "note.pareto":"若在 WPF 中使用图表库会产生费用: 可改为 <b>带背景条的排名表</b> — 数据不变。",
    "note.trend":"坐标轴 0–100% · 目标 85%。",
    "note.shift":"ⓘ 可添加任意班次模板 (例 S1 08:00–16:00)。目标 &amp; 节拍时间在旁边的标签页中 <b>按每台 PLC</b> 设置。",
    "note.trace":"ⓘ 追溯为 <b>按单件产品 (serial 级)</b> — 2026/07/30 确定。<b>生产批次</b> 栏仅用于参考 / 报表分组，不是查询键。",
    "note.gallery":"ⓘ 有 8 台 PLC 配相机保存图片: <b>PLC01 · 03 · 05 · 06 · 09 · 11 · 12 · 14</b>。保存策略: <b>仅 NG 图片</b>，在检出工序拍 1 张。",
    "ct.shiftdone":"✓ 当班已结束",
    "ct.shiftrun":"当班进行中 — 结束后数据才完整",
    "ct.ovenna":"不适用 — 烘干炉保持产品约23小时，不按产品节拍计数",
    "lo.alloc":"时间分配",
    "lo.trend":"整线运行率趋势",
    "lo.heat":"运行率热力图 — 设备 ×",
    "lo.perdev":"各设备时间分配",
    "lo.pareto":"损失 Pareto — 原因排名",
    "lo.struct":"时间构成",
    "lo.click":"点击设备查看详情",
    "lo.heatnote":"颜色: 红 <75% · 黄 75–85% · 绿 ≥85% (目标 85%)。灰色格",
    "lo.heatnote2":"= 该期间未运行。",
    "lo.trendnote":"每根柱 = 各期整线实稼动率（同一班次）。颜色: 红 <75% · 黄 75–85% · 绿 ≥85% (目标 85%)。",
    "lo.totalloss":"损失合计",
    "lo.topcause":"最大原因:",
    "dt.trace":"追溯 — 识别码与材料",
    "dt.counter":"产量计数器",
    "dt.insp":"检查/加工数据",
    "dt.alarmhist":"报警履历",
    "dt.srcserial":"最近序列号",
    "dt.coverage":"项",
    "dt.now":"运行中",
    "dt.prev":"上次运行",
    "dt.counterlbl":"计数器",
    "dt.start":"开始",
    "dt.stop":"结束",
    "dt.noalarm":"无报警",
    "st.data":"有实际数据",
    "st.empty2":"导出为空 / ERROR",
    "st.iomapd":"有标签，导出无数据",
    "st.needd":"09/07文件要求，无标签",
    "set.mockup":"样机版本",
    "set.mockup2":"— 本画面的输入/保存仅在界面响应，不写入系统。",
    "set.shifttpl":"班次模板 — 通用班次时间",                        // TODO review ZH
    "ov.sc.shift":"当班", "ov.sc.day":"今日全天",
    "ov.st.run":"运行中", "ov.st.alarm":"报警", "ov.st.off":"停机",  // TODO review ZH
    "pd.input.s":"投入",
    "ov.nocount":"不按产品计数",                // TODO review ZH
    "ov.ovennote":"烘干炉保持产品约23小时 — 不按产品节拍计数",  // TODO review ZH
    "ov.formula":"目标排出数量 = 运行时间 × 60 ÷ 计划节拍时间",  // TODO review ZH
    "tab.rt":"设备状态时间轴",                 // TODO review ZH
    "tab.detail":"设备详情",                   // TODO review ZH
    "tab.loss":"损失分析",                     // TODO review ZH
    "tab.output":"产量与目标",                 // TODO review ZH
    "tab.agg":"信息汇总",                      // TODO review ZH
    "tab.prodlist":"产品查询",
    "pl.start":"开始", "pl.end":"结束", "pl.nproc":"工序数", "pl.result":"结果",
    "pl.matinput":"投入材料", "pl.journey":"工序履历", "pl.fulltrace":"打开完整序列号追溯",
    "pl.lot":"材料批次号", "pl.matname":"材料编号", "pl.lotf":"批次号", "pl.matf":"材料编号",
    "pl.qty":"数量", "pl.from":"开始日期", "pl.to":"结束日期",
    "pl.serialph":"按序列号筛选…", "pl.empty":"没有符合筛选条件的产品。", "pl.unit":"个产品",
    "tab.shift":"班次",                        // TODO review ZH
    "tab.target":"目标与节拍时间",             // TODO review ZH
                       // TODO review ZH
    "st.wait":"待机时间",   "st.run":"运行时间",  "st.error":"故障停机时间",   // TODO review ZH
    "st.adj":"调整时间",    "st.check":"作业前点检时间",                      // TODO review ZH
    "st.idle":"非稼动时间", "st.actual":"实际稼动时间", "st.actrate":"实际稼动率", "st.planned":"计划稼动时间", // TODO review ZH
    "st.loss":"损失时间",                                                     // TODO review ZH
    "tl.future":"未到达",                                                     // TODO review ZH
    "pd.input":"投入数量", "pd.ok":"OK排出数量", "pd.ng":"NG排出数量",         // TODO review ZH
    "pd.ct":"OK排出节拍时间", "pd.target":"目标排出数量", "pd.rate":"达成率",   // TODO review ZH
    "pd.wip":"机内在制品 (WIP)", "pd.planct":"计划节拍时间",                   // TODO review ZH
    "pd.targetqty":"目标生产数量（手动录入）",                                // TODO review ZH
    "oee.oee":"OEE", "oee.a":"稼动率 (A)", "oee.p":"性能 (P)", "oee.q":"品质 (Q)", // TODO review ZH
    "pr.shift":"班次", "pr.daily":"日", "pr.weekly":"周", "pr.monthly":"月",   // TODO review ZH
    "th.timestart":"开始时间", "th.timestop":"结束时间", "th.plc":"PLC", "th.stage":"工序",
    "th.ok":"OK", "th.ng":"NG", "th.total":"合计",
    "th.no":"序号", "th.raised":"发生时间", "th.content":"报警内容",           // TODO review ZH
    "th.resolved":"解决时间", "th.duration":"持续时间", "th.product2d":"发生时制品2D", // TODO review ZH
    "th.process":"工序", "th.code":"工序代码", "th.period":"期间",
    "th.ngrate":"不良率", "th.runh":"实际稼动 (h)", "th.alarms":"报警件数",    // TODO review ZH
    "ov.alarmopen":"报警未处理设备",                                          // TODO review ZH
    "th.serial":"序列号", "th.ts":"采集时间", "th.judge":"判定",
    "th.field":"数据项", "th.value":"数值", "th.camera":"相机",
    "btn.search":"搜索", "btn.reset":"重置", "btn.exportcsv":"导出CSV",
    "btn.exportpdf":"导出PDF报告",
    "btn.lookup":"查询",
    "lg.ok":"OK", "lg.ng":"NG",
    "tag.opt":"可选", "tag.confirm":"待确认", "tag.needtag":"需追加PLC标签",   // TODO review ZH
    "tag.nodata":"无数据", "tag.nocode":"未能读取编码", "tag.notyet":"尚未到达" // TODO review ZH
  }
};

/* Nhãn hiển thị song ngữ: <ngôn ngữ đang chọn> — <tiếng Nhật>
   (kiểu wireframe: `稼動状況 — Phân tích tổn thất`). Khi đang xem tiếng Nhật thì
   không nhân đôi. */
function i18nBi(key, lang) {
  const cur = (I18N[lang] || I18N.vi)[key] || key;
  const ja = I18N.ja[key];
  return (lang === 'ja' || !ja || ja === cur) ? cur : `${ja} — ${cur}`;
}
