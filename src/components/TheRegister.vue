<template>
    <div class="login-page d-flex align-items-center">
        <teleport to="body">
            <div
                v-if="backendMessage"
                :class="[
                    'alert alert-dismissible fade show login-alert',
                    backendMessage === 'success'
                        ? 'alert-success'
                        : 'alert-warning',
                ]"
                role="alert"
            >
                <i
                    :class="[
                        'bi me-2',
                        backendMessage === 'success'
                            ? 'bi-check-circle-fill'
                            : 'bi-exclamation-triangle-fill',
                    ]"
                ></i>

                {{
                    backendMessage === "success"
                        ? "ลงทะเบียนสำเร็จ กำลังพาไปยังหน้าเข้าสู่ระบบ..."
                        : backendMessage
                }}

                <button
                    type="button"
                    class="btn-close"
                    @click="backendMessage = null"
                ></button>
            </div>
        </teleport>

        <div class="container">
            <div class="row">
                <div class="col-md-5">
                    <div class="card login-card shadow-sm border-0">
                        <div class="card-body p-4">
                            <h3 class="fw-bold mb-2">ลงทะเบียน</h3>
                            <p class="text-muted mb-4">
                                ลงทะเบียนเข้าใช้งาน <br />
                                กรอกเพียง Username และ Password
                            </p>

                            <form @submit.prevent="handleSubmit">
                                <div class="mb-4">
                                    <div class="input-group">
                                        <span class="input-group-text bg-light">
                                            <i class="bi bi-person-plus-fill"></i>
                                        </span>
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="ชื่อผู้ใช้งาน (Username)"
                                            v-model.trim="newUser.userName"
                                            required
                                        />
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <div class="input-group">
                                        <span class="input-group-text bg-light">
                                            <i class="bi bi-lock"></i>
                                        </span>
                                        <input
                                            :type="showPassword ? 'text' : 'password'"
                                            class="form-control"
                                            placeholder="รหัสผ่าน"
                                            v-model.trim="newUser.password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            class="input-group-text bg-light"
                                            @click="togglePassword"
                                        >
                                            <i
                                                :class="
                                                    showPassword
                                                        ? 'bi bi-eye-slash'
                                                        : 'bi bi-eye'
                                                "
                                            ></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="text-end mb-4">
                                    <span class="small me-1">มีผู้ใช้ในระบบแล้ว ?</span>
                                    <router-link
                                        to="/"
                                        class="small text-decoration-none"
                                    >
                                        เข้าสู่ระบบ
                                    </router-link>
                                </div>

                                <button
                                    type="submit"
                                    class="btn btn-secondary w-100 mb-3 text-light"
                                    :disabled="isLoading"
                                >
                                    {{
                                        isLoading
                                            ? "กำลังสร้างบัญชี..."
                                            : "ลงทะเบียน"
                                    }}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-7 d-none d-md-block"></div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";


export default {
    name: "TheRegister",
    data() {
        return {
            newUser: {
                userName: "",
                password: "",
            },
            backendMessage: null,
            isLoading: false,
            showPassword: false,
        };
    },

    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },

        async handleSubmit() {
            if (!this.newUser.userName || !this.newUser.password) {
                this.backendMessage = "กรุณากรอกข้อมูลให้ครบถ้วน";
                return;
            }

            this.isLoading = true;
            this.backendMessage = null;

            try {
                // ส่งไปที่ endpoint /register
                await axios.post(`${import.meta.env.VITE_API_URL}/register`, this.newUser);
                this.backendMessage = "success";

                // Reset form
                this.newUser = { userName: "", password: "" };

                // Redirect
                setTimeout(() => {
                    this.$router.push({ path: "/" }); // หรือชื่อ route 'TheLogin'
                }, 1500);
            } catch (err) {
                this.backendMessage =
                    err.response?.data?.error ||
                    "เกิดข้อผิดพลาดในการลงทะเบียน";
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>

<style scoped>
/* คงไว้ตามเดิมทุกประการ */
.login-page {
    position: fixed;
    inset: 0;
    z-index: 100;
    overflow-y: auto;
    background: url("../assets/Gemini_Generated_Image_njewk4njewk4njew.png")
        center / cover no-repeat;
}

.login-card {
    border-radius: 16px;
}

.login-alert {
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