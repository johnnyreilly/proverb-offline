using System.Data.Entity;
using System.Threading.Tasks;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.EntityFramework;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery
{
    public class SageCommand : BaseCommandQuery, ISageCommand
    {
        public SageCommand(ProverbContext dbContext) : base(dbContext) { }

        public async Task<int> CreateAsync(Sage sage)
        {
            DbContext.Sages.Add(sage);

            await DbContext.SaveChangesAsync();

            return sage.Id;
        }

        public async Task DeleteAsync(int id) 
        {
            var userToDelete = await DbContext.Sages.FindAsync(id);
            
            DbContext.Sages.Remove(userToDelete);

            await DbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Sage sage)
        {
            DbContext.Entry(sage).State = EntityState.Modified;

            await DbContext.SaveChangesAsync();
        }
    }
}
