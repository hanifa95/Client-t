// Firebase core
import { initializeApp } from "firebase/app";

// Auth
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Analytics (опционально)
import { getAnalytics } from "firebase/analytics";

// Конфигурация Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCd2HOj6wNoZpi_tEKacbyN374ug0vPNlw",
//   authDomain: "first-bd55e.firebaseapp.com",
//   projectId: "first-bd55e",
//   storageBucket: "first-bd55e.firebasestorage.app",
//   messagingSenderId: "306228559688",
//   appId: "1:306228559688:web:8eb42a7e55f83d97f23d7d",
//   measurementId: "G-8DTRG41LYT"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDC-0u1fP7_Jcrp_6Pu9AhCJD_bBoW8ZPI",
  authDomain: "client-8b6fc.firebaseapp.com",
  projectId: "client-8b6fc",
  storageBucket: "client-8b6fc.firebasestorage.app",
  messagingSenderId: "847141847060",
  appId: "1:847141847060:web:0cc2fc6acbdab14786a701",
  measurementId: "G-NF07N8Q2TF"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация сервисов
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics (можно удалить, если не нужен)
export const analytics = getAnalytics(app);