using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.EntityFramework;
using Proverb.Data.Models;
using System.Threading.Tasks;

namespace Proverb.Data.CommandQuery
{
    public class SayingQuery : BaseCommandQuery, ISayingQuery
    {
        public SayingQuery(ProverbContext context) : base(context) { }

        public async Task<ICollection<Saying>> GetAllAsync()
        {
            var sayings = await _context.Sayings.ToListAsync();

            return sayings;
        }

        public async Task<Saying> GetByIdAsync(int id)
        {
            var sayings = await _context.Sayings.FindAsync(id);

            return sayings;
        }

        public async Task<ICollection<Saying>> GetBySageIdAsync(int sageId)
        {
            var sayings = await _context.Sayings.Where(x => x.SageId == sageId).ToListAsync();

            return sayings;
        }
    }
}
