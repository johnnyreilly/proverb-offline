using System.Collections.Generic;
using Proverb.Data.Models;
using System.Threading.Tasks;

namespace Proverb.Data.CommandQuery.Interfaces
{
    public interface ISayingCommand
    {
        Task<int> CreateAsync(Saying saying);
        Task DeleteAsync(int id);
        Task UpdateAsync(Saying saying);
    }
}
