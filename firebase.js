// Importa las funciones necesarias de los SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Configuración de tu aplicación Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC4T0xGsU-a1rUwdC98T17RXTzLoDYw-_A",
  authDomain: "encuestaprobabilidaes.firebaseapp.com",
  projectId: "encuestaprobabilidaes",
  storageBucket: "encuestaprobabilidaes.appspot.com",
  messagingSenderId: "444446720213",
  appId: "1:444446720213:web:cbfe0815bb9b241b60a25c",
  measurementId: "G-1E68CR8NWF"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

export { db, collection, addDoc };
