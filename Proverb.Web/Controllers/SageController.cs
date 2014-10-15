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
    public class SageController : ApiController
    {
        readonly ISageService _sageService;
        readonly IUserHelper _userHelper;
        readonly ILog _logger;

        public SageController(
            ISageService userService,
            IUserHelper userHelper,
            ILog logger) 
        {
            _sageService = userService;
            _userHelper = userHelper;
            _logger = logger;
        }

        public async Task<IHttpActionResult> Get(int id)
        {
            var sage = await _sageService.GetByIdAsync(id);

            if (sage == null)
                return NotFound();
            else
                return Ok(sage);
        }

        public async Task<IHttpActionResult> Get()
        {
            var sages = await _sageService.GetAllAsync();

            return Ok(sages);
        }

        public async Task<IHttpActionResult> Post(Sage sage)
        {
            if (!ModelState.IsValid) 
            {
                return this.BadRequest(ModelState.ToValidationMessages());
            }

            await _sageService.UpdateAsync(sage);

            _logger.Info("Sage " + sage.Name + " [id: " + sage.Id + "] updated by " + _userHelper.UserName);

            return Ok();
        }

        public async Task<IHttpActionResult> Delete(int id)
        {
            await _sageService.DeleteAsync(id);

            return Ok();
        }

        /*

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }
         */
    }
}