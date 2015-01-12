using System.Collections.Generic;
using System.Threading.Tasks;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.Models;
using Proverb.Services.Interfaces;

namespace Proverb.Services
{
    public class SageService : ISageService
    {
        public SageService(ISageCommand sageCommand, ISageQuery sageQuery)
        {
            _sageCommand = sageCommand;
            _sageQuery = sageQuery;
        }

        private readonly ISageCommand _sageCommand;
        private readonly ISageQuery _sageQuery;

        public async Task<int> CreateAsync(Sage sage)
        {
            return await _sageCommand.CreateAsync(sage);
        }

        public async Task DeleteAsync(int id)
        {
            await _sageCommand.DeleteAsync(id);
        }

        public async Task<ICollection<Sage>> GetAllAsync()
        {
            return await _sageQuery.GetAllAsync();
        }

        public async Task<Sage> GetByIdAsync(int id)
        {
            return await _sageQuery.GetByIdAsync(id);
        }

        public async Task UpdateAsync(Sage sage) 
        {
            await _sageCommand.UpdateAsync(sage);
        }

    }
}
