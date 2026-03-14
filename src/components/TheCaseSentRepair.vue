<template>
  <div class="page-container bg-white d-flex flex-column">
    <div
      class="px-6 py-4 border-bottom d-flex flex-wrap align-center justify-space-between sticky-top bg-white sticky-header"
      style="z-index: 10; min-height: 80px"
    >
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">
          รายการงานส่งซ่อม (Sent Repair Cases)
        </h2>
        <div class="text-body-2 text-grey mb-3">จัดการและติดตามงานที่ส่งซ่อมภายนอก/ช่าง</div>
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
          :to="{ name: 'TheCaseSentRepairDetail', params: { id: 'new' } }" 
          elevation="0"
          height="44"
          class="text-capitalize px-6 font-weight-bold shadow-sm-custom text-white"
          rounded="pill"
        >
          เปิดงานส่งซ่อม
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
            ค้นหาจาก Case S-ID, ชื่อช่าง, ชื่อลูกค้า หรือเลข Order
          </div>
        </div>
      </div>

      <v-row dense>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="filters.keyword"
            label="ค้นหา (ID, ช่าง, ลูกค้า, S/N)"
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
            v-model="filters.status"
            :items="statusOptions"
            label="สถานะงาน"
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
          <v-autocomplete
            v-model="filters.caseSType"
            :items="typeOptions"
            label="ประเภทอุปกรณ์"
            prepend-inner-icon="mdi-laptop"
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
            id="date-input-sent"
            v-model="filters.date"
            label="วันที่ส่งซ่อม (เริ่ม - สิ้นสุด)"
            prepend-inner-icon="mdi-calendar-range"
            variant="outlined"
            density="compact"
            color="#4D2FB2"
            bg-color="grey-lighten-5"
            
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
        item-value="caseSId"
        show-select
        hover
        class="minimal-table full-width-table"
        @update:options="loadItems"
      >
        <template v-slot:[`item.caseSId`]="{ item }">
          <div>
            <span class="font-weight-bold text-grey-darken-4 cursor-pointer">{{ item.caseSId }}</span>
            <div class="text-caption text-grey" v-if="item.caseSOrderNo">Ref: {{ item.caseSOrderNo }}</div>
          </div>
        </template>

        <template v-slot:[`item.caseSToMechanic`]="{ item }">
          <div class="d-flex align-center">
            <v-icon size="small" color="grey" start class="mr-1">mdi-account-wrench</v-icon>
            <span class="text-body-2 text-grey-darken-3 font-weight-bold">{{ item.caseSToMechanic || '-' }}</span>
          </div>
        </template>

        <template v-slot:[`item.caseSCusName`]="{ item }">
          <span class="text-body-2 text-grey-darken-2">{{ item.caseSCusName }}</span>
        </template>

        <template v-slot:[`item.deviceInfo`]="{ item }">
          <div class="text-body-2 font-weight-medium text-grey-darken-3">
            {{ item.caseSType }}
          </div>
          <div class="text-caption text-grey">
            {{ item.caseSBrand }} {{ item.caseSModel }}
          </div>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="item.dateOfReceived ? 'success' : 'warning'"
            variant="flat"
            size="small"
            class="font-weight-bold text-white"
          >
            {{ item.dateOfReceived ? 'รับคืนแล้ว' : 'ส่งซ่อมอยู่' }}
          </v-chip>
        </template>

        <template v-slot:[`item.DateSOfSent`]="{ item }">
            <div class="text-body-2 text-grey-darken-2">
                {{ item.DateSOfSent }}
            </div>
        </template>

        <template v-slot:[`item.dateOfReceived`]="{ item }">
            <div class="text-body-2 text-grey-darken-2">
                {{ formatDateToThai(item.dateOfReceived) }}
            </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-menu location="bottom end" transition="scale-transition" offset="5">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" color="grey-darken-1" v-bind="props" size="small"></v-btn>
            </template>
            
            <v-list density="compact" elevation="2" rounded="lg" class="py-1">
              <v-list-item 
                :to="{ name: 'TheCaseSentRepairDetail', params: { id: item.caseSId } }"
                prepend-icon="mdi-eye-outline" 
                value="view" 
                active-color="#4D2FB2"
              >
                <v-list-item-title class="text-body-2">ดูรายละเอียด</v-list-item-title>
              </v-list-item>

              <v-divider class="my-1"></v-divider>
              
              <v-list-item @click="deleteItem(item)" prepend-icon="mdi-trash-can-outline" value="delete">
                <v-list-item-title class="text-red text-body-2">ลบรายการ</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template v-slot:no-data>
          <div class="pa-10 text-center">
            <div class="bg-grey-lighten-5 rounded-circle d-inline-flex pa-4 mb-3">
              <v-icon icon="mdi-file-document-alert-outline" size="40" color="grey-lighten-1"></v-icon>
            </div>
            <div class="text-subtitle-1 text-grey-darken-1 font-weight-bold">
              ไม่พบข้อมูลงานส่งซ่อม
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
import apiClient from "@/services/authService";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th.js";
import Swal from 'sweetalert2';
import { swalTheme } from "@/utils/swalTheme";


export default {
  name: "TheCaseSentRepair",
  data() {
    return {
      serverItems: [],
      totalItems: 0,
      itemsPerPage: 10,
      loading: false,
      selected: [], 

      typeList: [], 

      filters: {
        keyword: null,
        status: null,
        caseSType: null,
        date: null,
      },
      
      serverDateRange: null, 
      fp: null,

      headers: [
        { title: "Case S-ID", key: "caseSId", align: "start", width: "12%" },
        { title: "ส่งถึงช่าง/ร้าน", key: "caseSToMechanic", width: "18%", sortable: false },
        { title: "ลูกค้า", key: "caseSCusName", width: "15%", sortable: false }, 
        { title: "อุปกรณ์", key: "deviceInfo", width: "20%", sortable: false },
        { title: "สถานะ", key: "status", width: "10%", sortable: false }, 
        { title: "วันที่ส่ง", key: "DateSOfSent", width: "12%" },
        { title: "วันที่รับคืน", key: "dateOfReceived", width: "12%" },
        { title: "", key: "actions", sortable: false, align: "end" },
      ],
    };
  },
  computed: {
    statusOptions() {
        return ["ส่งซ่อมอยู่", "รับคืนแล้ว"];
    },
    typeOptions() { 
        return [
            "ซ่อมคอมพิวเตอร์", "ซ่อมโน็ตบุ๊ค", "ซ่อมปริ้นเตอร์", 
            "ซ่อมมือถือ/แท็บเล็ต", "เปลี่ยนอะไหล่", "อื่นๆ"
        ]; 
    }
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
    this.$nextTick(() => {
      this.initThaiDatePicker();
    });
  },
  beforeUnmount() {
    if (this.fp) this.fp.destroy();
  },
  methods: {
    // เพิ่มฟังก์ชันใหม่เพื่อแปลงวันที่ใน Table ให้เป็น พ.ศ.
    formatDateToThai(dateStr) {
      if (!dateStr) return "-";
      
      // แยกส่วน วัน-เดือน-ปี (รองรับทั้ง - และ /)
      const separator = dateStr.includes('-') ? '-' : '/';
      const parts = dateStr.split(separator);
      
      if (parts.length === 3) {
        let day, month, year;
        
        // ตรวจสอบว่าปีอยู่ส่วนไหน (รองรับรูปแบบ dd-mm-yyyy หรือ yyyy-mm-dd)
        if (parts[0].length === 4) { // yyyy-mm-dd
            year = parseInt(parts[0]);
            month = parts[1];
            day = parts[2];
        } else { // dd-mm-yyyy
            day = parts[0];
            month = parts[1];
            year = parseInt(parts[2]);
        }

        // ถ้าปีเป็น ค.ศ. (น้อยกว่า 2500) ให้บวก 543
        if (year < 2500) {
            year = year + 543;
        }
        
        return `${day}-${month}-${year}`;
      }
      return dateStr;
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
            status: this.filters.status,
            caseSType: this.filters.caseSType,
            dateRange: this.serverDateRange,
            sort_by: sortKey,
            sort_order: sortOrder
        };

        const res = await apiClient.get('/get-sent-repair-info', { params });
        
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

    async deleteItem(item) {
      const result = await Swal.fire({
        title: 'ยืนยันการลบ?',
        text: `ต้องการลบรายการส่งซ่อม: ${item.caseSId}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก',
        ...swalTheme.danger
      });

      if (result.isConfirmed) {
        try {
          await apiClient.post('/delete-sent-repair', { caseSId: item.caseSId });
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
      const el = document.getElementById("date-input-sent");
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
            this.filters.date = `${startStr} ถึง ${endStr}`;
            this.serverDateRange = `${startStr},${endStr}`; 
          } else {
            this.filters.date = null; 
            this.serverDateRange = null; 
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

/* Table Styles */
:deep(.minimal-table) { width: 100%; }
:deep(.minimal-table .v-data-table__td:first-child),
:deep(.minimal-table .v-data-table-header__th:first-child) { padding-left: 24px !important; }
:deep(.minimal-table .v-data-table__td:last-child),
:deep(.minimal-table .v-data-table-header__th:last-child) { padding-right: 24px !important; }

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

.cursor-pointer { cursor: pointer; }
</style>