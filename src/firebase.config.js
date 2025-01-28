import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDKLDKtFurEYTFCxEtegb5LqXGRTNVfRIQ',
  authDomain: 'house-marketplace-app-d7158.firebaseapp.com',
  projectId: 'house-marketplace-app-d7158',
  storageBucket: 'house-marketplace-app-d7158.firebasestorage.app',
  messagingSenderId: '174987829553',
  appId: '1:174987829553:web:d2863e373d4567a6029010',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
