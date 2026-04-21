<template>
  <div class="page-container bg-white d-flex flex-column">
    <div
      class="px-6 py-4 border-bottom d-flex flex-wrap align-center justify-space-between sticky-top bg-white sticky-header"
      style="z-index: 10; min-height: 80px"
    >
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">
          รายการเอกสาร (Documents)
        </h2>
        <div class="text-body-2 text-grey mb-3">
          จัดการใบเสนอราคา, ใบส่งของ, ใบเสร็จรับเงิน
        </div>
      </div>

      <div class="d-flex align-center" style="gap: 12px">
        <v-menu location="bottom end" transition="scale-transition">
          <v-list density="compact">
            <v-list-item
              @click="exportData"
              prepend-icon="mdi-download"
              title="Export Excel"
            ></v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          color="#4D2FB2"
          prepend-icon="mdi-plus"
          :to="{ name: 'TheQuotationDetail', params: { id: 'new' } }"
          elevation="0"
          height="44"
          class="text-capitalize px-6 font-weight-bold shadow-sm-custom text-white"
          rounded="pill"
        >
          สร้างเอกสารใหม่
        </v-btn>
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
            ค้นหาและคัดกรอง
          </div>
          <div class="text-caption text-grey">
            ค้นหาจากเลขที่เอกสาร หรือลูกค้า
          </div>
        </div>
      </div>

      <v-row dense>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="filters.quotationId"
            label="เลขที่ใบเสนอราคา"
            prepend-inner-icon="mdi-file-document-outline"
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
          <v-text-field
            v-model="filters.deliveryNoteNo"
            label="เลขที่ใบส่งของ"
            prepend-inner-icon="mdi-truck-delivery-outline"
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
          <v-text-field
            v-model="filters.receiptNo"
            label="เลขที่ใบเสร็จ"
            prepend-inner-icon="mdi-receipt-text-outline"
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
          <v-text-field
            v-model="filters.customerName"
            label="ชื่อลูกค้า/บริษัท"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            density="compact"
            color="#4D2FB2"
            bg-color="grey-lighten-5"
            clearable
            hide-details="auto"
            class="rounded-lg"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row dense class="mt-2">
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete
            v-model="filters.status"
            :items="statusOptions"
            label="สถานะเอกสาร"
            prepend-inner-icon="mdi-list-status"
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
            id="date-input-quotation"
            v-model="filters.date"
            label="วันที่ออกเอกสาร (เริ่ม - สิ้นสุด)"
            prepend-inner-icon="mdi-calendar-range"
            variant="outlined"
            density="compact"
            color="#4D2FB2"
            bg-color="grey-lighten-5"
            clearable
            hide-details="auto"
            class="rounded-lg"
            @click:clear="clearDate"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <div class="flex-grow-1 bg-white">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model="selected"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        item-value="id"
        show-select
        hover
        class="minimal-table full-width-table"
        @update:options="loadItems"
      >
        <template v-slot:[`item.id`]="{ item }">
          <span class="text-grey-darken-4 cursor-pointer">
            {{ item.id }}
          </span>
        </template>

        <template v-slot:[`item.quotationId`]="{ item }">
          <span class="text-black">
            {{ item.quotationId || "-" }}
          </span>
        </template>

        <template v-slot:[`item.deliveryNoteNo`]="{ item }">
          <span class="text-black">
            {{ item.deliveryNoteNo || "-" }}
          </span>
        </template>

        <template v-slot:[`item.receiptNo`]="{ item }">
          <span class="text-black">
            {{ item.receiptNo || "-" }}
          </span>
        </template>

        <template v-slot:[`item.customerName`]="{ item }">
          <div class="d-flex flex-column">
            <span class="text-grey-darken-3">
              {{ item.customerName || "-" }}
            </span>
          </div>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <div class="d-flex align-center">
            <v-chip
              :color="getStatusColor(item.status)"
              variant="flat"
              size="small"
              class="font-weight-bold text-white mr-2"
            >
              {{ getStatusText(item.status) }}
            </v-chip>
          </div>
        </template>

        <template v-slot:[`item.issueDate`]="{ item }">
          <div class="text-body-2 text-grey-darken-2">
            {{ item.issueDate }}
          </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-menu
            location="bottom end"
            transition="scale-transition"
            offset="5"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                variant="text"
                color="grey-darken-1"
                v-bind="props"
                size="small"
              ></v-btn>
            </template>

            <v-list density="compact" elevation="2" rounded="lg" class="py-1">
              <v-list-item
                @click="viewDetails(item)"
                prepend-icon="mdi-eye-outline"
                value="view"
                active-color="#4D2FB2"
              >
                <v-list-item-title class="text-body-2"
                  >ดูรายละเอียด</v-list-item-title
                >
              </v-list-item>

              <v-divider class="my-1"></v-divider>

              <v-list-item
                @click="deleteItem(item)"
                prepend-icon="mdi-trash-can-outline"
                value="delete"
              >
                <v-list-item-title class="text-red text-body-2"
                  >ลบเอกสาร</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template v-slot:no-data>
          <div class="pa-10 text-center">
            <v-avatar color="grey-lighten-4" size="80" class="mb-4">
              <v-icon
                icon="mdi-file-document-outline"
                size="40"
                color="grey-lighten-1"
              ></v-icon>
            </v-avatar>
            <h3 class="text-h6 text-grey-darken-1 font-weight-bold mb-1">
              ไม่พบข้อมูลเอกสาร
            </h3>
            <p class="text-body-2 text-grey mb-4">
              ลองปรับตัวกรองค้นหา หรือสร้างเอกสารใหม่
            </p>
            <v-btn
              color="#4D2FB2"
              variant="flat"
              rounded="pill"
              class="text-capitalize text-white font-weight-bold"
              @click="loadItems({ page: 1, itemsPerPage: itemsPerPage })"
            >
              รีเฟรชข้อมูล
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </div>
  </div>
</template>

<script>
import apiClient from "@/services/authService";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th.js";
import Swal from "sweetalert2";
import { swalTheme } from "@/utils/swalTheme";

export default {
  name: "TheQuotation",
  data() {
    return {
      serverItems: [],
      totalItems: 0,
      itemsPerPage: 10,
      loading: false,
      selected: [],

      filters: {
        quotationId: null,
        deliveryNoteNo: null,
        receiptNo: null,
        customerName: null,
        status: null,
        date: null,
      },
      startDate: null,
      endDate: null,
      fp: null,

      statusOptions: [
        { title: "ใบเสนอราคา", value: "QUOTATION" },
        { title: "ใบส่งของ", value: "DELIVERY_NOTE" },
        { title: "ใบเสร็จรับเงิน", value: "RECEIPT" },
        { title: "ยกเลิก", value: "CANCELLED" },
      ],
      headers: [
        { title: "System ID", key: "id", align: "start", width: "100px" },
        { title: "เลขที่ใบเสนอราคา", key: "quotationId", width: "140px" },
        { title: "เลขที่ใบส่งของ", key: "deliveryNoteNo", width: "140px" },
        { title: "เลขที่ใบเสร็จ", key: "receiptNo", width: "140px" },
        { title: "ลูกค้า", key: "customerName" },
        { title: "สถานะ", key: "status" },
        { title: "วันที่สร้าง", key: "issueDate" },
        {
          title: "",
          key: "actions",
          sortable: false,
          align: "end",
          width: "50px",
        },
      ],
    };
  },
  watch: {
    filters: {
      handler() {
        this.saveFilters();
        this.loadItems({
          page: 1,
          itemsPerPage: this.itemsPerPage,
          sortBy: [],
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.restoreFilters();
    this.$nextTick(() => {
      this.initThaiDatePicker();
    });
  },
  beforeUnmount() {
    if (this.fp) this.fp.destroy();
  },
  methods: {
    async loadItems({ page, itemsPerPage, sortBy }) {
      this.loading = true;
      try {
        let sortKey = null;
        let sortOrder = null;

        if (sortBy && sortBy.length > 0) {
          sortKey = sortBy[0].key;
          sortOrder = sortBy[0].order;
        }

        const params = {
          page: page,
          itemsPerPage: itemsPerPage,
          quotationId: this.filters.quotationId || undefined,
          deliveryNoteNo: this.filters.deliveryNoteNo || undefined,
          receiptNo: this.filters.receiptNo || undefined,
          customerName: this.filters.customerName || undefined,
          status: this.filters.status,
          startDate: this.startDate || undefined,
          endDate: this.endDate || undefined,
          sort_by: sortKey,
          sort_order: sortOrder,
        };

        const res = await apiClient.get("/get-quotation-info", { params });

        if (res.data.message === "success") {
          const rawData = res.data.data;
          this.totalItems = res.data.totalItems;

          // Map ข้อมูล (หัวใจสำคัญคือการ Mapping ให้ตรงกับ DB)
          const mappedData = rawData.map((item) => {
            if (!item) return null;

            let total = 0;
            // คำนวณยอดเงิน (ถ้า Backend ส่ง productSections มาให้)
            if (item.productSections && Array.isArray(item.productSections)) {
              item.productSections.forEach((section) => {
                if (section && section.items && Array.isArray(section.items)) {
                  section.items.forEach((p) => {
                    const qty = parseFloat(p.quantity) || 0;
                    const price =
                      parseFloat(p.unit_price) || parseFloat(p.unitPrice) || 0;
                    total += qty * price;
                  });
                }
              });
            } else if (item.total) {
              // กรณี Backend คำนวณมาให้แล้ว
              total = parseFloat(item.total);
            }

            // ตรวจสอบว่าต้องบวก VAT หรือไม่ (สมมติว่าถ้าคำนวณจาก section ต้องบวก)
            let grandTotal = total;
            if (item.productSections) {
              grandTotal = total * 1.07; // VAT 7%
            }

            return {
              id: item.id || `TEMP-${Math.random().toString(36).substr(2, 5)}`,

              quotationId: item.quotation_Id, // ใช้ค่าที่ดักจับมาได้

              customerName:
                item.customer_name || item.customerName || "ไม่ระบุ",
              total: grandTotal.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              }),
              status: item.current_status || item.currentStatus || "QUOTATION",

              deliveryNoteNo:
                item.delivery_note_no || item.deliveryNoteNo || "",
              receiptNo: item.receipt_no || item.receiptNo || "",

              issueDate: item.created_at
                ? this.formatToThaiDate(new Date(item.created_at))
                : item.issue_date_str || "-",
              fullData: item,
            };
          });

          this.serverItems = mappedData.filter((item) => item !== null);
        }
      } catch (err) {
        console.error("API Error:", err);
        this.serverItems = [];
        this.totalItems = 0;
      } finally {
        this.loading = false;
      }
    },

    getStatusColor(status) {
      if (!status) return "grey";
      switch (status) {
        case "RECEIPT":
          return "success";
        case "DELIVERY_NOTE":
          return "info";
        case "CANCELLED":
          return "error";
        default:
          return "warning";
      }
    },
    getStatusText(status) {
      if (!status) return "-";
      const map = {
        QUOTATION: "ใบเสนอราคา",
        DELIVERY_NOTE: "ใบส่งของ",
        RECEIPT: "ใบเสร็จรับเงิน",
        CANCELLED: "ยกเลิก",
      };
      return map[status] || status;
    },
    viewDetails(item) {
      if (item && item.id) {
        this.$router.push({
          name: "TheQuotationDetail",
          params: { id: item.id },
        });
      }
    },
    async deleteItem(item) {
      if (!item || !item.id) return;

      const result = await Swal.fire({
        title: "ยืนยันการลบ?",
        text: `คุณต้องการลบเอกสาร ${item.id} ใช่หรือไม่?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก",
        ...swalTheme.danger,
      });

      if (result.isConfirmed) {
        try {
          await apiClient.delete(`/quotation/${item.id}`);
          Swal.fire({
            title: "Deleted!",
            text: "ลบข้อมูลเรียบร้อยแล้ว",
            icon: "success",
            ...swalTheme.info,
          });
          this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Error",
            text: "ลบข้อมูลไม่สำเร็จ",
            icon: "error",
            ...swalTheme.danger,
          });
        }
      }
    },
    exportData() {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "ฟีเจอร์นี้ต้องเชื่อมต่อ API Export",
        ...swalTheme.info,
      });
    },

    initThaiDatePicker() {
      const el = document.getElementById("date-input-quotation");
      if (!el) return;

      this.fp = flatpickr(el, {
        mode: "range",
        locale: Thai,
        disableMobile: "true",
        dateFormat: "d-m-Y",
        allowInput: false,

        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            const startStr = this.formatToThaiDate(selectedDates[0]);
            const endStr = this.formatToThaiDate(selectedDates[1]);
            
            this.startDate = this.thaiDateToSqlDate(startStr);
            this.endDate = this.thaiDateToSqlDate(endStr);
          } else {
            this.startDate = null;
            this.endDate = null;
          }
          this.adjustYearDisplay(this.fp);
        },

        onReady: (d, s, instance) => this.adjustYearDisplay(instance),
        onMonthChange: (d, s, instance) => this.adjustYearDisplay(instance),
        onYearChange: (d, s, instance) => this.adjustYearDisplay(instance),
      });
    },

    formatToThaiDate(date) {
      if (!date) return "";
      const yearBE = date.getFullYear() + 543;
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}-${month}-${yearBE}`;
    },

    thaiDateToSqlDate(thaiDate) {
      if (!thaiDate) return null;
      const parts = thaiDate.split(/[-/]/);
      return parts.length === 3
        ? `${parseInt(parts[2]) - 543}-${parts[1]}-${parts[0]}`
        : null;
    },

    adjustYearDisplay(instance) {
      setTimeout(() => {
        if (instance.currentYearElement) {
          instance.currentYearElement.value = instance.currentYear + 543;
        }
      }, 10);
    },
    clearDate() {
      this.filters.date = null;
      this.startDate = null;
      this.endDate = null;
      if (this.fp) this.fp.clear();
      this.saveFilters();
    },

    saveFilters() {
      const state = {
        filters: this.filters,
        startDate: this.startDate,
        endDate: this.endDate,
      };
      sessionStorage.setItem('quotationFilters', JSON.stringify(state));
    },

    restoreFilters() {
      try {
        const saved = sessionStorage.getItem('quotationFilters');
        if (!saved) return;
        const state = JSON.parse(saved);
        if (state.filters) {
          this.filters = { ...this.filters, ...state.filters };
        }
        if (state.startDate) this.startDate = state.startDate;
        if (state.endDate) this.endDate = state.endDate;
      } catch (e) {
        // ignore
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
  background-color: #f8f9fa;
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

/* Minimal Table Styles */
:deep(.minimal-table) {
  width: 100%;
  background-color: white;
  border-radius: 8px;
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
  height: 56px !important;
  border-bottom: 2px solid #e0e0e0 !important;
  white-space: nowrap;
}

:deep(.minimal-table tbody tr:hover td) {
  background-color: #f9f7ff !important;
  cursor: pointer;
}

:deep(.minimal-table tbody tr td) {
  height: 64px !important;
  font-size: 1rem !important;
  font-weight: 400 !important;
  border-bottom: 1px solid #f0f0f0 !important;
  color: #424242 !important;
  vertical-align: middle;
}

:deep(.minimal-table tbody tr td .font-weight-bold),
:deep(.minimal-table tbody tr td .font-weight-medium) {
  font-weight: 400 !important;
}

.text-theme-primary {
  color: #4d2fb2;
}

.shadow-sm-custom {
  box-shadow: 0 4px 6px rgba(77, 47, 178, 0.2) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.bg-primary-lighten-5 {
  background-color: #f3effd !important;
}
</style>
