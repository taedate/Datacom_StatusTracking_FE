<template>
  <div class="page-container position-relative">
    <div class="content-wrapper p-4 position-relative" style="z-index: 2;">
      
      <div class="row g-4 mb-5">
        <div class="col-12">
          <div class="hero-section bg-gradient-primary text-white rounded-4 p-5 position-relative overflow-hidden shadow-lg">
            <div class="row align-items-center">
              <div class="col-lg-8">
                <h1 class="display-6 fw-bold mb-2">ยินดีต้อนรับสู่ Datacom Dashboard</h1>
                <p class="lead text-white-50 mb-4">จัดการงานซ่อม ติดตามโปรเจกต์ และตรวจสอบสถานะอุปกรณ์แบบเรียลไทม์</p>
                <div class="d-flex gap-3 flex-wrap">
                  <router-link to="/caseRepair" class="btn btn-light px-4 py-2 fw-bold rounded-pill shadow-sm">
                    <i class="bi bi-plus-lg me-2"></i>งานรับซ่อมใหม่
                  </router-link>
                  <router-link to="/caseSentRepair" class="btn btn-outline-light px-4 py-2 fw-bold rounded-pill">
                    <i class="bi bi-send-arrow-up me-2"></i>งานส่งซ่อมใหม่
                  </router-link>
                </div>
              </div>
              <div class="col-lg-4 text-center d-none d-lg-block">
                <div class="display-1 opacity-25">
                  <i class="bi bi-cpu"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-5">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h4 class="fw-bold text-dark m-0">
            <i class="bi bi-activity me-2 text-primary"></i>ภาพรวมระบบ
          </h4>
        </div>

        <div class="row g-3">
          <div class="col-md-6 col-lg-3">
            <div class="card border-0 shadow-sm h-100 kpi-card">
              <div class="card-body p-4">
                <div class="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <p class="text-muted small mb-1 text-uppercase fw-bold">งานสะสมทั้งหมด</p>
                    <h2 class="fw-bold text-dark mb-0">{{ stats.totalCases }}</h2>
                  </div>                
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="card border-0 shadow-sm h-100 kpi-card">
              <div class="card-body p-4">
                <div class="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <p class="text-muted small mb-1 text-uppercase fw-bold">กำลังดำเนินการ</p>
                    <h2 class="fw-bold text-warning mb-0">{{ stats.inProgress }}</h2>
                  </div>
                </div>
                <div class="progress" style="height: 6px">
                  <div class="progress-bar bg-warning" role="progressbar" :style="{ width: stats.progressPercent + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="card border-0 shadow-sm h-100 kpi-card">
              <div class="card-body p-4">
                <div class="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <p class="text-muted small mb-1 text-uppercase fw-bold">เสร็จสมบูรณ์</p>
                    <h2 class="fw-bold text-success mb-0">{{ stats.completed }}</h2>
                  </div>                  
                </div>
                <div class="small text-muted">อัตราสำเร็จ: {{ stats.completionRate }}%</div>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="card border-0 shadow-sm h-100 kpi-card">
              <div class="card-body p-4">
                <div class="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <p class="text-muted small mb-1 text-uppercase fw-bold">ระยะเวลาซ่อมเฉลี่ย</p>
                    <h2 class="fw-bold text-info mb-0">{{ stats.avgTime }} <span class="fs-6 fw-normal">วัน</span></h2>
                  </div>                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mb-5">
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 py-3 border-start border-primary border-4">
              <div class="d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0">งานรับซ่อม (ในร้าน)</h6>
                <span class="badge bg-primary rounded-pill">{{ stats.caseRepair }}</span>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
                <span class="small text-muted">รับเครื่องแล้ว</span>
                <span class="fw-bold">{{ stats.caseRepair_received }}</span>
              </div>
              <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
                <span class="small text-muted">กำลังซ่อม</span>
                <span class="fw-bold text-warning">{{ stats.caseRepair_repairing }}</span>
              </div>
              <div class="p-3 d-flex justify-content-between align-items-center">
                <span class="small text-muted">ซ่อมเสร็จแล้ว</span>
                <span class="fw-bold text-success">{{ stats.caseRepair_repairComplete }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 py-3 border-start border-info border-4">
              <div class="d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0">งานส่งซ่อม (ภายนอก)</h6>
                <span class="badge bg-info rounded-pill">{{ stats.sentRepairTotal }}</span>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
                <span class="small text-muted">ส่งเครื่องไปแล้ว</span>
                <span class="fw-bold text-info">{{ stats.sentRepair_sending }}</span>
              </div>
              <div class="p-3 d-flex justify-content-between align-items-center">
                <span class="small text-muted">รับคืนแล้ว</span>
                <span class="fw-bold text-success">{{ stats.sentRepair_received }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 py-3 border-start border-dark border-4">
              <div class="d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0">งานติดตั้ง/โปรเจกต์</h6>
                <span class="badge bg-dark rounded-pill">{{ stats.caseProject }}</span>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
                <span class="small text-muted">รอดำเนินการ</span>
                <span class="fw-bold">{{ stats.caseProject_waiting }}</span>
              </div>
              <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
                <span class="small text-muted">กำลังดำเนินการ</span>
                <span class="fw-bold text-warning">{{ stats.caseProject_inProgress }}</span>
              </div>
              <div class="p-3 d-flex justify-content-between align-items-center">
                <span class="small text-muted">เสร็จสิ้น</span>
                <span class="fw-bold text-success">{{ stats.caseProject_completed }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 py-4 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold mb-0">กิจกรรมล่าสุด</h5>
          <button @click="loadDashboardData" class="btn btn-sm btn-light border">
            <i class="bi bi-arrow-clockwise"></i> อัปเดตข้อมูล
          </button>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 table-fixed">
            <thead class="bg-light">
              <tr class="small text-muted text-uppercase">
                <th class="ps-4" style="width: 20%;">ประเภทงาน</th>
                <th style="width: 40%;">รายละเอียดอุปกรณ์</th>
                <th style="width: 20%;">สถานะ</th>
                <th style="width: 20%;">วันที่บันทึก</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="4" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status"></div>
                </td>
              </tr>
              <tr v-else-if="recentActivities.length === 0">
                <td colspan="4" class="text-center py-5 text-muted">ไม่พบข้อมูลกิจกรรม</td>
              </tr>
              <tr v-for="item in recentActivities" :key="item.id + item.type">
                <td class="ps-4">
                  <span class="badge rounded-pill d-inline-block text-center" style="min-width: 100px;" :class="getActivityClass(item.type)">
                    {{ item.type === 'caseRepair' ? 'งานซ่อมในร้าน' : item.type === 'sentRepair' ? 'ส่งซ่อมข้างนอก' : 'งานติดตั้ง' }}
                  </span>
                </td>
                <td>
                  <div class="fw-bold text-truncate" style="max-width: 100%;">{{ item.title }}</div>
                  <div class="small text-muted text-truncate" style="max-width: 100%;">{{ item.description }}</div>
                </td>
                <td>
                  <span class="badge bg-light text-dark border">{{ item.status }}</span>
                </td>
                <td class="small text-muted">{{ formatDate(item.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { sentRepairService } from "@/services/sentRepairService";

export default {
  name: "TheHome",
  data() {
    return {
      loading: false,
      stats: {
        totalCases: 0,
        inProgress: 0,
        progressPercent: 0,
        completed: 0,
        completionRate: 0,
        avgTime: 0,
        
        caseRepair: 0,
        caseRepair_received: 0,
        caseRepair_repairing: 0,
        caseRepair_repairComplete: 0,

        sentRepairTotal: 0,
        sentRepair_sending: 0,
        sentRepair_received: 0,

        caseProject: 0,
        caseProject_waiting: 0,
        caseProject_inProgress: 0,
        caseProject_completed: 0,
      },
      recentActivities: [],
    };
  },
  mounted() {
    this.loadDashboardData();
  },
  methods: {
    async loadDashboardData() {
      this.loading = true;
      try {
        await Promise.all([
          this.fetchDashboardStatistics(),
          this.fetchRecentActivities(),
        ]);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchDashboardStatistics() {
      try {
        const res = await sentRepairService.getStatistics();
        if (res.data && res.data.data) {
          const d = res.data.data;
          this.stats.caseRepair = d.caseRepair.total;
          this.stats.caseRepair_received = d.caseRepair.received;
          this.stats.caseRepair_repairing = d.caseRepair.repairing;
          this.stats.caseRepair_repairComplete = d.caseRepair.repairComplete;
          this.stats.sentRepairTotal = d.sentRepair.total;
          this.stats.sentRepair_sending = d.sentRepair.sending;
          this.stats.sentRepair_received = d.sentRepair.received;
          this.stats.caseProject = d.caseProject.total;
          this.stats.caseProject_waiting = d.caseProject.waiting;
          this.stats.caseProject_inProgress = d.caseProject.inProgress;
          this.stats.caseProject_completed = d.caseProject.completed;
          this.stats.totalCases = d.summary.totalCases;
          this.stats.completed = d.summary.completed;
          this.stats.avgTime = d.summary.avgTime || 0;
          this.stats.inProgress = (this.stats.caseRepair_repairing || 0) + (this.stats.sentRepair_sending || 0) + (this.stats.caseProject_inProgress || 0);
          this.stats.progressPercent = this.stats.totalCases > 0 ? (this.stats.inProgress / this.stats.totalCases) * 100 : 0;
          this.stats.completionRate = this.stats.totalCases > 0 ? Math.round((this.stats.completed / this.stats.totalCases) * 100) : 0;
        }
      } catch (error) {
        console.error("Stats API Error:", error);
      }
    },
    async fetchRecentActivities() {
      try {
        const res = await sentRepairService.getRecentActivities(10);
        if (res.data && res.data.data) {
          this.recentActivities = res.data.data;
        }
      } catch (error) {
        console.error("Activities API Error:", error);
      }
    },
    getActivityClass(type) {
      const colors = {
        caseRepair: "bg-primary text-white",
        sentRepair: "bg-info text-white",
        caseProject: "bg-dark text-white"
      };
      return colors[type] || "bg-secondary text-white";
    },

    // ฟังก์ชัน formatDate ที่แก้ไขใหม่ เพื่อแก้ปัญหา Timezone และปี พ.ศ.
    formatDate(dateStr) {
      if (!dateStr) return "-";
      
      let day, month, year;

      // 1. ตรวจสอบว่าข้อมูลเป็น ISO String (มีตัว T) หรือไม่ เช่น "2026-02-06T15:30:00.000Z"
      if (typeof dateStr === 'string' && dateStr.includes('T')) {
          const pureDate = dateStr.split('T')[0]; // ตัดเอาเฉพาะส่วนวันที่ "2026-02-06"
          const parts = pureDate.split('-');
          year = parseInt(parts[0]);
          month = parts[1];
          day = parts[2];
      } else {
          // 2. ถ้ามาในรูปแบบอื่น พยายามแปลงผ่าน Date Object
          const dateObj = new Date(dateStr);
          if (isNaN(dateObj.getTime())) return dateStr; // คืนค่าเดิมถ้าแปลงไม่ได้
          
          year = dateObj.getFullYear();
          month = String(dateObj.getMonth() + 1).padStart(2, '0');
          day = String(dateObj.getDate()).padStart(2, '0');
      }

      // 3. ปรับปีเป็น พ.ศ. (ถ้ายังเป็น ค.ศ. อยู่)
      if (year < 2400) {
          year = year + 543;
      }
      
      // ส่งกลับในรูปแบบ dd-mm-yyyy (เช่น 06-02-2569)
      return `${day}-${month}-${year}`;
    }
  }
};
</script>

<style scoped>
.page-container {
  background-color: #f8fafc;
  min-height: 100vh;
}
.bg-gradient-primary {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
}
.kpi-card {
  border-radius: 16px;
  transition: transform 0.2s;
}
.kpi-card:hover {
  transform: translateY(-5px);
}
.badge {
  font-weight: 600;
  padding: 0.5em 0.8em;
}

.table-fixed {
  table-layout: fixed;
  width: 100%;
}
.table-fixed td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 992px) {
  .page-container { padding-left: 280px; }
}
</style>