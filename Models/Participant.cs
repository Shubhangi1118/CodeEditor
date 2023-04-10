using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace CodeEditor.Models
{
    public class Participant
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string College { get; set; }
    }
}
