import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtzYfQgh2FjD0Bx4qMXef_pRidh8fjBQs",
  authDomain: "goaura-3265d.firebaseapp.com",
  projectId: "goaura-3265d",
  storageBucket: "goaura-3265d.firebasestorage.app",
  messagingSenderId: "776019690907",
  appId: "1:776019690907:web:75fcbc47fade8999744d3e",
  measurementId: "G-YZBFSX1F1W"
};

const app = initializeApp(firebaseConfig);

// 🔥 THIS IS IMPORTANT
export const db = getFirestore(app);