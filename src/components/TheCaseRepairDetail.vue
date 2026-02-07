<template>
  <div class="page-container d-flex flex-column">
    <div
      class="px-4 py-3 px-md-6 py-md-4 border-bottom d-flex flex-wrap align-center justify-space-between bg-white flex-shrink-0 sticky-top shadow-sm sticky-header"
      style="z-index: 900; min-height: 80px; top: 0"
    >
      <div>
        <div class="d-flex align-center gap-2 mb-1">
          <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-0">
            {{ isNew ? "เปิดงานซ่อมใหม่" : `Case ID: ${formData.caseId}` }}
          </h2>
          <v-chip
            v-if="!isNew"
            :color="getStatusColor(formData.caseStatus)"
            class="font-weight-bold text-white ms-2"
            size="small"
            variant="flat"
          >
            {{ formData.caseStatus }}
          </v-chip>
        </div>
        <div class="text-body-2 text-grey">
          {{
            isNew
              ? "กรอกข้อมูลเพื่อรับเครื่องซ่อม"
              : "แก้ไขรายละเอียดและอัปเดตสถานะงานซ่อม"
          }}
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
          พิมพ์ใบรับซ่อม
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

    <div
      class="flex-grow-1 overflow-y-auto px-4 py-5 px-md-6 pb-5 mb-5 bg-light-gray"
    >
      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center"
        style="height: 50vh"
      >
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else class="mx-auto" style="max-width: 100%">
        <v-form ref="repairForm">
          <div
            class="bg-white rounded-lg pa-5 mb-4 section-block"
            v-if="!isNew"
          >
            <h5 class="fw-bold mb-4 text-dark">สถานะงานซ่อม (Workflow)</h5>

            <div class="w-100 overflow-x-auto py-2 mb-4">
              <div class="d-flex align-center px-2" style="min-width: 900px">
                <div
                  class="text-center position-relative"
                  style="z-index: 2; min-width: 100px"
                >
                  <v-avatar
                    :color="getStepColor(1)"
                    size="44"
                    class="mb-2 border elevation-1"
                  >
                    <v-icon
                      icon="mdi-clock-outline"
                      color="white"
                      size="22"
                    ></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold text-no-wrap">
                    รอรับเครื่อง
                  </div>
                </div>
                <v-divider
                  :color="getStepColor(2, true)"
                  class="border-opacity-100 mx-2 flex-grow-1"
                  thickness="3"
                ></v-divider>

                <div
                  class="text-center position-relative"
                  style="z-index: 2; min-width: 100px"
                >
                  <v-avatar
                    :color="getStepColor(2)"
                    size="44"
                    class="mb-2 border elevation-1"
                  >
                    <v-icon
                      icon="mdi-inbox-arrow-down"
                      color="white"
                      size="22"
                    ></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold text-no-wrap">
                    รับเครื่องแล้ว
                  </div>
                </div>
                <v-divider
                  :color="getStepColor(3, true)"
                  class="border-opacity-100 mx-2 flex-grow-1"
                  thickness="3"
                ></v-divider>

                <div
                  class="text-center position-relative"
                  style="z-index: 2; min-width: 100px"
                >
                  <v-avatar
                    :color="getStepColor(3)"
                    size="44"
                    class="mb-2 border elevation-1"
                  >
                    <v-icon icon="mdi-wrench" color="white" size="22"></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold text-no-wrap">
                    กำลังซ่อม
                  </div>
                </div>
                <v-divider
                  :color="getStepColor(4, true)"
                  class="border-opacity-100 mx-2 flex-grow-1"
                  thickness="3"
                ></v-divider>

                <div
                  class="text-center position-relative"
                  style="z-index: 2; min-width: 100px"
                >
                  <v-avatar
                    :color="getStepColor(4)"
                    size="44"
                    class="mb-2 border elevation-1"
                  >
                    <v-icon
                      icon="mdi-check-circle-outline"
                      color="white"
                      size="22"
                    ></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold text-no-wrap">
                    ซ่อมเสร็จ
                  </div>
                </div>
                <v-divider
                  :color="getStepColor(5, true)"
                  class="border-opacity-100 mx-2 flex-grow-1"
                  thickness="3"
                ></v-divider>

                <div
                  class="text-center position-relative"
                  style="z-index: 2; min-width: 100px"
                >
                  <v-avatar
                    :color="getStepColor(5)"
                    size="44"
                    class="mb-2 border elevation-1"
                  >
                    <v-icon
                      icon="mdi-handshake-outline"
                      color="white"
                      size="22"
                    ></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold text-no-wrap">
                    ส่งมอบ
                  </div>
                </div>
              </div>
            </div>

            <div
              class="mt-2 p-4 bg-grey-lighten-4 rounded-lg d-flex flex-column flex-sm-row align-center gap-3"
            >
              <span
                class="font-weight-bold text-grey-darken-3 text-no-wrap mb-2 mb-sm-0"
              >
                <v-icon icon="mdi-update" class="mr-1"></v-icon>
                อัปเดตสถานะล่าสุด:
              </span>
              <v-select
                v-model="formData.caseStatus"
                :items="statusOptions"
                variant="outlined"
                density="compact"
                bg-color="white"
                color="primary"
                hide-details
                class="w-100 flex-grow-1"
                style="max-width: 400px"
                @update:model-value="onStatusChange"
              ></v-select>
            </div>
          </div>

          <div class="bg-white rounded-lg pa-5 mb-4 section-block">
            <div class="d-flex align-items-center mb-4">
              <div class="section-number me-3">1</div>
              <h5 class="fw-bold m-0 text-dark">ข้อมูลลูกค้า (Customer)</h5>
            </div>
            <hr class="mb-4" />
            <div class="row g-3">
              <div class="col-12 col-md-4">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  ชื่อจริง <span class="text-red">*</span>
                </div>
                <v-text-field
                  v-model="formData.cusFirstName"
                  placeholder="ระบุชื่อจริง"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  :rules="[rules.required]"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-4">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  นามสกุล <span class="text-red">*</span>
                </div>
                <v-text-field
                  v-model="formData.cusLastName"
                  placeholder="ระบุนามสกุล"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  :rules="[rules.required]"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-4">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  เบอร์โทรศัพท์ <span class="text-red">*</span>
                </div>
                <v-text-field
                  v-model="formData.cusPhone"
                  placeholder="08xxxxxxxx"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  type="tel"
                  maxlength="10"
                  :rules="[rules.required, rules.phone]"
                  @input="filterPhone"
                ></v-text-field>
              </div>
              <div class="col-12">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  หน่วยงาน / สังกัด / บริษัท
                </div>
                <v-text-field
                  v-model="formData.caseInstitution"
                  placeholder="ระบุหน่วยงาน (ถ้ามี)"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  prepend-inner-icon="mdi-domain"
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
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  ประเภทอุปกรณ์ <span class="text-red">*</span>
                </div>
                <v-combobox
                  v-model="formData.caseType"
                  :items="typeOptions"
                  placeholder="เช่น โน้ตบุ๊ค, พีซี"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  :rules="[rules.required]"
                ></v-combobox>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  เลขครุภัณฑ์ (ถ้ามี)
                </div>
                <v-text-field
                  v-model="formData.caseDurableArticles"
                  placeholder="ระบุเลขครุภัณฑ์"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-4">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  ยี่ห้อ (Brand)
                </div>
                <v-text-field
                  v-model="formData.caseBrand"
                  placeholder="เช่น Dell, HP, Acer"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-4">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  รุ่น (Model)
                </div>
                <v-text-field
                  v-model="formData.caseModel"
                  placeholder="ระบุรุ่นอุปกรณ์"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                ></v-text-field>
              </div>
              <div class="col-12 col-md-4">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  Serial Number (S/N)
                </div>
                <v-text-field
                  v-model="formData.caseSN"
                  placeholder="ระบุ S/N"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                ></v-text-field>
              </div>
              <div class="col-12">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  อุปกรณ์ที่นำมาด้วย (Accessories)
                </div>
                <v-textarea
                  v-model="formData.caseEquipment"
                  placeholder="เช่น สายชาร์จ, กระเป๋า, เม้าส์ (ระบุอย่างละเอียด)"
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
              <div class="section-number me-3">3</div>
              <h5 class="fw-bold m-0 text-dark">
                อาการเสีย / รายละเอียดงาน (Symptom)
              </h5>
            </div>
            <hr class="mb-4" />
            <div class="row g-3">
              <div class="col-12">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  รายละเอียดอาการเสีย / สิ่งที่ต้องทำ
                  <span class="text-red">*</span>
                </div>
                <v-textarea
                  v-model="formData.brokenSymptom"
                  placeholder="ระบุอาการเสียอย่างละเอียด หรือโปรแกรมที่ต้องการให้ลง"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  rows="4"
                  auto-grow
                  :rules="[rules.required]"
                ></v-textarea>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg pa-5 mb-4 section-block">
            <div class="d-flex align-items-center mb-4">
              <div class="section-number me-3">4</div>
              <h5 class="fw-bold m-0 text-dark">กำหนดการและวันที่ (Dates)</h5>
            </div>
            <hr class="mb-4" />
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  วันที่รับเครื่อง
                </div>
                <v-text-field
                  id="date-pickup"
                  v-model="formData.datePickUp"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  readonly
                  placeholder="เลือกวันที่"
                  prepend-inner-icon="mdi-calendar-import"
                ></v-text-field>
              </div>

              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  วันนัดรับ (ประมาณการ)
                </div>
                <v-text-field
                  id="date-before-pickup"
                  v-model="formData.dateBeforePicUp"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  readonly
                  placeholder="เลือกวันที่"
                  prepend-inner-icon="mdi-calendar-clock"
                ></v-text-field>
              </div>

              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  วันที่ซ่อมเสร็จ
                </div>
                <v-text-field
                  id="date-complete"
                  v-model="formData.dateComplete"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  readonly
                  placeholder="--- ยังไม่เสร็จสิ้น ---"
                  prepend-inner-icon="mdi-calendar-check"
                  :disabled="isNew"
                ></v-text-field>
              </div>

              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  วันที่ส่งมอบคืนลูกค้า
                </div>
                <v-text-field
                  id="date-delivered"
                  v-model="formData.dateDelivered"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  readonly
                  placeholder="--- ยังไม่ส่งมอบ ---"
                  prepend-inner-icon="mdi-calendar-export"
                  :disabled="isNew"
                ></v-text-field>
              </div>
            </div>
          </div>
        </v-form>
      </div>
    </div>

    <div
      class="bg-white border-top py-3 px-4 px-md-6 d-flex align-items-center justify-content-end fixed-bottom-custom shadow-lg"
      style="z-index: 1040"
    >
      <span class="text-muted small me-auto d-none d-md-inline">
        <v-icon
          icon="mdi-information-outline"
          size="small"
          class="me-1"
        ></v-icon>
        กรุณาตรวจสอบข้อมูลก่อนบันทึก
      </span>

      <button
        class="btn btn-primary px-4 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm btn-save-custom"
        @click="saveForm"
        :disabled="isSaving"
        style="background-color: #161e54; border: none"
      >
        <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
        <v-icon v-else icon="mdi-content-save" class="me-1"></v-icon>
        {{ isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล" }}
      </button>
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
  name: "CaseRepairDetail",
  data() {
    return {
      isNew: false,
      loading: false,
      isSaving: false,

      statusOptions: [
        "รอรับเครื่อง",
        "รับเครื่องแล้ว",
        "กำลังซ่อม",
        "รอสินค้า",
        "ซ่อมเสร็จ",
        "ส่งมอบ",
      ],
      typeOptions: [
        "ซ่อมคอมพิวเตอร์",
        "ซ่อมโน็ตบุ๊ค",
        "ซ่อมปริ้นเตอร์",
        "UPS",
        "ซ่อมมือถือ/แท็บเล็ต",
        "ลงโปรแกรม/OS",
        "เปลี่ยนอะไหล่",
        "กู้ข้อมูล",
        "อื่นๆ",
      ],

      formData: {
        caseId: null,
        cusFirstName: "",
        cusLastName: "",
        cusPhone: "",
        caseInstitution: "", 
        brokenSymptom: "",
        caseType: null,
        caseBrand: "", 
        caseModel: "", 
        caseSN: "", 
        caseDurableArticles: "", 
        caseEquipment: "", 
        caseStatus: "รับเครื่องแล้ว",
        datePickUp: "",
        dateBeforePicUp: "",
        dateComplete: "",
        dateDelivered: "",
      },

      previousStatus: "",
      pickers: {},
      rules: {
        required: (v) => !!v || "กรุณากรอกข้อมูล",
        phone: (v) =>
          !v || /^0[0-9]{9}$/.test(v) || "เบอร์โทรต้องเป็นตัวเลข 10 หลัก",
      },
    };
  },

  async mounted() {
    const routeId = this.$route.params.id;

    if (routeId === "new" || !routeId) {
      this.isNew = true;
      this.formData.caseStatus = "รับเครื่องแล้ว";
      this.previousStatus = "รับเครื่องแล้ว";
      this.formData.datePickUp = this.getTodayThaiDate();
      this.$nextTick(() => this.initDatePickers());
    } else {
      this.isNew = false;
      this.formData.caseId = routeId;
      await this.fetchDetail(routeId);
    }
  },

  beforeUnmount() {
    Object.values(this.pickers).forEach((fp) => fp && fp.destroy());
  },

  methods: {
    async fetchDetail(id) {
      this.loading = true;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/get-case-detail/${id}`);
        if (res.data.message === "success") {
          const data = res.data.data;
          this.formData = {
            caseId: data.caseId,
            cusFirstName: data.cusFirstName,
            cusLastName: data.cusLastName,
            cusPhone: data.cusPhone,
            caseInstitution: data.caseInstitution, 
            brokenSymptom: data.brokenSymptom,
            caseType: data.caseType,
            caseBrand: data.caseBrand, 
            caseModel: data.caseModel, 
            caseSN: data.caseSN, 
            caseDurableArticles: data.caseDurableArticles, 
            caseEquipment: data.caseEquipment, 
            caseStatus: data.caseStatus,
            datePickUp: data.datePickUp,
            dateBeforePicUp: data.dateBeforePicUp,
            dateComplete: data.dateComplete,
            dateDelivered: data.dateDelivered,
          };
          this.previousStatus = data.caseStatus;
        }
      } catch (err) {
        console.error("Error fetching detail:", err);
        Swal.fire("Error", "ไม่สามารถโหลดข้อมูลได้", "error");
      } finally {
        this.loading = false;
        this.$nextTick(() => this.initDatePickers());
      }
    },

    async saveForm() {
      const { valid } = await this.$refs.repairForm.validate();
      if (!valid) {
        Swal.fire({
          icon: "warning",
          title: "ข้อมูลไม่ครบถ้วน",
          text: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ",
          confirmButtonColor: "#161E54",
        });
        return;
      }

      this.isSaving = true;
      try {
        const endpoint = this.isNew
          ? `${import.meta.env.VITE_API_URL}/create-case`
          : `${import.meta.env.VITE_API_URL}/update-case`;
        const payload = { ...this.formData };

        const res = await axios.post(endpoint, payload);

        if (res.data.message === "success") {
          await Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ!",
            timer: 1500,
            showConfirmButton: false,
          });

          if (this.isNew) {
            this.$router.replace({ name: "CaseRepair" });
          }
        }
      } catch (err) {
        console.error("Save error:", err);
        Swal.fire("Error", "เกิดข้อผิดพลาดในการบันทึก", "error");
      } finally {
        this.isSaving = false;
      }
    },

    async onStatusChange(newStatus) {
      if (newStatus === this.previousStatus) return;

      const result = await Swal.fire({
        title: "ยืนยันเปลี่ยนสถานะ?",
        html: `ต้องการเปลี่ยนจาก <b class="text-secondary">${this.previousStatus}</b> <br> เป็น <b class="text-primary">${newStatus}</b> ใช่หรือไม่?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#161E54",
        cancelButtonColor: "#d33",
        reverseButtons: false,
      });

      if (result.isConfirmed) {
        const today = this.getTodayThaiDate();

        if (newStatus === "ซ่อมเสร็จ" && !this.formData.dateComplete) {
          this.formData.dateComplete = today;
          this.updatePicker("dateComplete", today);
        }

        if (newStatus === "ส่งมอบ" && !this.formData.dateDelivered) {
          if (!this.formData.dateComplete) {
            this.formData.dateComplete = today;
            this.updatePicker("dateComplete", today);
          }
          this.formData.dateDelivered = today;
          this.updatePicker("dateDelivered", today);
        }

        this.previousStatus = newStatus;
      } else {
        this.$nextTick(() => {
          this.formData.caseStatus = this.previousStatus;
        });
      }
    },

    updatePicker(key, dateStr) {
      if (this.pickers[key]) {
        this.pickers[key].setDate(this.parseThaiDate(dateStr));
      }
    },

    getStatusColor(status) {
      switch (status) {
        case "ส่งมอบ":
          return "success";
        case "ซ่อมเสร็จ":
          return "teal";
        case "กำลังซ่อม":
          return "info";
        case "รอสินค้า":
          return "warning";
        case "รับเครื่องแล้ว":
          return "primary";
        case "รอรับเครื่อง":
          return "grey";
        default:
          return "grey";
      }
    },

    getStepColor(step, isDivider = false) {
      const status = this.formData.caseStatus;
      let currentStep = 1;

      if (status === "รับเครื่องแล้ว") currentStep = 2;
      else if (status === "กำลังซ่อม" || status === "รอสินค้า") currentStep = 3;
      else if (status === "ซ่อมเสร็จ") currentStep = 4;
      else if (status === "ส่งมอบ") currentStep = 5;

      const activeColor = "#161E54";
      const inactiveColor = "#E0E0E0";
      const successColor = "#107C41";

      if (isDivider) {
        return step < currentStep
          ? successColor
          : step === currentStep
          ? activeColor
          : inactiveColor;
      } else {
        if (step < currentStep) return successColor;
        if (step === currentStep) return activeColor;
        return inactiveColor;
      }
    },

    initDatePickers() {
      const config = {
        locale: Thai,
        dateFormat: "d-m-Y",
        disableMobile: true,
        allowInput: false,
        onReady: (d, s, i) => this.adjustYear(i),
        onMonthChange: (d, s, i) => this.adjustYear(i),
        onYearChange: (d, s, i) => this.adjustYear(i),
      };

      const keys = [
        "datePickUp",
        "dateBeforePicUp",
        "dateComplete",
        "dateDelivered",
      ];
      const ids = [
        "date-pickup",
        "date-before-pickup",
        "date-complete",
        "date-delivered",
      ];

      keys.forEach((key, index) => {
        const el = document.getElementById(ids[index]);
        if (el) {
          let defaultDate = null;
          if (this.formData[key]) {
            defaultDate = this.parseThaiDate(this.formData[key]);
          }
          this.pickers[key] = flatpickr(el, {
            ...config,
            defaultDate: defaultDate,
            onChange: (selectedDates) => {
              this.formData[key] =
                selectedDates.length > 0
                  ? this.formatToThaiDate(selectedDates[0])
                  : "";
              this.adjustYear(this.pickers[key]);
            },
          });
        }
      });
    },

    formatToThaiDate(date) {
      const d = String(date.getDate()).padStart(2, "0");
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const y = date.getFullYear() + 543;
      return `${d}-${m}-${y}`;
    },
    parseThaiDate(dateStr) {
      if (!dateStr) return null;
      const [d, m, y] = dateStr.split("-");
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
    filterPhone(event) {
      this.formData.cusPhone = event.target.value.replace(/[^0-9]/g, "");
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
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/print-case/${this.formData.caseId}`,
          {
            responseType: "blob", // สำคัญมาก: บอกว่าจะเอาไฟล์
            headers: { Accept: "application/pdf" },
          }
        );

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
        link.setAttribute("download", `Repair-${this.formData.caseId}.pdf`);
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
  },
};
</script>

<style scoped>
.bg-light-gray {
  background-color: #f3f4f6;
  min-height: 100vh;
}
.page-container {
  width: 100%;
  min-height: 100vh;
  transition: all 0.3s ease;
  background-color: #f3f4f6;
}

@media (min-width: 992px) {
  .page-container {
    padding-left: 280px !important;
  }
  .fixed-bottom-custom {
    left: 280px !important;
    width: calc(100% - 280px) !important;
    position: fixed;
    bottom: 0;
  }
}
@media (max-width: 991.98px) {
  .page-container {
    padding-left: 0 !important;
    padding-top: 60px !important;
  }
  .fixed-bottom-custom {
    left: 0 !important;
    width: 100% !important;
    position: fixed;
    bottom: 0;
  }
  
  /* ✅ เพิ่มกฎ CSS นี้เพื่อดัน Header ลงมา */
  .sticky-header {
    top: 60px !important;
  }
}

.section-block {
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.section-number {
  width: 32px;
  height: 32px;
  background-color: #161e54;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}
.btn-save-custom {
  transition: transform 0.2s;
}
.btn-save-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 30, 84, 0.3) !important;
}
</style>