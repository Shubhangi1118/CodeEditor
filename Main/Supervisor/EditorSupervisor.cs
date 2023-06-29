
using Contest;
using Main.Models;

namespace Main.Supervisor
{
    public class EditorSupervisor
    {
        // Dependency injection of IEditor
        private IEditor _editor;
        public EditorSupervisor(IEditor editor)
        {
            _editor = editor;
        }
        // Getting the question array
        public async Task<List<EditorData>> GetEditorAsync()=>
            await _editor.GetEditorAsync();
        // getting the question with the given id
        public async Task<EditorData> GetEditorAsync(string id)
        {
            var question = await _editor.GetEditorAsync(id);
            return question;
        }
        // creating a new question
        public async Task CreateEditorAsync(EditorData newQuestion)=>
            await _editor.CreateEditorAsync(newQuestion);
        // Updating the question with the given id and changing teh value to updatedQuestion  
        public async Task UpdateEditorAsync(string id,EditorData updatedQuestion)
        {
            var question = await _editor.GetEditorAsync(id);
            if(question is null)// if there is no question with the given id
            {
                throw new Exception("Not Found");
            }
            updatedQuestion._id = question._id;
            await _editor.UpdateEditorAsync(id, updatedQuestion);

        }
        // deleting the question with the given id
        public async Task RemoveEditorAsync(string id)
        {
            var question = await _editor.GetEditorAsync(id);
            if(question is null)// if there is no question with the given id
            {
                throw new Exception("Not Found");
            }
            await _editor.RemoveEditorAsync(id);
        }
    }
}
