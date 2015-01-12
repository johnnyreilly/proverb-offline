using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using Proverb.Data.Models;
using Proverb.Services.Interfaces;
using Proverb.Web.Common.SaveHelpers;
using Proverb.Web.Helpers;

namespace Proverb.Web.Controllers
{
    public class SayingController : ApiController
    {
        readonly ISayingService _sayingService;
        readonly IUserHelper _userHelper;
        readonly ILog _logger;

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

            var sayingId = await _sayingService.CreateAsync(saying);
            return Ok(sayingId);
        }


        public async Task<IHttpActionResult> Delete(int id)
        {
            await _sayingService.DeleteAsync(id);

            return Ok();
        }
    }
}