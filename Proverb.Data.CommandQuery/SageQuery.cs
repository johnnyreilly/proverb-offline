using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.EntityFramework;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery
{
    public class SageQuery : BaseCommandQuery, ISageQuery
    {
        public SageQuery(ProverbContext dbContext) : base(dbContext) { }

        public async Task<ICollection<Sage>> GetAllAsync()
        {
            var sages = await DbContext.Sages.ToListAsync();
            
            return sages;
        }

        public async Task<ICollection<Sage>> GetAllWithSayingsAsync()
        {
            var sagesWithSayings = await DbContext.Sages.Include(x => x.Sayings).ToListAsync();
            
            return sagesWithSayings;
        }

        public async Task<Sage> GetByIdAsync(int id)
        {
            var sage = await DbContext.Sages.FindAsync(id);
            
            return sage;
        }

        public async Task<Sage> GetByIdWithSayingsAsync(int id)
        {
            var sageWithSayings = await DbContext.Sages
                .Include(x => x.Sayings)
                .SingleOrDefaultAsync(x => x.Id == id);

            return sageWithSayings;
        }
    }
}
