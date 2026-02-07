<template>
  <div class="page-container d-flex flex-column">
    <div
      class="px-4 py-3 px-md-6 py-md-4 border-bottom d-flex flex-wrap align-center justify-space-between bg-white flex-shrink-0 sticky-top shadow-sm sticky-header"
      style="z-index: 900; min-height: 80px; top: 0"
    >
      <div>
        <div class="d-flex align-center gap-2 mb-1">
          <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-0">
            {{ isNew ? "สร้างรายการส่งซ่อมใหม่" : `Sent ID: ${formData.caseSId}` }}
          </h2>
          <v-chip
            v-if="!isNew"
            :color="currentStatus === 'รับคืนแล้ว' ? 'success' : 'warning'"
            class="font-weight-bold text-white ms-2"
            size="small"
            variant="flat"
          >
            {{ currentStatus }}
          </v-chip>
        </div>
        <div class="text-body-2 text-grey">
          {{ isNew ? "กรอกข้อมูลเพื่อส่งเครื่องซ่อมภายนอก/ช่าง" : "แก้ไขรายละเอียดการส่งซ่อม" }}
        </div>
      </div>

      <div class="d-flex align-center mt-3 mt-md-0" style="gap: 12px">
        <v-btn
          v-if="!isNew"
          variant="outlined"
          color="primary"
          prepend-icon="mdi-printer"
          class="text-capitalize font-weight-bold"
          rounded="pill"
          @click="printPDF"
        >
          พิมพ์ใบส่งซ่อม
        </v-btn>
        <v-btn
          variant="text"
          color="grey-darken-1"
          prepend-icon="mdi-arrow-left"
          class="text-capitalize font-weight-bold"
          rounded="pill"
          @click="$router.go(-1)"
        >
          ย้อนกลับ
        </v-btn>
      </div>
    </div>

    <div class="flex-grow-1 overflow-y-auto px-4 py-5 px-md-6 pb-5 mb-5 bg-light-gray">
      
      <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 50vh">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else class="mx-auto" style="max-width: 100%">
        <v-form ref="sentRepairForm">

          <div class="bg-white rounded-lg pa-5 mb-4 section-block" v-if="!isNew">
            <h5 class="fw-bold mb-4 text-dark">สถานะการดำเนินงาน (Timeline)</h5>
            
            <div class="d-flex align-center justify-center py-4">
               <div class="text-center position-relative" style="min-width: 120px;">
                  <v-avatar :color="getStepColor(1)" size="50" class="mb-2 border elevation-1">
                    <v-icon icon="mdi-truck-delivery-outline" color="white" size="24"></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold">ส่งซ่อมอยู่</div>
               </div>

               <v-divider :color="getStepColor(2, true)" class="border-opacity-100 mx-4" thickness="3" style="width: 100px; flex: none;"></v-divider>

               <div class="text-center position-relative" style="min-width: 120px;">
                  <v-avatar :color="getStepColor(2)" size="50" class="mb-2 border elevation-1">
                    <v-icon icon="mdi-package-variant-closed-check" color="white" size="24"></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold">รับคืนแล้ว</div>
               </div>
            </div>
            
            <div class="text-center text-grey text-caption mt-2">
              *สถานะจะเปลี่ยนเป็น "รับคืนแล้ว" เมื่อมีการลงวันที่รับคืน
            </div>
          </div>

          <div class="bg-white rounded-lg pa-5 mb-4 section-block">
            <div class="d-flex align-items-center mb-4">
              <div class="section-number me-3">1</div>
              <h5 class="fw-bold m-0 text-dark">ข้อมูลการส่งซ่อม (Sending Info)</h5>
            </div>
            <hr class="mb-4" />
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">ส่งซ่อมที่ / ชื่อช่าง <span class="text-red">*</span></div>
                <v-text-field
                  v-model="formData.caseSToMechanic"
                  placeholder="ระบุร้านซ่อม หรือ ชื่อช่าง"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  prepend-inner-icon="mdi-account-wrench"
                  :rules="[rules.required]"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">เลขที่ใบส่งของ / Order No.</div>
                <v-text-field
                  v-model="formData.caseSOrderNo"
                  placeholder="เช่น INV-12345 (ถ้ามี)"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  prepend-inner-icon="mdi-file-document-outline"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">วันที่ส่งซ่อม <span class="text-red">*</span></div>
                <v-text-field
                  id="date-sent"
                  v-model="formData.DateSOfSent"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  readonly
                  placeholder="เลือกวันที่"
                  prepend-inner-icon="mdi-calendar-export"
                  :rules="[rules.required]"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">ชื่อลูกค้า (เจ้าของเครื่อง)</div>
                <v-text-field
                  v-model="formData.caseSCusName"
                  placeholder="ระบุชื่อลูกค้า"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  prepend-inner-icon="mdi-account"
                ></v-text-field>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg pa-5 mb-4 section-block">
            <div class="d-flex align-items-center mb-4">
              <div class="section-number me-3">2</div>
              <h5 class="fw-bold m-0 text-dark">ข้อมูลอุปกรณ์ (Device Info)</h5>
            </div>
            <hr class="mb-4" />
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">ประเภทอุปกรณ์ <span class="text-red">*</span></div>
                <v-combobox
                  v-model="formData.caseSType"
                  :items="typeOptions"
                  placeholder="เลือกประเภท"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  :rules="[rules.required]"
                ></v-combobox>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">ยี่ห้อ (Brand)</div>
                <v-text-field
                  v-model="formData.caseSBrand"
                  placeholder="เช่น Dell, HP"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">รุ่น (Model)</div>
                <v-text-field
                  v-model="formData.caseSModel"
                  placeholder="ระบุรุ่น"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">Serial Number (S/N)</div>
                <v-text-field
                  v-model="formData.caseSSN"
                  placeholder="ระบุ S/N"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                ></v-text-field>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg pa-5 mb-4 section-block">
            <div class="d-flex align-items-center mb-4">
              <div class="section-number me-3">3</div>
              <h5 class="fw-bold m-0 text-dark">รายละเอียดเพิ่มเติม (Details)</h5>
            </div>
            <hr class="mb-4" />
            <div class="row g-3">
              <div class="col-12">
                <div class="text-subtitle-1 font-weight-bold mb-1">อาการเสีย (Broken Symptom)</div>
                <v-textarea
                  v-model="formData.brokenSymptom"
                  placeholder="ระบุอาการเสียที่แจ้งช่าง"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  rows="3"
                  auto-grow
                ></v-textarea>
              </div>
              <div class="col-12">
                <div class="text-subtitle-1 font-weight-bold mb-1">อุปกรณ์ที่ส่งไปด้วย (Equipment)</div>
                <v-textarea
                  v-model="formData.caseSEquipment"
                  placeholder="เช่น สายชาร์จ, กระเป๋า"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  rows="2"
                  auto-grow
                ></v-textarea>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg pa-5 mb-4 section-block">
            <div class="d-flex align-items-center mb-4">
              <div class="section-number me-3">4</div>
              <h5 class="fw-bold m-0 text-dark">การรับคืน (Received Back)</h5>
            </div>
            <hr class="mb-4" />
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">วันที่รับคืน</div>
                <v-text-field
                  id="date-received"
                  v-model="formData.dateOfReceived"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  readonly
                  placeholder="--- ยังไม่รับคืน ---"
                  prepend-inner-icon="mdi-calendar-check"
                  :disabled="isNew"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">ผู้รับคืน (Recipient)</div>
                <v-text-field
                  v-model="formData.caseSRecipient"
                  placeholder="ระบุชื่อพนักงานที่รับของคืน"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  prepend-inner-icon="mdi-account-check"
                  :disabled="isNew"
                ></v-text-field>
              </div>
            </div>
          </div>

        </v-form>
      </div>
    </div>

    <div class="bg-white border-top py-3 px-4 px-md-6 d-flex align-items-center justify-content-end fixed-bottom-custom shadow-lg" style="z-index: 1040">
      <span class="text-muted small me-auto d-none d-md-inline">
        <v-icon icon="mdi-information-outline" size="small" class="me-1"></v-icon>
        ตรวจสอบความถูกต้องก่อนบันทึก
      </span>

      <button
        class="btn btn-primary px-4 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm btn-save-custom"
        @click="saveForm"
        :disabled="isSaving"
        style="background-color: #161e54; border: none;"
      >
        <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
        <v-icon v-else icon="mdi-content-save" class="me-1"></v-icon>
        {{ isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล" }}
      </button>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.css";
import { useDateHelper } from "@/composables/useDateHelper";
import { sentRepairService } from "@/services/sentRepairService";
import { validationRules as rules } from "@/utils/validationRules";

export default {
  name: 'TheCaseSentRepairDetail',
  setup() {
    const { getTodayThaiDate, initDatePicker, destroyAllPickers } = useDateHelper();
    return {
      getTodayThaiDate,
      initDatePicker,
      destroyAllPickers
    };
  },
  data() {
    return {
      isNew: false,
      loading: false,
      isSaving: false,
      
      typeOptions: [
        "ซ่อมคอมพิวเตอร์", "ซ่อมโน็ตบุ๊ค", "ซ่อมปริ้นเตอร์", "UPS",
        "ซ่อมมือถือ/แท็บเล็ต", "เปลี่ยนอะไหล่", "อื่นๆ"
      ],

      formData: {
        caseSId: null,
        caseSToMechanic: "",
        caseSOrderNo: "",
        caseSCusName: "",
        DateSOfSent: "",
        caseSType: "",
        caseSBrand: "",
        caseSModel: "",
        caseSSN: "",
        brokenSymptom: "",
        caseSEquipment: "",
        dateOfReceived: "",
        caseSRecipient: ""
      },
      
      pickers: {},
      rules: {
        required: rules.required('ข้อมูล'),
      },
    };
  },
  computed: {
    currentStatus() {
        return this.formData.dateOfReceived ? 'รับคืนแล้ว' : 'ส่งซ่อมอยู่';
    }
  },
  async mounted() {
    const routeId = this.$route.params.id;
    
    if (routeId === "new" || !routeId) {
      this.isNew = true;
      this.formData.DateSOfSent = this.getTodayThaiDate(); // Default Date
      this.$nextTick(() => this.initDatePickers());
    } else {
      this.isNew = false;
      this.formData.caseSId = routeId;
      await this.fetchDetail(routeId);
    }
  },
  beforeUnmount() {
    this.destroyAllPickers();
  },
  methods: {
    async fetchDetail(id) {
      this.loading = true;
      try {
        const res = await sentRepairService.getDetail(id);
        if (res.data.message === "success") {
           const data = res.data.data;
           this.formData = { ...data };
        }
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire("Error", "ไม่สามารถโหลดข้อมูลได้", "error");
      } finally {
        this.loading = false;
        this.$nextTick(() => this.initDatePickers());
      }
    },

    async saveForm() {
      const { valid } = await this.$refs.sentRepairForm.validate();
      if (!valid) {
        Swal.fire({
            icon: 'warning',
            title: 'ข้อมูลไม่ครบถ้วน',
            text: 'กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย *',
            confirmButtonColor: '#161E54'
        });
        return;
      }

      this.isSaving = true;
      try {
        const endpoint = this.isNew ? 'create' : 'update';
        const payload = { ...this.formData };

        // Clean Empty Strings
        Object.keys(payload).forEach(key => {
            if (payload[key] === "") payload[key] = null;
        });

        const res = await sentRepairService[endpoint](payload);
        
        if (res.data.message === "success") {
            await Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ!',
                timer: 1500,
                showConfirmButton: false
            });
            
            if (this.isNew) {
                this.$router.replace({ name: 'TheCaseSentRepair' });
            }
        }
      } catch (err) {
        console.error("Save error:", err);
        Swal.fire("Error", "เกิดข้อผิดพลาดในการบันทึก", "error");
      } finally {
        this.isSaving = false;
      }
    },

    getStepColor(step, isDivider = false) {
        const received = !!this.formData.dateOfReceived;
        let currentStep = 1;
        if (received) currentStep = 2;

        const activeColor = '#161E54';
        const inactiveColor = '#E0E0E0';
        const successColor = '#107C41';

        if (isDivider) {
            return step < currentStep ? successColor : (step === currentStep ? activeColor : inactiveColor);
        } else {
             if (step < currentStep) return successColor;
             if (step === currentStep) return activeColor;
             return inactiveColor;
        }
    },

    // --- Date Picker Logic ---
    initDatePickers() {
        this.initDatePicker('date-sent', this.formData.DateSOfSent, (newDate) => {
            this.formData.DateSOfSent = newDate;
        });
        
        this.initDatePicker('date-received', this.formData.dateOfReceived, (newDate) => {
            this.formData.dateOfReceived = newDate;
        });
    },

    formatToThaiDate(date) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear() + 543;
        return `${d}-${m}-${y}`;
    },
    parseThaiDate(dateStr) {
        if (!dateStr) return null;
        const [d, m, y] = dateStr.split('-');
        return new Date(y - 543, m - 1, d);
    },
    getTodayThaiDate() {
        return this.formatToThaiDate(new Date());
    },
    adjustYear(instance) {
        setTimeout(() => {
            if (instance && instance.currentYearElement) {
                instance.currentYearElement.value = instance.currentYear + 543;
            }
        }, 10);
    },
    async printPDF() {
      Swal.fire({
        title: "กำลังสร้างไฟล์ PDF...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await sentRepairService.print(this.formData.caseSId);

        if (response.data.type !== "application/pdf") {
          const text = await response.data.text();
          let errMsg = text;
          try {
            const json = JSON.parse(text);
            errMsg = json.message || json.error || text;
          } catch (e) {} 

          throw new Error(`Server Error: ${errMsg}`);
        }

        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Sent-Repair-${this.formData.caseSId}.pdf`);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        Swal.close();
      } catch (error) {
        console.error("Print Error:", error);
        Swal.fire({
          icon: "error",
          title: "ออกใบรับซ่อมไม่สำเร็จ",
          text: error.message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
          confirmButtonColor: "#d33",
        });
      }
    },

  }
}
</script>

<style scoped>
.bg-light-gray { background-color: #f3f4f6; min-height: 100vh; }
.page-container { width: 100%; min-height: 100vh; transition: all 0.3s ease; background-color: #f3f4f6; }

@media (min-width: 992px) {
  .page-container { padding-left: 280px !important; }
  .fixed-bottom-custom { left: 280px !important; width: calc(100% - 280px) !important; position: fixed; bottom: 0; }
}
@media (max-width: 991.98px) {
  .page-container { padding-left: 0 !important; padding-top: 60px !important; }
  .fixed-bottom-custom { left: 0 !important; width: 100% !important; position: fixed; bottom: 0; }
  
  /* ✅ เพิ่มกฎ CSS นี้เพื่อดัน Header ลงมา */
  .sticky-header {
    top: 60px !important;
  }
}

.section-block {
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.section-number {
  width: 32px; height: 32px;
  background-color: #161e54; color: white;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 0.9rem;
}
.btn-save-custom {
    transition: transform 0.2s;
}
.btn-save-custom:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(22, 30, 84, 0.3) !important;
}
</style>