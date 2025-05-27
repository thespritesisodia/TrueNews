// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyChxh49wSpMX6UyA1PebL1ZS5JKQN4BqQI",
    authDomain: "truenews-cd60a.firebaseapp.com",
    projectId: "truenews-cd60a",
    storageBucket: "truenews-cd60a.firebasestorage.app",
    messagingSenderId: "799255318021",
    appId: "1:799255318021:web:b3f67237057a2f4438d66c",
    measurementId: "G-N1F44P6DZD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();

// Initialize Firestore
const db = firebase.firestore(); 