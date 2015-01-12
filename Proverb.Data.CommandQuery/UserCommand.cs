using System.Data.Entity;
using System.Threading.Tasks;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.EntityFramework;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery
{
    public class UserCommand : BaseCommandQuery, IUserCommand
    {
        public UserCommand(ProverbContext dbContext) : base(dbContext) { }

        public async Task<int> CreateAsync(User user)
        {
            DbContext.Users.Add(user);

            await DbContext.SaveChangesAsync();

            return user.Id;
        }

        public async Task DeleteAsync(int id) 
        {
            var userToDelete = await DbContext.Users.FindAsync(id);
            
            DbContext.Users.Remove(userToDelete);

            await DbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            DbContext.Entry(user).State = EntityState.Modified;

            await DbContext.SaveChangesAsync();
        }
    }
}
