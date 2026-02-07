import { createApp } from 'vue'
import App from './App.vue'
import router from './route'

// 1. Import Vuetify 
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'


// 2. Import Icons (ถ้าต้องการใช้ checkbox หรือ icon ต่างๆ)
import '@mdi/font/css/materialdesignicons.css'

// 3. สร้าง instance ของ Vuetify
const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

// 4. เรียกใช้งานทั้ง router และ vuetify
app.use(router)
app.use(vuetify)
app.use(VueViewer)

app.mount('#app')