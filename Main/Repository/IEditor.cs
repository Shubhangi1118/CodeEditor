using Main.Models;

namespace Contest
{
    public interface IEditor
    {
        Task CreateEditorAsync(EditorData newQuestion);
        Task<List<EditorData>> GetEditorAsync();
        Task<EditorData?> GetEditorAsync(string id);
        Task RemoveEditorAsync(string id);
        Task UpdateEditorAsync(string id, EditorData updatedQuestion);
    }
}