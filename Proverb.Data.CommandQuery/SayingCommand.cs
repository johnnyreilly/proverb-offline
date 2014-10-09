using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.EntityFramework;
using Proverb.Data.Models;
using System.Threading.Tasks;

namespace Proverb.Data.CommandQuery
{
    public class SayingCommand : BaseCommandQuery, ISayingCommand
    {
        public SayingCommand(ProverbContext context) : base(context) { }

        public async Task<int> CreateAsync(Saying saying)
        {
            _context.Sayings.Add(saying);

            await _context.SaveChangesAsync();

            return saying.Id;
        }

        public async Task DeleteAsync(int id)
        {
            var userToDelete = await _context.Sayings.FindAsync(id);

            _context.Sayings.Remove(userToDelete);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Saying saying)
        {
            _context.Entry(saying).State = EntityState.Modified;

            await _context.SaveChangesAsync();
        }
    }
}
