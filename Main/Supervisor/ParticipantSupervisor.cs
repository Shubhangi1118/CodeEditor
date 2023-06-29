using Contest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Main.Models;


namespace Main.Supervisor
{
    public class ParticipantSupervisor
    {
        // Dependency injection of IParticipant
        private IParticipant _participant;
        public ParticipantSupervisor(IParticipant participant) 
        {
            _participant = participant;
        }
        // Getting the participant array
        public async Task<List<ParticipantData>> GetParticipantAsync()=>
           await _participant.GetParticipantAsync();
        // Getting the participant with the given id
        public async Task<ParticipantData> GetParticipantAsync(string id)
        {
            var participant = await _participant.GetParticipantAsync(id);
            return participant;
        }
        // creating a new participant in the database
        public async Task CreateParticipantAsync(ParticipantData newParticipant)
        {
            await _participant.CreateParticipantAsync(newParticipant);
        }
    }
}
