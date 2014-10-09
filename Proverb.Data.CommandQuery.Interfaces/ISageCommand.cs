using System.Collections.Generic;
using Proverb.Data.Models;
using System.Threading.Tasks;

namespace Proverb.Data.CommandQuery.Interfaces
{
    public interface ISageCommand
    {
        Task<int> CreateAsync(Sage sage);
        Task DeleteAsync(int id);
        Task UpdateAsync(Sage sage);
    }
}
