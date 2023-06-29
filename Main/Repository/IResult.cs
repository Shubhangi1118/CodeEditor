using Main.Models;

namespace Contest
{
    public interface IResult
    {
        Task CreateResultAsync(ResultData newResult);
        Task<List<ResultData>> GetResultAsync();
        Task<ResultData?> GetResultAsync(string id);
    }
}