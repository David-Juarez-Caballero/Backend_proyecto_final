//Granting acces to the database

const firebase = require("firebase-admin");

const serviceAccount = require("../key.json");

const mongoose = require("mongoose");


firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

//crear una base de datos(excel)

const db = firebase.firestore();

module.exports = {
  db
}