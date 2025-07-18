import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Cấu hình Firebase (lấy từ Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyD1tByhPowa8ls-9lsNo398d8mEpLycnos",
    authDomain: "coffeeexpress-8e70b.firebaseapp.com",
    projectId: "coffeeexpress-8e70b",
    storageBucket: "coffeeexpress-8e70b.firebasestorage.app",
    messagingSenderId: "809066685836",
    appId: "1:809066685836:web:29a294a09418284b44e2a9",
    measurementId: "G-3WN6PM1X4H"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Khởi tạo các dịch vụ
const auth = getAuth(app);
const db = getFirestore(app);

// Xuất các dịch vụ để dùng trong các file khác
export { auth, db };
