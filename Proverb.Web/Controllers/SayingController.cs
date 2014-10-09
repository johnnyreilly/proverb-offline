using log4net;
using Proverb.Data.Common;
using Proverb.Data.Models;
using Proverb.Services.Interfaces;
using Proverb.Web.Common.SaveHelpers;
using Proverb.Web.Helpers;
using System.Threading.Tasks;
using System.Web.Http;

namespace Proverb.Web.Controllers
{
    public class SayingController : ApiController
    {
        ISayingService _sayingService;
        IUserHelper _userHelper;
        ILog _logger;

        public SayingController(
            ISayingService sayingService,
            IUserHelper userHelper,
            ILog logger) 
        {
            _sayingService = sayingService;
            _userHelper = userHelper;
            _logger = logger;
        }

        public async Task<IHttpActionResult> Get(int id)
        {
            var sage = await _sayingService.GetByIdAsync(id);

            if (sage == null)
                return NotFound();
            else
                return Ok(sage);
        }

        public async Task<IHttpActionResult> Get()
        {
            var sages = await _sayingService.GetAllAsync();

            return Ok(sages);
        }

        public async Task<IHttpActionResult> Post(Saying saying)
        {
            if (!ModelState.IsValid)
            {
                return this.BadRequest(ModelState.ToValidationMessages());
            }

            // Perform service validations
            var serviceValidations = _sayingService.Validate(saying);
            if (serviceValidations.HasErrors())
                return this.BadRequest(serviceValidations.WithCamelCaseKeys());

            if (saying.Id > 0)
            {
                await _sayingService.UpdateAsync(saying);
                return Ok();
            }
            else
            {
                var sayingId = await _sayingService.CreateAsync(saying);
                return Ok(sayingId);
            }
        }


        public async Task<IHttpActionResult> Delete(int id)
        {
            await _sayingService.DeleteAsync(id);

            return Ok();
        }
    }
}