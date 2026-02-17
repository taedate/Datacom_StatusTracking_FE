<template>
  <div class="page-container bg-white d-flex flex-column">
    <div
      class="px-6 py-4 border-bottom d-flex flex-wrap align-center justify-space-between sticky-top bg-white sticky-header"
      style="z-index: 10; min-height: 80px"
    >
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">
          รายการงานซ่อม (Repair Cases)
        </h2>
        <div class="text-body-2 text-grey mb-3">จัดการและติดตามสถานะงานซ่อมทั้งหมด</div>
      </div>

      <div class="d-flex align-center" style="gap: 12px">
        <v-menu location="bottom end" transition="scale-transition">
          <v-list density="compact">
            <v-list-item @click="exportData" prepend-icon="mdi-download" title="Export Excel"></v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          color="#4D2FB2"
          prepend-icon="mdi-plus"
          :to="{ name: 'TheCaseRepairDetail', params: { id: 'new' } }" 
          elevation="0"
          height="44"
          class="text-capitalize px-6 font-weight-bold shadow-sm-custom text-white"
          rounded="pill"
        >
          เปิดงานซ่อมใหม่
        </v-btn>
      </div>
    </div>

    <div class="px-6 py-5 bg-white border-bottom">
      <div class="d-flex align-center mb-4">
        <div class="bg-primary-lighten-5 rounded-circle pa-2 mr-3 d-flex align-center justify-center">
          <v-icon icon="mdi-filter-variant" color="#4D2FB2" size="20"></v-icon>
        </div>
        <div>
          <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
            ค้นหาและคัดกรอง
          </div>
          <div class="text-caption text-grey">
            ค้นหาจาก Case ID, ชื่อลูกค้า หรือเบอร์โทร
          </div>
        </div>
      </div>

      <v-row dense>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="filters.keyword"
            label="ค้นหา (ID, ชื่อ, เบอร์โทร)"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            color="#4D2FB2"
            bg-color="grey-lighten-5"
            base-color="grey-lighten-2"
            clearable
            hide-details="auto"
            class="rounded-lg"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-autocomplete
            v-model="filters.caseStatus"
            :items="statusOptions"
            label="สถานะงานซ่อม"
            prepend-inner-icon="mdi-list-status"
            variant="outlined"
            density="compact"
            color="#4D2FB2"
            bg-color="grey-lighten-5"
            base-color="grey-lighten-2"
            clearable
            hide-details="auto"
            class="rounded-lg"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-autocomplete
            v-model="filters.caseType"
            :items="typeOptions"
            label="ประเภทงานซ่อม"
            prepend-inner-icon="mdi-tools"
            variant="outlined"
            density="compact"
            color="#4D2FB2"
            bg-color="grey-lighten-5"
            base-color="grey-lighten-2"
            clearable
            hide-details="auto"
            class="rounded-lg"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field
            id="date-input"
            v-model="filters.date"
            label="วันที่รับเครื่อง (เริ่ม - สิ้นสุด)"
            prepend-inner-icon="mdi-calendar-range"
            variant="outlined"
            density="compact"
            color="#4D2FB2"
            bg-color="grey-lighten-5"
            base-color="grey-lighten-2"
            hide-details="auto"
            clearable
            readonly
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
        item-value="caseId"
        show-select
        hover
        class="minimal-table full-width-table"
        @update:options="loadItems"
      >
        <template v-slot:[`item.caseId`]="{ item }">
          <span class="font-weight-bold text-grey-darken-4 cursor-pointer">{{ item.caseId }}</span>
        </template>

        <template v-slot:[`item.customerName`]="{ item }">
          <span class="text-grey-darken-3 font-weight-bold text-body-2">
              {{ item.cusFirstName }} {{ item.cusLastName }}
          </span>
        </template>

        <template v-slot:[`item.cusPhone`]="{ item }">
          <div class="d-flex align-center">
            <v-icon size="small" color="grey" start class="mr-1">mdi-phone</v-icon>
            <span class="text-body-2 text-grey-darken-2">{{ item.cusPhone || '-' }}</span>
          </div>
        </template>

        <template v-slot:[`item.brokenSymptom`]="{ item }">
          <div class="text-truncate text-grey-darken-2" style="max-width: 180px;" :title="item.brokenSymptom">
            {{ item.brokenSymptom || '-' }}
          </div>
        </template>

        <template v-slot:[`item.caseStatus`]="{ item }">
          <v-chip
            :color="getStatusColor(item.caseStatus)"
            variant="flat"
            size="small"
            class="font-weight-bold text-white"
          >
            {{ item.caseStatus }}
          </v-chip>
        </template>

        <template v-slot:[`item.datePickUp`]="{ item }">
            <div class="text-body-2 text-grey-darken-2">
                {{ item.datePickUp }}
            </div>
        </template>

        <template v-slot:[`item.refSentRepairId`]="{ item }">
            <div v-if="item.refSentRepairId">
                <v-chip
                  color="warning"
                  variant="tonal"
                  size="small"
                  class="font-weight-bold cursor-pointer"
                  :to="{ name: 'TheCaseSentRepairDetail', params: { id: item.refSentRepairId } }"
                  style="border-color: var(--warning);"
                >
                  <v-icon start icon="mdi-truck-delivery-outline" size="small"></v-icon>
                  {{ item.refSentRepairId }}
                </v-chip>
            </div>
            <div v-else class="text-grey-lighten-1 text-caption pl-2">
                -
            </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-menu location="bottom end" transition="scale-transition" offset="5">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" color="grey-darken-1" v-bind="props" size="small"></v-btn>
            </template>
            
            <v-list density="compact" elevation="2" rounded="lg" class="py-1">
              
              <v-list-item 
                :to="{ name: 'TheCaseRepairDetail', params: { id: item.caseId } }"
                prepend-icon="mdi-eye-outline" 
                value="view" 
                active-color="#4D2FB2"
              >
                <v-list-item-title class="text-body-2">ดูรายละเอียด</v-list-item-title>
              </v-list-item>

              <v-divider class="my-1"></v-divider>
              
              <v-list-item @click="deleteItem(item)" prepend-icon="mdi-trash-can-outline" value="delete">
                <v-list-item-title class="text-red text-body-2">ลบงานซ่อม</v-list-item-title>
              </v-list-item>

            </v-list>
          </v-menu>
        </template>

        <template v-slot:no-data>
          <div class="pa-10 text-center">
            <div class="bg-grey-lighten-5 rounded-circle d-inline-flex pa-4 mb-3">
              <v-icon icon="mdi-file-search-outline" size="40" color="grey-lighten-1"></v-icon>
            </div>
            <div class="text-subtitle-1 text-grey-darken-1 font-weight-bold">
              ไม่พบข้อมูลงานซ่อม
            </div>
            <div class="text-caption text-grey">
              ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองใหม่อีกครั้ง
            </div>
          </div>
        </template>
      </v-data-table-server>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th.js";
import Swal from 'sweetalert2';
import { swalTheme } from "@/utils/swalTheme";

export default {
  name: "TheCaseRepair",
  data() {
    return {
      serverItems: [],
      totalItems: 0,
      itemsPerPage: 10,
      loading: false,
      selected: [], 

      statusList: [
        "รอรับเครื่อง",
        "รับเครื่องแล้ว",
        "ส่งซ่อมอยู่",
        "กำลังซ่อม",
        "ซ่อมเสร็จ",
        "ส่งมอบ"
      ], 
      typeList: [],

      filters: {
        keyword: null,
        caseStatus: null,
        caseType: null,
        date: null,
      },
      
      serverDateRange: null, 
      rawDateRange: [],
      fp: null,

      headers: [
        { title: "Case ID", key: "caseId", align: "start", width: "10%" },
        { title: "ชื่อลูกค้า", key: "customerName", width: "15%", sortable: false },
        { title: "เบอร์โทร", key: "cusPhone", width: "12%", sortable: false }, 
        { title: "อาการเสีย/ลงโปรแกรม", key: "brokenSymptom", width: "18%", sortable: false },
        { title: "ประเภท", key: "caseType", width: "10%" },
        { title: "สถานะ", key: "caseStatus", width: "10%" },
        { title: "วันที่รับเครื่อง", key: "datePickUp", width: "10%" },
        
        // ✅ ส่วนที่แก้ไข: เปลี่ยนหัวตารางและ Key
        { title: "ใบส่งซ่อม (Ref)", key: "refSentRepairId", width: "12%", sortable: false },
        
        { title: "", key: "actions", sortable: false, align: "end" },
      ],
    };
  },
  computed: {
    statusOptions() { return this.statusList; },
    typeOptions() { return this.typeList; }
  },
  watch: {
    filters: {
        handler() {
            this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage, sortBy: [] });
        },
        deep: true
    }
  },
  mounted() {
    this.fetchDropdownOptions();
    this.$nextTick(() => {
      this.initThaiDatePicker();
    });
  },
  beforeUnmount() {
    if (this.fp) this.fp.destroy();
  },
  methods: {
    getStatusColor(status) {
        if (!status) return 'grey';
        if (status.includes('เสร็จ') || status.includes('Complete') || status.includes('ส่งมอบ')) return 'success';
        if (status.includes('รอ') || status.includes('Wait')) return 'warning';
        if (status.includes('ซ่อม') || status.includes('Process')) return 'info';
        if (status.includes('รับเครื่องแล้ว')) return 'primary';
        if (status.includes('ส่งซ่อมอยู่')) return 'secondary'; // สีม่วงอ่อน
        if (status.includes('ยกเลิก') || status.includes('Cancel')) return 'error';
        return 'grey-darken-1';
    },

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
            search: this.filters.keyword,
            caseStatus: this.filters.caseStatus,
            caseType: this.filters.caseType,
            dateRange: this.serverDateRange,
            sort_by: sortKey,
            sort_order: sortOrder
        };

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/get-case-info`, { params });
        
        if (res.data.message === "success") {
          this.serverItems = res.data.data;
          this.totalItems = res.data.totalItems;
        }
      } catch (err) {
        console.error("API Error:", err);
        this.serverItems = [];
        this.totalItems = 0;
      } finally {
        this.loading = false;
      }
    },

    async fetchDropdownOptions() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/get-filter-options`);
        if (res.data.message === "success") {
          this.typeList = res.data.data.types;
        }
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
      }
    },

    async deleteItem(item) {
      const result = await Swal.fire({
        title: 'ยืนยันการลบ?',
        text: `ต้องการลบ Case ID: ${item.caseId} หรือไม่?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: false, 
        focusCancel: true,
        ...swalTheme.danger
      });

      if (result.isConfirmed) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/delete-case`, { caseId: item.caseId });
          await Swal.fire({
            icon: 'success',
            title: 'ลบเสร็จสิ้น',
            text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
            ...swalTheme.info
          });
          this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
        } catch (err) {
           Swal.fire({
             icon: 'error',
             title: 'Error',
             text: 'ไม่สามารถลบข้อมูลได้',
             ...swalTheme.danger
           });
        }
      }
    },

    exportData() {
        Swal.fire({
          icon: 'info',
          title: 'Info',
          text: 'ฟีเจอร์นี้ต้องเชื่อมต่อ API Export',
          ...swalTheme.info
        });
    },

    initThaiDatePicker() {
      const el = document.getElementById("date-input");
      if (!el) return;

      this.fp = flatpickr(el, {
        mode: "range",
        locale: Thai,
        disableMobile: "true",
        dateFormat: "d-m-Y",
        allowInput: false,

        onChange: (selectedDates, dateStr, instance) => {
          if (selectedDates.length === 2) {
            this.rawDateRange = selectedDates;
            const startStr = this.formatToThaiDate(selectedDates[0]);
            const endStr = this.formatToThaiDate(selectedDates[1]);
            this.filters.date = `${startStr} ถึง ${endStr}`;
            this.serverDateRange = `${startStr},${endStr}`; 
          } else {
            this.rawDateRange = [];
            this.filters.date = null; 
            this.serverDateRange = null; 
          }
          this.adjustYearDisplay(instance);
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

    adjustYearDisplay(instance) {
      setTimeout(() => {
        if (instance.currentYearElement) {
          instance.currentYearElement.value = instance.currentYear + 543;
        }
      }, 10);
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

/* Table Customization */
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
  background-color: var(--theme-tint-1) !important;
  color: var(--theme-primary) !important;
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
  cursor: pointer;
}

:deep(.minimal-table tbody tr td) {
  height: 64px !important;
  font-size: 0.875rem !important;
  border-bottom: 1px solid #e0e0e0 !important;
  color: #424242 !important;
}

.shadow-sm-custom {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

.bg-primary-lighten-5 {
  background-color: var(--theme-tint-1) !important;
}

.cursor-pointer {
    cursor: pointer;
}
</style>