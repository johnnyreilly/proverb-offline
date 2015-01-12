using System.Data.Entity;
using System.Threading.Tasks;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.EntityFramework;
using Proverb.Data.Models;

namespace Proverb.Data.CommandQuery
{
    public class SayingCommand : BaseCommandQuery, ISayingCommand
    {
        public SayingCommand(ProverbContext dbContext) : base(dbContext) { }

        public async Task<int> CreateAsync(Saying saying)
        {
            DbContext.Sayings.Add(saying);

            await DbContext.SaveChangesAsync();

            return saying.Id;
        }

        public async Task DeleteAsync(int id)
        {
            var userToDelete = await DbContext.Sayings.FindAsync(id);

            DbContext.Sayings.Remove(userToDelete);

            await DbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Saying saying)
        {
            DbContext.Entry(saying).State = EntityState.Modified;

            await DbContext.SaveChangesAsync();
        }
    }
}
