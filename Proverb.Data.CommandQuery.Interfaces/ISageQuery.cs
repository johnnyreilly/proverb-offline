using System.Collections.Generic;
using System.Threading.Tasks;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery.Interfaces
{
    public interface ISageQuery
    {
        Task<ICollection<Sage>> GetAllAsync();
        Task<ICollection<Sage>> GetAllWithSayingsAsync();
        Task<Sage> GetByIdAsync(int id);
        Task<Sage> GetByIdWithSayingsAsync(int id);
    }
}
