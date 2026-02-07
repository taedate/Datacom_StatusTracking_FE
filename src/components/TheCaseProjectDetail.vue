<template>
  <div class="page-container d-flex flex-column">
    <div
      class="px-4 py-3 px-md-6 py-md-4 border-bottom d-flex flex-wrap align-center justify-space-between bg-white flex-shrink-0 sticky-top shadow-sm sticky-header"
      style="z-index: 900; min-height: 80px; top: 0"
    >
      <div>
        <div class="d-flex align-center gap-2 mb-1">
          <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-0">
            {{ isNew ? "สร้างงานติดตั้งใหม่" : `Project ID: ${formData.pId}` }}
          </h2>
          <v-chip
            v-if="!isNew"
            :color="getStatusColor(formData.pStatus)"
            class="font-weight-bold text-white ms-2"
            size="small"
            variant="flat"
          >
            {{ formData.pStatus }}
          </v-chip>
        </div>
        <div class="text-body-2 text-grey">
          {{ isNew ? "กรอกรายละเอียดเพื่อเปิดงานติดตั้ง" : "แก้ไขรายละเอียดและอัปเดตสถานะงาน" }}
        </div>
      </div>

      <div class="d-flex align-center mt-3 mt-md-0" style="gap: 12px">
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
        <v-form ref="projectForm">

          <div class="bg-white rounded-lg pa-5 mb-4 section-block" v-if="!isNew">
            <h5 class="fw-bold mb-4 text-dark">สถานะการดำเนินงาน (Timeline)</h5>
            
            <div class="w-100 overflow-x-auto py-2 mb-4">
              <div class="d-flex align-center px-2" style="min-width: 600px;">
                <div class="text-center position-relative" style="z-index: 2; min-width: 100px;">
                  <v-avatar :color="getStepColor(1)" size="44" class="mb-2 border elevation-1">
                    <v-icon icon="mdi-clock-start" color="white" size="22"></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold text-no-wrap">รอดำเนินการ</div>
                </div>
                <v-divider :color="getStepColor(2, true)" class="border-opacity-100 mx-2 flex-grow-1" thickness="3"></v-divider>

                <div class="text-center position-relative" style="z-index: 2; min-width: 100px;">
                  <v-avatar :color="getStepColor(2)" size="44" class="mb-2 border elevation-1">
                    <v-icon icon="mdi-tools" color="white" size="22"></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold text-no-wrap">กำลังดำเนินการ</div>
                </div>
                <v-divider :color="getStepColor(3, true)" class="border-opacity-100 mx-2 flex-grow-1" thickness="3"></v-divider>

                <div class="text-center position-relative" style="z-index: 2; min-width: 100px;">
                  <v-avatar :color="getStepColor(3)" size="44" class="mb-2 border elevation-1">
                    <v-icon icon="mdi-check-decagram" color="white" size="22"></v-icon>
                  </v-avatar>
                  <div class="text-caption font-weight-bold text-no-wrap">เสร็จสิ้น</div>
                </div>
              </div>
            </div>

            <div class="mt-2 p-4 bg-grey-lighten-4 rounded-lg d-flex flex-column flex-sm-row align-center gap-3">
               <span class="font-weight-bold text-grey-darken-3 text-no-wrap mb-2 mb-sm-0">
                 <v-icon icon="mdi-update" class="mr-1"></v-icon> อัปเดตสถานะ:
               </span>
               <v-select
                  v-model="formData.pStatus"
                  :items="statusOptions"
                  variant="outlined"
                  density="compact"
                  bg-color="white"
                  color="primary"
                  hide-details
                  class="w-100 flex-grow-1"
                  style="max-width: 400px;"
                  @update:model-value="onStatusChange"
               ></v-select>
            </div>
          </div>

          <div class="bg-white rounded-lg pa-5 mb-4 section-block">
            <div class="d-flex align-items-center mb-4">
              <div class="section-number me-3">1</div>
              <h5 class="fw-bold m-0 text-dark">รายละเอียดงาน (Information)</h5>
            </div>
            <hr class="mb-4" />
            <div class="row g-3">
              <div class="col-12">
                <div class="text-subtitle-1 font-weight-bold mb-1">สถานที่ติดตั้ง <span class="text-red">*</span></div>
                <v-textarea
                  v-model="formData.pAddress"
                  placeholder="ระบุที่อยู่ หรือ สถานที่หน้างาน"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  rows="2"
                  auto-grow
                  :rules="[rules.required]"
                ></v-textarea>
              </div>

              <div class="col-12">
                <div class="text-subtitle-1 font-weight-bold mb-1">รายละเอียดงาน <span class="text-red">*</span></div>
                <v-textarea
                  v-model="formData.pDetail"
                  placeholder="รายละเอียดสิ่งที่ต้องติดตั้ง หรือ Scope งาน"
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
              <div class="section-number me-3">2</div>
              <h5 class="fw-bold m-0 text-dark">ข้อมูลเพิ่มเติม (Additional)</h5>
            </div>
            <hr class="mb-4" />
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">วันที่เริ่มงาน</div>
                <v-text-field
                  id="date-create"
                  v-model="formData.dateCreate"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  readonly
                  placeholder="--- รอเริ่มงาน ---"
                  prepend-inner-icon="mdi-calendar-start"
                ></v-text-field>
              </div>

              <div class="col-12 col-md-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">วันที่เสร็จสิ้น</div>
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
              
              <div class="col-12 mt-4">
                 <div class="d-flex align-center justify-space-between mb-3">
                    <div class="text-subtitle-1 font-weight-bold">
                        หลักฐานการติดตั้ง 
                        <span v-if="existingImages.length > 0" class="text-success text-caption ms-1">
                            (มีแล้ว {{ existingImages.length }} รูป)
                        </span>
                    </div>
                    <v-btn 
                        v-if="!isNew"
                        size="small" 
                        color="primary" 
                        variant="tonal"
                        prepend-icon="mdi-camera-plus"
                        @click="uploadDialog = true"
                    >
                        เพิ่มรูปภาพ
                    </v-btn>
                 </div>

                 <div v-if="existingImages.length > 0" class="row g-2 mb-3">
                    <div class="col-6 col-sm-4 col-md-3" v-for="(img, index) in existingImages" :key="'server-'+index">
                        <v-card variant="outlined" class="pa-1 position-relative h-100">
                             <v-img 
                                :src="getImageUrl(img)" 
                                aspect-ratio="1" 
                                cover 
                                class="bg-grey-lighten-4 rounded cursor-pointer"
                                @click="openImage(getImageUrl(img))"
                             >
                                <template v-slot:placeholder>
                                    <div class="d-flex align-center justify-center fill-height">
                                        <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
                                    </div>
                                </template>
                             </v-img>
                             <div class="text-caption text-center mt-1 text-truncate text-grey">
                                รูปที่ {{ index + 1 }}
                             </div>
                        </v-card>
                    </div>
                 </div>
                 <div v-else class="text-center py-4 bg-grey-lighten-5 rounded border border-dashed text-grey mb-3">
                    <v-icon icon="mdi-image-off-outline" size="large" class="mb-2"></v-icon>
                    <div>ยังไม่มีรูปภาพในระบบ</div>
                 </div>

                 <div v-if="filesToUpload.length > 0" class="pa-3 bg-blue-lighten-5 rounded-lg border border-blue mt-3">
                    <div class="d-flex align-center mb-2">
                        <v-icon icon="mdi-cloud-upload" color="primary" class="me-2"></v-icon>
                        <span class="font-weight-bold text-primary">รอการบันทึก ({{ filesToUpload.length }} ไฟล์ใหม่)</span>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        <v-chip 
                            v-for="(file, i) in filesToUpload" 
                            :key="'new-'+i" 
                            closable 
                            color="blue" 
                            variant="flat"
                            class="text-white"
                            @click:close="removePendingFile(i)"
                        >
                            {{ file.name }}
                        </v-chip>
                    </div>
                    <div class="text-caption text-blue-grey mt-2">
                        * กดปุ่ม "บันทึกข้อมูล" ด้านล่างเพื่อยืนยันการอัปโหลด
                    </div>
                 </div>

              </div>

            </div>
          </div>
        </v-form>
      </div>
    </div>

    <div class="bg-white border-top py-3 px-4 px-md-6 d-flex align-items-center justify-content-end fixed-bottom-custom shadow-lg" style="z-index: 1040">
      <span class="text-muted small me-auto d-none d-md-inline">
        <v-icon icon="mdi-information-outline" size="small" class="me-1"></v-icon>
        กรุณาตรวจสอบข้อมูลก่อนบันทึก
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

    <v-dialog v-model="uploadDialog" persistent max-width="600px">
      <div class="bg-white rounded-lg pa-5">
        <div class="d-flex align-center mb-4">
          <v-avatar color="green-lighten-5" class="me-3">
            <v-icon icon="mdi-camera-burst" color="green-darken-1"></v-icon>
          </v-avatar>
          <div>
            <h5 class="fw-bold m-0 text-dark">อัปโหลดรูปภาพ</h5>
            <div class="text-caption text-grey">เลือกไฟล์เพิ่มได้เรื่อยๆ ก่อนกดปุ่มยืนยัน</div>
          </div>
        </div>

        <v-file-input
          v-model="fileInputBuffer"
          label="คลิกเพื่อเลือกรูปภาพ (เพิ่มได้)"
          placeholder="เลือกไฟล์"
          variant="outlined"
          prepend-inner-icon="mdi-camera-plus"
          accept="image/*"
          multiple
          hide-details
          class="mb-4"
          @update:model-value="addToTempFiles"
        ></v-file-input>

        <div v-if="tempFiles.length > 0" class="border rounded pa-3 mb-2 bg-grey-lighten-5">
            <div class="d-flex align-center justify-space-between mb-2">
                 <span class="text-body-2 font-weight-bold text-grey-darken-2">
                    <v-icon icon="mdi-image-multiple" size="small" class="me-1"></v-icon>
                    รายการที่เลือกไว้ ({{ tempFiles.length }} รูป)
                 </span>
                 <v-btn size="x-small" variant="text" color="error" @click="tempFiles = []">
                    ล้างทั้งหมด
                 </v-btn>
            </div>

            <div class="row g-2" style="max-height: 250px; overflow-y: auto;">
                <div class="col-4 col-sm-3 position-relative" v-for="(file, index) in tempFiles" :key="index">
                    <v-img 
                        :src="createPreview(file)" 
                        aspect-ratio="1" 
                        cover 
                        class="rounded border bg-white"
                    ></v-img>
                    <v-btn
                        icon="mdi-close"
                        size="x-small"
                        color="error"
                        variant="flat"
                        class="position-absolute elevation-2"
                        style="top: 4px; right: 4px; z-index: 10; width: 20px; height: 20px;"
                        @click="removeFromTemp(index)"
                    ></v-btn>
                </div>
            </div>
        </div>
        <div v-else class="text-center py-5 border border-dashed rounded text-grey-lighten-1 mb-2">
            <v-icon icon="mdi-image-plus" size="large" class="mb-2"></v-icon>
            <div>ยังไม่มีรูปที่เลือก</div>
        </div>


        <div class="d-flex justify-end gap-2 mt-4 pt-3 border-top">
          <v-btn variant="text" color="grey" @click="cancelUploadDialog">
            ยกเลิก
          </v-btn>
          <v-btn 
            color="#161E54" 
            class="text-white" 
            :disabled="tempFiles.length === 0"
            @click="confirmUploadFiles"
          >
            ยืนยัน {{ tempFiles.length }} รูป
          </v-btn>
        </div>
      </div>
    </v-dialog>

  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th.js";

export default {
  name: "TheCaseProjectDetail",
  data() {
    return {
      isNew: false,
      loading: false,
      isSaving: false,
      
      // Dialog & Upload controls
      uploadDialog: false,
      fileInputBuffer: [],
      tempFiles: [],       
      filesToUpload: [],   
      
      statusOptions: ["รอดำเนินการ", "กำลังดำเนินการ", "เสร็จสิ้น"],

      formData: {
        pId: null,
        pAddress: "",
        pDetail: "",
        pStatus: "รอดำเนินการ",
        dateCreate: "",
        dateComplete: "",
        pImage: null,
      },
      
      previousStatus: "",
      pickers: {},
      rules: {
        required: (v) => !!v || "กรุณากรอกข้อมูล",
      },
    };
  },

  computed: {
    existingImages() {
        if (!this.formData.pImage) return [];
        try {
            const parsed = JSON.parse(this.formData.pImage);
            return Array.isArray(parsed) ? parsed : [this.formData.pImage];
        } catch (e) {
            return [this.formData.pImage];
        }
    }
  },

  async mounted() {
    const routeId = this.$route.params.id;
    if (routeId === "new" || !routeId) {
      this.isNew = true;
      this.formData.pStatus = "รอดำเนินการ";
      this.previousStatus = "รอดำเนินการ";
      this.formData.dateCreate = ""; 
      this.$nextTick(() => this.initDatePickers());
    } else {
      this.isNew = false;
      this.formData.pId = routeId;
      await this.fetchDetail(routeId);
    }
  },

  beforeUnmount() {
    Object.values(this.pickers).forEach(fp => fp && fp.destroy());
  },

  methods: {
    addToTempFiles(files) {
        if (files && files.length > 0) {
            this.tempFiles = [...this.tempFiles, ...files];
            this.$nextTick(() => {
                this.fileInputBuffer = []; 
            });
        }
    },

    removeFromTemp(index) {
        this.tempFiles.splice(index, 1);
    },

    createPreview(file) {
        return URL.createObjectURL(file);
    },

    // --- แก้ไข Function นี้ให้ฉลาดขึ้น เพื่อรองรับ Path เก่า ---
    getImageUrl(path) {
        if (!path) return '';
        
        let cleanPath = path;
        
        // 1. ถ้าเจอ Full Path ของ Render (/opt/render/...) ให้ตัดทิ้ง
        // โดยการหาคำว่า 'uploads/' แล้วเอาแค่ส่วนข้างหลัง
        if (cleanPath.includes('uploads/')) {
            const parts = cleanPath.split('uploads/');
            // parts[1] คือส่วนที่อยู่หลัง uploads/ เช่น projects/abc.jpg
            cleanPath = 'uploads/' + parts[1];
        }
        
        // 2. แก้เครื่องหมาย \ เป็น / เผื่อมาจาก Windows
        cleanPath = cleanPath.replace(/\\/g, "/");

        const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
        
        // 3. ป้องกัน Double Slash (//)
        const finalUrl = `${baseUrl}/${cleanPath}`;
        return finalUrl.replace(/([^:]\/)\/+/g, "$1");
    },

    openImage(url) {
        window.open(url, '_blank');
    },

    async fetchDetail(id) {
      this.loading = true;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/get-project-detail/${id}`);
        if (res.data.message === "success") {
           const data = res.data.data;
           this.formData = { ...data };
           if (data.dateCreate) this.formData.dateCreate = this.formatDateDBtoThai(data.dateCreate);
           if (data.dateComplete) this.formData.dateComplete = this.formatDateDBtoThai(data.dateComplete);
           this.previousStatus = data.pStatus;
        }
      } catch (err) {
        Swal.fire("Error", "ไม่สามารถโหลดข้อมูลได้", "error");
      } finally {
        this.loading = false;
        this.$nextTick(() => this.initDatePickers());
      }
    },

    confirmUploadFiles() {
        if (this.tempFiles.length > 0) {
            this.filesToUpload = [...this.filesToUpload, ...this.tempFiles];
            this.tempFiles = []; 
            this.fileInputBuffer = [];
            this.uploadDialog = false;

            this.handleStatusLogic("เสร็จสิ้น");
            
            Swal.fire({
                icon: 'success',
                title: 'เตรียมไฟล์เรียบร้อย',
                text: 'อย่าลืมกดปุ่ม "บันทึกข้อมูล" ด้านล่าง',
                timer: 2000,
                showConfirmButton: false
            });
        }
    },

    cancelUploadDialog() {
        this.uploadDialog = false;
        this.tempFiles = [];
        this.fileInputBuffer = [];
        if (this.formData.pStatus === 'เสร็จสิ้น' && this.existingImages.length === 0 && this.filesToUpload.length === 0) {
            this.$nextTick(() => { this.formData.pStatus = this.previousStatus; });
        }
    },

    removePendingFile(index) {
        this.filesToUpload.splice(index, 1);
    },

    async onStatusChange(newStatus) {
        if (newStatus === this.previousStatus) return;

        if (newStatus === "เสร็จสิ้น") {
            if (this.existingImages.length === 0 && this.filesToUpload.length === 0) {
                this.uploadDialog = true; 
                return; 
            }
        }

        const result = await Swal.fire({
            title: 'ยืนยันเปลี่ยนสถานะ?',
            html: `เปลี่ยนเป็น <b class="text-primary">${newStatus}</b> ใช่หรือไม่?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#161E54',
        });

        if (result.isConfirmed) {
            this.handleStatusLogic(newStatus);
        } else {
            this.$nextTick(() => { this.formData.pStatus = this.previousStatus; });
        }
    },

    handleStatusLogic(newStatus) {
        const today = this.getTodayThaiDate();
        
        if (newStatus === "กำลังดำเนินการ" && !this.formData.dateCreate) {
            this.formData.dateCreate = today;
            this.updatePicker('dateCreate', today);
        }

        if (newStatus === "เสร็จสิ้น") {
            if (!this.formData.dateCreate) {
                this.formData.dateCreate = today;
                this.updatePicker('dateCreate', today);
            }
            this.formData.dateComplete = today;
            this.updatePicker('dateComplete', today);
        }
        
        this.previousStatus = newStatus;
    },

    async saveForm() {
      const { valid } = await this.$refs.projectForm.validate();
      if (!valid) {
        Swal.fire('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
        return;
      }

      if (this.formData.pStatus === 'เสร็จสิ้น' && this.existingImages.length === 0 && this.filesToUpload.length === 0) {
          Swal.fire('ต้องการหลักฐาน', 'งานที่เสร็จสิ้นต้องมีรูปภาพประกอบ', 'warning');
          this.uploadDialog = true;
          return;
      }

      this.isSaving = true;
      try {
        const endpoint = this.isNew ? `${import.meta.env.VITE_API_URL}/create-project` : `${import.meta.env.VITE_API_URL}/update-project`;
        const formData = new FormData();

        Object.keys(this.formData).forEach(key => {
            const value = this.formData[key] === "" ? null : this.formData[key];
            if (value !== null && key !== 'pImage') {
                formData.append(key, value);
            }
        });

        if (this.filesToUpload.length > 0) {
            this.filesToUpload.forEach(file => {
                formData.append('evidence_images', file);
            });
        }

        // --- จุดที่แก้ไข: ลบ Headers ทิ้ง เพื่อให้ Axios จัดการเอง ---
        const res = await axios.post(endpoint, formData);
        
        if (res.data.message === "success") {
            await Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ!',
                timer: 1500,
                showConfirmButton: false
            });
            
            if (this.isNew) {
                this.$router.replace({ name: 'TheCaseProject' });
            } else {
                this.filesToUpload = [];
                await this.fetchDetail(this.formData.pId || res.data.pId);
            }
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "เกิดข้อผิดพลาดในการบันทึก", "error");
      } finally {
        this.isSaving = false;
      }
    },

    updatePicker(key, dateStr) {
        if(this.pickers[key]) {
            this.pickers[key].setDate(this.parseThaiDate(dateStr));
        }
    },
    formatDateDBtoThai(dateStr) {
        if(!dateStr) return "";
        const date = new Date(dateStr);
        return this.formatToThaiDate(date);
    },
    getTodayThaiDate() {
        return this.formatToThaiDate(new Date());
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
    adjustYear(instance) {
        setTimeout(() => {
            if (instance && instance.currentYearElement) {
                instance.currentYearElement.value = instance.currentYear + 543;
            }
        }, 10);
    },
    getStatusColor(status) {
        if (status === 'เสร็จสิ้น') return 'success';
        if (status === 'กำลังดำเนินการ') return 'info';
        return 'grey-darken-1';
    },
    getStepColor(step, isDivider = false) {
        const status = this.formData.pStatus;
        let currentStep = 1;
        if (status === 'กำลังดำเนินการ') currentStep = 2;
        if (status === 'เสร็จสิ้น') currentStep = 3;
        const activeColor = '#161E54';
        const inactiveColor = '#E0E0E0';
        const successColor = '#107C41';
        if (isDivider) return step < currentStep ? successColor : (step === currentStep ? activeColor : inactiveColor);
        else return step < currentStep ? successColor : (step === currentStep ? activeColor : inactiveColor);
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
        const keys = ['dateCreate', 'dateComplete'];
        const ids = ['date-create', 'date-complete'];
        keys.forEach((key, index) => {
            const el = document.getElementById(ids[index]);
            if (el) {
                let defaultDate = null;
                if (this.formData[key]) defaultDate = this.parseThaiDate(this.formData[key]);
                this.pickers[key] = flatpickr(el, {
                    ...config,
                    defaultDate: defaultDate,
                    onChange: (selectedDates) => {
                        this.formData[key] = selectedDates.length > 0 ? this.formatToThaiDate(selectedDates[0]) : "";
                        this.adjustYear(this.pickers[key]);
                    }
                });
            }
        });
    },
  },
};
</script>

<style scoped>
.bg-light-gray { background-color: #f3f4f6; min-height: 100vh; }
.page-container { width: 100%; min-height: 100vh; transition: all 0.3s ease; background-color: #f3f4f6; }

/* Responsive Layout */
@media (min-width: 992px) {
  .page-container { padding-left: 280px !important; }
  .fixed-bottom-custom { left: 280px !important; width: calc(100% - 280px) !important; position: fixed; bottom: 0; }
}
@media (max-width: 991.98px) {
  .page-container { padding-left: 0 !important; padding-top: 60px !important; }
  .fixed-bottom-custom { left: 0 !important; width: 100% !important; position: fixed; bottom: 0; }
  .sticky-header { top: 60px !important; }
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
.cursor-pointer {
    cursor: pointer;
}
</style>