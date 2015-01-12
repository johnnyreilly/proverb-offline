using System.Collections.Generic;
using System.Threading.Tasks;
using Proverb.Data.CommandQuery.Interfaces;
using Proverb.Data.Common;
using Proverb.Data.Models;
using Proverb.Services.Interfaces;

namespace Proverb.Services
{
    public class SayingService : ISayingService
    {
        public SayingService(ISayingCommand sayingCommand, ISayingQuery sayingQuery)
        {
            _sayingCommand = sayingCommand;
            _sayingQuery = sayingQuery;
        }

        private readonly ISayingCommand _sayingCommand;
        private readonly ISayingQuery _sayingQuery;

        public async Task<int> CreateAsync(Saying saying)
        {
            return await _sayingCommand.CreateAsync(saying);
        }

        public async Task DeleteAsync(int id)
        {
            await _sayingCommand.DeleteAsync(id);
        }

        public async Task<ICollection<Saying>> GetAllAsync()
        {
            return await _sayingQuery.GetAllAsync();
        }

        public async Task<Saying> GetByIdAsync(int id)
        {
            return await _sayingQuery.GetByIdAsync(id);
        }

        public async Task UpdateAsync(Saying saying)
        {
            await _sayingCommand.UpdateAsync(saying);
        }

        public ValidationMessages Validate(Saying saying)
        {
            var validations = new ValidationMessages();

            // Probably will move this logic into sayingService - a Validate method
            if (saying.SageId == 0) 
            {
                // eg "saying.sageId"
                var fieldName = ValidationHelpers.GetFieldName(saying, x => x.SageId);
                validations.AddError(fieldName, "Please select a sage.");
            }

            return validations;
        }
    }
}
