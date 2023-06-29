using Main.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contest
{
    public class Result : IResult
    {
        private readonly IMongoCollection<ResultData> table;// creating a variable to access the collection in the database
        private MongoClient mongoClient;// variable to connect to the mongodb server
        private IMongoDatabase mongoDatabase;// instance of the database we have to make changes to
        public Result()
        {
            // assigning the values to the variables
            mongoClient = new MongoClient("mongodb://localhost:27017");
            mongoDatabase = mongoClient.GetDatabase("Contest");
            table = mongoDatabase.GetCollection<ResultData>("Result");
        }
        // Retrieves all documents from collection and returns a list of type ResultData
        public async Task<List<ResultData>> GetResultAsync() =>
            await table.Find(_ => true).ToListAsync();
        // Retrieves the document with the given id and returns it otherwise returns null 
        public async Task<ResultData?> GetResultAsync(string id) =>
            await table.Find(x => x._id == id).FirstOrDefaultAsync();
        // creates a new document of ParticipantData type in the collection
        public async Task CreateResultAsync(ResultData newResult) =>
            await table.InsertOneAsync(newResult);

    }
}
