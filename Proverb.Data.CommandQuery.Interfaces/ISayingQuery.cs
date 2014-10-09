using System.Collections.Generic;
using System.Threading.Tasks;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery.Interfaces
{
    public interface ISayingQuery
    {
        Task<ICollection<Saying>> GetAllAsync();
        Task<Saying> GetByIdAsync(int id);
        Task<ICollection<Saying>> GetBySageIdAsync(int sageId);
    }
}
