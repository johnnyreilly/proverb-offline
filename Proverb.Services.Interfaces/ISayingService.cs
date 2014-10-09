using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Proverb.Data.Models;
using Proverb.Data.Common;

namespace Proverb.Services.Interfaces
{
    public interface ISayingService
    {
        Task<int> CreateAsync(Saying saying);
        Task DeleteAsync(int id);
        Task<ICollection<Saying>> GetAllAsync();
        Task<Saying> GetByIdAsync(int id);
        Task UpdateAsync(Saying saying);
        ValidationMessages Validate(Saying saying);
    }
}
