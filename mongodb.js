
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jflaxman7349:AzDijjQQuzXbZcH5@cluster0.bhj6303.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

  
  async function connectDB() {
    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();
      // Access the Chat database and messages collection
      const db = client.db('Chat');
      const messagesCollection = db.collection('messages');
      console.log("Connected to MongoDB and ready to use the Chat database with messages collection.");
      
      return { db, messagesCollection };
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err);
      throw err;
    }
  }

module.exports = {connectDB}
