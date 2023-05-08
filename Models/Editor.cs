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

       public List<string> TestCases { get; set; }
       public List<string> ExpectedOutputs { get; set; }
    }
}
