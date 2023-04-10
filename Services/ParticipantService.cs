using CodeEditor.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using CodeEditor.Models;

namespace CodeEditor.Services
{
    public class ParticipantService
    {
        private readonly IMongoCollection<Participant> _UsersCollection;

        public ParticipantService(
            IOptions<ParticipantSetting> ParticipantSettings)
        {
            var mongoClient = new MongoClient(
                    ParticipantSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                ParticipantSettings.Value.DatabaseName);

            _UsersCollection = mongoDatabase.GetCollection<Participant>(
                ParticipantSettings.Value.UserCollectionName);
        }

        public async Task<List<Participant>> GetAsync() =>
            await _UsersCollection.Find(_ => true).ToListAsync();

        public async Task<Participant?> GetAsync(string id) =>
            await _UsersCollection.Find(x => x._id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Participant newUser) =>
            await _UsersCollection.InsertOneAsync(newUser);


    }
}
