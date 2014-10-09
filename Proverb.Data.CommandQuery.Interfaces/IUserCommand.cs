using System.Collections.Generic;
using System.Threading.Tasks;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery.Interfaces
{
    public interface IUserCommand
    {
        Task<int> CreateAsync(User user);
        Task DeleteAsync(int id);
        Task UpdateAsync(User user);
    }
}
