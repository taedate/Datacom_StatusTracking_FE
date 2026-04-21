<template>
  <div class="page-container bg-white d-flex flex-column">
    <!-- Header -->
    <div
      class="px-6 py-4 border-bottom d-flex flex-wrap align-center justify-space-between sticky-top bg-white sticky-header"
      style="z-index: 10; min-height: 80px"
    >
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">
          ค้นหาประวัติราคา (Price History)
        </h2>
        <div class="text-body-2 text-grey mb-3">
          ค้นหาราคาสินค้าที่เคยขายให้แต่ละหน่วยงาน
        </div>
      </div>
    </div>

    <!-- Search Filters -->
    <div class="px-6 py-5 bg-white border-bottom">
      <div class="d-flex align-center mb-4">
        <div
          class="bg-primary-lighten-5 rounded-circle pa-2 mr-3 d-flex align-center justify-center"
        >
          <v-icon icon="mdi-magnify" color="#4D2FB2" size="20"></v-icon>
        </div>
        <div>
          <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
            ค้นหาตามเงื่อนไข
          </div>
          <div class="text-caption text-grey">
            กรอกชื่อลูกค้า/บริษัท หรือชื่อสินค้าเพื่อค้นหาประวัติราคา
          </div>
        </div>
      </div>

      <v-row dense>
        <v-col cols="12" sm="6" md="5">
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

        <v-col cols="12" sm="6" md="5">
          <v-text-field
            v-model="filters.productName"
            label="ชื่อสินค้า/รายละเอียด"
            prepend-inner-icon="mdi-package-variant-closed"
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
    </div>

    <!-- Results Table -->
    <div class="flex-grow-1 bg-white">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        item-value="id"
        hover
        class="minimal-table full-width-table"
        @update:options="loadItems"
      >
        <template v-slot:[`item.customer_name`]="{ item }">
          <span class="font-weight-medium text-grey-darken-3">{{
            item.customer_name
          }}</span>
        </template>

        <template v-slot:[`item.product_name`]="{ item }">
          <div class="d-flex flex-column">
            <span class="text-grey-darken-3">{{ item.product_name }}</span>
            <span class="text-caption text-grey" v-if="item.section_name">
              กลุ่ม: {{ item.section_name }}
            </span>
          </div>
        </template>

        <template v-slot:[`item.unit_price`]="{ item }">
          <span class="font-weight-bold text-indigo-darken-3">
            {{
              Number(item.unit_price).toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })
            }}
          </span>
        </template>

        <template v-slot:[`item.quantity`]="{ item }">
          <span class="text-grey-darken-2">
            {{ item.quantity }} {{ item.unit || "" }}
          </span>
        </template>

        <template v-slot:[`item.total_price`]="{ item }">
          <span class="font-weight-medium text-teal-darken-2">
            {{
              (item.quantity * item.unit_price).toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })
            }}
          </span>
        </template>

        <template v-slot:[`item.quotation_id`]="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            color="indigo"
            class="font-weight-medium"
            @click="goToQuotation(item.document_id)"
            style="cursor: pointer"
          >
            {{ item.quotation_id || item.document_id }}
          </v-chip>
        </template>

        <template v-slot:[`item.issue_date_str`]="{ item }">
          <span class="text-body-2 text-grey-darken-2">
            {{ formatDate(item) }}
          </span>
        </template>

        <template v-slot:no-data>
          <div class="pa-10 text-center">
            <div
              class="bg-grey-lighten-5 rounded-circle d-inline-flex pa-4 mb-3"
            >
              <v-icon
                icon="mdi-tag-search-outline"
                size="40"
                color="grey-lighten-1"
              ></v-icon>
            </div>
            <div class="text-subtitle-1 text-grey-darken-1 font-weight-bold">
              ไม่พบข้อมูลประวัติราคา
            </div>
            <div class="text-caption text-grey">
              กรอกชื่อลูกค้าหรือชื่อสินค้า
            </div>
          </div>
        </template>
      </v-data-table-server>
    </div>
  </div>
</template>

<script>
import apiClient from "@/services/authService";

export default {
  name: "ThePriceHistory",
  data() {
    return {
      serverItems: [],
      totalItems: 0,
      itemsPerPage: 15,
      loading: false,
      lastOptions: null,

      filters: {
        customerName: null,
        productName: null,
      },

      headers: [
        {
          title: "ลูกค้า/บริษัท",
          key: "customer_name",
          width: "20%",
        },
        {
          title: "รายการสินค้า",
          key: "product_name",
          width: "25%",
          sortable: false,
        },
        {
          title: "ราคา/หน่วย",
          key: "unit_price",
          align: "end",
          width: "12%",
        },
        {
          title: "จำนวน",
          key: "quantity",
          align: "center",
          width: "10%",
          sortable: false,
        },
        {
          title: "รวม",
          key: "total_price",
          align: "end",
          width: "12%",
          sortable: false,
        },
        {
          title: "เอกสาร",
          key: "quotation_id",
          width: "12%",
          sortable: false,
        },
        {
          title: "วันที่",
          key: "issue_date_str",
          width: "10%",
        },
      ],
    };
  },
  watch: {
    filters: {
      handler() {
        if (this.searchTimer) clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => {
          this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage, sortBy: [] });
        }, 400);
      },
      deep: true,
    },
  },
  methods: {
    clearFilters() {
      this.filters.customerName = null;
      this.filters.productName = null;
      this.serverItems = [];
      this.totalItems = 0;
    },

    async loadItems({ page, itemsPerPage, sortBy }) {
      if (!this.filters.customerName && !this.filters.productName) {
        this.serverItems = [];
        this.totalItems = 0;
        return;
      }

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
          customerName: this.filters.customerName || undefined,
          productName: this.filters.productName || undefined,
          sort_by: sortKey,
          sort_order: sortOrder,
        };

        const res = await apiClient.get("/quotation/price-history", {
          params,
        });

        if (res.data.message === "success") {
          this.serverItems = res.data.data;
          this.totalItems = res.data.totalItems;
        }
      } catch (err) {
        console.error("Price history API Error:", err);
        this.serverItems = [];
        this.totalItems = 0;
      } finally {
        this.loading = false;
      }
    },

    goToQuotation(documentId) {
      if (documentId) {
        this.$router.push({
          name: "TheQuotationDetail",
          params: { id: documentId },
        });
      }
    },

    formatDate(item) {
      if (item.issue_date_str) return item.issue_date_str;
      
      const dateToUse = item.issue_date || item.created_at || item.updated_at;
      if (!dateToUse) return "-";
      
      try {
        const d = new Date(dateToUse);
        if (isNaN(d.getTime())) return "-";
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear() + 543;
        return `${day}/${month}/${year}`;
      } catch {
        return "-";
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

/* Table */
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
  cursor: pointer;
}

:deep(.minimal-table tbody tr td) {
  height: 64px !important;
  font-size: 1rem !important;
  font-weight: 400 !important;
  border-bottom: 1px solid #e0e0e0 !important;
  color: #424242 !important;
}

.bg-primary-lighten-5 {
  background-color: var(--theme-tint-1) !important;
}
</style>
