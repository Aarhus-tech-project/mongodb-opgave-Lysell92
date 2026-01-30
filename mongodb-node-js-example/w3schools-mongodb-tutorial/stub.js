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

        // Ensure the documents doesn't add up. 
        await collection.deleteMany({});

        // Insert one
        const insertResult = await collection.insertOne({
            name: "John Doe",
            age: 25,
            major: "Computer Science"
        })

        console.log('Inserted document:', insertResult.insertedId);

        // Insert many
        const insertMany = await collection.insertMany([
            {
                name: "Peter",
                age: 33,
                major: "Data-Technician with speciality in programming"
            },
            {
                name: "Hans",
                age: 37,
                major: "Carpenter"
            },
            {
                name: "Sir Hans",
                age: 253,
                major: "Knight"
            },
            {
                name: "Soeren",
                age: 253,
                major: "Carpenter"
            },
            {
                name: "Sir Peter",
                age: 850,
                major: "Data-Technician with speciality in programming"
            }
        ])

        console.log('Several sets inserted into documents:', insertMany.insertedIds);



        // Read
        const findResult = await collection.findOne({ name: "Hans" });
        console.log('Found document:', findResult);

        // Read many
        const findCategory = await collection.find({}, { projection: { name: 1, age: 1, _id: 0 } }).toArray();
        console.log('Displaying categories:', findCategory);
        console.log(await collection.countDocuments());

        // Update
        const updateData = await collection.updateOne({ name: "Hans" }, { $set: { age: 52 } },
            // Still updates the document, but inserts into a new document if not found. 
            { upsert: true });

        // Registers the update and displays it.
        const findUpdate = await collection.findOne({ name: "Hans" });
        console.log('Found document:', findUpdate);

        // Aggregates
        const aggregateData = await collection.aggregate([
            { $group: { _id: "$age", count: { $sum: 1 } } }
        ]).toArray();
        console.log("Aggregate of same ages", aggregateData);

        const aggregateData2 = await collection.aggregate([
            { $group: { _id: "$major", count: { $sum: 1 } } }
        ]).toArray();
        console.log("Aggregate of same major", aggregateData2);

        // Aggregate that limits the amount of documents to be read
        const limitData = await collection.aggregate([
            { $project: { name: 1, major: 1, age: 1, _id: 0 } },
            { $limit: 2 } ]).toArray();
        console.log("Aggregate that limit how many datas to read", limitData);

        // Aggregate that sorts the data
        const sortData = await collection.aggregate([
            { $sort: { "age": -1 } },
            { $project: { "name": 1, "age": 1 } },
            { $limit: 4 }]).toArray();
        console.log("Sorts data descending from the highest age:", sortData);


        // Delete 
        const deleteData = await collection.deleteOne({ name: "Hans" });
        console.log('Displaying deleted data:', deleteData);

        // Delete several
        const deleteSeveral = await collection.deleteMany({ age: { $gt: 35 } });
        console.log('Displaying the several delete documents:', deleteSeveral);

        // Read again to display changes:
        const findResult2 = await collection.findOne({ name: "Hans" });
        console.log('Found document:', findResult2);

        const findCategory2 = await collection.find({}, { projection: { name: 1, age: 1, _id: 0 } }).toArray();
        console.log('Displaying categories:', findCategory2);
        console.log(await collection.countDocuments());


        


  } catch (err) {
    console.error('Error: ', err);
  } finally {
    console.log('Closing connection...');
    await client.close();
  }
}

main();