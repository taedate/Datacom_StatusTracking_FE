<template>
    <div class="login-page d-flex align-items-center">
        <teleport to="body">
            <div
                v-if="error"
                class="alert alert-danger alert-dismissible fade show login-alert"
                role="alert"
            >
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ error }}
                <button
                    type="button"
                    class="btn-close"
                    @click="error = ''"
                ></button>
            </div>
        </teleport>

        <div class="container">
            <div class="row">
                <div class="col-md-5">
                    <div class="card login-card shadow-sm border-0">
                        <div class="card-body p-4">
                            <h3 class="fw-bold mb-2">เข้าสู่ระบบ</h3>
                            <p class="text-muted mb-4">
                                สวัสดี! <br />
                                กรุณากรอก Username และ Password เพื่อล็อกอิน
                            </p>

                            <form @submit.prevent="login">
                                <div class="mb-4">
                                    <div class="input-group">
                                        <span class="input-group-text bg-light">
                                            <i class="bi bi-person-fill"></i>
                                        </span>
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="ชื่อผู้ใช้งาน (Username)"
                                            v-model="userName"
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
                                            v-model="password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            class="input-group-text bg-light"
                                            @click="togglePassword"
                                        >
                                            <i
                                                :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                                            ></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="text-end mb-4">
                                    <span class="small me-1">ผู้ใช้ใหม่ ?</span>
                                    <router-link
                                        to="/register"
                                        class="small text-decoration-none"
                                    >
                                        ลงทะเบียน
                                    </router-link>
                                </div>

                                <button
                                    type="submit"
                                    class="btn btn-secondary w-100 mb-3 text-light"
                                    :disabled="isLoading"
                                >
                                    {{ isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ" }}
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
// import { EventBus } from "@/even-bus"; // เปิดใช้ถ้าต้องการ

export default {
    name: "TheLogin",
    data() {
        return {
            userName: "",
            password: "",
            error: "",
            isLoading: false,
            showPassword: false,
        };
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },

        async login() {
    this.isLoading = true;
    this.error = "";

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/login`,
            {
                userName: this.userName,
                password: this.password,
            }
        );

        if (response.data.message === "success") {
            // ✅ 1. เก็บ Token ลง SessionStorage (หรือ LocalStorage ตามชอบ)
            sessionStorage.setItem("token", response.data.token);
            
            // ✅ 2. เก็บข้อมูล User ลง SessionStorage (ต้องแก้ Backend ข้อ 1 ก่อนนะ)
            if (response.data.payload) {
                sessionStorage.setItem("userId", response.data.payload.userId);
                sessionStorage.setItem("userName", response.data.payload.userName);
            }

            // (Optional) ถ้ามีการใช้ EventBus
            // EventBus.emit("loginok", response.data.payload.userName);

            // ไปหน้าแรก
            window.location.href = '/';
        }
    } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 404) {
            this.error = "ไม่พบชื่อผู้ใช้งานนี้";
        } else if (err.response && err.response.status === 401) {
            this.error = "รหัสผ่านไม่ถูกต้อง";
        } else {
            this.error = "เกิดข้อผิดพลาดในการเชื่อมต่อ";
        }
    }

    this.isLoading = false;
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

/* Global alert on top */
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