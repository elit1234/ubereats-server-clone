const firebase = require("firebase");

var firebaseConfig = {
  apiKey: "AIzaSyDRlFE7hoHmkVQyq4fiEuB1-c86quL-Qx4",
  authDomain: "fir-da7e8.firebaseapp.com",
  databaseURL: "https://fir-da7e8-default-rtdb.firebaseio.com",
  projectId: "fir-da7e8",
  storageBucket: "fir-da7e8.appspot.com",
  messagingSenderId: "498149020660",
  appId: "1:498149020660:web:b04ae9d0bc4b0926f7dfa1"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firebaseRef = firebase.database();

module.exports = firebaseRef;
