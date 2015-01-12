using System.Collections.Generic;
using System.Threading.Tasks;
using Proverb.Data.Models;

namespace Proverb.Services.Interfaces
{
    public interface IUserService
    {
        Task<int> CreateAsync(User user);
        Task DeleteAsync(int id);
        Task<ICollection<User>> GetAllAsync();
        Task<User> GetByIdAsync(int id);
        Task<User> GetByUserNameAsync(string userName);
        Task UpdateAsync(User user);
    }
}
