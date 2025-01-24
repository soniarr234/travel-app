// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importa Firestore
import { getAnalytics } from "firebase/analytics";

// Configuración de tu aplicación Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCAj2dUpoldf7AsYlPfCDvrv6yPy0Dv1ik",
  authDomain: "pulguiviajes.firebaseapp.com",
  projectId: "pulguiviajes",
  storageBucket: "pulguiviajes.firebasestorage.app",
  messagingSenderId: "960626686573",
  appId: "1:960626686573:web:01fc0098aebe8f979bdd64",
  measurementId: "G-64PR35PDKW"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
export const db = getFirestore(app); // Exporta la instancia de Firestore

// Inicializa Analytics (opcional, solo si lo necesitas)
export const analytics = getAnalytics(app);
