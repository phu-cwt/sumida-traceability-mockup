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
    "tab.output":"Sản lượng & mục tiêu", "tab.agg":"Tổng hợp kỳ",
    "tab.shift":"Ca làm việc", "tab.target":"Mục tiêu & Cycle time",
    /* 5 trạng thái thời gian + 2 tổng */
    "st.wait":"Thời gian chờ", "st.run":"Thời gian chạy", "st.error":"Thời gian dừng lỗi",
    "st.adj":"Thời gian điều chỉnh", "st.check":"Kiểm tra trước khi vận hành lại",
    "st.idle":"Máy không hoạt động", "st.actual":"Thời gian vận hành thực",
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
    /* Ô KPI Top Page đếm lỗi CHƯA XỬ LÝ tại thời điểm hiện tại — khác `th.alarms` là
       số LẦN lỗi cộng dồn trong kỳ ở bảng tổng hợp. Trước đây dùng chung một nhãn
       "Số lỗi", lại nằm cạnh "Hàng lỗi (NG)" nên rất dễ đọc nhầm thành hàng hỏng. */
    "ov.alarmopen":"Lỗi chưa xử lý",
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
    "tab.output":"Output & target", "tab.agg":"Period aggregation",
    "tab.shift":"Shift schedule", "tab.target":"Target & cycle time",
    "st.wait":"Waiting time", "st.run":"Operating time", "st.error":"Error stop time",
    "st.adj":"Adjustment time", "st.check":"Pre-operation check time",
    "st.idle":"Machine not operating", "st.actual":"Actual operating time",
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
    "ov.alarmopen":"Open alarms",
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
    "ov.alarmopen":"未処理アラーム",              // TODO review JA
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
    "tab.shift":"班次",                        // TODO review ZH
    "tab.target":"目标与节拍时间",             // TODO review ZH
                       // TODO review ZH
    "st.wait":"待机时间",   "st.run":"运行时间",  "st.error":"故障停机时间",   // TODO review ZH
    "st.adj":"调整时间",    "st.check":"作业前点检时间",                      // TODO review ZH
    "st.idle":"非稼动时间", "st.actual":"实际稼动时间", "st.planned":"计划稼动时间", // TODO review ZH
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
    "ov.alarmopen":"未处理报警",                                              // TODO review ZH
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
