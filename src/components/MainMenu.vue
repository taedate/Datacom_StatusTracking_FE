<template>
    <div>
        <nav class="navbar navbar-light bg-white border-bottom d-lg-none fixed-top shadow-sm px-3" style="height: 60px;">
            <div class="d-flex align-items-center w-100 justify-content-between">
                <div class="d-flex align-items-center">
                    <div class=" rounded-3 p-1 me-2 d-flex align-items-center justify-content-center">
                        <img src="https://github.com/taedate/datacom-image/blob/main/logoData.PNG?raw=true" alt="Logo" style="width: 50px; height: 40px;" />
                    </div>
                    <span class="fw-bold tracking-tight text-dark"></span>
                </div>
                <button class="btn btn-light border" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu">
                    <i class="bi bi-list fs-4"></i>
                </button>
            </div>
        </nav>

        <div 
            class="offcanvas-lg offcanvas-start bg-white border-end h-100 sidebar-container" 
            tabindex="-1" 
            id="sidebarMenu" 
            aria-labelledby="sidebarMenuLabel"
        >
            <div class="d-flex flex-column h-100 p-4">
                
                <div class="d-flex align-items-center mb-5 ps-2 pt-2">
                    <div class="rounded-4 p-2 me-3 shadow-sm d-flex align-items-center justify-content-center">
                        <img src="https://github.com/taedate/datacom-image/blob/main/logoData.PNG?raw=true" alt="Logo" style="width: 50px; height: 40px;" />
                    </div>
                    <hr>
                    <div class="d-flex flex-column">
                        <span class="fw-bold fs-4 tracking-tight text-dark" style="color: var(--text-dark) !important;">Datacom</span>
                        <span class="text-muted text-uppercase fw-bold" style="font-size: 0.6rem; letter-spacing: 1.5px;">Status Tracking</span>
                    </div>
                </div>

                <div class="nav flex-column gap-2 mb-auto">
                    <p class="text-uppercase text-muted fw-bold ps-3 mb-2" style="font-size: 0.7rem; letter-spacing: 1px;">Menu</p>
                    
                    <router-link to="/" class="nav-link sidebar-link d-flex align-items-center" active-class="active" @click="closeMenu">
                        <i class="bi bi-grid-fill me-3 fs-5"></i>
                        <span>หน้าหลัก</span>
                    </router-link>

                    <router-link 
                        to="/caseRepair" 
                        class="nav-link sidebar-link d-flex align-items-center" 
                        :class="{ 'active': $route.path.includes('/caseRepair') }"
                        @click="closeMenu"
                    >
                        <i class="bi bi-wrench me-3 fs-5"></i>
                        <span>งานรับซ่อม</span>
                    </router-link>

                    <router-link 
                        to="/caseSentRepair" 
                        class="nav-link sidebar-link d-flex align-items-center" 
                        :class="{ 'active': $route.path.includes('/caseSentRepair') }"
                        @click="closeMenu"
                    >
                        <i class="bi bi-send-arrow-up-fill me-3 fs-5"></i>
                        <span>งานส่งซ่อม</span>
                    </router-link>
                    
                    <router-link 
                        to="/caseProject" 
                        class="nav-link sidebar-link d-flex align-items-center" 
                        :class="{ 'active': $route.path.includes('/caseProject') }"
                        @click="closeMenu"
                    >
                        <i class="bi bi-gear-fill me-3 fs-5"></i>
                        <span>งานติดตั้ง</span>
                    </router-link>

                    <router-link 
                        to="/quotation" 
                        class="nav-link sidebar-link d-flex align-items-center" 
                        :class="{ 'active': $route.path.includes('/quotation') }"
                        @click="closeMenu"
                    >
                        <i class="bi bi-receipt-cutoff me-3 fs-5"></i>
                        <span>ใบเสนอราคา</span>
                    </router-link>

                    
                </div>

                <div class="mt-auto border-top pt-3" v-if="memName">
                    <div class="dropup">
                        <div 
                            class="d-flex align-items-center p-2 rounded-3 user-card cursor-pointer" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        >
                            <div class="position-relative">
                                <div class="avatar-circle shadow-sm">
                                    {{ memName.charAt(0).toUpperCase() }}
                                </div>
                                <span class="position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle"></span>
                            </div>
                            
                            <div class="ms-3 d-flex flex-column overflow-hidden">
                                <span class="fw-bold text-dark text-truncate" style="font-size: 0.9rem;">{{ memName }}</span>
                                <span class="text-muted small">เจ้าหน้าที่</span>
                            </div>
                            <i class="bi bi-three-dots-vertical ms-auto text-muted"></i>
                        </div>

                        <ul class="dropdown-menu shadow-lg border-0 rounded-4 p-2 mb-2 w-100">
                            <li>
                                <button class="dropdown-item rounded-3 py-2 d-flex align-items-center" type="button" data-bs-toggle="modal" data-bs-target="#userProfileModal">
                                    <i class="bi bi-person me-2"></i> ข้อมูลส่วนตัว
                                </button>
                            </li>
                            <li><hr class="dropdown-divider my-1"></li>
                            <li>
                                <button class="dropdown-item rounded-3 py-2 text-danger d-flex align-items-center" type="button" @click="memlogout">
                                    <i class="bi bi-box-arrow-right me-2"></i> ออกจากระบบ
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>

        <div class="modal fade" id="userProfileModal" tabindex="-1" aria-hidden="true">
             <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-0 pb-0">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center pt-0 pb-4 px-4">
                        <div class="position-relative d-inline-block mb-3">
                             <div class="rounded-circle d-flex justify-content-center align-items-center shadow-sm" 
                                 style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--theme-primary) 0%, #7B56D8 100%); color: #fff; font-size: 2rem; font-weight: bold;">
                                {{ memName ? memName.charAt(0).toUpperCase() : 'U' }}
                            </div>
                        </div>
                        <h5 class="fw-bold mb-1">{{ memName }}</h5>
                        <p class="text-muted small mb-3">เจ้าหน้าที่คัดกรองโรค</p>
                        
                        <div class="bg-light rounded-3 p-3 text-start">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="text-muted">Status</small>
                                <span class="badge bg-success bg-opacity-10 text-dark rounded-pill">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from "@/even-bus";
import Swal from "sweetalert2";
import { swalTheme } from "@/utils/swalTheme";
import { authService } from "@/services/authService";

export default {
    name: "SidebarMenu",
    data() {
        return {
            memName: null,
            backendMessage: null,
        };
    },
    mounted() {
        this.loadUserData();
        EventBus.on("loginok", () => {
            this.loadUserData();
        });
    },
    beforeUnmount() {
        EventBus.off("loginok");
    },
    methods: {
        loadUserData() {
            const fname = sessionStorage.getItem("userName");
            const lname = sessionStorage.getItem("userSurname");
            
            if (fname || lname) {
                this.memName = `${fname || ''} ${lname || ''}`.trim();
            } else {
                this.memName = sessionStorage.getItem("userEmail") || "User";
            }
        },

        closeMenu() {
            const sidebar = document.getElementById('sidebarMenu');
            if (sidebar && sidebar.classList.contains('show')) {
                if (window.bootstrap) {
                    const instance = window.bootstrap.Offcanvas.getInstance(sidebar);
                    if (instance) {
                        instance.hide();
                        return;
                    }
                }
                const toggleBtn = document.querySelector('[data-bs-target="#sidebarMenu"]');
                if (toggleBtn) toggleBtn.click();
            }
        },

        async memlogout() {
            const result = await Swal.fire({
                title: 'ออกจากระบบ?',
                text: "ยืนยันการออกจากระบบ",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ออก',
                cancelButtonText: 'ยกเลิก',
                ...swalTheme.danger
            });

            if (result.isConfirmed) {
                try {
                    Swal.fire({
                        title: "กำลังออกจากระบบ...",
                        allowOutsideClick: false,
                        didOpen: () => Swal.showLoading(),
                    });

                    const response = await authService.logout();
                    
                    // Backend responds with message: 'Logout successful'
                    if (response.status === 200 && response.data.message === "Logout successful") {
                        // Clear storage and state
                        sessionStorage.clear();
                        localStorage.clear();
                        this.memName = null;
                        
                        // Close any open modals
                        const modals = document.querySelectorAll('.modal.show');
                        modals.forEach(modal => {
                            modal.classList.remove('show');
                            modal.style.display = 'none';
                        });
                        
                        // Remove backdrop
                        const backdrops = document.querySelectorAll('.modal-backdrop');
                        backdrops.forEach(backdrop => backdrop.remove());
                        
                        // Clean body classes
                        document.body.classList.remove('modal-open');
                        document.body.style.removeProperty('overflow');
                        document.body.style.removeProperty('padding-right');

                        // Emit event
                        EventBus.emit("memlogout");
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'ออกจากระบบสำเร็จ',
                            timer: 1000,
                            showConfirmButton: false
                        });

                        // Redirect to login
                        setTimeout(() => {
                            this.$router.push("/login");
                        }, 500);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'ออกจากระบบไม่สำเร็จ',
                            ...swalTheme.danger
                        });
                    }
                } catch (err) {
                    console.error("Logout error:", err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: err.response?.data?.error || 'เกิดข้อผิดพลาดในการออกจากระบบ',
                        ...swalTheme.danger
                    });
                }
            }
        },
    },
};
</script>

<style scoped>
/* --- Sidebar Styles --- */

/* 1. Layout Container */
.sidebar-container {
    width: 280px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1045;
    background-color: #ffffff;
    transition: all 0.3s ease;
}

/* 2. Logo */
.logo-icon-bg {
    background: linear-gradient(135deg, var(--theme-primary) 0%, #7B56D8 100%);
    width: 45px;
    height: 45px;
}

/* 3. Navigation Links */
.sidebar-link {
    color: #64748b;
    font-weight: 500;
    padding: 0.8rem 1.2rem;
    border-radius: 12px;
    transition: all 0.2s ease;
    margin-bottom: 4px;
    position: relative;
    overflow: hidden;
}

.sidebar-link:hover {
    background-color: #f1f5f9;
    color: var(--text-dark);
    transform: translateX(3px);
}

/* Active State */
.sidebar-link.active {
    background-color: var(--theme-primary);
    color: var(--theme-on-primary);
    box-shadow: 0 4px 12px rgba(22, 30, 84, 0.25);
}

/* 4. User Profile Footer */
.user-card {
    transition: background 0.2s;
}
.user-card:hover {
    background-color: #f8fafc;
}

.avatar-circle {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--theme-primary) 0%, #7B56D8 100%);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.1rem;
}

@media (max-width: 991.98px) {
    .sidebar-container {
        /* Mobile handling handled by Bootstrap offcanvas */
    }
}
</style>