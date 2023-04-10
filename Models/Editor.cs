using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace CodeEditor.Models
{
    public class Editor
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }

        public string Question { get; set; }

        public List<string> Languages { get; set; }

        public string TestCase1 { get; set; }
        public string TestCase2 { get; set; }
        public string TestCase3 { get; set; }
        public string ExpectedOutput1 { get; set; }
        public string ExpectedOutput2 { get; set; }
        public string ExpectedOutput3 { get; set; }
    }
}
