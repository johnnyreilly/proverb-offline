using System.Collections.Generic;
using System.Threading.Tasks;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery.Interfaces
{
    public interface IUserQuery
    {
        Task<ICollection<User>> GetAllAsync();
        Task<User> GetByIdAsync(int id);
        Task<User> GetByUserNameAsync(string userName);
    }
}
