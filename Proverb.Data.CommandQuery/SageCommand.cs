using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.EntityFramework;
using Proverb.Data.Models;
using System.Threading.Tasks;

namespace Proverb.Data.CommandQuery
{
    public class SageCommand : BaseCommandQuery, ISageCommand
    {
        public SageCommand(ProverbContext context) : base(context) { }

        public async Task<int> CreateAsync(Sage sage)
        {
            _context.Sages.Add(sage);

            await _context.SaveChangesAsync();

            return sage.Id;
        }

        public async Task DeleteAsync(int id) 
        {
            var userToDelete = await _context.Sages.FindAsync(id);
            
            _context.Sages.Remove(userToDelete);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Sage sage)
        {
            _context.Entry(sage).State = EntityState.Modified;

            await _context.SaveChangesAsync();
        }
    }
}
