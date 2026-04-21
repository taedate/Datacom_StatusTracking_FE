<template>
  <div class="page-container bg-white d-flex flex-column">
    <div
      class="px-6 py-4 border-bottom d-flex flex-wrap align-center justify-space-between sticky-top bg-white sticky-header"
      style="z-index: 10; min-height: 80px"
    >
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">
          กิจกรรมในระบบ (Audit Logs)
        </h2>
        <div class="text-body-2 text-grey mb-3">
          ติดตามการกระทำทั้งหมดของผู้ใช้งานและระบบ
        </div>
      </div>

      <div class="d-flex align-center" style="gap: 12px">
        <v-menu location="bottom end" transition="scale-transition">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="outlined"
              color="grey-darken-1"
              prepend-icon="mdi-cog-outline"
              class="text-capitalize font-weight-bold"
              rounded="pill"
            >
              จัดการ
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item
              @click="exportData"
              prepend-icon="mdi-download"
              title="Export Logs"
            ></v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <div class="px-6 py-5 bg-white border-bottom">
      <div class="d-flex align-center mb-4">
        <div
          class="bg-primary-lighten-5 rounded-circle pa-2 mr-3 d-flex align-center justify-center"
        >
          <v-icon icon="mdi-filter-variant" color="#4D2FB2" size="20"></v-icon>
        </div>
        <div>
          <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
            ตัวกรองการค้นหา
          </div>
          <div class="text-caption text-grey">
            ค้นหาตามผู้ใช้งาน, action, module, สถานะ และช่วงเวลา
          </div>
        </div>
      </div>

      <v-row dense>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="filters.keyword"
            label="ค้นหา"
            placeholder="logId / requestId / entityId"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-text-field
            v-model="filters.performedBy"
            label="ผู้กระทำ (userId)"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-autocomplete
            v-model="filters.module"
            :items="moduleOptions"
            label="Module"
            prepend-inner-icon="mdi-view-module-outline"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-autocomplete
            v-model="filters.action"
            :items="actionOptions"
            label="Action"
            prepend-inner-icon="mdi-lightning-bolt-outline"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-autocomplete
            v-model="filters.status"
            :items="statusOptions"
            label="Status"
            prepend-inner-icon="mdi-check-decagram"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-autocomplete
            v-model="filters.entityStatus"
            :items="filteredEntityStatusItems"
            item-title="title"
            item-value="value"
            label="สถานะงาน"
            prepend-inner-icon="mdi-list-status"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
            :disabled="!entityStatusTabs.length"
          >
            <template v-slot:prepend-item>
              <v-tabs
                v-model="entityStatusTab"
                class="mb-2"
                slider-color="primary"
                density="comfortable"
                grow
              >
                <v-tab
                  v-for="tab in entityStatusTabs"
                  :key="tab.key"
                  :value="tab.key"
                  class="text-capitalize"
                  style="font-size: 0.8rem"
                >
                  {{ tab.label }}
                </v-tab>
              </v-tabs>
              <v-divider />
            </template>
          </v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field
            id="date-input-audit"
            v-model="filters.date"
            label="ช่วงวันที่"
            prepend-inner-icon="mdi-calendar-range"
            variant="outlined"
            density="comfortable"
            readonly
            clearable
            hide-details
            @click:clear="clearDate"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <div class="flex-grow-1 bg-white">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        item-value="logId"
        hover
        class="minimal-table full-width-table"
        @update:options="loadItems"
      >
        <template v-slot:[`item.logId`]="{ item }">
          <span class="text-grey-darken-4"
            >#{{ item.logId }}</span
          >
        </template>

        <template v-slot:[`item.performedBy`]="{ item }">
          <span>{{ displayActor(item) }}</span>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <v-chip
            size="small"
            variant="flat"
            color="primary"
            class="font-weight-bold text-white"
          >
            {{ item.action || "-" }}
          </v-chip>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            size="small"
            variant="flat"
            :color="
              item.status === 'success'
                ? 'success'
                : item.status === 'fail'
                ? 'error'
                : 'grey-darken-1'
            "
            class="font-weight-bold text-white"
          >
            {{ item.status || "-" }}
          </v-chip>
        </template>

        <template v-slot:[`item.changes`]="{ item }">
          <div class="text-grey-darken-2" style="max-width: 280px">
            <template v-if="summarizeChange(item).length">
              <div
                v-for="(line, i) in summarizeChange(item)"
                :key="i"
                class="d-flex align-center"
                style="gap: 4px; line-height: 1.6"
              >
                <v-icon
                  v-if="line.icon"
                  :icon="line.icon"
                  size="14"
                  :color="line.color || 'grey'"
                />
                <span
                  class="text-truncate"
                  style="max-width: 240px"
                  :title="line.text"
                  >{{ line.text }}</span
                >
              </div>
            </template>
            <span v-else class="text-grey">-</span>
          </div>
        </template>

        <template v-slot:[`item.createdAt`]="{ item }">
          <span>{{ formatDate(item.createdAt) }}</span>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            icon="mdi-eye-outline"
            size="small"
            variant="text"
            color="primary"
            @click="openDetail(item)"
          ></v-btn>
        </template>
      </v-data-table-server>
    </div>

    <v-dialog v-model="detailDialog" max-width="760px">
      <div class="bg-white rounded-lg pa-5">
        <h5 class="fw-bold mb-3 text-dark">
          รายละเอียด Log #{{ selectedLog?.logId }}
        </h5>
        <div class="row g-3 text-body-2">
          <div class="col-6">
            <strong>ผู้กระทำ:</strong> {{ displayActor(selectedLog) }}
          </div>
          <div class="col-6">
            <strong>performedBy:</strong> {{ selectedLog?.performedBy || "-" }}
          </div>
          <div class="col-6">
            <strong>actorUserId:</strong> {{ selectedLog?.actorUserId || "-" }}
          </div>
          <div class="col-6">
            <strong>action:</strong> {{ selectedLog?.action || "-" }}
          </div>
          <div class="col-6">
            <strong>module:</strong> {{ selectedLog?.module || "-" }}
          </div>
          <div class="col-6">
            <strong>entityType:</strong> {{ selectedLog?.entityType || "-" }}
          </div>
          <div class="col-6">
            <strong>entityId:</strong> {{ selectedLog?.entityId || "-" }}
          </div>
          <div class="col-6">
            <strong>status:</strong> {{ selectedLog?.status || "-" }}
          </div>
          <div class="col-12">
            <strong>ipAddress:</strong> {{ selectedLog?.ipAddress || "-" }}
          </div>
          <div class="col-12">
            <strong>userAgent:</strong> {{ selectedLog?.userAgent || "-" }}
          </div>
          <div class="col-12">
            <strong>requestId:</strong> {{ selectedLog?.requestId || "-" }}
          </div>
          <div class="col-12">
            <strong>createdAt:</strong> {{ formatDate(selectedLog?.createdAt) }}
          </div>
          <div class="col-12">
            <strong>detail:</strong>
            <pre class="detail-json mt-2">{{
              prettyDetail(selectedLog?.detail)
            }}</pre>
          </div>
        </div>

        <div class="text-end mt-3">
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            rounded="pill"
            @click="detailDialog = false"
          >
            ปิด
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th.js";
import Swal from "sweetalert2";
import { swalTheme } from "@/utils/swalTheme";
import apiClient from "@/services/authService";

export default {
  name: "TheAuditLogs",
  data() {
    return {
      serverItems: [],
      totalItems: 0,
      itemsPerPage: 20,
      loading: false,
      networkErrorMsg: "",
      lastTriedEndpoint: "",
      fp: null,
      detailDialog: false,
      selectedLog: null,

      filters: {
        keyword: null,
        performedBy: null,
        module: null,
        action: null,
        status: null,
        entityStatus: null,
        date: null,
      },
      serverDateRange: null,

      moduleOptions: [],
      statusOptions: [],
      actionOptions: [],
      entityStatusOptions: [],
      entityStatusTab: null,
      entityStatusMap: {},

      headers: [
        { title: "Log ID", key: "logId", align: "start", width: "90px" },
        {
          title: "ผู้กระทำ",
          key: "performedBy",
          width: "100px",
          sortable: false,
        },
        { title: "Action", key: "action", width: "180px" },
        { title: "Module", key: "module", width: "120px" },
        { title: "Entity", key: "entityType", width: "120px", sortable: false },
        {
          title: "Entity ID",
          key: "entityId",
          width: "120px",
          sortable: false,
        },
        { title: "Status", key: "status", width: "100px" },
        {
          title: "สิ่งที่เปลี่ยนแปลง",
          key: "changes",
          sortable: false,
          width: "280px",
        },
        { title: "Created At", key: "createdAt", width: "170px" },
        {
          title: "",
          key: "actions",
          sortable: false,
          align: "end",
          width: "80px",
        },
      ],
    };
  },
  computed: {
    entityStatusTabs() {
      const mod = this.filters.module;
      if (mod && this.entityStatusMap[mod]) {
        return [{ key: mod, label: this.entityStatusMap[mod].label }];
      }
      return Object.entries(this.entityStatusMap).map(([key, group]) => ({
        key,
        label: group.label,
      }));
    },
    filteredEntityStatusItems() {
      const tab = this.entityStatusTab;
      if (tab && this.entityStatusMap[tab]) {
        return this.entityStatusMap[tab].values.map((v) => ({
          title: v,
          value: v,
        }));
      }
      const items = [];
      for (const group of Object.values(this.entityStatusMap)) {
        for (const v of group.values) {
          if (!items.some((i) => i.value === v)) {
            items.push({ title: v, value: v });
          }
        }
      }
      return items;
    },
  },
  watch: {
    filters: {
      handler() {
        this.loadItems({
          page: 1,
          itemsPerPage: this.itemsPerPage,
          sortBy: [],
        });
      },
      deep: true,
    },
    "filters.module"() {
      this.filters.entityStatus = null;
      this.entityStatusTab = null;
    },
  },
  mounted() {
    this.loadFilterOptions();
    this.$nextTick(() => {
      this.initThaiDatePicker();
    });
  },
  beforeUnmount() {
    if (this.fp) this.fp.destroy();
  },
  methods: {
    async loadFilterOptions() {
      try {
        const res = await apiClient.get("/audit-logs/filters");
        const payload = res?.data?.payload;
        if (payload) {
          this.actionOptions = payload.actions || [];
          this.moduleOptions = payload.modules || [];
          this.statusOptions = payload.statuses || [];
          this.entityStatusMap = payload.entityStatuses || {};
          if (Object.keys(this.entityStatusMap).length) {
            this.entityStatusTab = Object.keys(this.entityStatusMap)[0];
          }
        }
      } catch (err) {
        console.error("Failed to load filter options:", err);
      }
    },

    async loadItems({ page, itemsPerPage, sortBy }) {
      this.loading = true;
      this.networkErrorMsg = "";
      try {
        let sortKey = null;
        let sortOrder = null;

        if (sortBy && sortBy.length > 0) {
          sortKey = sortBy[0].key;
          sortOrder = sortBy[0].order;
        }

        const params = {
          page,
          itemsPerPage,
          search: this.filters.keyword,
          performedBy: this.filters.performedBy,
          module: this.filters.module,
          action: this.filters.action,
          status: this.filters.status,
          entityStatus: this.filters.entityStatus,
          dateRange: this.serverDateRange,
          sort_by: sortKey,
          sort_order: sortOrder,
        };

        const customPath = import.meta.env.VITE_AUDIT_LOGS_PATH;
        const endpointCandidates = [
          customPath,
          "/audit-logs",
          "/get-audit-logs",
          "/admin/audit-logs",
        ].filter((v, i, arr) => v && arr.indexOf(v) === i);

        let res = null;
        let lastError = null;

        for (const endpoint of endpointCandidates) {
          try {
            this.lastTriedEndpoint = endpoint;
            res = await apiClient.get(endpoint, { params });
            break;
          } catch (err) {
            const status = err?.response?.status;
            if (status === 404) {
              lastError = err;
              continue;
            }
            throw err;
          }
        }

        if (!res) {
          throw lastError || new Error("AUDIT_LOGS_ENDPOINT_NOT_FOUND");
        }

        const payload = res?.data?.payload;

        if (Array.isArray(payload)) {
          this.serverItems = payload;
          this.totalItems = payload.length;
        } else {
          this.serverItems = payload?.data || res?.data?.data || [];
          this.totalItems =
            payload?.totalItems ||
            res?.data?.totalItems ||
            this.serverItems.length;
        }
      } catch (err) {
        const baseUrl =
          import.meta.env.VITE_API_URL || "(ไม่ได้ตั้งค่า VITE_API_URL)";
        if (err?.code === "ERR_NETWORK") {
          this.networkErrorMsg = `ไม่สามารถเชื่อมต่อ ${baseUrl} ได้ กรุณาตรวจสอบว่า BE เปิดอยู่และพอร์ตถูกต้อง`;
        } else if (err?.response?.status === 404) {
          this.networkErrorMsg = `ไม่พบ endpoint log ใน BE (ลองแล้ว: ${
            this.lastTriedEndpoint || "/audit-logs"
          }) กรุณาให้ BE เปิด route หรือกำหนด VITE_AUDIT_LOGS_PATH`;
        } else {
          this.networkErrorMsg =
            err?.response?.data?.detail || "โหลดข้อมูลกิจกรรมไม่สำเร็จ";
        }
        console.error("Audit logs API Error:", err);
        this.serverItems = [];
        this.totalItems = 0;
      } finally {
        this.loading = false;
      }
    },

    getSeverityColor(severity) {
      if (severity === "security") return "error";
      if (severity === "warning") return "warning";
      if (severity === "info") return "info";
      return "grey-darken-1";
    },

    displayActor(item) {
      if (!item) return "-";

      const actorName =
        item.performedByName ||
        item.actorUserName ||
        item.userName ||
        item.actorName;

      const actorId = item.performedBy || item.actorUserId;

      if (actorName && actorId) return `${actorName} (#${actorId})`;
      if (actorName) return actorName;
      if (actorId) return `#${actorId}`;
      return "-";
    },

    summarizeChange(item) {
      const lines = [];
      const detail = item?.detail;
      if (!detail) return lines;

      const d =
        typeof detail === "string"
          ? (() => {
              try {
                return JSON.parse(detail);
              } catch {
                return null;
              }
            })()
          : detail;
      if (!d || typeof d !== "object") {
        if (typeof detail === "string" && detail.trim()) {
          lines.push({
            icon: "mdi-information-outline",
            color: "grey",
            text: detail,
          });
        }
        return lines;
      }

      // Status change
      if (
        d.statusFrom ||
        d.statusTo ||
        d.oldStatus ||
        d.newStatus ||
        d.caseStatus ||
        d.pStatus
      ) {
        const from = d.statusFrom || d.oldStatus || null;
        const to =
          d.statusTo || d.newStatus || d.caseStatus || d.pStatus || null;
        if (from && to) {
          lines.push({
            icon: "mdi-swap-horizontal",
            color: "primary",
            text: `สถานะ: ${from} → ${to}`,
          });
        } else if (to) {
          lines.push({
            icon: "mdi-arrow-right-bold",
            color: "primary",
            text: `สถานะ: ${to}`,
          });
        }
      }

      // Entity info
      if (d.caseId)
        lines.push({
          icon: "mdi-wrench",
          color: "orange",
          text: `Case: ${d.caseId}`,
        });
      if (d.caseSId)
        lines.push({
          icon: "mdi-truck-delivery",
          color: "blue",
          text: `ส่งซ่อม: ${d.caseSId}`,
        });
      if (d.pId)
        lines.push({
          icon: "mdi-folder-outline",
          color: "teal",
          text: `Project: ${d.pId}`,
        });
      if (d.quotationId || d.quotation_Id)
        lines.push({
          icon: "mdi-file-document-outline",
          color: "indigo",
          text: `ใบเสนอราคา: ${d.quotationId || d.quotation_Id}`,
        });

      // Key fields
      if (d.cusFirstName || d.cusLastName) {
        lines.push({
          icon: "mdi-account",
          color: "grey",
          text: `ลูกค้า: ${[d.cusFirstName, d.cusLastName]
            .filter(Boolean)
            .join(" ")}`,
        });
      }
      if (d.customerName || d.customer_name) {
        lines.push({
          icon: "mdi-account",
          color: "grey",
          text: `ลูกค้า: ${d.customerName || d.customer_name}`,
        });
      }

      // Fallback: show first few keys if nothing matched
      if (!lines.length) {
        const keys = Object.keys(d).slice(0, 3);
        const summary = keys
          .map((k) => `${k}: ${typeof d[k] === "object" ? "..." : d[k]}`)
          .join(", ");
        if (summary)
          lines.push({
            icon: "mdi-information-outline",
            color: "grey",
            text: summary,
          });
      }

      return lines;
    },

    formatDetail(detail) {
      if (!detail) return "-";
      if (typeof detail === "string") return detail;
      try {
        return JSON.stringify(detail);
      } catch {
        return "-";
      }
    },

    prettyDetail(detail) {
      if (!detail) return "-";
      if (typeof detail === "string") {
        try {
          return JSON.stringify(JSON.parse(detail), null, 2);
        } catch {
          return detail;
        }
      }
      try {
        return JSON.stringify(detail, null, 2);
      } catch {
        return "-";
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      if (Number.isNaN(date.getTime())) return dateStr;

      return date.toLocaleString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    openDetail(item) {
      this.selectedLog = item;
      this.detailDialog = true;
    },

    exportData() {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "ฟีเจอร์ Export ต้องเชื่อม API เพิ่มเติม",
        ...swalTheme.info,
      });
    },

    initThaiDatePicker() {
      const el = document.getElementById("date-input-audit");
      if (!el) return;

      this.fp = flatpickr(el, {
        mode: "range",
        locale: Thai,
        dateFormat: "d-m-Y",
        disableMobile: true,
        onChange: (dates) => {
          if (!dates || dates.length === 0) {
            this.filters.date = null;
            this.serverDateRange = null;
            return;
          }

          const toThaiDate = (d) => {
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear() + 543;
            return `${day}-${month}-${year}`;
          };

          if (dates.length === 1) {
            const one = toThaiDate(dates[0]);
            this.filters.date = one;
            this.serverDateRange = `${one} to ${one}`;
            return;
          }

          const start = toThaiDate(dates[0]);
          const end = toThaiDate(dates[1]);
          this.filters.date = `${start} to ${end}`;
          this.serverDateRange = `${start} to ${end}`;
        },
      });
    },

    clearDate() {
      this.filters.date = null;
      this.serverDateRange = null;
      if (this.fp) this.fp.clear();
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

.detail-json {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  font-size: 12px;
  max-height: 260px;
  overflow: auto;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
