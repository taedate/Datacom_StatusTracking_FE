<template>
  <div id="receipt-content" class="print-sheet">
    <section class="a4-page">
      <div class="header-container">
        <img :src="logoSrc" class="logo-img" alt="Logo" />
        <div class="company-info">
          <div class="logo-text">บริษัท ดาต้า คอม แอนด์ เซอร์วิส จำกัด</div>
          <div class="sub-header">
            187/15 ถ.มาตุลี ต.ปากน้ำโพ อ.เมือง จ.นครสวรรค์ 60000
          </div>
          <div class="sub-header fw-bold">
            DATA COM & SERVICE CO.,LTD. โทร. 056-313355, 223547 FAX. 056-231539
          </div>
        </div>
      </div>

      <div class="title-box">
        ใบรับซ่อมเครื่อง / อุปกรณ์ (JOB ID: {{ data.caseId }})
      </div>

      <div class="section-header mt-0">1. รายละเอียดลูกค้า</div>
      <div class="row-flex">
        <div class="col-2">
          <span class="label">ผู้ส่งซ่อม:</span>
          <span class="value"
            >{{ data.cusFirstName }} {{ data.cusLastName }}</span
          >
        </div>
        <div class="col-1">
          <span class="label">เบอร์โทร:</span>
          <span class="value">{{ data.cusPhone }}</span>
        </div>
      </div>
      <div class="row-flex">
        <div class="col-1">
          <span class="label">หน่วยงาน/สังกัด:</span>
          <span class="value">{{ data.caseInstitution || "-" }}</span>
        </div>
      </div>

      <div class="section-header">2. รายละเอียดอุปกรณ์รับซ่อม</div>
      <div class="row-flex">
        <div class="col-1">
          <div class="chk-group">
            <div class="chk-item">
              <div class="box">{{ isType("คอมพิวเตอร์") ? "✓" : "" }}</div>
              คอมพิวเตอร์
            </div>
            <div class="chk-item">
              <div class="box">
                {{ isType("โน็ตบุ๊ค") || isType("โน้ตบุ๊ค") ? "✓" : "" }}
              </div>
              โน๊ตบุ๊ค
            </div>
            <div class="chk-item">
              <div class="box">{{ isType("ปริ้นเตอร์") ? "✓" : "" }}</div>
              ปริ้นเตอร์
            </div>
            <div class="chk-item">
              <div class="box">{{ isType("UPS") ? "✓" : "" }}</div>
              UPS
            </div>
            <div class="chk-item">
              <div class="box">{{ isOtherType ? "✓" : "" }}</div>
              อื่นๆ
            </div>
          </div>
        </div>
      </div>

      <div class="row-flex mt-2">
        <div class="col-1">
          <span class="label">ยี่ห้อ:</span>
          <span class="value">{{ data.caseBrand || "-" }}</span>
        </div>
        <div class="col-1">
          <span class="label">รุ่น:</span>
          <span class="value">{{ data.caseModel || "-" }}</span>
        </div>
        <div class="col-1">
          <span class="label">S/N:</span>
          <span class="value">{{ data.caseSN || "-" }}</span>
        </div>
      </div>
      <div class="row-flex">
        <div class="col-1">
          <span class="label">เลขครุภัณฑ์:</span>
          <span class="value">{{ data.caseDurableArticles || "-" }}</span>
        </div>
      </div>

      <div class="row-flex">
        <div class="col-1">
          <span class="label">อาการเสีย:</span>
          <span class="value">{{ data.brokenSymptom || "-" }}</span>
        </div>
      </div>
      <div class="row-flex">
        <div class="col-1">
          <span class="label">อุปกรณ์ที่นำมา:</span>
          <span class="value">{{ data.caseEquipment || "-" }}</span>
        </div>
      </div>

      <div class="sig-container">
        <div class="sig-box">
          <div class="sig-line"></div>
          <div class="label">ลงชื่อผู้ส่งซ่อม</div>
          <div>วันที่: {{ formatDate(data.datePickUp || getToday()) }}</div>
        </div>
        <div class="sig-box">
          <div class="sig-line">
            <span v-if="staffName" class="staff-name-text">{{ staffName }}</span>
          </div>
          <div class="label">ลงชื่อผู้รับซ่อม (เจ้าหน้าที่)</div>
          <div>วันที่: {{ formatDate(getToday()) }}</div>
        </div>
      </div>

      <div class="section-header mt-3">
        3. รายการที่ช่างซ่อม / เปลี่ยนอะไหล่
      </div>
      <table class="tech-table">
        <thead>
          <tr>
            <th style="width: 8%">ลำดับ</th>
            <th style="width: 62%">รายการเปลี่ยนอะไหล่ / ค่าบริการ</th>
            <th style="width: 30%">ราคา (บาท)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 5" :key="i">
            <td class="text-center">{{ i }}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td
              colspan="2"
              class="text-right fw-bold bg-light"
              style="
                background-color: #fafafa;
                font-weight: bold;
                text-align: right;
              "
            >
              รวมราคาทั้งสิ้น
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="footer-wrapper">
        <div class="disclaimer">
          <strong><u>หมายเหตุเงื่อนไขการรับบริการ:</u></strong
          ><br />
          1. กรณีที่ซื้อเฉพาะฮาร์ดแวร์ (อุปกรณ์คอมพิวเตอร์) บริษัทจะไม่รับใดๆ
          เกี่ยวกับซอฟต์แวร์ (โปรแกรม) ไม่ว่ากรณีใดๆทั้งสิ้น<br />
          2. นำเครื่องมาเซอร์วิส ทางบริษัทฯ จะไม่รับผิดชอบหากเกิดความเสียหายใดๆ
          เกี่ยวกับข้อมูลหรือซอฟต์แวร์ ไม่ว่ากรณีใดๆทั้งสิ้น<br />
          3. ถ้าเครื่องถูกจับจากผู้มีอำนาจทางกฏหมายเหตุเนื่องจาก
          ซอฟต์แวร์ในทางกฏหมาย ทางบริษัทฯ
          จะไม่รับผิดชอบทั้งซอฟต์แวร์และฮาร์ดแวร์ ไม่ว่ากรณีใดๆทั้งสิ้น
        </div>

        <div class="sig-container" style="margin-top: 20px">
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="label">ลงชื่อผู้รับเครื่องคืน (ลูกค้า)</div>
            <div>วันที่: {{ formatDate(data.dateDelivered) }}</div>
          </div>
          <div class="sig-box">
            <div class="label" style="padding-top: 15px">
              ( ........................................................... )
            </div>
            <div class="label">พนักงานผู้ส่งคืน</div>
          </div>
        </div>
      </div>
    </section>

    <section class="a4-page page-break">
      <div class="header-container staff-header">
        <div class="staff-header-main">
          <img :src="logoSrc" class="logo-img" alt="Logo" />
          <div class="company-info">
            <div class="logo-text">บริษัท ดาต้า คอม แอนด์ เซอร์วิส จำกัด</div>
            <div class="sub-header">
              187/15 ถ.มาตุลี ต.ปากน้ำโพ อ.เมือง จ.นครสวรรค์ 60000
            </div>
            <div class="sub-header fw-bold">
              DATA COM & SERVICE CO.,LTD. โทร. 056-313355, 223547 FAX.
              056-231539
            </div>
          </div>
        </div>
        <div class="staff-qr-block">
          <div class="staff-copy-label">สำเนาพนักงาน</div>
          <img
            v-if="qrDataUrl"
            :src="qrDataUrl"
            alt="Document QR"
            class="header-qr-image"
          />
        </div>
      </div>

      <div class="title-box">
        ใบรับซ่อมเครื่อง / อุปกรณ์ (JOB ID: {{ data.caseId }})
      </div>

      <div class="section-header mt-0">1. รายละเอียดลูกค้า</div>
      <div class="row-flex">
        <div class="col-2">
          <span class="label">ผู้ส่งซ่อม:</span>
          <span class="value"
            >{{ data.cusFirstName }} {{ data.cusLastName }}</span
          >
        </div>
        <div class="col-1">
          <span class="label">เบอร์โทร:</span>
          <span class="value">{{ data.cusPhone }}</span>
        </div>
      </div>
      <div class="row-flex">
        <div class="col-1">
          <span class="label">หน่วยงาน/สังกัด:</span>
          <span class="value">{{ data.caseInstitution || "-" }}</span>
        </div>
      </div>

      <div class="section-header">2. รายละเอียดอุปกรณ์รับซ่อม</div>
      <div class="row-flex">
        <div class="col-1">
          <div class="chk-group">
            <div class="chk-item">
              <div class="box">{{ isType("คอมพิวเตอร์") ? "✓" : "" }}</div>
              คอมพิวเตอร์
            </div>
            <div class="chk-item">
              <div class="box">
                {{ isType("โน็ตบุ๊ค") || isType("โน้ตบุ๊ค") ? "✓" : "" }}
              </div>
              โน๊ตบุ๊ค
            </div>
            <div class="chk-item">
              <div class="box">{{ isType("ปริ้นเตอร์") ? "✓" : "" }}</div>
              ปริ้นเตอร์
            </div>
            <div class="chk-item">
              <div class="box">{{ isType("UPS") ? "✓" : "" }}</div>
              UPS
            </div>
            <div class="chk-item">
              <div class="box">{{ isOtherType ? "✓" : "" }}</div>
              อื่นๆ
            </div>
          </div>
        </div>
      </div>

      <div class="row-flex mt-2">
        <div class="col-1">
          <span class="label">ยี่ห้อ:</span>
          <span class="value">{{ data.caseBrand || "-" }}</span>
        </div>
        <div class="col-1">
          <span class="label">รุ่น:</span>
          <span class="value">{{ data.caseModel || "-" }}</span>
        </div>
        <div class="col-1">
          <span class="label">S/N:</span>
          <span class="value">{{ data.caseSN || "-" }}</span>
        </div>
      </div>
      <div class="row-flex">
        <div class="col-1">
          <span class="label">เลขครุภัณฑ์:</span>
          <span class="value">{{ data.caseDurableArticles || "-" }}</span>
        </div>
      </div>

      <div class="row-flex">
        <div class="col-1">
          <span class="label">อาการเสีย:</span>
          <span class="value">{{ data.brokenSymptom || "-" }}</span>
        </div>
      </div>
      <div class="row-flex">
        <div class="col-1">
          <span class="label">อุปกรณ์ที่นำมา:</span>
          <span class="value">{{ data.caseEquipment || "-" }}</span>
        </div>
      </div>

      <div class="sig-container">
        <div class="sig-box">
          <div class="sig-line"></div>
          <div class="label">ลงชื่อผู้ส่งซ่อม</div>
          <div>วันที่: {{ formatDate(data.datePickUp || getToday()) }}</div>
        </div>
        <div class="sig-box">
          <div class="sig-line">
            <span v-if="staffName" class="staff-name-text">{{ staffName }}</span>
          </div>
          <div class="label">ลงชื่อผู้รับซ่อม (เจ้าหน้าที่)</div>
          <div>วันที่: {{ formatDate(getToday()) }}</div>
        </div>
      </div>

      <div class="section-header mt-3">
        3. รายการที่ช่างซ่อม / เปลี่ยนอะไหล่
      </div>
      <table class="tech-table">
        <thead>
          <tr>
            <th style="width: 8%">ลำดับ</th>
            <th style="width: 62%">รายการเปลี่ยนอะไหล่ / ค่าบริการ</th>
            <th style="width: 30%">ราคา (บาท)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 5" :key="`staff-${i}`">
            <td class="text-center">{{ i }}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td
              colspan="2"
              class="text-right fw-bold bg-light"
              style="
                background-color: #fafafa;
                font-weight: bold;
                text-align: right;
              "
            >
              รวมราคาทั้งสิ้น
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="footer-wrapper">
        <div class="disclaimer">
          <strong><u>หมายเหตุเงื่อนไขการรับบริการ:</u></strong
          ><br />
          1. กรณีที่ซื้อเฉพาะฮาร์ดแวร์ (อุปกรณ์คอมพิวเตอร์) บริษัทจะไม่รับใดๆ
          เกี่ยวกับซอฟต์แวร์ (โปรแกรม) ไม่ว่ากรณีใดๆทั้งสิ้น<br />
          2. นำเครื่องมาเซอร์วิส ทางบริษัทฯ จะไม่รับผิดชอบหากเกิดความเสียหายใดๆ
          เกี่ยวกับข้อมูลหรือซอฟต์แวร์ ไม่ว่ากรณีใดๆทั้งสิ้น<br />
          3. ถ้าเครื่องถูกจับจากผู้มีอำนาจทางกฏหมายเหตุเนื่องจาก
          ซอฟต์แวร์ในทางกฏหมาย ทางบริษัทฯ
          จะไม่รับผิดชอบทั้งซอฟต์แวร์และฮาร์ดแวร์ ไม่ว่ากรณีใดๆทั้งสิ้น
        </div>

        <div class="sig-container" style="margin-top: 20px">
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="label">ลงชื่อผู้รับเครื่องคืน (ลูกค้า)</div>
            <div>วันที่: {{ formatDate(data.dateDelivered) }}</div>
          </div>
          <div class="sig-box">
            <div class="label" style="padding-top: 15px">
              ( ........................................................... )
            </div>
            <div class="label">พนักงานผู้ส่งคืน</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import QRCode from "qrcode";

export default {
  name: "RepairReceipt",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      logoSrc: "/LogoDatacom.jpg",
      qrDataUrl: "",
      staffName: "",
    };
  },
  computed: {
    isOtherType() {
      const t = this.data.caseType || "";
      return (
        !t.includes("คอมพิวเตอร์") &&
        !t.includes("โน็ตบุ๊ค") &&
        !t.includes("โน้ตบุ๊ค") &&
        !t.includes("ปริ้นเตอร์") &&
        !t.includes("UPS")
      );
    },
    detailUrl() {
      const id = this.data?.caseId || "";
      if (!id) return "";
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      return `${origin}/caseRepair/${encodeURIComponent(id)}`;
    },
  },
  watch: {
    "data.caseId": {
      immediate: true,
      handler() {
        this.buildQrCode();
      },
    },
    detailUrl() {
      this.buildQrCode();
    },
  },
  mounted() {
    this.staffName = sessionStorage.getItem("userName") || "";
  },
  methods: {
    isType(keyword) {
      return (this.data.caseType || "").includes(keyword);
    },
    formatDate(dateStr) {
      if (!dateStr) return "______/______/______";

      const thaiMonths = [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
      ];
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const parts = dateStr.split("-");
        if (parts.length === 3 && parseInt(parts[2], 10) > 2400) {
          const d = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const y = parts[2];
          if (m >= 0 && m < 12) {
            return `${d} ${thaiMonths[m]} ${y}`;
          }
        }
      }

      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const d = date.getDate();
        const m = date.getMonth();
        const y = date.getFullYear() + 543;
        return `${d} ${thaiMonths[m]} ${y}`;
      }

      return dateStr;
    },
    getToday() {
      return new Date().toISOString().split("T")[0];
    },
    async buildQrCode() {
      if (!this.detailUrl) {
        this.qrDataUrl = "";
        return;
      }
      try {
        this.qrDataUrl = await QRCode.toDataURL(this.detailUrl, {
          width: 180,
          margin: 1,
          errorCorrectionLevel: "M",
        });
      } catch (error) {
        console.error("QR generation failed:", error);
        this.qrDataUrl = "";
      }
    },
  },
};
</script>

<style scoped>
.print-sheet {
  width: 210mm;
  margin: 0 auto;
  background: white;
}

.a4-page {
  width: 210mm;
  padding: 10mm 15mm;
  background: white;
  color: black;
  font-family: "Sarabun", Tahoma, sans-serif;
  font-size: 13.8px;
  line-height: 1.42;
  box-sizing: border-box;
}

.page-break {
  page-break-before: always;
  position: relative;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 1px;
}
.logo-img {
  width: 150px;
  height: auto;
}
.company-info {
  text-align: left;
}
.logo-text {
  font-size: 20px;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 4px;
}
.sub-header {
  font-size: 12px;
}

.title-box {
  border: 2px solid #000;
  padding: 6px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  background-color: #eee;
  margin-bottom: 15px;
  border-radius: 4px;
  color: #000;
}

.section-header {
  font-weight: bold;
  font-size: 15px;
  border-bottom: 1px solid #000;
  margin-top: 15px;
  margin-bottom: 12px;
  padding-bottom: 4px;
  color: #000;
}

.row-flex {
  display: flex;
  width: 100%;
  margin-bottom: 14px;
  align-items: flex-end;
}
.col-1 {
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding-right: 15px;
}
.col-2 {
  flex: 2;
  display: flex;
  align-items: flex-end;
  padding-right: 15px;
}

.label {
  font-weight: bold;
  margin-right: 8px;
  white-space: nowrap;
  font-size: 13.8px;
  color: #000;
}
.value {
  border-bottom: 1px dotted #000;
  flex: 1;
  padding-left: 8px;
  color: #000;
  font-weight: bold;
  padding-bottom: 2px;
  word-break: break-all;
  font-size: 14px;
}

.chk-group {
  display: flex;
  gap: 18px;
  align-items: center;
  flex-wrap: wrap;
}
.chk-item {
  display: flex;
  align-items: center;
  font-size: 13.8px;
  font-weight: 500;
}
.box {
  width: 14px;
  height: 14px;
  border: 1px solid #000;
  display: inline-block;
  margin-right: 5px;
  text-align: center;
  line-height: 12px;
  font-size: 12px;
  font-weight: bold;
}

.tech-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 12.8px;
}
.tech-table th,
.tech-table td {
  border: 1px solid #000;
  padding: 3px 6px;
}
.tech-table th {
  background-color: #eee;
  text-align: center;
  height: 20px;
}
.tech-table td {
  height: 20px;
}

.disclaimer {
  font-size: 10.8px;
  margin-top: 0px;
  border: 1px dashed #666;
  padding: 8px;
  line-height: 1.42;
}

.sig-container {
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
  text-align: center;
  page-break-inside: avoid;
}
.sig-box {
  width: 40%;
}
.staff-name-text {
  font-size: 14px;
  font-weight: bold;
  color: #000;
}
.sig-line {
  border-bottom: 1px dotted #000;
  height: 25px;
  margin-bottom: 5px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 2px;
}

.footer-wrapper {
  margin-top: auto;
  padding-top: 10px;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.fw-bold {
  font-weight: bold;
}
.mt-0 {
  margin-top: 0 !important;
}
.mt-2 {
  margin-top: 10px !important;
}
.mt-3 {
  margin-top: 15px !important;
}

.staff-copy-label {
  font-size: 13px;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1px 10px;
  background: #fff;
}

.staff-header {
  justify-content: space-between;
  align-items: flex-start;
}

.staff-header-main {
  display: flex;
  align-items: center;
  gap: 20px;
}

.staff-qr-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3mm;
  flex-shrink: 0;
}

.header-qr-image {
  width: 28mm;
  height: 28mm;
  border: 1px solid #ddd;
  padding: 2px;
}
</style>
