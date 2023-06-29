using Main.Models;

namespace Contest
{
    public interface IParticipant
    {
        Task CreateParticipantAsync(ParticipantData newParticipant);
        Task<List<ParticipantData>> GetParticipantAsync();
        Task<ParticipantData?> GetParticipantAsync(string id);
    }
}