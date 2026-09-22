// إعدادات فايربيس الخاصة بمشروعك (tsawq-33f80)
// ملاحظة: هذا الملف يستخدم أسلوب "compat" (عبر script tags) وليس import،
// لأن index.html و admin.html يحمّلان مكتبات firebase عبر <script> مباشرة بدون أي أداة تجميع (bundler).

const firebaseConfig = {
  apiKey: "AIzaSyCflCjX0KjdhBjgXgp2ZAgOVXy6EhIGlX4",
  authDomain: "tsawq-33f80.firebaseapp.com",
  projectId: "tsawq-33f80",
  storageBucket: "tsawq-33f80.firebasestorage.app",
  messagingSenderId: "270608539408",
  appId: "1:270608539408:web:db59d825000d8345d98f95",
  measurementId: "G-S0JHLBQ52Z"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
