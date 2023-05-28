using CodeEditor.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CodeEditor.Services
{
    public class ResultService
    {
        private readonly IMongoCollection<Result> _UsersCollection;

        public ResultService(
            IOptions<ResultSetting> ResultSettings)
        {
            var mongoClient = new MongoClient(
                ResultSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                ResultSettings.Value.DatabaseName);

            _UsersCollection = mongoDatabase.GetCollection<Result>(
                ResultSettings.Value.UserCollectionName);
        }

        public async Task<List<Result>> GetAsync() =>
            await _UsersCollection.Find(_ => true).ToListAsync();

        public async Task<Result?> GetAsync(string id) =>
            await _UsersCollection.Find(x => x._id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Result newUser) =>
            await _UsersCollection.InsertOneAsync(newUser);

        public async Task UpdateAsync(string id, Result updatedUser) =>
            await _UsersCollection.ReplaceOneAsync(x => x._id == id, updatedUser);

        public async Task RemoveAsync(string id) =>
            await _UsersCollection.DeleteOneAsync(x => x._id == id);
    }
}
