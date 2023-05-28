using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Collections.Generic;

namespace CodeEditor.Models
{
    public class Result
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string participantId { get; set; }
        public List<int> Outputs { get; set; }
    }
}
