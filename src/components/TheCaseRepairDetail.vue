<template>
  <div class="page-container d-flex flex-column">
    <div
      class="px-4 py-3 px-md-6 py-md-4 border-bottom d-flex flex-wrap align-center justify-space-between bg-white flex-shrink-0 sticky-top shadow-sm sticky-header"
      style="z-index: 900; min-height: 80px; top: 0"
    >
      <div class="mb-2 mb-md-0">
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

      <div
        class="d-flex flex-wrap align-center justify-end mt-2 mt-md-0 w-100 w-md-auto"
        style="gap: 8px"
      >
        <v-btn
          v-if="formData.refSentRepairId"
          :color="isSentRepairReturned ? 'success' : 'warning'"
          variant="flat"
          prepend-icon="mdi-link-variant"
          class="text-capitalize font-weight-bold flex-grow-1 flex-md-grow-0"
          rounded="pill"
          :to="{
            name: 'TheCaseSentRepairDetail',
            params: { id: formData.refSentRepairId },
          }"
        >
          ดูใบงานส่งซ่อม ({{ formData.refSentRepairId }})
        </v-btn>

        <v-btn
          v-else-if="!isNew"
          variant="flat"
          color="info"
          prepend-icon="mdi-truck-delivery-outline"
          class="text-capitalize font-weight-bold flex-grow-1 flex-md-grow-0"
          rounded="pill"
          @click="sendToExternalRepair"
        >
          ส่งซ่อมภายนอก
        </v-btn>

        <v-btn
          v-if="!isNew"
          variant="flat"
          color="#4D2FB2"
          prepend-icon="mdi-printer"
          class="text-capitalize font-weight-bold flex-grow-1 flex-md-grow-0"
          rounded="pill"
          @click="printPDF"
        >
          พิมพ์ใบรับซ่อม
        </v-btn>

        <v-btn
          variant="outlined"
          color="grey-darken-1"
          prepend-icon="mdi-arrow-left"
          class="text-capitalize font-weight-bold flex-grow-1 flex-md-grow-0"
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
        <div class="spinner-border text-theme" role="status"></div>
      </div>

      <div v-else class="mx-auto" style="max-width: 100%">
        <v-form ref="repairForm">
          <div
            class="bg-white rounded-lg pa-5 mb-4 section-block"
            v-if="!isNew"
          >
            <h5 class="fw-bold mb-4 text-dark">สถานะงานซ่อม (Workflow)</h5>

            <div class="w-100 overflow-x-auto py-2 mb-4">
              <div
                class="position-relative mx-auto mt-2 mb-2"
                style="min-width: 1050px; height: 180px"
              >
                <!-- SVG Connector Lines -->
                <svg
                  class="position-absolute w-100 h-100"
                  style="z-index: 0; top: 0; left: 0"
                  stroke-width="3"
                  fill="none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <!-- 1 -> 2 (รับเครื่องแล้ว -> รออะไหล่) Top Branch -->
                  <path
                    d="M 10 50 C 14 50, 14 25, 20 25 L 30 25"
                    :stroke="getLineColor('รออะไหล่')"
                    vector-effect="non-scaling-stroke"
                  />

                  <!-- 2 -> 3 (รออะไหล่ -> กำลังซ่อม) -->
                  <line
                    x1="30"
                    y1="25"
                    x2="50"
                    y2="25"
                    :stroke="getLineColor('กำลังซ่อม')"
                    vector-effect="non-scaling-stroke"
                  />

                  <!-- 3 -> 4 (กำลังซ่อม -> ซ่อมเสร็จ) -->
                  <path
                    d="M 50 25 L 61.66 25 C 66 25, 66 50, 70 50"
                    :stroke="getLineColor('ซ่อมเสร็จ', 'internal')"
                    vector-effect="non-scaling-stroke"
                  />

                  <!-- 1 -> S1 (รับเครื่องแล้ว -> ส่งซ่อมอยู่) Bottom Branch -->
                  <path
                    d="M 10 50 C 14 50, 14 75, 20 75 L 30 75"
                    :stroke="getLineColor('ส่งซ่อมอยู่')"
                    vector-effect="non-scaling-stroke"
                  />

                  <!-- S1 -> 4 (ส่งซ่อมอยู่ -> ซ่อมเสร็จ) -->
                  <path
                    d="M 30 75 L 61.66 75 C 66 75, 66 50, 70 50"
                    :stroke="getLineColor('ซ่อมเสร็จ', 'external')"
                    vector-effect="non-scaling-stroke"
                  />

                  <!-- 4 -> 5 (ซ่อมเสร็จ -> ส่งมอบ) -->
                  <line
                    x1="70"
                    y1="50"
                    x2="90"
                    y2="50"
                    :stroke="getLineColor('ส่งมอบ')"
                    vector-effect="non-scaling-stroke"
                  />
                </svg>

                <div
                  style="
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    grid-template-rows: 1fr 1fr;
                    height: 100%;
                    position: relative;
                    z-index: 2;
                  "
                >
                  <!-- 1. รับเครื่องแล้ว (Center) -->
                  <div
                    style="grid-column: 1; grid-row: 1 / 3"
                    class="d-flex flex-column align-center justify-center"
                  >
                    <v-avatar
                      :color="getStepColor('รับเครื่องแล้ว')"
                      size="44"
                      class="mb-2 border elevation-1"
                    >
                      <v-icon
                        icon="mdi-inbox-arrow-down"
                        color="white"
                        size="22"
                      ></v-icon>
                    </v-avatar>
                    <div
                      class="text-caption font-weight-bold text-no-wrap bg-white px-2 py-1 rounded"
                    >
                      รับเครื่องแล้ว
                    </div>
                  </div>

                  <!-- 3. รออะไหล่ (Top) -->
                  <div
                    style="grid-column: 2; grid-row: 1"
                    class="d-flex flex-column align-center justify-center"
                  >
                    <v-avatar
                      :color="getStepColor('รออะไหล่')"
                      size="44"
                      class="mb-2 border elevation-1"
                    >
                      <v-icon
                        icon="mdi-package-variant-closed"
                        color="white"
                        size="22"
                      ></v-icon>
                    </v-avatar>
                    <div
                      class="text-caption font-weight-bold text-no-wrap bg-white px-2 py-1 rounded"
                    >
                      รออะไหล่
                    </div>
                  </div>

                  <!-- S1. ส่งซ่อมอยู่ (Bottom) -->
                  <div
                    style="grid-column: 2; grid-row: 2"
                    class="d-flex flex-column align-center justify-center"
                  >
                    <v-avatar
                      :color="getStepColor('ส่งซ่อมอยู่')"
                      size="44"
                      class="mb-2 border elevation-1"
                    >
                      <v-icon
                        icon="mdi-truck-fast-outline"
                        color="white"
                        size="22"
                      ></v-icon>
                    </v-avatar>
                    <div
                      class="text-caption font-weight-bold text-no-wrap bg-white px-2 py-1 rounded"
                    >
                      ส่งซ่อมอยู่
                    </div>
                  </div>

                  <!-- 4. กำลังซ่อม (Top) -->
                  <div
                    style="grid-column: 3; grid-row: 1"
                    class="d-flex flex-column align-center justify-center"
                  >
                    <v-avatar
                      :color="getStepColor('กำลังซ่อม')"
                      size="44"
                      class="mb-2 border elevation-1"
                    >
                      <v-icon
                        icon="mdi-wrench"
                        color="white"
                        size="22"
                      ></v-icon>
                    </v-avatar>
                    <div
                      class="text-caption font-weight-bold text-no-wrap bg-white px-2 py-1 rounded"
                    >
                      กำลังซ่อม
                    </div>
                  </div>

                  <!-- S2. ส่งซ่อมเสร็จ (Removed) -->

                  <!-- 5. ซ่อมเสร็จ (Center) -->
                  <div
                    style="grid-column: 4; grid-row: 1 / 3"
                    class="d-flex flex-column align-center justify-center"
                  >
                    <v-avatar
                      :color="getStepColor('ซ่อมเสร็จ')"
                      size="44"
                      class="mb-2 border elevation-1"
                    >
                      <v-icon
                        icon="mdi-check-circle-outline"
                        color="white"
                        size="22"
                      ></v-icon>
                    </v-avatar>
                    <div
                      class="text-caption font-weight-bold text-no-wrap bg-white px-2 py-1 rounded"
                    >
                      ซ่อมเสร็จ
                    </div>
                  </div>

                  <!-- 6. ส่งมอบ (Center) -->
                  <div
                    style="grid-column: 5; grid-row: 1 / 3"
                    class="d-flex flex-column align-center justify-center"
                  >
                    <v-avatar
                      :color="getStepColor('ส่งมอบ')"
                      size="44"
                      class="mb-2 border elevation-1"
                    >
                      <v-icon
                        icon="mdi-handshake-outline"
                        color="white"
                        size="22"
                      ></v-icon>
                    </v-avatar>
                    <div
                      class="text-caption font-weight-bold text-no-wrap bg-white px-2 py-1 rounded"
                    >
                      ส่งมอบ
                    </div>
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
                color="#4D2FB2"
                hide-details
                class="w-100 flex-grow-1"
                style="max-width: 400px"
                @update:model-value="onStatusChange"
              ></v-select>
              <span
                v-if="statusChanged"
                class="text-red font-weight-bold text-no-wrap d-flex align-center"
              >
                <v-icon
                  icon="mdi-alert-circle"
                  size="small"
                  class="mr-1"
                ></v-icon>
                กรุณาบันทึก
              </span>
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
                <v-select
                  v-model="formData.caseType"
                  :items="typeOptions"
                  placeholder="เช่น โน้ตบุ๊ค, พีซี"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  :rules="[rules.required]"
                ></v-select>
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
                  clearable
                  @click:clear="pickers['datePickUp']?.clear()"
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
                  clearable
                  @click:clear="pickers['dateBeforePicUp']?.clear()"
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
                  clearable
                  @click:clear="pickers['dateComplete']?.clear()"
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
                  clearable
                  @click:clear="pickers['dateDelivered']?.clear()"
                ></v-text-field>
              </div>
            </div>
          </div>
        </v-form>
      </div>
    </div>

    <div style="position: fixed; left: -9999px; top: 0">
      <RepairReceipt :data="formData" />
    </div>

    <div
      class="bg-white border-top py-3 px-4 px-md-6 d-flex align-items-center justify-content-end fixed-bottom-custom shadow-lg"
      style="z-index: 1040"
    >
      <span class="text-muted small me-auto d-none d-md-inline">
        <template v-if="isDirty">
          <v-icon
            icon="mdi-alert-circle"
            size="small"
            class="me-2 text-danger"
          ></v-icon>
          <span class="text-danger font-weight-bold">
            มีการแก้ไขข้อมูล อย่าลืมบันทึก!
          </span>
        </template>
        <template v-else>
          <v-icon
            icon="mdi-information-outline"
            size="small"
            class="me-1"
          ></v-icon>
          กรุณาตรวจสอบข้อมูลก่อนบันทึก
        </template>
      </span>

      <button
        class="btn btn-primary px-4 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm btn-save-custom"
        @click="saveForm"
        :disabled="isSaving"
        style="background-color: #4d2fb2; border: none"
      >
        <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
        <v-icon v-else icon="mdi-content-save" class="me-1"></v-icon>
        {{ isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล" }}
      </button>
    </div>
  </div>
</template>

<script>
import apiClient from "@/services/authService";
import Swal from "sweetalert2";
import { swalTheme } from "@/utils/swalTheme";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th.js";
import html2pdf from "html2pdf.js";
import RepairReceipt from "./RepairReceipt.vue";

export default {
  name: "CaseRepairDetail",
  components: {
    RepairReceipt,
  },
  data() {
    return {
      isNew: false,
      loading: false,
      isSaving: false,
      statusChanged: false,
      isDirty: false,
      originalFormData: null, // เก็บค่าเริ่มต้น

      statusOptions: [
        "รับเครื่องแล้ว",
        "ส่งซ่อมอยู่",
        "รออะไหล่",
        "กำลังซ่อม",
        "ซ่อมเสร็จ",
        "ส่งมอบ",
        "ยกเลิก",
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
        refSentRepairId: null,
      },
      isSentRepairReturned: false,
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
      this.$nextTick(() => {
        this.initDatePickers();
        setTimeout(() => {
          this.originalFormData = JSON.stringify(this.formData);
        }, 500);
      });
    } else {
      this.isNew = false;
      this.formData.caseId = routeId;
      await this.fetchDetail(routeId);
    }
  },

  watch: {
    '$route.params.id': {
      async handler(newId) {
        if (!newId) return;
        // Destroy existing date pickers
        Object.values(this.pickers).forEach((fp) => fp && fp.destroy());
        this.pickers = {};

        if (newId === 'new') {
          this.isNew = true;
          this.formData.caseId = null;
          this.formData.caseStatus = 'รับเครื่องแล้ว';
          this.previousStatus = 'รับเครื่องแล้ว';
          this.formData.datePickUp = this.getTodayThaiDate();
          this.$nextTick(() => {
            this.initDatePickers();
            setTimeout(() => {
              this.originalFormData = JSON.stringify(this.formData);
            }, 500);
          });
        } else {
          this.isNew = false;
          this.formData.caseId = newId;
          await this.fetchDetail(newId);
        }
      },
    },
    formData: {
      handler(newVal) {
        if (this.loading) return;
        if (this.originalFormData) {
          const currentData = JSON.stringify(newVal);
          this.isDirty = currentData !== this.originalFormData;
        }
      },
      deep: true,
    },
  },

  beforeUnmount() {
    Object.values(this.pickers).forEach((fp) => fp && fp.destroy());
  },

  beforeRouteLeave(to, from, next) {
    if (this.isDirty) {
      Swal.fire({
        title: "มีการแก้ไขข้อมูลค้างอยู่",
        text: "คุณต้องการออกจากหน้านี้โดยไม่บันทึกหรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ออกจากหน้านี้",
        cancelButtonText: "ยกเลิก",
        ...swalTheme.danger,
      }).then((result) => {
        if (result.isConfirmed) {
          next();
        } else {
          next(false);
        }
      });
    } else {
      next();
    }
  },

  methods: {
    sendToExternalRepair() {
      const queryData = {
        refCaseId: this.formData.caseId,
        cusName: `${this.formData.cusFirstName} ${this.formData.cusLastName}`,
        type: this.formData.caseType,
        brand: this.formData.caseBrand,
        model: this.formData.caseModel,
        sn: this.formData.caseSN,
        symptom: this.formData.brokenSymptom,
        equipment: this.formData.caseEquipment,
      };

      this.$router.push({
        name: "TheCaseSentRepairDetail",
        params: { id: "new" },
        query: queryData,
      });
    },

    async checkSentRepairStatus(id) {
      try {
        const res = await apiClient.get("/get-sent-repair-detail/" + id);
        if (res.data.message === "success" && res.data.data) {
          this.isSentRepairReturned = !!res.data.data.dateOfReceived;
        }
      } catch (err) {
        console.error("Failed to check sent repair status", err);
      }
    },

    async fetchDetail(id) {
      this.loading = true;
      try {
        const res = await apiClient.get(`/get-case-detail/${id}`);
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
          this.formData.refSentRepairId = data.refSentRepairId || null;
          this.previousStatus = data.caseStatus;

          if (this.formData.refSentRepairId) {
            this.checkSentRepairStatus(this.formData.refSentRepairId);
          }
        }
      } catch (err) {
        console.error("Error fetching detail:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "ไม่สามารถโหลดข้อมูลได้",
          ...swalTheme.danger,
        });
      } finally {
        this.loading = false;
        this.isDirty = false;
        this.$nextTick(() => {
          this.initDatePickers();
          setTimeout(() => {
            this.originalFormData = JSON.stringify(this.formData);
            this.isDirty = false;
          }, 500);
        });
      }
    },

    async saveForm() {
      const { valid } = await this.$refs.repairForm.validate();
      if (!valid) {
        Swal.fire({
          icon: "warning",
          title: "ข้อมูลไม่ครบถ้วน",
          text: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ",
          ...swalTheme.confirm,
        });
        return;
      }

      this.isSaving = true;
      try {
        const endpoint = this.isNew ? "/create-case" : "/update-case";
        const payload = { ...this.formData };

        const res = await apiClient.post(endpoint, payload);

        if (res.data.message === "success") {
          this.statusChanged = false;
          this.originalFormData = JSON.stringify(this.formData);
          this.isDirty = false;

          await Swal.fire({
            icon: "success",
            title: "บันทึกสำเร็จ!",
            timer: 1500,
            showConfirmButton: false,
          });

          if (this.isNew && res.data.caseId) {
            this.$router.replace({ name: 'TheCaseRepairDetail', params: { id: res.data.caseId } });
          }
        }
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

    async onStatusChange(newStatus) {
      if (newStatus === this.previousStatus) return;

      const result = await Swal.fire({
        title: "ยืนยันเปลี่ยนสถานะ?",
        html: `ต้องการเปลี่ยนจาก <b class="text-secondary">${this.previousStatus}</b> <br> เป็น <b class="text-theme">${newStatus}</b> ใช่หรือไม่?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        cancelButtonColor: "#d33",
        reverseButtons: false,
        ...swalTheme.confirm,
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
        this.statusChanged = true;
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
        // เพิ่มสีให้กับสถานะ "รออะไหล่"
        case "รออะไหล่":
        case "รอสินค้า":
          return "warning";
        case "รับเครื่องแล้ว":
          return "primary";
        case "ยกเลิก":
          return "error";
        default:
          return "grey";
      }
    },

    getStepColor(stepName) {
      const status = this.formData.caseStatus;
      if (status === "ยกเลิก") return "#E0E0E0";

      const levels = {
        รับเครื่องแล้ว: 2,
        รออะไหล่: 3.1,
        กำลังซ่อม: 4.1,
        ส่งซ่อมอยู่: 3.2,
        ส่งซ่อมเสร็จ: 4.2,
        ซ่อมเสร็จ: 5,
        ส่งมอบ: 6,
      };

      const currentLvl = levels[status] || 0;
      const targetLvl = levels[stepName];

      const activeColor = "#4D2FB2";
      const successColor = "#107C41";
      const inactiveColor = "#E0E0E0";

      if (targetLvl === currentLvl) return activeColor;

      if (currentLvl >= 5 && targetLvl < 5) {
        const isExternal =
          !!this.formData.refSentRepairId ||
          this.previousStatus === "ส่งซ่อมเสร็จ" ||
          this.previousStatus === "ส่งซ่อมอยู่";
        if (isExternal) {
          if (targetLvl === 3.2 || targetLvl === 4.2 || targetLvl < 3)
            return successColor;
          return inactiveColor;
        } else {
          if (targetLvl === 3.1 || targetLvl === 4.1 || targetLvl < 3)
            return successColor;
          return inactiveColor;
        }
      } else if (currentLvl > targetLvl) {
        if (targetLvl < 3) return successColor;
        
        const currentBranch = Math.round((currentLvl % 1) * 10);
        const targetBranch = Math.round((targetLvl % 1) * 10);
        
        if (currentBranch === targetBranch) {
          return successColor;
        }
        return inactiveColor;
      }
      return inactiveColor;
    },

    getLineColor(targetStepName, mergePoint = null) {
      const stepColor = this.getStepColor(targetStepName);
      if (stepColor === "#E0E0E0") return "#E0E0E0";

      if (mergePoint === "internal") {
        const isExternal =
          !!this.formData.refSentRepairId ||
          this.previousStatus === "ส่งซ่อมเสร็จ" ||
          this.previousStatus === "ส่งซ่อมอยู่";
        if (
          isExternal &&
          (this.formData.caseStatus === "ซ่อมเสร็จ" ||
            this.formData.caseStatus === "ส่งมอบ")
        )
          return "#E0E0E0";
      }
      if (mergePoint === "external") {
        const isExternal =
          !!this.formData.refSentRepairId ||
          this.previousStatus === "ส่งซ่อมเสร็จ" ||
          this.previousStatus === "ส่งซ่อมอยู่";
        if (
          !isExternal &&
          (this.formData.caseStatus === "ซ่อมเสร็จ" ||
            this.formData.caseStatus === "ส่งมอบ")
        )
          return "#E0E0E0";
      }

      return stepColor === "#4D2FB2" ? "#107C41" : stepColor;
    },

    initDatePickers() {
      const config = {
        locale: Thai,
        dateFormat: "d-m-Y",
        disableMobile: true,
        allowInput: false,
        formatDate: (date) => {
          const d = String(date.getDate()).padStart(2, "0");
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const y = date.getFullYear() + 543;
          return `${d}-${m}-${y}`;
        },
        parseDate: (datestr) => {
          if (!datestr) return null;
          const parts = datestr.split(/[-/]/);
          if (parts.length === 3) {
            let year = parseInt(parts[2], 10);
            if (year > 2400) year -= 543;
            return new Date(year, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
          }
          return null;
        },
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
          const loader = Swal.getPopup()?.querySelector(".swal2-loader");
          if (loader) {
            loader.style.borderColor = "#4D2FB2";
            loader.style.borderTopColor = "#4D2FB2";
          }
        },
      });

      try {
        const element = document.getElementById("receipt-content");
        if (!element) throw new Error("ไม่พบแบบฟอร์มใบงาน");

        const opt = {
          margin: 0,
          filename: `Repair-${this.formData.caseId}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          pagebreak: { mode: ["css"] },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        await html2pdf().set(opt).from(element).save();

        Swal.close();
      } catch (error) {
        console.error("Print Error:", error);
        Swal.fire({
          icon: "error",
          title: "ออกใบรับซ่อมไม่สำเร็จ",
          text: error.message,
          ...swalTheme.danger,
        });
      }
    },
  },
};
</script>

<style scoped>
/* สไตล์ยังคงเหมือนเดิม */
.bg-light-gray {
  background-color: #dee2e6 !important;
  min-height: 100vh;
}
.page-container {
  width: 100%;
  min-height: 100vh;
  transition: all 0.3s ease;
  background-color: var(--background);
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
  background-color: var(--theme-primary);
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
  box-shadow: 0 4px 12px rgba(77, 47, 178, 0.3) !important;
}
</style>