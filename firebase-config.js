const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const firebaseConfigurado = false;

export { db, firebaseConfigurado };