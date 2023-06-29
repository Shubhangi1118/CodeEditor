using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Main.Models
{
    public class CodeInput
    {
        public string code { get; set; }
        public List<string> expectedOutputs { get; set; }
        public int QuestionNumber { get; set; }
        public string language { get; set; }
        public List<List<string>> testCaseInputs { get; set; }
        public string participantId { get; set; }
    }
}
