using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.Models;
using Proverb.Services.Interfaces;

namespace Proverb.Services
{
    public class UserService : IUserService
    {
        public UserService(IUserCommand userCommand, IUserQuery userQuery)
        {
            _userCommand = userCommand;
            _userQuery = userQuery;
        }

        private IUserCommand _userCommand;
        private IUserQuery _userQuery;

        public async Task<int> CreateAsync(User user)
        {
            return await _userCommand.CreateAsync(user);
        }

        public async Task DeleteAsync(int id)
        {
            await _userCommand.DeleteAsync(id);
        }

        public async Task<ICollection<User>> GetAllAsync()
        {
            return await _userQuery.GetAllAsync();
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _userQuery.GetByIdAsync(id);
        }

        public async Task<User> GetByUserNameAsync(string userName)
        {
            return await _userQuery.GetByUserNameAsync(userName);
        }

        public async Task UpdateAsync(User user) 
        {
            await _userCommand.UpdateAsync(user);
        }
    }
}
