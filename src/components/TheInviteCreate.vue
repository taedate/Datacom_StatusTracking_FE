<template>
    <div class="page-container d-flex flex-column">

        <!-- Sticky Header (same pattern as Detail pages) -->
        <div
            class="px-4 py-3 px-md-6 py-md-4 border-bottom d-flex flex-wrap align-center justify-space-between bg-white flex-shrink-0 sticky-top shadow-sm sticky-header"
            style="z-index: 900; min-height: 80px; top: 0"
        >
            <div class="mb-2 mb-md-0">
                <div class="d-flex align-center gap-2 mb-1">
                    <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-0">
                        เชิญสมาชิก
                    </h2>
                </div>
                <div class="text-body-2 text-grey">
                    สร้างลิงก์สำหรับเชิญสมาชิกใหม่เข้าระบบ (ใช้ได้ครั้งเดียว)
                </div>
            </div>

            <div class="d-flex flex-wrap align-center justify-end mt-2 mt-md-0 w-100 w-md-auto" style="gap: 8px">
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

        <!-- Alert teleport -->
        <teleport to="body">
            <div
                v-if="alertMsg"
                :class="[
                    'alert alert-dismissible fade show invite-alert',
                    alertType === 'success' ? 'alert-success' : 'alert-danger',
                ]"
                role="alert"
            >
                <i :class="['bi me-2', alertType === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill']"></i>
                {{ alertMsg }}
                <button type="button" class="btn-close" @click="alertMsg = null"></button>
            </div>
        </teleport>

        <!-- Content -->
        <div class="flex-grow-1 px-4 py-5 px-md-6 pb-5 bg-light-gray">
            <div class="mx-auto" style="max-width: 720px">

                <!-- Form section -->
                <v-form ref="inviteForm" @submit.prevent="handleCreate">
                    <div class="bg-white rounded-lg pa-5 mb-4 section-block">
                        <div class="d-flex align-items-center mb-4">
                            <div class="section-number me-3">1</div>
                            <h5 class="fw-bold m-0 text-dark">ข้อมูลการเชิญ</h5>
                        </div>
                        <hr class="mb-4" />

                        <div class="row g-3">
                            <div class="col-12 col-md-6">
                                <div class="text-subtitle-1 font-weight-bold mb-1">
                                    Username ที่เชิญ <span class="text-red">*</span>
                                </div>
                                <v-text-field
                                    v-model="form.invitedUserName"
                                    placeholder="เช่น john_doe"
                                    variant="outlined"
                                    density="comfortable"
                                    bg-color="white"
                                    prepend-inner-icon="mdi-account"
                                    :rules="[v => !!v || 'กรุณากรอก Username']"
                                ></v-text-field>
                            </div>

                            <div class="col-12 col-md-6">
                                <div class="text-subtitle-1 font-weight-bold mb-1">
                                    สิทธิ์การใช้งาน <span class="text-red">*</span>
                                </div>
                                <v-select
                                    v-model="form.role"
                                    :items="roleOptions"
                                    item-title="label"
                                    item-value="value"
                                    variant="outlined"
                                    density="comfortable"
                                    bg-color="white"
                                    prepend-inner-icon="mdi-shield-account"
                                    :rules="[v => !!v || 'กรุณาเลือกสิทธิ์']"
                                ></v-select>
                            </div>

                            <div class="col-12">
                                <div class="text-subtitle-1 font-weight-bold mb-1">
                                    ลิงก์หมดอายุใน (นาที) <span class="text-red">*</span>
                                </div>
                                <v-text-field
                                    v-model.number="form.expireMinutes"
                                    type="number"
                                    variant="outlined"
                                    density="comfortable"
                                    bg-color="white"
                                    prepend-inner-icon="mdi-clock-outline"
                                    :rules="[v => (v >= 1 && v <= 43200) || 'ระบุ 1–43200 นาที']"
                                    hint="1440 = 24 ชั่วโมง  |  10080 = 7 วัน  |  สูงสุด 43200 = 30 วัน"
                                    persistent-hint
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="d-flex justify-end mt-5">
                            <v-btn
                                type="submit"
                                color="#4D2FB2"
                                prepend-icon="mdi-link-plus"
                                class="text-capitalize font-weight-bold text-white"
                                rounded="pill"
                                elevation="0"
                                height="44"
                                :loading="isLoading"
                            >
                                สร้างลิงก์เชิญ
                            </v-btn>
                        </div>
                    </div>
                </v-form>

                <!-- Result section -->
                <div v-if="inviteUrl" class="bg-white rounded-lg pa-5 section-block">
                    <div class="d-flex align-items-center mb-4">
                        <div class="section-number me-3">
                            <v-icon icon="mdi-check" color="white" size="16"></v-icon>
                        </div>
                        <h5 class="fw-bold m-0 text-dark">ลิงก์พร้อมใช้งาน</h5>
                    </div>
                    <hr class="mb-4" />

                    <div class="input-group mb-3">
                        <input
                            type="text"
                            class="form-control bg-light"
                            :value="inviteUrl"
                            readonly
                            ref="urlInput"
                        />
                        <button class="btn btn-theme" type="button" @click="copyUrl">
                            <i :class="copied ? 'bi bi-check2' : 'bi bi-clipboard'"></i>
                            {{ copied ? 'คัดลอกแล้ว' : 'คัดลอก' }}
                        </button>
                    </div>

                    <div class="d-flex align-items-center gap-2 text-muted" style="font-size: 0.85rem;">
                        <i class="bi bi-clock text-warning"></i>
                        <span>หมดอายุ: <strong>{{ formatDate(expiresAt) }}</strong></span>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import apiClient from "@/services/authService.js";

export default {
    name: "TheInviteCreate",
    data() {
        return {
            form: {
                invitedUserName: "",
                role: "user",
                expireMinutes: 1440,
            },
            roleOptions: [
                { label: "User — ผู้ใช้ทั่วไป", value: "user" },
                { label: "Manager — ผู้จัดการ", value: "manager" },
                { label: "Admin — ผู้ดูแลระบบ", value: "admin" },
            ],
            isLoading: false,
            alertMsg: null,
            alertType: "danger",
            inviteUrl: "",
            expiresAt: null,
            copied: false,
        };
    },
    methods: {
        async handleCreate() {
            this.isLoading = true;
            this.alertMsg = null;
            this.inviteUrl = "";
            this.expiresAt = null;
            this.copied = false;

            try {
                const { data } = await apiClient.post("/invites", this.form);
                this.inviteUrl = data.payload.inviteUrl;
                this.expiresAt = data.payload.expiresAt;
                this.alertMsg = "สร้างลิงก์เชิญสำเร็จ";
                this.alertType = "success";
                this.form.invitedUserName = "";
            } catch (err) {
                const code = err?.response?.data?.code;
                const detail = err?.response?.data?.detail;

                if (code === "FORBIDDEN") {
                    this.alertMsg = "คุณไม่มีสิทธิ์สร้างลิงก์เชิญ (ต้องเป็น Admin)";
                } else if (code === "USERNAME_ALREADY_EXISTS") {
                    this.alertMsg = "Username นี้มีอยู่ในระบบแล้ว";
                } else {
                    this.alertMsg = detail || "เกิดข้อผิดพลาด กรุณาลองใหม่";
                }
                this.alertType = "danger";
            } finally {
                this.isLoading = false;
            }
        },

        async copyUrl() {
            try {
                await navigator.clipboard.writeText(this.inviteUrl);
                this.copied = true;
                setTimeout(() => { this.copied = false; }, 2500);
            } catch {
                this.$refs.urlInput.select();
                document.execCommand("copy");
                this.copied = true;
                setTimeout(() => { this.copied = false; }, 2500);
            }
        },

        formatDate(iso) {
            if (!iso) return "-";
            return new Date(iso).toLocaleString("th-TH", {
                dateStyle: "medium",
                timeStyle: "short",
            });
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
}

.invite-alert {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 360px;
    max-width: 600px;
    z-index: 9999;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
</style>
