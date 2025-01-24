// firestoreService.js
import { collection, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Guardar datos en Firestore
export const saveData = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), data);
    console.log("Datos guardados correctamente");
  } catch (error) {
    console.error("Error al guardar datos: ", error);
  }
};

// Obtener datos de Firestore
export const getData = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("El documento no existe");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener datos: ", error);
  }
};

// Escuchar cambios en tiempo real
export const subscribeToData = (collectionName, docId, callback) => {
  try {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        console.log("El documento no existe");
      }
    });
  } catch (error) {
    console.error("Error al suscribirse a cambios: ", error);
  }
};
