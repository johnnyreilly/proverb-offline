using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.EntityFramework;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery
{
    public class UserQuery : BaseCommandQuery, IUserQuery
    {
        public UserQuery(ProverbContext context) : base(context) { }

        public async Task<ICollection<User>> GetAllAsync()
        {
            var users = await _context.Users.ToListAsync();

            return users;
        }

        public async Task<User> GetByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);

            return user;
        }

        public async Task<User> GetByUserNameAsync(string userName)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == userName);

            return user;
        }
    }
}
