using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;
using CodeEditor.Models;
using MongoDB.Bson;
using MongoDB.Driver;



namespace CodeEditor.Services
{
    public class EditorService
    {
        private readonly IMongoCollection<Editor> _UsersCollection;

        public EditorService(
            IOptions<EditorSetting> EditorSettings)
        {
            var mongoClient = new MongoClient(
                EditorSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                EditorSettings.Value.DatabaseName);

            _UsersCollection = mongoDatabase.GetCollection<Editor>(
                EditorSettings.Value.UserCollectionName);
        }

        public async Task<List<Editor>> GetAsync() =>
            await _UsersCollection.Find(_ => true).ToListAsync();

        public async Task<  Editor?> GetAsync(string id) =>
            await _UsersCollection.Find(x => x._id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Editor newUser) =>
            await _UsersCollection.InsertOneAsync(newUser);

        public async Task UpdateAsync(string id, Editor updatedUser) =>
            await _UsersCollection.ReplaceOneAsync(x => x._id == id, updatedUser);

        public async Task RemoveAsync(string id) =>
            await _UsersCollection.DeleteOneAsync(x => x._id == id);
    }
}
