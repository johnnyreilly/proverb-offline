using System.Threading.Tasks;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery.Interfaces
{
    public interface ISageCommand
    {
        Task<int> CreateAsync(Sage sage);
        Task DeleteAsync(int id);
        Task UpdateAsync(Sage sage);
    }
}
