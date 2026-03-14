import apiClient from "@/services/sentRepairService";

const CLOSED_REPAIR_STATUS = new Set(["ส่งมอบ", "ยกเลิก"]);
const CLOSED_PROJECT_STATUS = new Set(["เสร็จสิ้น", "ยกเลิก"]);
const CLOSED_QUOTATION_STATUS = new Set(["RECEIPT", "CANCELLED"]);

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function parseDateToObj(value) {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  const raw = String(value).trim();
  if (!raw) return null;

  // ISO-like: yyyy-mm-dd / yyyy/mm/dd
  const isoMatch = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const year = toNumber(isoMatch[1]);
    const month = toNumber(isoMatch[2]);
    const day = toNumber(isoMatch[3]);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Thai/common: dd-mm-yyyy / dd/mm/yyyy
  const thaiMatch = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (thaiMatch) {
    const day = toNumber(thaiMatch[1]);
    const month = toNumber(thaiMatch[2]);
    let year = toNumber(thaiMatch[3]);
    if (year > 2400) year -= 543;
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const fallbackDate = new Date(raw);
  return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
}

function formatThaiDate(value) {
  const date = parseDateToObj(value);
  if (!date) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear() + 543;
  return `${day}-${month}-${year}`;
}

function calculateAgeDays(baseDate, now = new Date()) {
  const dateObj = parseDateToObj(baseDate);
  if (!dateObj) return 0;

  const start = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  return diff < 0 ? 0 : diff;
}

function getUrgencyLevel(ageDays, warnDays, criticalDays) {
  if (ageDays > criticalDays) return "critical";
  if (ageDays > warnDays) return "warning";
  return "normal";
}

function normalizeRepairItems(items, warnDays, criticalDays) {
  return (items || [])
    .filter((item) => item && !CLOSED_REPAIR_STATUS.has(item.caseStatus))
    .map((item) => {
      const ageDays = calculateAgeDays(item.datePickUp);
      const customer = item.customerName || `${item.cusFirstName || ""} ${item.cusLastName || ""}`.trim() || "-";
      return {
        uid: `repair-${item.caseId}`,
        workType: "caseRepair",
        workTypeText: "งานรับซ่อม",
        refId: item.caseId,
        title: item.brokenSymptom || item.caseType || "-",
        customer,
        status: item.caseStatus || "-",
        baseDate: item.datePickUp || "-",
        baseDateText: formatThaiDate(item.datePickUp),
        ageDays,
        urgencyLevel: getUrgencyLevel(ageDays, warnDays, criticalDays),
        route: { name: "TheCaseRepairDetail", params: { id: item.caseId } },
      };
    });
}

function normalizeProjectItems(items, warnDays, criticalDays) {
  return (items || [])
    .filter((item) => item && !CLOSED_PROJECT_STATUS.has(item.pStatus))
    .map((item) => {
      const ageDays = calculateAgeDays(item.dateCreate);
      return {
        uid: `project-${item.pId}`,
        workType: "caseProject",
        workTypeText: "งานติดตั้ง",
        refId: item.pId,
        title: item.pDetail || "-",
        customer: item.pAddress || "-",
        status: item.pStatus || "-",
        baseDate: item.dateCreate || "-",
        baseDateText: formatThaiDate(item.dateCreate),
        ageDays,
        urgencyLevel: getUrgencyLevel(ageDays, warnDays, criticalDays),
        route: { name: "TheCaseProjectDetail", params: { id: item.pId } },
      };
    });
}

function normalizeSentRepairItems(items, warnDays, criticalDays) {
  return (items || [])
    .filter((item) => item && !item.dateOfReceived)
    .map((item) => {
      const ageDays = calculateAgeDays(item.DateSOfSent);
      const device = [item.caseSType, item.caseSBrand, item.caseSModel].filter(Boolean).join(" / ");
      return {
        uid: `sent-repair-${item.caseSId}`,
        workType: "caseSentRepair",
        workTypeText: "งานส่งซ่อม",
        refId: item.caseSId,
        title: device || item.brokenSymptom || "-",
        customer: item.caseSCusName || "-",
        status: "ส่งซ่อมอยู่",
        baseDate: item.DateSOfSent || "-",
        baseDateText: formatThaiDate(item.DateSOfSent),
        ageDays,
        urgencyLevel: getUrgencyLevel(ageDays, warnDays, criticalDays),
        route: { name: "TheCaseSentRepairDetail", params: { id: item.caseSId } },
      };
    });
}

function normalizeQuotationItems(items, warnDays, criticalDays) {
  return (items || [])
    .filter((item) => {
      if (!item) return false;
      const status = item.current_status || item.currentStatus || "QUOTATION";
      return !CLOSED_QUOTATION_STATUS.has(status);
    })
    .map((item) => {
      const status = item.current_status || item.currentStatus || "QUOTATION";
      const issueDate = item.issue_date_str || item.issueDateStr || item.issue_date || null;
      const ageDays = calculateAgeDays(issueDate);
      const docNo = item.quotation_Id || item.delivery_note_no || item.receipt_no || item.id;
      return {
        uid: `quotation-${item.id}`,
        workType: "quotation",
        workTypeText: "เอกสารขาย",
        refId: docNo || item.id,
        title: docNo ? `เลขที่เอกสาร: ${docNo}` : "เอกสารขาย",
        customer: item.customer_name || item.customerName || "-",
        status,
        baseDate: issueDate || "-",
        baseDateText: formatThaiDate(issueDate),
        ageDays,
        urgencyLevel: getUrgencyLevel(ageDays, warnDays, criticalDays),
        route: { name: "TheQuotationDetail", params: { id: item.id } },
      };
    });
}

export const urgentDashboardService = {
  async getUrgentWorkList(options = {}) {
    const warnDays = toNumber(options.warnDays, 3);
    const criticalDays = toNumber(options.criticalDays, 5);
    const itemsPerModule = toNumber(options.itemsPerModule, 300);

    const commonParams = {
      page: 1,
      itemsPerPage: itemsPerModule,
      sort_by: null,
      sort_order: null,
    };

    const [repairRes, projectRes, sentRepairRes, quotationRes] = await Promise.all([
      apiClient.get("/get-case-info", {
        params: {
          ...commonParams,
          search: null,
          caseStatus: null,
          caseType: null,
          dateRange: null,
        },
      }),
      apiClient.get("/get-project-info", {
        params: {
          ...commonParams,
          search: null,
          pStatus: null,
          dateRange: null,
        },
      }),
      apiClient.get("/get-sent-repair-info", {
        params: {
          ...commonParams,
          search: null,
          status: null,
          caseSType: null,
          dateRange: null,
        },
      }),
      apiClient.get("/get-quotation-info", {
        params: {
          ...commonParams,
          search: null,
          status: null,
          dateRange: null,
        },
      }),
    ]);

    const repairItems = normalizeRepairItems(repairRes?.data?.data, warnDays, criticalDays);
    const projectItems = normalizeProjectItems(projectRes?.data?.data, warnDays, criticalDays);
    const sentRepairItems = normalizeSentRepairItems(sentRepairRes?.data?.data, warnDays, criticalDays);
    const quotationItems = normalizeQuotationItems(quotationRes?.data?.data, warnDays, criticalDays);

    return {
      items: [...repairItems, ...projectItems, ...sentRepairItems, ...quotationItems],
      meta: {
        warnDays,
        criticalDays,
      },
    };
  },
};

export default urgentDashboardService;
