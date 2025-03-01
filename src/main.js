import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  // Your Firebase configuration will go here
  // You'll need to replace this with your actual Firebase project configuration
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-authDomain-aqui",
  projectId: "tu-project-id-aqui",
  storageBucket: "tu-storageBucket-aqui",
  messagingSenderId: "tu-messagingSenderId-aqui",
  appId: "tu-app-id-aqui"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

// Make Firebase services available in all components
const app = createApp(App)
app.config.globalProperties.$db = db
app.config.globalProperties.$auth = auth

app.use(createPinia())
app.use(router)

app.mount('#app')