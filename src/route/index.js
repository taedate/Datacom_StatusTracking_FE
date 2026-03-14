import { createRouter, createWebHistory } from "vue-router"
import TheRegister from "@/components/TheRegister.vue"
import TheHome from "@/components/TheHome.vue"
import TheInviteCreate from "@/components/TheInviteCreate.vue"
import TheAuditLogs from "@/components/TheAuditLogs.vue"
import TheLogin from "@/components/TheLogin.vue"
import TheDocumentDetail from "@/components/TheCaseRepairDetail.vue"
import TheCaseRepair from "@/components/TheCaseRepair.vue"
import TheCaseProject from "@/components/TheCaseProject.vue"
import TheCaseProjectDetail from "@/components/TheCaseProjectDetail.vue"
import TheCaseSentRepair from "@/components/TheCaseSentRepair.vue"
import TheCaseSentRepairDetail from "@/components/TheCaseSentRepairDetail.vue"
import TheQuotation from "@/components/TheQuotation.vue"
import TheQuotationDetail from "@/components/TheQuotationDetail.vue"
import TheUrgentOverview from "@/components/TheUrgentOverview.vue"

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TheHome,
    meta: { requiresAuth: true } 
  },
  {
    path: '/register',
    name: 'Register',
    component: TheRegister,
    meta: { 
      hideNavbar: true 
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: TheLogin,
    meta: { 
      hideNavbar: true  
    }
  },
  {
    path: '/caseRepair',
    name: 'CaseRepair',
    component: TheCaseRepair,
    meta: { requiresAuth: true }
  },
  {
    path: '/caseRepair/:id',
    name: 'TheCaseRepairDetail',
    component: TheDocumentDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/caseProject',
    name: 'TheCaseProject',
    component: TheCaseProject,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/caseProject/:id',
    name: 'TheCaseProjectDetail',
    component: TheCaseProjectDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/caseSentRepair',
    name: 'TheCaseSentRepair',
    component: TheCaseSentRepair,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/caseSentRepair/:id',
    name: 'TheCaseSentRepairDetail',
    component: TheCaseSentRepairDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/quotation',
    name: 'TheQuotation',
    component: TheQuotation,
    meta: { requiresAuth: true }
  },
  {
    path: '/quotation/:id',
    name: 'TheQuotationDetail',
    component: TheQuotationDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/urgentOverview',
    name: 'TheUrgentOverview',
    component: TheUrgentOverview,
    meta: { requiresAuth: true }
  },
  {
    path: '/invite',
    name: 'TheInviteCreate',
    component: TheInviteCreate,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin-logs',
    name: 'TheAuditLogs',
    component: TheAuditLogs,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// -----------------------------
// Navigation Guard
// -----------------------------
router.beforeEach((to, from, next) => {
  const userId = sessionStorage.getItem("userId")
  const role   = sessionStorage.getItem("role")

  if (to.meta.requiresAuth && !userId) {
    next("/login")
  } else if (to.meta.requiresAdmin && role !== "admin") {
    next("/")
  } else {
    next()
  }
})


export default router
