import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyA2h0J3xkMGM13SU6eomUA3wJJHh8yga_o",
    authDomain: "crm-storage-v1.firebaseapp.com",
    projectId: "crm-storage-v1",
    storageBucket: "crm-storage-v1.appspot.com",
    messagingSenderId: "335115019834",
    appId: "1:335115019834:web:42d1c6b91a20fb8d48f703",
    measurementId: "G-YL1H72H022"
};
firebase.initializeApp(firebaseConfig);
var storage: firebase.storage.Storage = firebase.storage();

export default storage;
