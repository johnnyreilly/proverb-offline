using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using Proverb.Services.Interfaces;
using Proverb.Web.Helpers;
using Proverb.Web.Models;

namespace Proverb.Web.Controllers
{
    public class StartupController : ApiController
    {
        readonly IAppConfigHelper _appConfigHelper;
        readonly IUserHelper _userHelper;
        readonly IUserService _userService;
        readonly ILog _logger;

        public StartupController(
            IAppConfigHelper appConfigHelper,
            ILog logger,
            IUserService userService,
            IUserHelper userHelper)
        {
            _appConfigHelper = appConfigHelper;
            _logger = logger;
            _userHelper = userHelper;
            _userService = userService;
        }

        public async Task<IHttpActionResult> Get()
        {
            var userName = _userHelper.UserName;
            string whoIsIt;
            if (string.IsNullOrEmpty(userName))
            {
                whoIsIt = "Anonymous user";
            }
            else
            {
                var userId = await _userHelper.GetUserId();
                whoIsIt = string.Format("{0} (UserId: {1})", userName, userId);
            }

            _logger.Info(whoIsIt + " starting up Proverb");


            var appRoot = Url.Content("~/");
            var remoteServiceRoot = Url.Content("~/api/");

            var startUpData = new StartUpData(
                _appConfigHelper.AppName,
                appRoot,
                _appConfigHelper.InDebug,
                remoteServiceRoot,
                _appConfigHelper.Version);

            return Ok(startUpData);
        }
    }
}