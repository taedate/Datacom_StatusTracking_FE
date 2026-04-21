<template>
  <div class="page-container bg-white d-flex flex-column">
    <div
      class="px-6 py-4 border-bottom d-flex flex-wrap align-center justify-space-between sticky-top bg-white sticky-header"
      style="z-index: 10; min-height: 80px"
    >
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">รายการงานเร่งด่วน (Urgent Overview)</h2>
        <div class="text-body-2 text-grey mb-3">ติดตามงานค้างที่เกิน {{ warnDays }} / {{ criticalDays }} วัน</div>
      </div>
    </div>

    <div class="px-6 py-4 bg-white border-bottom">
      <v-row dense>
        <v-col cols="12" sm="6" md="3">
          <v-sheet class="kpi-box kpi-total pa-4" rounded="lg">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-caption text-uppercase font-weight-bold text-grey-darken-1">งานค้างทั้งหมด</div>
              <div class="kpi-icon kpi-icon-total">
                <v-icon size="16">mdi-briefcase-outline</v-icon>
              </div>
            </div>
            <div class="text-h4 font-weight-bold text-grey-darken-3">{{ summary.total }}</div>
            <div class="text-caption text-grey">งานที่ยังไม่ปิดทั้งหมด</div>
          </v-sheet>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-sheet class="kpi-box kpi-warning pa-4" rounded="lg">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-caption text-uppercase font-weight-bold text-grey-darken-1">เตือน (&gt; {{ warnDays }} วัน)</div>
              <div class="kpi-icon kpi-icon-warning">
                <v-icon size="16">mdi-alert-outline</v-icon>
              </div>
            </div>
            <div class="text-h4 font-weight-bold text-warning">{{ summary.warning }}</div>
            <div class="text-caption text-grey">เริ่มเสี่ยงหลุด SLA</div>
          </v-sheet>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-sheet class="kpi-box kpi-critical pa-4" rounded="lg">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-caption text-uppercase font-weight-bold text-grey-darken-1">เร่งด่วนมาก (&gt; {{ criticalDays }} วัน)</div>
              <div class="kpi-icon kpi-icon-critical">
                <v-icon size="16">mdi-alert-circle-outline</v-icon>
              </div>
            </div>
            <div class="text-h4 font-weight-bold text-error">{{ summary.critical }}</div>
            <div class="text-caption text-grey">ต้องเร่งดำเนินการทันที</div>
          </v-sheet>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-sheet class="kpi-box kpi-follow pa-4" rounded="lg">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-caption text-uppercase font-weight-bold text-grey-darken-1">ที่ต้องตามวันนี้</div>
              <div class="kpi-icon kpi-icon-follow">
                <v-icon size="16">mdi-calendar-clock-outline</v-icon>
              </div>
            </div>
            <div class="text-h4 font-weight-bold text-theme">{{ summary.followToday }}</div>
            <div class="text-caption text-grey">รวมเตือนและเร่งด่วนมาก</div>
          </v-sheet>
        </v-col>
      </v-row>
    </div>

    <div class="px-6 py-5 bg-white border-bottom">
      <div class="d-flex align-center mb-4">
        <div class="bg-primary-lighten-5 rounded-circle pa-2 mr-3 d-flex align-center justify-center">
          <v-icon icon="mdi-filter-variant" color="#4D2FB2" size="20"></v-icon>
        </div>
        <div>
          <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">ค้นหาและคัดกรอง</div>
          <div class="text-caption text-grey">ค้นหาจากเลขอ้างอิง, ลูกค้า หรือประเภทงาน</div>
        </div>
      </div>

      <v-row dense>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="filters.keyword"
            label="ค้นหา (เลขงาน / ลูกค้า / รายละเอียด)"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            color="#4D2FB2"
            bg-color="grey-lighten-5"
            
            clearable
            hide-details="auto"
            class="rounded-lg"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-autocomplete
            v-model="filters.workType"
            :items="workTypeOptions"
            label="ประเภทงาน"
            prepend-inner-icon="mdi-shape"
            variant="outlined"
            density="compact"
            color="#4D2FB2"
            bg-color="grey-lighten-5"
            
            clearable
            hide-details="auto"
            class="rounded-lg"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-autocomplete
            v-model="filters.urgency"
            :items="urgencyOptions"
            label="ระดับเร่งด่วน"
            prepend-inner-icon="mdi-alert"
            variant="outlined"
            density="compact"
            color="#4D2FB2"
            bg-color="grey-lighten-5"
            
            clearable
            hide-details="auto"
            class="rounded-lg"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field
            id="date-input-urgent"
            v-model="filters.date"
            label="ช่วงวันที่เริ่มงาน"
            prepend-inner-icon="mdi-calendar-range"
            variant="outlined"
            density="compact"
            color="#4D2FB2"
            bg-color="grey-lighten-5"
            
            hide-details="auto"
            readonly
            clearable
            class="rounded-lg"
            @click:clear="clearDateRange"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <div class="flex-grow-1 bg-white">
      <v-data-table
        :headers="headers"
        :items="displayItems"
        :loading="loading"
        loading-text="กำลังโหลดงานเร่งด่วน..."
        no-data-text="ไม่พบงานตามเงื่อนไข"
        item-value="uid"
        class="minimal-table full-width-table"
        :items-per-page="20"
        :sort-by="[{ key: 'ageDays', order: 'desc' }]"
      >
        <template v-slot:[`item.workTypeText`]="{ item }">
          <v-chip
            size="small"
            class="font-weight-bold"
            :color="getWorkTypeColor(item.workType)"
            text-color="white"
          >
            {{ item.workTypeText }}
          </v-chip>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            size="small"
            variant="flat"
            :color="getStatusColor(item.status)"
            class="font-weight-bold text-white"
          >
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <template v-slot:[`item.ageDays`]="{ item }">
          <div class="d-flex align-items-center gap-2">
            <v-chip
              size="small"
              :color="getUrgencyColor(item.urgencyLevel)"
              text-color="white"
              class="font-weight-bold"
            >
              {{ item.ageDays }} วัน
            </v-chip>
          </div>
        </template>

        <template v-slot:[`item.baseDateText`]="{ item }">
          <span class="text-grey-darken-2">{{ item.baseDateText }}</span>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            size="small"
            variant="tonal"
            color="#4D2FB2"
            class="rounded-pill"
            @click="goToDetail(item)"
          >
            <v-icon start icon="mdi-arrow-top-right"></v-icon>
            เปิดงาน
          </v-btn>
        </template>

        <template v-slot:no-data>
          <div class="pa-10 text-center">
            <div class="bg-grey-lighten-5 rounded-circle d-inline-flex pa-4 mb-3">
              <v-icon icon="mdi-alert-circle-outline" size="40" color="grey-lighten-1"></v-icon>
            </div>
            <div class="text-subtitle-1 text-grey-darken-1 font-weight-bold">ไม่พบข้อมูลงานเร่งด่วน</div>
            <div class="text-caption text-grey">ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองใหม่อีกครั้ง</div>
          </div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th.js";
import { urgentDashboardService } from "@/services/urgentDashboardService";

export default {
  name: "TheUrgentOverview",
  data() {
    return {
      loading: false,
      warnDays: 3,
      criticalDays: 5,
      quickFilter: "all",
      allItems: [],
      headers: [
        { title: "ประเภทงาน", key: "workTypeText", sortable: false, width: "130px" },
        { title: "เลขอ้างอิง", key: "refId", width: "120px" },
        { title: "รายละเอียด", key: "title", sortable: false },
        { title: "ลูกค้า/สถานที่", key: "customer", sortable: false },
        { title: "สถานะ", key: "status", sortable: false, width: "130px" },
        { title: "ค้างมาแล้ว", key: "ageDays", width: "110px" },
        { title: "วันที่เริ่ม", key: "baseDateText", width: "110px" },
        { title: "", key: "actions", sortable: false, align: "end", width: "120px" },
      ],
      filters: {
        keyword: null,
        workType: null,
        urgency: null,
        date: null,
      },
      dateRange: {
        start: null,
        end: null,
      },
      fp: null,
      workTypeOptions: [
        { title: "งานรับซ่อม", value: "caseRepair" },
        { title: "งานส่งซ่อม", value: "caseSentRepair" },
        { title: "งานติดตั้ง", value: "caseProject" },
        { title: "เอกสารขาย", value: "quotation" },
      ],
      urgencyOptions: [
        { title: "ปกติ", value: "normal" },
        { title: "เตือน", value: "warning" },
        { title: "เร่งด่วนมาก", value: "critical" },
      ],
    };
  },
  computed: {
    scopedItems() {
      const keyword = (this.filters.keyword || "").trim().toLowerCase();

      return this.allItems.filter((item) => {
        if (this.filters.workType && item.workType !== this.filters.workType) {
          return false;
        }

        if (this.filters.urgency && item.urgencyLevel !== this.filters.urgency) {
          return false;
        }

        if (keyword) {
          const haystack = [item.refId, item.title, item.customer, item.status, item.workTypeText]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(keyword)) {
            return false;
          }
        }

        if (this.dateRange.start || this.dateRange.end) {
          const date = this.parseDateToObj(item.baseDate);
          if (!date) return false;

          const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

          if (this.dateRange.start) {
            const startTime = new Date(
              this.dateRange.start.getFullYear(),
              this.dateRange.start.getMonth(),
              this.dateRange.start.getDate()
            ).getTime();
            if (normalized < startTime) return false;
          }

          if (this.dateRange.end) {
            const endTime = new Date(
              this.dateRange.end.getFullYear(),
              this.dateRange.end.getMonth(),
              this.dateRange.end.getDate()
            ).getTime();
            if (normalized > endTime) return false;
          }
        }

        return true;
      });
    },
    displayItems() {
      return this.scopedItems.filter((item) => {
        if (this.quickFilter === "critical") {
          return item.urgencyLevel === "critical";
        }
        if (this.quickFilter === "warn") {
          return item.ageDays > this.warnDays;
        }
        return true;
      });
    },
    summary() {
      const items = this.scopedItems;
      const warning = items.filter((item) => item.ageDays > this.warnDays).length;
      const critical = items.filter((item) => item.ageDays > this.criticalDays).length;

      return {
        total: items.length,
        warning,
        critical,
        followToday: warning + critical,
      };
    },
  },
  mounted() {
    this.loadUrgentItems();
    this.$nextTick(() => this.initDatePicker());
  },
  beforeUnmount() {
    if (this.fp) this.fp.destroy();
  },
  methods: {
    async loadUrgentItems() {
      this.loading = true;
      try {
        const response = await urgentDashboardService.getUrgentWorkList({
          warnDays: this.warnDays,
          criticalDays: this.criticalDays,
        });

        this.allItems = (response.items || []).sort((a, b) => b.ageDays - a.ageDays);
      } catch (error) {
        console.error("Failed to load urgent overview:", error);
        this.allItems = [];
      } finally {
        this.loading = false;
      }
    },
    getWorkTypeColor(type) {
      const map = {
        caseRepair: "#4D2FB2",
        caseSentRepair: "info",
        caseProject: "dark",
        quotation: "teal",
      };
      return map[type] || "grey";
    },
    getStatusColor(status) {
      const normalized = (status || "").toString();
      if (normalized.includes("เสร็จ") || normalized.includes("RECEIPT") || normalized.includes("รับคืน")) {
        return "success";
      }
      if (normalized.includes("รอ") || normalized.includes("QUOTATION")) {
        return "warning";
      }
      if (normalized.includes("กำลัง") || normalized.includes("DELIVERY_NOTE") || normalized.includes("ส่งซ่อม")) {
        return "info";
      }
      if (normalized.includes("ยกเลิก") || normalized.includes("CANCELLED")) {
        return "error";
      }
      return "grey-darken-1";
    },
    getStatusText(status) {
      const map = {
        QUOTATION: "ใบเสนอราคา",
        DELIVERY_NOTE: "ใบส่งของ",
        RECEIPT: "ใบเสร็จรับเงิน",
        CANCELLED: "ยกเลิก",
      };
      return map[status] || status || "-";
    },
    getUrgencyColor(level) {
      if (level === "critical") return "error";
      if (level === "warning") return "warning";
      return "primary";
    },
    goToDetail(item) {
      if (!item?.route) return;
      this.$router.push(item.route);
    },
    parseDateToObj(value) {
      if (!value) return null;
      const raw = String(value).trim();

      const isoMatch = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
      if (isoMatch) {
        const date = new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
        return Number.isNaN(date.getTime()) ? null : date;
      }

      const thaiMatch = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
      if (thaiMatch) {
        let year = Number(thaiMatch[3]);
        if (year > 2400) year -= 543;
        const date = new Date(year, Number(thaiMatch[2]) - 1, Number(thaiMatch[1]));
        return Number.isNaN(date.getTime()) ? null : date;
      }

      const fallback = new Date(raw);
      return Number.isNaN(fallback.getTime()) ? null : fallback;
    },
    formatToThaiDate(date) {
      if (!date) return "";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear() + 543;
      return `${day}-${month}-${year}`;
    },
    initDatePicker() {
      const el = document.getElementById("date-input-urgent");
      if (!el) return;

      this.fp = flatpickr(el, {
        mode: "range",
        locale: Thai,
        dateFormat: "d-m-Y",
        disableMobile: true,
        allowInput: false,
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            this.dateRange.start = selectedDates[0];
            this.dateRange.end = selectedDates[1];
            this.filters.date = `${this.formatToThaiDate(selectedDates[0])} ถึง ${this.formatToThaiDate(selectedDates[1])}`;
          } else {
            this.clearDateRange();
          }
        },
      });
    },
    clearDateRange() {
      this.dateRange.start = null;
      this.dateRange.end = null;
      this.filters.date = null;
      if (this.fp) {
        this.fp.clear();
      }
    },
  },
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  width: 100%;
  transition: all 0.3s ease;
}

@media (min-width: 992px) {
  .page-container {
    padding-left: 280px !important;
    padding-top: 0 !important;
    padding-right: 0 !important;
  }
}

@media (max-width: 991.98px) {
  .page-container {
    padding-top: 60px !important;
    padding-left: 0 !important;
  }

  .sticky-header {
    top: 60px !important;
  }
}

.kpi-box {
  border: 1px solid #e6eaf2;
  background: linear-gradient(180deg, #ffffff 0%, #fafcff 100%);
  box-shadow: 0 8px 20px rgba(31, 41, 55, 0.04);
  border-left: 4px solid #9ca3af;
}

.kpi-total {
  border-left-color: #4d2fb2;
}

.kpi-warning {
  border-left-color: #f59e0b;
}

.kpi-critical {
  border-left-color: #ef4444;
}

.kpi-follow {
  border-left-color: #0ea5e9;
}

.kpi-icon {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon-total {
  background-color: #ede9fe;
  color: #4d2fb2;
}

.kpi-icon-warning {
  background-color: #fef3c7;
  color: #b45309;
}

.kpi-icon-critical {
  background-color: #fee2e2;
  color: #b91c1c;
}

.kpi-icon-follow {
  background-color: #e0f2fe;
  color: #0369a1;
}

.text-theme {
  color: #4d2fb2 !important;
}

:deep(.minimal-table) {
  width: 100%;
}

:deep(.minimal-table .v-data-table__td:first-child),
:deep(.minimal-table .v-data-table-header__th:first-child) {
  padding-left: 24px !important;
}

:deep(.minimal-table .v-data-table__td:last-child),
:deep(.minimal-table .v-data-table-header__th:last-child) {
  padding-right: 24px !important;
}

:deep(.minimal-table thead tr th) {
  background-color: #f3effd !important;
  color: #333333 !important;
  font-weight: 700 !important;
  font-size: 0.95rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: 60px !important;
  border-bottom: 1px solid var(--theme-border) !important;
  white-space: nowrap;
}

:deep(.minimal-table tbody tr:hover td) {
  background-color: var(--theme-tint-1) !important;
}

:deep(.minimal-table tbody tr td) {
  height: 64px !important;
  font-size: 1rem !important;
  font-weight: 400 !important;
  border-bottom: 1px solid #e0e0e0 !important;
  color: #424242 !important;
}

:deep(.minimal-table tbody tr td .font-weight-bold),
:deep(.minimal-table tbody tr td .font-weight-medium) {
  font-weight: 400 !important;
}

.bg-primary-lighten-5 {
  background-color: var(--theme-tint-1) !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
