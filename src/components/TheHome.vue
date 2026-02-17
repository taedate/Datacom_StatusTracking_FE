<template>
  <div class="page-container position-relative">
    <div class="content-wrapper px-3 py-4 px-md-5 py-md-5 position-relative" style="z-index: 2;">
      
      <div class="row g-4 mb-4 mb-md-5 mx-0">
        <div class="col-12 px-0 px-md-2">
          <div class="hero-section bg-theme-gradient text-white rounded-xl pa-4 pa-md-5 position-relative overflow-hidden shadow-theme">
            <div class="circle-decoration circle-1"></div>
            <div class="circle-decoration circle-2"></div>
            
            <div class="row align-items-center position-relative mx-0" style="z-index: 2;">
              <div class="col-12 col-lg-8 text-center text-lg-start">
                <span class="badge bg-white text-theme bg-opacity-10 backdrop-blur mb-3 px-3 py-2 rounded-pill d-inline-block">
                  <i class="bi bi-stars me-1"></i> Dashboard System
                </span>
                <h1 class="text-h4 text-md-h3 font-weight-bold mb-3">ยินดีต้อนรับสู่ Datacom Dashboard</h1>
                <p class="text-subtitle-1 text-md-h6 text-white-80 mb-4" style="font-weight: 300;">
                  จัดการงานซ่อม ติดตามโปรเจกต์ และตรวจสอบสถานะอุปกรณ์แบบเรียลไทม์
                </p>
                <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                  <v-btn 
                    to="/caseRepair" 
                    color="white" 
                    class="text-theme font-weight-bold rounded-pill btn-hover-lift" 
                    size="large"
                    elevation="2"
                  >
                    <i class="bi bi-plus-lg me-2"></i>งานรับซ่อมใหม่
                  </v-btn>
                  <v-btn 
                    to="/caseSentRepair" 
                    variant="outlined" 
                    color="white" 
                    class="font-weight-bold rounded-pill btn-hover-lift" 
                    size="large"
                  >
                    <i class="bi bi-send-arrow-up me-2"></i>งานส่งซ่อมใหม่
                  </v-btn>
                </div>
              </div>
              <div class="col-lg-4 text-center d-none d-lg-block">
                <div class="display-1 text-white opacity-25 floating-icon">
                  <i class="bi bi-cpu-fill" style="font-size: 8rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4 mb-md-5">
        <div class="d-flex align-items-center justify-content-between mb-3 px-1">
          <h4 class="fw-bold text-dark m-0 text-subtitle-1 text-md-h5">
            <i class="bi bi-activity me-2 text-theme"></i>ภาพรวมระบบ
          </h4>
        </div>

        <div class="row g-3 mx-0">
          <div class="col-12 col-sm-6 col-lg-3 px-1 px-md-2">
            <v-card class="border-0 shadow-sm h-100 kpi-card rounded-lg" elevation="1">
              <div class="card-body p-4">
                <div class="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <p class="text-muted small mb-1 text-uppercase fw-bold ls-1">งานทั้งหมด</p>
                    <h2 class="fw-bold text-theme mb-0">{{ stats.totalCases }}</h2>
                  </div>
                  <div class="icon-shape bg-theme-light text-theme rounded-circle">
                    <i class="bi bi-folder2-open fs-4"></i>
                  </div>
                </div>
              </div>
            </v-card>
          </div>

          <div class="col-12 col-sm-6 col-lg-3 px-1 px-md-2">
            <v-card class="border-0 shadow-sm h-100 kpi-card rounded-lg" elevation="1">
              <div class="card-body p-4">
                <div class="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <p class="text-muted small mb-1 text-uppercase fw-bold ls-1">กำลังดำเนินการ</p>
                    <h2 class="fw-bold text-warning mb-0">{{ stats.inProgress }}</h2>
                  </div>
                  <div class="icon-shape bg-warning-light text-warning rounded-circle">
                    <i class="bi bi-hourglass-split fs-4"></i>
                  </div>
                </div>
                <v-progress-linear 
                  :model-value="stats.progressPercent" 
                  color="warning" 
                  height="6" 
                  rounded
                ></v-progress-linear>
              </div>
            </v-card>
          </div>

          <div class="col-12 col-sm-6 col-lg-3 px-1 px-md-2">
            <v-card class="border-0 shadow-sm h-100 kpi-card rounded-lg" elevation="1">
              <div class="card-body p-4">
                <div class="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <p class="text-muted small mb-1 text-uppercase fw-bold ls-1">เสร็จสมบูรณ์</p>
                    <h2 class="fw-bold text-success mb-0">{{ stats.completed }}</h2>
                  </div> 
                  <div class="icon-shape bg-success-light text-success rounded-circle">
                    <i class="bi bi-check-lg fs-4"></i>
                  </div>                 
                </div>
                <div class="small text-muted d-flex align-items-center">
                  <i class="bi bi-graph-up-arrow me-1 text-success"></i>
                  อัตราสำเร็จ: {{ stats.completionRate }}%
                </div>
              </div>
            </v-card>
          </div>

          <div class="col-12 col-sm-6 col-lg-3 px-1 px-md-2">
            <v-card class="border-0 shadow-sm h-100 kpi-card rounded-lg" elevation="1">
              <div class="card-body p-4">
                <div class="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <p class="text-muted small mb-1 text-uppercase fw-bold ls-1">ระยะเวลาซ่อมเฉลี่ย</p>
                    <h2 class="fw-bold text-info mb-0">{{ stats.avgTime }} <span class="fs-6 fw-normal text-muted">วัน</span></h2>
                  </div>   
                  <div class="icon-shape bg-info-light text-info rounded-circle">
                    <i class="bi bi-clock-history fs-4"></i>
                  </div>               
                </div>
              </div>
            </v-card>
          </div>
        </div>
      </div>

      <div class="row g-3 g-md-4 mb-4 mb-md-5 mx-0">
        <div class="col-12 col-lg-4 px-1 px-md-2">
          <v-card class="border-0 shadow-sm h-100 rounded-xl" elevation="1">
            <div class="d-flex justify-content-between align-items-center pa-4 border-bottom">
              <div class="d-flex align-items-center">
                <div class="bg-theme rounded-pill me-3" style="width: 5px; height: 22px;"></div>
                <h6 class="font-weight-bold mb-0 text-dark text-subtitle-1">งานรับซ่อม (ในร้าน)</h6>
              </div>
              <v-chip color="#4D2FB2" text-color="white" size="small" class="font-weight-bold px-3">{{ stats.caseRepair }}</v-chip>
            </div>
            <div class="card-body p-3">
              <div class="d-flex align-items-center">
                <div style="width: 120px; flex-shrink: 0;" class="d-flex justify-content-center me-2">
                  <apexchart type="donut" width="120" height="120" :options="repairOptions" :series="repairSeries"></apexchart>
                </div>
                <div class="flex-grow-1">
                  <div class="py-2 border-bottom border-light d-flex justify-content-between align-items-center hover-bg-gray rounded px-2">
                    <span class="small text-grey-darken-2"><i class="bi bi-box-seam me-2 text-grey"></i>รับเครื่องแล้ว</span>
                    <span class="font-weight-bold text-dark">{{ stats.caseRepair_received }}</span>
                  </div>
                  <div class="py-2 border-bottom border-light d-flex justify-content-between align-items-center hover-bg-gray rounded px-2">
                    <span class="small text-grey-darken-2"><i class="bi bi-tools me-2 text-warning"></i>กำลังซ่อม</span>
                    <span class="font-weight-bold text-warning">{{ stats.caseRepair_repairing }}</span>
                  </div>
                  <div class="py-2 d-flex justify-content-between align-items-center hover-bg-gray rounded px-2">
                    <span class="small text-grey-darken-2"><i class="bi bi-check-circle me-2 text-success"></i>ซ่อมเสร็จแล้ว</span>
                    <span class="font-weight-bold text-success">{{ stats.caseRepair_repairComplete }}</span>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </div>

        <div class="col-12 col-lg-4 px-1 px-md-2">
          <v-card class="border-0 shadow-sm h-100 rounded-xl" elevation="1">
            <div class="d-flex justify-content-between align-items-center pa-4 border-bottom">
              <div class="d-flex align-items-center">
                <div class="bg-info rounded-pill me-3" style="width: 5px; height: 22px;"></div>
                <h6 class="font-weight-bold mb-0 text-dark text-subtitle-1">งานส่งซ่อม (ภายนอก)</h6>
              </div>
              <v-chip color="info" text-color="white" size="small" class="font-weight-bold px-3">{{ stats.sentRepairTotal }}</v-chip>
            </div>
            <div class="card-body p-3">
              <div class="d-flex align-items-center h-100">
                <div style="width: 120px; flex-shrink: 0;" class="d-flex justify-content-center me-2">
                  <apexchart type="donut" width="120" height="120" :options="sentRepairOptions" :series="sentRepairSeries"></apexchart>
                </div>
                <div class="flex-grow-1">
                  <div class="py-3 border-bottom border-light d-flex justify-content-between align-items-center hover-bg-gray rounded px-2">
                    <span class="small text-grey-darken-2"><i class="bi bi-truck me-2 text-info"></i>ส่งเครื่องไปแล้ว</span>
                    <span class="font-weight-bold text-info">{{ stats.sentRepair_sending }}</span>
                  </div>
                  <div class="py-3 d-flex justify-content-between align-items-center hover-bg-gray rounded px-2">
                    <span class="small text-grey-darken-2"><i class="bi bi-arrow-return-left me-2 text-success"></i>รับคืนแล้ว</span>
                    <span class="font-weight-bold text-success">{{ stats.sentRepair_received }}</span>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </div>

        <div class="col-12 col-lg-4 px-1 px-md-2">
          <v-card class="border-0 shadow-sm h-100 rounded-xl" elevation="1">
            <div class="d-flex justify-content-between align-items-center pa-4 border-bottom">
              <div class="d-flex align-items-center">
                <div class="bg-dark rounded-pill me-3" style="width: 5px; height: 22px;"></div>
                <h6 class="font-weight-bold mb-0 text-dark text-subtitle-1">งานติดตั้ง/โปรเจกต์</h6>
              </div>
              <v-chip color="dark" text-color="white" size="small" class="font-weight-bold px-3">{{ stats.caseProject }}</v-chip>
            </div>
            <div class="card-body p-3">
              <div class="d-flex align-items-center">
                <div style="width: 120px; flex-shrink: 0;" class="d-flex justify-content-center me-2">
                  <apexchart type="donut" width="120" height="120" :options="projectOptions" :series="projectSeries"></apexchart>
                </div>
                <div class="flex-grow-1">
                  <div class="py-2 border-bottom border-light d-flex justify-content-between align-items-center hover-bg-gray rounded px-2">
                    <span class="small text-grey-darken-2"><i class="bi bi-hourglass me-2 text-grey"></i>รอดำเนินการ</span>
                    <span class="font-weight-bold text-dark">{{ stats.caseProject_waiting }}</span>
                  </div>
                  <div class="py-2 border-bottom border-light d-flex justify-content-between align-items-center hover-bg-gray rounded px-2">
                    <span class="small text-grey-darken-2"><i class="bi bi-play-circle me-2 text-warning"></i>กำลังดำเนินการ</span>
                    <span class="font-weight-bold text-warning">{{ stats.caseProject_inProgress }}</span>
                  </div>
                  <div class="py-2 d-flex justify-content-between align-items-center hover-bg-gray rounded px-2">
                    <span class="small text-grey-darken-2"><i class="bi bi-flag me-2 text-success"></i>เสร็จสิ้น</span>
                    <span class="font-weight-bold text-success">{{ stats.caseProject_completed }}</span>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </div>
      </div>

      <div class="px-1 px-md-2">
        <v-card class="border-0 shadow-sm rounded-xl overflow-hidden" elevation="1">
          <div class="card-header bg-white border-0 py-3 py-md-4 px-3 px-md-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h5 class="fw-bold mb-0 text-dark text-subtitle-1 text-md-h6">กิจกรรมล่าสุด</h5>
            <v-btn 
              @click="loadDashboardData" 
              variant="tonal" 
              color="#4D2FB2"
              size="small"
              class="rounded-pill px-4"
              :loading="loading"
            >
              <v-icon start icon="mdi-refresh"></v-icon>
              อัปเดตข้อมูล
            </v-btn>
          </div>
          
          <v-data-table
            :headers="tableHeaders"
            :items="recentActivities"
            :loading="loading"
            loading-text="กำลังโหลดข้อมูล..."
            no-data-text="ไม่พบข้อมูลกิจกรรมล่าสุด"
            class="custom-v-table"
            hover
            hide-default-footer
            :items-per-page="-1"
          >
            <template v-slot:[`item.type`]="{ item }">
              <v-chip 
                :color="getVuetifyChipColor(item.type)" 
                variant="flat" 
                size="small" 
                class="font-weight-medium text-white px-3"
              >
                {{ item.type === 'caseRepair' ? 'งานซ่อมในร้าน' : item.type === 'sentRepair' ? 'ส่งซ่อมข้างนอก' : 'งานติดตั้ง' }}
              </v-chip>
            </template>

            <template v-slot:[`item.title`]="{ item }">
              <div class="py-2">
                <div class="font-weight-bold text-dark text-truncate mobile-truncate">
                  {{ item.title }}
                </div>
                <div class="text-caption text-grey text-truncate mobile-truncate">
                  {{ item.description }}
                </div>
              </div>
            </template>

            <template v-slot:[`item.status`]="{ item }">
              <span class="status-pill text-caption font-weight-bold" :class="getStatusClass(item.status)">
                {{ item.status }}
              </span>
            </template>

            <template v-slot:[`item.createdAt`]="{ item }">
              <div class="text-caption text-grey text-no-wrap">
                <v-icon size="x-small" class="me-1">mdi-calendar-clock</v-icon>
                {{ formatDate(item.createdAt) }}
              </div>
            </template>
          </v-data-table>
        </v-card>
      </div>

    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { sentRepairService } from "@/services/sentRepairService";

export default {
  name: "TheHome",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      loading: false,
      tableHeaders: [
        { title: 'ประเภทงาน', key: 'type', align: 'start', sortable: false, width: '150px' },
        { title: 'รายละเอียดอุปกรณ์', key: 'title', align: 'start', sortable: false },
        { title: 'สถานะ', key: 'status', align: 'center', sortable: false, width: '130px' },
        { title: 'วันที่บันทึก', key: 'createdAt', align: 'start', sortable: false, width: '130px' },
      ],
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
  computed: {
    // --- ตั้งค่ากราฟ งานรับซ่อม ---
    repairSeries() {
      return [
        this.stats.caseRepair_received || 0,
        this.stats.caseRepair_repairing || 0,
        this.stats.caseRepair_repairComplete || 0
      ];
    },
    repairOptions() {
      return {
        chart: { type: 'donut', sparkline: { enabled: true } }, // Sparkline ช่วยลดช่องว่างขอบกราฟทิ้งทั้งหมด
        colors: ['#6c757d', '#ffc107', '#198754'], // เทา, เหลือง, เขียว
        labels: ['รับเครื่องแล้ว', 'กำลังซ่อม', 'ซ่อมเสร็จแล้ว'],
        plotOptions: { pie: { donut: { size: '70%' } } },
        dataLabels: { enabled: false },
        legend: { show: false },
        stroke: { width: 2 },
        tooltip: { enabled: true, theme: 'light', y: { formatter: function(val) { return val + " รายการ" } } }
      };
    },

    // --- ตั้งค่ากราฟ งานส่งซ่อม ---
    sentRepairSeries() {
      return [
        this.stats.sentRepair_sending || 0,
        this.stats.sentRepair_received || 0
      ];
    },
    sentRepairOptions() {
      return {
        chart: { type: 'donut', sparkline: { enabled: true } },
        colors: ['#0dcaf0', '#198754'], // ฟ้า, เขียว
        labels: ['ส่งเครื่องไปแล้ว', 'รับคืนแล้ว'],
        plotOptions: { pie: { donut: { size: '70%' } } },
        dataLabels: { enabled: false },
        legend: { show: false },
        stroke: { width: 2 },
        tooltip: { enabled: true, theme: 'light', y: { formatter: function(val) { return val + " รายการ" } } }
      };
    },

    // --- ตั้งค่ากราฟ งานติดตั้ง ---
    projectSeries() {
      return [
        this.stats.caseProject_waiting || 0,
        this.stats.caseProject_inProgress || 0,
        this.stats.caseProject_completed || 0
      ];
    },
    projectOptions() {
      return {
        chart: { type: 'donut', sparkline: { enabled: true } },
        colors: ['#6c757d', '#ffc107', '#198754'], // เทา, เหลือง, เขียว
        labels: ['รอดำเนินการ', 'กำลังดำเนินการ', 'เสร็จสิ้น'],
        plotOptions: { pie: { donut: { size: '70%' } } },
        dataLabels: { enabled: false },
        legend: { show: false },
        stroke: { width: 2 },
        tooltip: { enabled: true, theme: 'light', y: { formatter: function(val) { return val + " รายการ" } } }
      };
    }
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
    getVuetifyChipColor(type) {
      const colors = {
        caseRepair: "#4D2FB2", // ธีมม่วง
        sentRepair: "info",
        caseProject: "dark"
      };
      return colors[type] || "grey";
    },
    getStatusClass(status) {
      const s = (status || '').toString().trim().toLowerCase();
      const map = {
        'รอดำเนินการ': 'status-pending',
        'pending': 'status-pending',
        'กำลังดำเนินการ': 'status-inprogress',
        'in progress': 'status-inprogress',
        'กำลังส่ง': 'status-inprogress',
        'ส่งซ่อม': 'status-info',
        'sending': 'status-info',
        'รับคืนแล้ว': 'status-completed',
        'เสร็จสมบูรณ์': 'status-completed',
        'ซ่อมเสร็จ': 'status-completed',
        'completed': 'status-completed',
        'ยกเลิก': 'status-cancelled',
        'cancelled': 'status-cancelled',
        'on hold': 'status-onhold',
        'พักไว้': 'status-onhold'
      };
      return map[s] || 'status-default';
    },
    formatDate(dateStr) {
      if (!dateStr) return "-";
      let day, month, year;

      if (typeof dateStr === 'string' && dateStr.includes('T')) {
          const pureDate = dateStr.split('T')[0];
          const parts = pureDate.split('-');
          year = parseInt(parts[0]);
          month = parts[1];
          day = parts[2];
      } else {
          const dateObj = new Date(dateStr);
          if (isNaN(dateObj.getTime())) return dateStr;
          year = dateObj.getFullYear();
          month = String(dateObj.getMonth() + 1).padStart(2, '0');
          day = String(dateObj.getDate()).padStart(2, '0');
      }

      if (year < 2400) {
          year = year + 543;
      }
      return `${day}-${month}-${year}`;
    }
  }
};
</script>

<style scoped>
/* Base Layout & Responsive Fixes */
.page-container {
  background-color: var(--background);
  min-height: 100vh;
  font-family: 'Sarabun', sans-serif;
  max-width: 100vw;
  overflow-x: clip; /* ป้องกันจอทะลุแนวนอนบนมือถือ */
}

.ls-1 { letter-spacing: 0.5px; }
.fs-7 { font-size: 0.85rem; }

/* Theme Colors */
.bg-theme { background-color: #4d2fb2 !important; }
.bg-theme-gradient {
  background: linear-gradient(135deg, #4d2fb2 0%, #7B56D8 100%);
}
.text-theme { color: #4d2fb2 !important; }
.bg-theme-light { background-color: rgba(77, 47, 178, 0.1); }
.bg-warning-light { background-color: rgba(255, 193, 7, 0.1); }
.bg-success-light { background-color: rgba(25, 135, 84, 0.1); }
.bg-info-light { background-color: rgba(13, 202, 240, 0.1); }

/* Hero Section */
.text-white-80 { color: rgba(255, 255, 255, 0.8); }
.circle-decoration {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  z-index: 1;
}
.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -50px;
}
.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -30px;
  left: 20%;
}
.backdrop-blur {
  backdrop-filter: blur(5px);
}

/* Cards */
.kpi-card, .detail-card, .hero-section {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(77, 47, 178, 0.1) !important;
}
.icon-shape {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Buttons */
.btn-hover-lift {
  transition: transform 0.2s;
}
.btn-hover-lift:hover {
  transform: translateY(-2px);
}

/* Status Pills */
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 50px;
  line-height: 1.5;
}
.status-pending { background-color: #f8f9fa; color: #6c757d; border: 1px solid #e9ecef; }
.status-inprogress { background-color: #fff8e1; color: #ffc107; border: 1px solid #ffeeba; }
.status-info { background-color: #e0f8fA; color: #0dcaf0; border: 1px solid #b6effb; }
.status-completed { background-color: #e6f8f0; color: #198754; border: 1px solid #c3ebd7; }
.status-cancelled { background-color: #fceceb; color: #dc3545; border: 1px solid #f5c2c7; }
.status-default { background-color: #f8f9fa; color: #495057; }

/* Vuetify Table Customization */
:deep(.custom-v-table th) {
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6c757d !important;
  background-color: #f8f9fa !important;
  border-bottom: none !important;
}
:deep(.custom-v-table td) {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  border-bottom-color: #f1f5f9 !important;
}

/* Mobile Truncate */
.mobile-truncate {
  max-width: 250px;
}
@media (max-width: 575.98px) {
  .mobile-truncate {
    max-width: 180px;
  }
}

/* Detail Lists */
.hover-bg-gray {
  transition: background-color 0.2s;
}
.hover-bg-gray:hover {
  background-color: #f8f9fa;
}

/* Animations */
.floating-icon {
  animation: float 6s ease-in-out infinite;
}
@keyframes float {
  0% { transform: translatey(0px); }
  50% { transform: translatey(-15px); }
  100% { transform: translatey(0px); }
}

@media (min-width: 992px) {
  .page-container { padding-left: 280px; }
}
</style>