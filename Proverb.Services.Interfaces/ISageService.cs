using System.Collections.Generic;
using System.Threading.Tasks;
using Proverb.Data.Models;

namespace Proverb.Services.Interfaces
{
    public interface ISageService
    {
        Task<int> CreateAsync(Sage sage);
        Task DeleteAsync(int id);
        Task<ICollection<Sage>> GetAllAsync();
        Task<Sage> GetByIdAsync(int id);
        Task UpdateAsync(Sage sage);
    }
}
