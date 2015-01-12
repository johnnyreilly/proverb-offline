using System.Threading.Tasks;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery.Interfaces
{
    public interface ISayingCommand
    {
        Task<int> CreateAsync(Saying saying);
        Task DeleteAsync(int id);
        Task UpdateAsync(Saying saying);
    }
}
