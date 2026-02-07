<template>
  <div class="page-container bg-white d-flex flex-column">
    <div
      class="px-6 py-4 border-bottom d-flex flex-wrap align-center justify-space-between sticky-top bg-white sticky-header"
      style="z-index: 10; min-height: 80px"
    >
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">
          รายการงานติดตั้ง (Installation Projects)
        </h2>
        <div class="text-body-2 text-grey mb-3">จัดการและติดตามสถานะงานติดตั้ง</div>
      </div>

      <div class="d-flex align-center" style="gap: 12px">
        <v-menu location="bottom end" transition="scale-transition">
          <!-- <template v-slot:activator="{ props }">
            <v-btn
              color="#107C41"
              prepend-icon="mdi-microsoft-excel"
              variant="flat"
              v-bind="props"
              height="44"
              class="text-capitalize px-6 font-weight-bold rounded-pill text-white shadow-sm-custom"
            >
              ส่งออกข้อมูล
            </v-btn>
          </template> -->
          <v-list density="compact">
            <v-list-item title="Export Excel" prepend-icon="mdi-download"></v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          color="#161E54"
          prepend-icon="mdi-plus"
          elevation="0"
          height="44"
          class="text-capitalize px-6 font-weight-bold shadow-sm-custom text-white"
          rounded="pill"
          :to="{ name: 'TheCaseProjectDetail', params: { id: 'new' } }"
        >
          เปิดงานติดตั้งใหม่
        </v-btn>
      </div>
    </div>

    <div class="px-6 py-5 bg-white border-bottom">
      
      <div class="d-flex align-center mb-4">
        <div class="bg-primary-lighten-5 rounded-circle pa-2 mr-3 d-flex align-center justify-center">
          <v-icon icon="mdi-filter-variant" color="#161E54" size="20"></v-icon>
        </div>
        <div>
          <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
            ค้นหาและคัดกรอง
          </div>
          <div class="text-caption text-grey">
            ค้นหาจาก Project ID, สถานที่ หรือรายละเอียด
          </div>
        </div>
      </div>

      <v-row dense>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="filters.keyword"
            label="ค้นหา (Project ID, สถานที่, รายละเอียด)"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            color="#161e54"
            bg-color="grey-lighten-5"
            clearable
            hide-details="auto"
            class="rounded-lg"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-autocomplete
            v-model="filters.pStatus"
            :items="statusList"
            label="สถานะงาน"
            prepend-inner-icon="mdi-list-status"
            variant="outlined"
            density="compact"
            color="#161e54"
            bg-color="grey-lighten-5"
            clearable
            hide-details="auto"
            class="rounded-lg"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field
            id="date-input-project"
            v-model="filters.date"
            label="วันที่เริ่มงาน (เริ่ม - สิ้นสุด)"
            prepend-inner-icon="mdi-calendar-range"
            variant="outlined"
            density="compact"
            color="#161e54"
            bg-color="grey-lighten-5"
            hide-details="auto"
            readonly
            clearable
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
        item-value="pId"
        show-select
        hover
        class="minimal-table full-width-table"
        @update:options="loadItems"
      >
        <template v-slot:[`item.pId`]="{ item }">
          <span class="font-weight-bold text-grey-darken-4 cursor-pointer">{{ item.pId }}</span>
        </template>

        <template v-slot:[`item.pAddress`]="{ item }">
          <div class="d-flex align-center">
            <v-icon size="small" color="grey" start class="mr-1">mdi-map-marker</v-icon>
            <span class="text-body-2 text-grey-darken-3">{{ item.pAddress || '-' }}</span>
          </div>
        </template>

        <template v-slot:[`item.pDetail`]="{ item }">
          <div class="text-truncate text-grey-darken-2" style="max-width: 250px;">
            {{ item.pDetail || '-' }}
          </div>
        </template>

        <template v-slot:[`item.pStatus`]="{ item }">
          <v-chip
            :color="getStatusColor(item.pStatus)"
            variant="flat"
            size="small"
            class="font-weight-bold text-white"
          >
            {{ item.pStatus }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-menu location="bottom end" transition="scale-transition" offset="5">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" color="grey-darken-1" v-bind="props" size="small"></v-btn>
            </template>
            <v-list density="compact" elevation="2" rounded="lg" class="py-1">
              <v-list-item 
                :to="{ name: 'TheCaseProjectDetail', params: { id: item.pId } }"
                prepend-icon="mdi-eye-outline" 
                value="view" 
                active-color="primary"
              >
                <v-list-item-title class="text-body-2">ดูรายละเอียด</v-list-item-title>
              </v-list-item>
              <v-divider class="my-1"></v-divider>
              <v-list-item @click="deleteItem(item)" prepend-icon="mdi-trash-can-outline" value="delete">
                <v-list-item-title class="text-red text-body-2">ลบงานติดตั้ง</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

      </v-data-table-server>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th.js";


export default {
  name: "TheCaseProject",
  data() {
    return {
      serverItems: [],
      totalItems: 0,
      itemsPerPage: 10,
      loading: false,
      selected: [], 

      // Filter Options
      statusList: ["รอดำเนินการ", "กำลังดำเนินการ", "เสร็จสิ้น"],
      
      filters: {
        keyword: null,
        pStatus: null,
        date: null,
      },
      serverDateRange: null,
      fp: null,

      headers: [
        { title: "Project ID", key: "pId", align: "start", width: "12%" },
        { title: "สถานที่ติดตั้ง", key: "pAddress", width: "25%", sortable: false },
        { title: "รายละเอียดงาน", key: "pDetail", width: "25%", sortable: false },
        { title: "สถานะ", key: "pStatus", width: "12%" },
        { title: "วันที่เริ่ม", key: "dateCreate", width: "12%" },
        { title: "วันที่เสร็จ", key: "dateComplete", width: "12%" },
        { title: "", key: "actions", sortable: false, align: "end" },
      ],
    };
  },
  watch: {
    filters: {
        handler() { this.loadItems({ page: 1, itemsPerPage: 10 }); },
        deep: true
    }
  },
  mounted() {
    this.$nextTick(() => this.initDatePicker());
  },
  methods: {
    getStatusColor(status) {
        if (status === 'เสร็จสิ้น') return 'success';
        if (status === 'กำลังดำเนินการ') return 'info';
        return 'grey-darken-1'; 
    },

    async loadItems({ page, itemsPerPage, sortBy }) {
      this.loading = true;
      try {
        let sortKey = sortBy && sortBy.length ? sortBy[0].key : null;
        let sortOrder = sortBy && sortBy.length ? sortBy[0].order : null;

        const params = {
            page,
            itemsPerPage,
            search: this.filters.keyword,
            pStatus: this.filters.pStatus,
            dateRange: this.serverDateRange,
            sort_by: sortKey,
            sort_order: sortOrder
        };

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/get-project-info`, { params });
        if (res.data.message === "success") {
          this.serverItems = res.data.data;
          this.totalItems = res.data.totalItems;
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(item) {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            text: `ต้องการลบ Project: ${item.pId}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#d33',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/delete-project`, { pId: item.pId });
                Swal.fire('สำเร็จ', 'ลบข้อมูลแล้ว', 'success');
                this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
            } catch (err) {
                Swal.fire('Error', 'ลบไม่สำเร็จ', 'error');
            }
        }
    },

    // --- Date Picker Logic ---
    initDatePicker() {
      const el = document.getElementById("date-input-project");
      if (!el) return;
      this.fp = flatpickr(el, {
        mode: "range",
        locale: Thai,
        dateFormat: "d-m-Y",
        disableMobile: true,
        onChange: (dates) => {
            if (dates.length === 2) {
                const s = this.formatDate(dates[0]);
                const e = this.formatDate(dates[1]);
                this.filters.date = `${s} ถึง ${e}`;
                this.serverDateRange = `${s},${e}`;
            }
        }
      });
    },
    formatDate(d) {
        return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()+543}`;
    },
    clearDate() {
        this.filters.date = null;
        this.serverDateRange = null;
        if(this.fp) this.fp.clear();
    }
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
  
  /* ✅ เพิ่มกฎ CSS นี้เพื่อดัน Header ลงมา */
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
  background-color: #ecf6ff !important;
  color: #161e54 !important;
  font-weight: 700 !important;
  font-size: 0.95rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: 60px !important;
  border-bottom: 1px solid #cce5ff !important;
  white-space: nowrap;
}

:deep(.minimal-table tbody tr:hover td) {
  background-color: #f8fbff !important;
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
.cursor-pointer {
    cursor: pointer;
}

/* ✅ Class พื้นหลัง */
.bg-primary-lighten-5 {
  background-color: #f0f4ff !important;
}
</style>