using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.EntityFramework;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery
{
    public class UserCommand : BaseCommandQuery, IUserCommand
    {
        public UserCommand(ProverbContext context) : base(context) { }

        public async Task<int> CreateAsync(User user)
        {
            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return user.Id;
        }

        public async Task DeleteAsync(int id) 
        {
            var userToDelete = await _context.Users.FindAsync(id);
            
            _context.Users.Remove(userToDelete);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _context.Entry(user).State = EntityState.Modified;

            await _context.SaveChangesAsync();
        }
    }
}
