using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.EntityFramework;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery
{
    public class SayingQuery : BaseCommandQuery, ISayingQuery
    {
        public SayingQuery(ProverbContext dbContext) : base(dbContext) { }

        public async Task<ICollection<Saying>> GetAllAsync()
        {
            var sayings = await DbContext.Sayings.ToListAsync();

            return sayings;
        }

        public async Task<Saying> GetByIdAsync(int id)
        {
            var sayings = await DbContext.Sayings.FindAsync(id);

            return sayings;
        }

        public async Task<ICollection<Saying>> GetBySageIdAsync(int sageId)
        {
            var sayings = await DbContext.Sayings.Where(x => x.SageId == sageId).ToListAsync();

            return sayings;
        }
    }
}
