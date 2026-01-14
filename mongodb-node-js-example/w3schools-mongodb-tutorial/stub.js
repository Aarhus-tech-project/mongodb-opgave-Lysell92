// W3schools MongoDB tutorial
// https://www.w3schools.com/mongodb/index.php

// Install Docker Desktop:
// winget install Docker.DockerDesktop

// Install Node.js:
// npm init -y
// npm install mongodb

// Run Docker Desktop:
// docker run --name mongodb -d -p 27017:27017 mongo:latest

// Run Node.js example:
// node stub.js

const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url);
const dbName = 'school';
const collectionName = 'students'

async function main() {
  
  // Connect to db
  try {
    await client.connect();
    console.log('Connected successfully to server');
  } catch (err) {
    console.error('CRITICAL: Could not connect to database.', err);
    return; 
  }

  // Db operations
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert one
    const insertResult = await collection.insertOne({
      name: "John Doe",
      age: 25,
      major: "Computer Science"
    });
    console.log('Inserted document:', insertResult.insertedId);

    // Read
    const findResult = await collection.findOne({ name: "John Doe" });
    console.log('Found document:', findResult);

  } catch (err) {
    console.error('Error: ', err);
  } finally {
    console.log('Closing connection...');
    await client.close();
  }
}

main();