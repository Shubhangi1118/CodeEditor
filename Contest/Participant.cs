using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Main.Models;
using Microsoft.Extensions.Options;

namespace Contest
{
    public class Participant : IParticipant
    {
        private readonly IMongoCollection<ParticipantData> table;// creating a variable to access the collection in the database
        private MongoClient mongoClient;// variable to connect to the mongodb server
        private IMongoDatabase mongoDatabase;// instance of the database we have to make changes to

        public Participant()
        {
            // assigning the values to the variables
            mongoClient = new MongoClient("mongodb://localhost:27017");
            mongoDatabase = mongoClient.GetDatabase("Contest");
            table = mongoDatabase.GetCollection<ParticipantData>("Participant");
        }
        //public Participant(
        //    IOptions<DataSetting> ParticipantSettings)
        //{
        //    var mongoClient = new MongoClient(
        //            ParticipantSettings.Value.ConnectionString);

        //    var mongoDatabase = mongoClient.GetDatabase(
        //        ParticipantSettings.Value.DatabaseName);

        //    table = mongoDatabase.GetCollection<ParticipantData>(
        //        ParticipantSettings.Value.UserCollectionName);
        //}

        // Retrieves all documents from collection and returns a list of type ParticipantData
        public async Task<List<ParticipantData>> GetParticipantAsync() =>
            await table.Find(_ => true).ToListAsync();
        // Retrieves the document with the given id and returns it otherwise returns null 
        public async Task<ParticipantData?> GetParticipantAsync(string id) =>
            await table.Find(x => x._id == id).FirstOrDefaultAsync();
        // creates a new document of ParticipantData type in the collection
        public async Task CreateParticipantAsync(ParticipantData newParticipant) =>
            await table.InsertOneAsync(newParticipant);
    }
}
