using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Collections.Generic;

namespace Main.Models
{
    public class EditorData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }

        public string Question { get; set; }
        public string ExplanationExample { get; set; }
        public string InputFormat { get; set; }
        public string OutputFormat { get; set; }
        public Dictionary<string, string> DriverCode1 { get; set; }
        public Dictionary<string,string> FunctionCode { get; set; }
        public Dictionary<string,string> DriverCode2 { get; set; }
        public List<TestCase> TestCases { get; set; }
    }

    public class TestCase
    {
        public string Inputs { get; set; }
        public string ExpectedOutput { get; set; }
    }
}
