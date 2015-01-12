using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.EntityFramework;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery
{
    public class UserQuery : BaseCommandQuery, IUserQuery
    {
        public UserQuery(ProverbContext dbContext) : base(dbContext) { }

        public async Task<ICollection<User>> GetAllAsync()
        {
            var users = await DbContext.Users.ToListAsync();

            return users;
        }

        public async Task<User> GetByIdAsync(int id)
        {
            var user = await DbContext.Users.FindAsync(id);

            return user;
        }

        public async Task<User> GetByUserNameAsync(string userName)
        {
            var user = await DbContext.Users.SingleOrDefaultAsync(x => x.UserName == userName);

            return user;
        }
    }
}
