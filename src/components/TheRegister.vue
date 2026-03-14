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
                                สมัครสมาชิกผ่านลิงก์เชิญ <br />
                                ตั้งรหัสผ่านเพื่อเข้าใช้งานระบบ
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
                                            :readonly="inviteChecked"
                                            required
                                        />
                                    </div>
                                    <div class="form-text" v-if="inviteChecked">
                                        Username ถูกกำหนดจากลิงก์เชิญ
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
                                    <div class="form-text">
                                        รหัสผ่านต้องมีอย่างน้อย 8 ตัว และต้องมีตัวพิมพ์ใหญ่,
                                        ตัวพิมพ์เล็ก และตัวเลข
                                    </div>
                                </div>

                                <div class="text-end mb-4">
                                    <span class="small me-1">มีผู้ใช้ในระบบแล้ว ?</span>
                                    <router-link
                                        to="/login"
                                        class="small text-decoration-none"
                                    >
                                        เข้าสู่ระบบ
                                    </router-link>
                                </div>

                                <button
                                    type="submit"
                                    class="btn btn-theme w-100 mb-3"
                                    :disabled="isLoading || inviteValidating || !inviteChecked"
                                >
                                    {{
                                        isLoading
                                            ? "กำลังสร้างบัญชี..."
                                            : inviteValidating
                                              ? "กำลังตรวจสอบลิงก์..."
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
            inviteToken: "",
            inviteChecked: false,
            inviteValidating: true,
        };
    },

    created() {
        this.initInviteFlow();
    },

    methods: {
        validatePassword(password) {
            if (password.length < 8) {
                return "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
            }

            if (!/[A-Z]/.test(password)) {
                return "รหัสผ่านต้องมีตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว";
            }

            if (!/[a-z]/.test(password)) {
                return "รหัสผ่านต้องมีตัวพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว";
            }

            if (!/[0-9]/.test(password)) {
                return "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว";
            }

            return null;
        },

        getErrorMessage(err) {
            const code = err?.response?.data?.code;

            if (code === "INVITE_EXPIRED") return "ลิงก์เชิญหมดอายุแล้ว";
            if (code === "INVITE_ALREADY_USED") return "ลิงก์เชิญนี้ถูกใช้งานแล้ว";
            if (code === "INVITE_REVOKED") return "ลิงก์เชิญนี้ถูกยกเลิกแล้ว";
            if (code === "INVITE_NOT_FOUND") return "ไม่พบลิงก์เชิญนี้";
            if (code === "PASSWORD_POLICY_FAILED") return "รหัสผ่านไม่ผ่านเงื่อนไขความปลอดภัย";
            if (code === "USERNAME_ALREADY_EXISTS") return "ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว";

            return err?.response?.data?.detail || "เกิดข้อผิดพลาดในการลงทะเบียน";
        },

        async initInviteFlow() {
            this.inviteToken = this.$route.query.token || "";

            if (!this.inviteToken) {
                this.backendMessage = "ต้องสมัครผ่านลิงก์เชิญที่มี token";
                this.inviteValidating = false;
                return;
            }

            this.inviteValidating = true;
            this.backendMessage = null;

            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/invites/validate`,
                    {
                        params: { token: this.inviteToken },
                    }
                );

                const invitedUserName =
                    data?.payload?.invitedUserName || data?.payload?.userName || "";

                if (invitedUserName) {
                    this.newUser.userName = invitedUserName;
                }

                this.inviteChecked = true;
            } catch (err) {
                this.backendMessage = this.getErrorMessage(err);
                this.inviteChecked = false;
            } finally {
                this.inviteValidating = false;
            }
        },

        togglePassword() {
            this.showPassword = !this.showPassword;
        },

        async handleSubmit() {
            if (!this.inviteToken || !this.inviteChecked) {
                this.backendMessage = "ลิงก์เชิญไม่ถูกต้องหรือหมดอายุ";
                return;
            }

            if (!this.newUser.userName || !this.newUser.password) {
                this.backendMessage = "กรุณากรอกข้อมูลให้ครบถ้วน";
                return;
            }

            const passwordValidationMessage = this.validatePassword(
                this.newUser.password
            );

            if (passwordValidationMessage) {
                this.backendMessage = passwordValidationMessage;
                return;
            }

            this.isLoading = true;
            this.backendMessage = null;

            try {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/register-by-invite`,
                    {
                        token: this.inviteToken,
                        password: this.newUser.password,
                    }
                );
                this.backendMessage = "success";

                // Reset form
                this.newUser = { userName: "", password: "" };

                // Redirect
                setTimeout(() => {
                    this.$router.push({ path: "/login" });
                }, 1500);
            } catch (err) {
                this.backendMessage = this.getErrorMessage(err);
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