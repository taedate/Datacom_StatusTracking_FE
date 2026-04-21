<template>
  <div class="page-container bg-white d-flex flex-column">
    <!-- Header -->
    <div
      class="px-6 py-4 border-bottom d-flex flex-wrap align-center justify-space-between sticky-top bg-white sticky-header"
      style="z-index: 10; min-height: 80px"
    >
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">
          จัดการลูกค้า (Customers)
        </h2>
        <div class="text-body-2 text-grey mb-3">
          เพิ่ม แก้ไข ลบ ข้อมูลลูกค้า/บริษัท
        </div>
      </div>

      <div class="d-flex align-center" style="gap: 12px">
        <v-btn
          color="#4D2FB2"
          prepend-icon="mdi-plus"
          elevation="0"
          height="44"
          class="text-capitalize px-6 font-weight-bold shadow-sm-custom text-white"
          rounded="pill"
          @click="openDialog()"
        >
          เพิ่มลูกค้าใหม่
        </v-btn>
      </div>
    </div>

    <!-- Search -->
    <div class="px-6 py-5 bg-white border-bottom">
      <div class="d-flex align-center mb-4">
        <div
          class="bg-primary-lighten-5 rounded-circle pa-2 mr-3 d-flex align-center justify-center"
        >
          <v-icon icon="mdi-filter-variant" color="#4D2FB2" size="20"></v-icon>
        </div>
        <div>
          <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
            ค้นหาลูกค้า
          </div>
          <div class="text-caption text-grey">
            ค้นหาจาก ชื่อลูกค้า/บริษัท, เลขภาษี หรือเบอร์โทร
          </div>
        </div>
      </div>

      <v-row dense>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="searchKeyword"
            label="ค้นหา (ชื่อ, เลขภาษี, เบอร์โทร)"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            color="#4D2FB2"
            bg-color="grey-lighten-5"
            clearable
            hide-details="auto"
            class="rounded-lg"
            @update:model-value="onSearchChanged"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <!-- Table -->
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

        <template v-slot:[`item.customer_tax_id`]="{ item }">
          <span class="text-grey-darken-2">{{
            item.customer_tax_id || "-"
          }}</span>
        </template>

        <template v-slot:[`item.customer_phone`]="{ item }">
          <div class="d-flex align-center" v-if="item.customer_phone">
            <v-icon size="small" color="grey" class="mr-1">mdi-phone</v-icon>
            <span class="text-grey-darken-2">{{ item.customer_phone }}</span>
          </div>
          <span v-else class="text-grey-lighten-1">-</span>
        </template>

        <template v-slot:[`item.customer_address`]="{ item }">
          <div
            class="text-truncate text-grey-darken-2"
            style="max-width: 250px"
            :title="item.customer_address"
          >
            {{ item.customer_address || "-" }}
          </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-menu location="bottom end" transition="scale-transition" offset="5">
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
                @click="openDialog(item)"
                prepend-icon="mdi-pencil-outline"
                value="edit"
                active-color="#4D2FB2"
              >
                <v-list-item-title class="text-body-2"
                  >แก้ไข</v-list-item-title
                >
              </v-list-item>

              <v-divider class="my-1"></v-divider>

              <v-list-item
                @click="deleteItem(item)"
                prepend-icon="mdi-trash-can-outline"
                value="delete"
              >
                <v-list-item-title class="text-red text-body-2"
                  >ลบ</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template v-slot:no-data>
          <div class="pa-10 text-center">
            <div
              class="bg-grey-lighten-5 rounded-circle d-inline-flex pa-4 mb-3"
            >
              <v-icon
                icon="mdi-account-search-outline"
                size="40"
                color="grey-lighten-1"
              ></v-icon>
            </div>
            <div class="text-subtitle-1 text-grey-darken-1 font-weight-bold">
              ไม่พบข้อมูลลูกค้า
            </div>
            <div class="text-caption text-grey">
              ลองปรับเปลี่ยนคำค้นหาหรือเพิ่มลูกค้าใหม่
            </div>
          </div>
        </template>
      </v-data-table-server>
    </div>

    <!-- Dialog เพิ่ม/แก้ไข -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center pa-5 pb-3">
          <v-icon
            :icon="isEdit ? 'mdi-pencil' : 'mdi-account-plus'"
            color="#4D2FB2"
            class="mr-2"
          ></v-icon>
          <span class="text-h6 font-weight-bold">{{
            isEdit ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"
          }}</span>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-5">
          <v-form ref="customerForm" v-model="formValid">
            <div class="mb-4">
              <div class="text-subtitle-2 font-weight-bold mb-1">
                ชื่อลูกค้า/บริษัท <span class="text-red">*</span>
              </div>
              <v-text-field
                v-model="form.customer_name"
                placeholder="ระบุชื่อบริษัทหรือลูกค้า"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
              ></v-text-field>
            </div>

            <div class="mb-4">
              <div class="text-subtitle-2 font-weight-bold mb-1">
                เลขประจำตัวผู้เสียภาษี
              </div>
              <v-text-field
                v-model="form.customer_tax_id"
                placeholder="เลข 13 หลัก"
                variant="outlined"
                density="comfortable"
                maxlength="13"
              ></v-text-field>
            </div>

            <div class="mb-4">
              <div class="text-subtitle-2 font-weight-bold mb-1">
                เบอร์โทรศัพท์
              </div>
              <v-text-field
                v-model="form.customer_phone"
                placeholder="เช่น 08x-xxx-xxxx"
                variant="outlined"
                density="comfortable"
                type="tel"
                maxlength="10"
              ></v-text-field>
            </div>

            <div>
              <div class="text-subtitle-2 font-weight-bold mb-1">ที่อยู่</div>
              <v-textarea
                v-model="form.customer_address"
                placeholder="ระบุที่อยู่สำหรับออกเอกสาร"
                variant="outlined"
                density="comfortable"
                rows="3"
                auto-grow
              ></v-textarea>
            </div>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            color="grey-darken-1"
            rounded="pill"
            class="text-capitalize px-6"
            @click="closeDialog"
          >
            ยกเลิก
          </v-btn>
          <v-btn
            color="#4D2FB2"
            variant="flat"
            rounded="pill"
            class="text-capitalize px-6 font-weight-bold text-white"
            :loading="isSaving"
            @click="saveForm"
          >
            {{ isEdit ? "บันทึกการแก้ไข" : "เพิ่มลูกค้า" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import apiClient from "@/services/authService";
import Swal from "sweetalert2";
import { swalTheme } from "@/utils/swalTheme";

export default {
  name: "TheCustomer",
  data() {
    return {
      serverItems: [],
      totalItems: 0,
      itemsPerPage: 10,
      loading: false,
      searchKeyword: null,
      searchTimer: null,

      dialog: false,
      isEdit: false,
      isSaving: false,
      formValid: false,
      editingId: null,

      form: {
        customer_name: "",
        customer_tax_id: "",
        customer_phone: "",
        customer_address: "",
      },

      rules: {
        required: (v) => !!v || "กรุณากรอกข้อมูล",
      },

      headers: [
        {
          title: "ชื่อลูกค้า/บริษัท",
          key: "customer_name",
          width: "25%",
        },
        {
          title: "เลขประจำตัวผู้เสียภาษี",
          key: "customer_tax_id",
          width: "18%",
          sortable: false,
        },
        {
          title: "เบอร์โทร",
          key: "customer_phone",
          width: "15%",
          sortable: false,
        },
        {
          title: "ที่อยู่",
          key: "customer_address",
          width: "30%",
          sortable: false,
        },
        {
          title: "",
          key: "actions",
          sortable: false,
          align: "end",
          width: "60px",
        },
      ],
    };
  },
  methods: {
    onSearchChanged() {
      if (this.searchTimer) clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage, sortBy: [] });
      }, 350);
    },

    async loadItems({ page, itemsPerPage }) {
      this.loading = true;
      try {
        const params = {
          page: page,
          itemsPerPage: itemsPerPage,
          search: this.searchKeyword || undefined,
        };

        const res = await apiClient.get("/customers", { params });

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

    openDialog(item = null) {
      if (item) {
        this.isEdit = true;
        this.editingId = item.id;
        this.form = {
          customer_name: item.customer_name || "",
          customer_tax_id: item.customer_tax_id || "",
          customer_phone: item.customer_phone || "",
          customer_address: item.customer_address || "",
        };
      } else {
        this.isEdit = false;
        this.editingId = null;
        this.form = {
          customer_name: "",
          customer_tax_id: "",
          customer_phone: "",
          customer_address: "",
        };
      }
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
      this.$nextTick(() => {
        this.$refs.customerForm?.reset();
      });
    },

    async saveForm() {
      const { valid } = await this.$refs.customerForm.validate();
      if (!valid) return;

      this.isSaving = true;
      try {
        if (this.isEdit) {
          await apiClient.put(`/customers/${this.editingId}`, this.form);
        } else {
          await apiClient.post("/customers", this.form);
        }

        await Swal.fire({
          icon: "success",
          title: this.isEdit ? "แก้ไขสำเร็จ!" : "เพิ่มลูกค้าสำเร็จ!",
          timer: 1500,
          showConfirmButton: false,
        });

        this.closeDialog();
        this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage, sortBy: [] });
      } catch (err) {
        console.error("Save error:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "เกิดข้อผิดพลาดในการบันทึก",
          ...swalTheme.danger,
        });
      } finally {
        this.isSaving = false;
      }
    },

    async deleteItem(item) {
      const result = await Swal.fire({
        title: "ยืนยันการลบ?",
        text: `ต้องการลบลูกค้า "${item.customer_name}" หรือไม่?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก",
        reverseButtons: false,
        focusCancel: true,
        ...swalTheme.danger,
      });

      if (result.isConfirmed) {
        try {
          await apiClient.delete(`/customers/${item.id}`);
          await Swal.fire({
            icon: "success",
            title: "ลบเสร็จสิ้น",
            text: "ข้อมูลถูกลบเรียบร้อยแล้ว",
            ...swalTheme.info,
          });
          this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage, sortBy: [] });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "ไม่สามารถลบข้อมูลได้",
            ...swalTheme.danger,
          });
        }
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

.shadow-sm-custom {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

.bg-primary-lighten-5 {
  background-color: var(--theme-tint-1) !important;
}
</style>
