/* DU LIEU chi tiet 14 PLC (machine status / trace codes / production / inspection)
   Tach tu Sumida_Traceability_Mock_UI.html — KHONG sua thu tu nap file,
   cascade CSS / thu tu khai bao JS phu thuoc vao no. */
/* ============ PLC DETAIL DATA ============ */
// Full data for 14 PLC — schema chuẩn theo IO MAP, render bằng template chung
const PLC_DETAIL = {
  PLC01: {
    stage: "BASE feeding / BASE 2D code",
    machineStatus: {
      connection: { ok:true,  label:"Online",  sub:"OPC UA · 192.168.10.11" },
      run:        { ok:true,  label:"Running", sub:"Auto mode" },
      alarm:      { ok:false, label:"Error",   sub:"Áp suất khí nén thấp (ALM-0002) · xem Lịch sử lỗi bên dưới" }
    },
    trace: [
      { lbl:"Material Lot (BASE)",  value:"LOT-BASE-26W20-0142",   scan:"Scanned 13:45:08" },
      { lbl:"Carrier 2D",           value:"CAR-001-04287",         scan:"Detected 15:42:24" },
      { lbl:"Winding Chuck 2D",     value:"CHK-001-00094",         scan:"Detected 15:42:24" },
      { lbl:"BASE 2D ★ key",        value:"260408A0190A0",  scan:"Printed & verified 15:42:25", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 13:45:08", timeStop:"—",                   ok:243, ng:1, total:246 },
      lastRun: { timeStart:"16/05/2026 11:30:02", timeStop:"16/05/2026 13:42:55", ok:248, ng:0, total:252 }
    },
    inspection: [
      { lbl:"BASE 2D Matching", val:"37", unit:"/40", status:"ok", note:"Grade A (ISO 15415)" },
      { lbl:"CCD Insertion",    val:"OK", unit:"",    status:"ok", note:"Vision: Keyence CV-X350F · CAM01" }
    ]
  },

  PLC02: {
    stage: "Winding",
    machineStatus: {
      connection: { ok:true, label:"Online",  sub:"OPC UA · 192.168.10.12" },
      run:        { ok:true, label:"Running", sub:"Auto mode" },
      alarm:      { ok:true, label:"Normal",  sub:"Không có alarm" }
    },
    trace: [
      { lbl:"Material Lot (Dây đồng φ)", value:"LOT-CU-26W20-0086",    scan:"Scanned 14:02:11" },
      { lbl:"Carrier 2D",                value:"CAR-001-04286",        scan:"Detected 15:42:22" },
      { lbl:"Winding Chuck 2D",          value:"CHK-001-00093",        scan:"Detected 15:42:22" },
      { lbl:"BASE 2D ★ key",             value:"260408A0142A0", scan:"Read 15:42:23", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 13:46:12", timeStop:"—",                   ok:239, ng:0, total:244 },
      lastRun: { timeStart:"16/05/2026 11:32:08", timeStop:"16/05/2026 13:44:30", ok:251, ng:0, total:253 }
    },
    inspection: [
      { lbl:"Winding Tension", val:"0.42", unit:"cN", status:"ok", note:"Target 0.40 ± 0.05 cN" }
    ]
  },

  PLC03: {
    stage: "Wire position check",
    machineStatus: {
      connection: { ok:true, label:"Online",  sub:"OPC UA · 192.168.10.13" },
      run:        { ok:true, label:"Running", sub:"Auto mode" },
      alarm:      { ok:true, label:"Normal",  sub:"Không có alarm" }
    },
    trace: [
      { lbl:"Carrier 2D",       value:"CAR-001-04285",        scan:"Detected 15:42:20" },
      { lbl:"Winding Chuck 2D", value:"CHK-001-00092",        scan:"Detected 15:42:20" },
      { lbl:"BASE 2D ★ key",    value:"260408A0153A0", scan:"Read 15:42:21", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 13:47:30", timeStop:"—",                   ok:240, ng:2, total:242 },
      lastRun: { timeStart:"16/05/2026 11:34:22", timeStop:"16/05/2026 13:45:50", ok:252, ng:1, total:253 }
    },
    inspection: [
      { lbl:"WirePos Result", val:"OK",    unit:"",   status:"ok" },
      { lbl:"Position X",     val:"+0.04", unit:"mm", status:"ok", note:"Tol ± 0.10 mm" },
      { lbl:"Position Y",     val:"-0.02", unit:"mm", status:"ok", note:"Tol ± 0.10 mm" }
    ]
  },

  PLC04: {
    stage: "Resistance welding",
    machineStatus: {
      connection: { ok:true,  label:"Online",      sub:"OPC UA · 192.168.10.14" },
      run:        { ok:true,  label:"Running",     sub:"Auto mode" },
      alarm:      { ok:false, label:"Error",  sub:"Dòng hàn vượt UCL (ALM-1023) · xem Lịch sử lỗi bên dưới" }
    },
    trace: [
      { lbl:"Carrier 2D",       value:"CAR-001-04282",        scan:"Detected 15:42:18" },
      { lbl:"Winding Chuck 2D", value:"CHK-001-00091",        scan:"Detected 15:42:18" },
      { lbl:"BASE 2D ★ key",    value:"260408A0162A0", scan:"Read 15:42:19", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 15:27:26", timeStop:"—",                   ok:230, ng:2, total:240 },
      lastRun: { timeStart:"16/05/2026 13:02:10", timeStop:"16/05/2026 15:18:44", ok:235, ng:0, total:240 }
    },
    inspection: [
      { lbl:"Weld Voltage",        val:"3.18",  unit:"V",  status:"ok" },
      { lbl:"Weld Current",        val:"19.82", unit:"A",  status:"ng", note:"UCL 18.50A" },
      { lbl:"Bend Pressure F",     val:"12.40", unit:"N",  status:"ok" },
      { lbl:"Bend Pressure S",     val:"12.62", unit:"N",  status:"ok" },
      { lbl:"Thickness before",    val:"1.20",  unit:"mm", status:"" },
      { lbl:"Thickness after",     val:"1.04",  unit:"mm", status:"" },
      { lbl:"Δ Thickness",         val:"-0.16", unit:"mm", status:"ng", note:"Spec -0.10 ~ +0.05" },
      { lbl:"Pressure after weld", val:"8.95",  unit:"N",  status:"ok" }
    ]
  },

  PLC05: {
    stage: "Core assy / Electric inspection",
    machineStatus: {
      connection: { ok:true, label:"Online",  sub:"OPC UA · 192.168.10.15" },
      run:        { ok:true, label:"Running", sub:"Auto mode" },
      alarm:      { ok:true, label:"Normal",  sub:"Không có alarm" }
    },
    trace: [
      { lbl:"Material Lot (Core)", value:"LOT-CORE-26W19-0234",  scan:"Scanned 12:30:55" },
      { lbl:"Carrier 2D",          value:"CAR-001-04280",        scan:"Detected 15:42:16" },
      { lbl:"Winding Chuck 2D",    value:"CHK-001-00090",        scan:"Detected 15:42:16" },
      { lbl:"BASE 2D ★ key",       value:"260408A0165A0", scan:"Read 15:42:17", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 13:50:18", timeStop:"—",                   ok:237, ng:1, total:241 },
      lastRun: { timeStart:"16/05/2026 11:38:45", timeStop:"16/05/2026 13:48:30", ok:250, ng:0, total:252 }
    },
    inspection: [
      { lbl:"Inductance",           val:"12.42", unit:"µH", status:"ok", note:"Spec 12.0 ~ 13.0 µH" },
      { lbl:"CCD (Core insertion)", val:"OK",    unit:"",   status:"ok", note:"Vision CAM05" }
    ]
  },

  PLC06: {
    stage: "CASE 2D code / BUSH assy",
    machineStatus: {
      connection: { ok:true, label:"Online",  sub:"OPC UA · 192.168.10.16" },
      run:        { ok:true, label:"Running", sub:"Auto mode" },
      alarm:      { ok:true, label:"Normal",  sub:"Không có alarm" }
    },
    trace: [
      { lbl:"Material Lot (CASE)", value:"LOT-CASE-26W20-0145", scan:"Scanned 13:15:22" },
      { lbl:"Material Lot (BUSH)", value:"LOT-BUSH-26W20-0091", scan:"Scanned 13:18:40" },
      { lbl:"CASE 2D ★ key",       value:"260408A0192A0", scan:"Printed & verified 15:42:14", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 13:52:44", timeStop:"—",                   ok:241, ng:0, total:245 },
      lastRun: { timeStart:"16/05/2026 11:41:20", timeStop:"16/05/2026 13:50:55", ok:251, ng:1, total:253 }
    },
    inspection: [
      { lbl:"CASE 2D Matching", val:"38",   unit:"/40", status:"ok", note:"Grade A (ISO 15415)" },
      { lbl:"BUSH assy Height", val:"4.20", unit:"mm",  status:"ok", note:"Spec 4.15 ~ 4.25 mm" },
      { lbl:"CCD (BUSH crack)", val:"OK",   unit:"",    status:"ok", note:"Vision CAM06" }
    ]
  },

  PLC07: {
    stage: "Resin potting",
    machineStatus: {
      connection: { ok:true, label:"Online",  sub:"OPC UA · 192.168.10.17" },
      run:        { ok:true, label:"Running", sub:"Auto mode" },
      alarm:      { ok:true, label:"Normal",  sub:"Không có alarm" }
    },
    trace: [
      { lbl:"Material Lot A (Keo A)", value:"LOT-RESIN-A-26W20-051", scan:"Scanned 06:30:11 — Tank A" },
      { lbl:"Material Lot B (Keo B)", value:"LOT-RESIN-B-26W20-051", scan:"Scanned 06:31:24 — Tank B" },
      { lbl:"Potting Carrier 2D",     value:"POT-002-01254",         scan:"Detected 15:42:12" },
      { lbl:"CASE 2D ★ key",          value:"260408A0041A0",  scan:"Read 15:42:13", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 13:55:08", timeStop:"—",                   ok:235, ng:1, total:242 },
      lastRun: { timeStart:"16/05/2026 11:44:00", timeStop:"16/05/2026 13:53:20", ok:249, ng:0, total:252 }
    },
    inspection: [
      { lbl:"Flow Quantity A", val:"1.42", unit:"ml", status:"ok", note:"Target 1.40 ± 0.05 ml" },
      { lbl:"Flow Quantity B", val:"1.40", unit:"ml", status:"ok", note:"Target 1.40 ± 0.05 ml" }
    ]
  },

  PLC08: {
    stage: "Coil-CASE assy",
    machineStatus: {
      connection: { ok:true, label:"Online",  sub:"OPC UA · 192.168.10.18" },
      run:        { ok:true, label:"Running", sub:"Auto mode" },
      alarm:      { ok:true, label:"Normal",  sub:"Không có alarm" }
    },
    trace: [
      { lbl:"Potting Carrier 2D", value:"POT-002-01250",        scan:"Detected 15:42:10" },
      { lbl:"CASE 2D ★ key",      value:"260408A0043A0", scan:"Read 15:42:11", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 13:57:32", timeStop:"—",                   ok:238, ng:0, total:240 },
      lastRun: { timeStart:"16/05/2026 11:46:50", timeStop:"16/05/2026 13:55:42", ok:252, ng:0, total:253 }
    },
    inspection: [
      { lbl:"Assy Pressure", val:"8.95", unit:"N",  status:"ok", note:"Spec 8.0 ~ 10.0 N" },
      { lbl:"Assy Height",   val:"8.20", unit:"mm", status:"ok", note:"Spec 8.15 ~ 8.25 mm" }
    ]
  },

  PLC09: {
    stage: "Hoop-C assy",
    machineStatus: {
      connection: { ok:true, label:"Online",  sub:"OPC UA · 192.168.10.19" },
      run:        { ok:true, label:"Running", sub:"Auto mode" },
      alarm:      { ok:true, label:"Normal",  sub:"Không có alarm" }
    },
    trace: [
      { lbl:"Material Lot (Hoop-C reel)", value:"LOT-HOOP-26W20-0312",  scan:"Scanned 10:15:30" },
      { lbl:"Potting Carrier 2D",         value:"POT-002-01246",        scan:"Detected 15:42:08" },
      { lbl:"CASE 2D ★ key",              value:"260408A0044A0", scan:"Read 15:42:09", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 13:59:48", timeStop:"—",                   ok:240, ng:0, total:240 },
      lastRun: { timeStart:"16/05/2026 11:49:14", timeStop:"16/05/2026 13:58:00", ok:252, ng:0, total:252 }
    },
    inspection: [
      { lbl:"CCD Inspection", val:"OK", unit:"", status:"ok", note:"Vision CAM09" }
    ]
  },

  PLC10: {
    stage: "Soldering",
    machineStatus: {
      connection: { ok:true, label:"Online",  sub:"OPC UA · 192.168.10.20" },
      run:        { ok:true, label:"Running", sub:"Auto mode" },
      alarm:      { ok:true, label:"Normal",  sub:"Không có alarm" }
    },
    trace: [
      { lbl:"Material Lot (Solder wire bobbin)", value:"LOT-SOLDER-26W19-0078", scan:"Scanned 09:45:12" },
      { lbl:"Potting Carrier 2D",                value:"POT-002-01242",         scan:"Detected 15:42:06" },
      { lbl:"CASE 2D ★ key",                     value:"260408A0049A0",  scan:"Read 15:42:07", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 14:02:11", timeStop:"—",                   ok:236, ng:2, total:241 },
      lastRun: { timeStart:"16/05/2026 11:51:30", timeStop:"16/05/2026 14:00:22", ok:250, ng:1, total:253 }
    },
    inspection: [
      { lbl:"Solder wire supply length", val:"3.42", unit:"mm", status:"ok", note:"Target 3.40 ± 0.10 mm" }
    ]
  },

  PLC11: {
    stage: "Solder inspection",
    machineStatus: {
      connection: { ok:true,  label:"Online",     sub:"OPC UA · 192.168.10.21" },
      run:        { ok:true,  label:"Running",    sub:"Auto mode" },
      alarm:      { ok:false, label:"Error", sub:"Camera 3D trigger timeout (ALM-2104) · xem Lịch sử lỗi bên dưới" }
    },
    trace: [
      { lbl:"Potting Carrier 2D", value:"POT-002-01238",        scan:"Detected 15:42:04" },
      { lbl:"CASE 2D ★ key",      value:"260408A0050A0", scan:"Read 15:42:05", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 14:04:35", timeStop:"—",                   ok:227, ng:7, total:239 },
      lastRun: { timeStart:"16/05/2026 11:53:48", timeStop:"16/05/2026 14:02:50", ok:248, ng:2, total:253 }
    },
    inspection: [
      { lbl:"3D Camera Result", val:"NG",   unit:"",    status:"ng", note:"Vision CAM11A" },
      { lbl:"Solder Height",    val:"0.14", unit:"mm",  status:"ng", note:"Spec ≥ 0.18 mm" },
      { lbl:"Solder Volume",    val:"0.42", unit:"mm³", status:"ok" }
    ]
  },

  PLC12: {
    stage: "COVER assy / Inversion",
    machineStatus: {
      connection: { ok:true, label:"Online",  sub:"OPC UA · 192.168.10.22" },
      run:        { ok:true, label:"Running", sub:"Auto mode" },
      alarm:      { ok:true, label:"Normal",  sub:"Không có alarm" }
    },
    trace: [
      { lbl:"Material Lot (COVER)", value:"LOT-COVER-26W20-0188", scan:"Scanned 11:20:08" },
      { lbl:"Potting Carrier 2D",   value:"POT-002-01234",        scan:"Detected 15:42:02" },
      { lbl:"CASE 2D ★ key",        value:"260408A0051A0", scan:"Read 15:42:03", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 14:07:00", timeStop:"—",                   ok:243, ng:0, total:244 },
      lastRun: { timeStart:"16/05/2026 11:56:10", timeStop:"16/05/2026 14:05:18", ok:253, ng:0, total:253 }
    },
    inspection: [
      { lbl:"COVER assy Height",   val:"12.85", unit:"mm",  status:"ok", note:"Spec 12.80 ~ 12.90 mm" },
      { lbl:"Potting→Invert Time", val:"1180",  unit:"s",   status:"ok", note:"≈ 19.7 min · Max 1800 s (30 min)" },
      { lbl:"Timer Judgment",      val:"OK",    unit:"",    status:"ok" }
    ]
  },

  PLC13: {
    stage: "Drying (auto-shelf oven)",
    machineStatus: {
      connection: { ok:true, label:"Online",  sub:"OPC UA · 192.168.10.23" },
      run:        { ok:true, label:"Running", sub:"Auto mode" },
      alarm:      { ok:true, label:"Normal",  sub:"Không có alarm" }
    },
    trace: [],
    production: {
      running: { timeStart:"16/05/2026 14:09:20", timeStop:"—",                   ok:248, ng:0, total:248 },
      lastRun: { timeStart:"16/05/2026 11:58:30", timeStop:"16/05/2026 14:07:40", ok:253, ng:0, total:253 }
    },
    inspection: [],
    note: "Lò sấy tự động — theo IO MAP chỉ thu Status & Alarm (không có Traceability codes, không có Inspection data)."
  },

  PLC14: {
    stage: "Final inspection (Weight / Electric / Pin / Date)",
    machineStatus: {
      connection: { ok:true, label:"Online",  sub:"OPC UA · 192.168.10.24" },
      run:        { ok:true, label:"Running", sub:"Auto mode" },
      alarm:      { ok:true, label:"Normal",  sub:"Không có alarm" }
    },
    trace: [
      { lbl:"CASE 2D (Input)",        value:"260408A0052A0", scan:"Read 15:41:58" },
      { lbl:"CASE 2D (Output) ★ key", value:"260408A0052A0", scan:"Recorded to DB 15:42:01", key:true }
    ],
    production: {
      running: { timeStart:"16/05/2026 14:12:08", timeStop:"—",                   ok:240, ng:3, total:248 },
      lastRun: { timeStart:"16/05/2026 12:00:55", timeStop:"16/05/2026 14:10:25", ok:251, ng:1, total:253 }
    },
    inspection: [
      { lbl:"Weight",              val:"4.82",  unit:"g",  status:"ok", note:"Spec 4.75 ~ 4.85 g" },
      { lbl:"Weight Result",       val:"OK",    unit:"",   status:"ok" },
      { lbl:"Electric 1 (L)",      val:"12.45", unit:"µH", status:"ok", note:"Spec 12.0 ~ 13.0 µH" },
      { lbl:"Electric 2 (DCR)",    val:"0.18",  unit:"Ω",  status:"ok", note:"Spec ≤ 0.20 Ω" },
      { lbl:"Dielectric Strength", val:"500",   unit:"V",  status:"ok" },
      { lbl:"Pin Position",        val:"OK",    unit:"",   status:"ok", note:"Vision CAM14" },
      { lbl:"Date Marking",        val:"OK",    unit:"",   status:"ok", note:"Printed & verified" },
      { lbl:"CASE 2D Output",      val:"OK",    unit:"",   status:"ok", note:"Recorded to DB" }
    ]
  }
};
