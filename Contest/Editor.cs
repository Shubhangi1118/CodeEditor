using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Main.Models;

namespace Contest
{
    public class Editor : IEditor
    {
        private readonly IMongoCollection<EditorData> table;// creating a variable to access the collection in the database
        private MongoClient mongoClient;// variable to connect to the mongodb server
        private IMongoDatabase mongoDatabase;// instance of the database we have to make changes to
        public Editor()
        {
            // assigning the values to the variables
            mongoClient = new MongoClient("mongodb://localhost:27017");
            mongoDatabase = mongoClient.GetDatabase("Contest");
            table = mongoDatabase.GetCollection<EditorData>("Editor");
        }
        // Retrieves all documents from collection and returns a list of type EditorData
        public async Task<List<EditorData>> GetEditorAsync() =>
            await table.Find(_ => true).ToListAsync();
        // Retrieves the document with the given id and returns it otherwise returns null 
        public async Task<EditorData?> GetEditorAsync(string id) =>
            await table.Find(x => x._id == id).FirstOrDefaultAsync();
        // creates a new document of EditorData type in the collection
        public async Task CreateEditorAsync(EditorData newQuestion) =>
            await table.InsertOneAsync(newQuestion);
        // updates the document with the given id and replaces it with updatedQuestion of type EditorData
        public async Task UpdateEditorAsync(string id, EditorData updatedQuestion) =>
       await table.ReplaceOneAsync(x => x._id == id, updatedQuestion);
        // delete the document with the given id
        public async Task RemoveEditorAsync(string id) =>
            await table.DeleteOneAsync(x => x._id == id);
    }
}
