using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Proverb.Services.Interfaces;
using Proverb.Web.Helpers;
using Proverb.Web.Models;
using System.Threading.Tasks;

namespace Proverb.Web.Controllers
{
    [SessionState(System.Web.SessionState.SessionStateBehavior.Disabled)]
    public class HomeController : Proverb.Web.Base.BaseController
    {
        readonly IAppConfigHelper _appConfigHelper;
        readonly IUserService _userService;

        public HomeController(
            IAppConfigHelper appConfigHelper,
            IUserService userService,
            IUserHelper userHelper,
            ILog logger)
            : base(userHelper, logger) 
        {
            _appConfigHelper = appConfigHelper;
            _userService = userService;
        }

        public async Task<ViewResult> Index()
        {
            var browser = Request.Browser;
            var userName = UserHelper.UserName;
            if (string.IsNullOrEmpty(userName))
            {
                Logger.InfoFormat("Anonymous user entering Proverb using {0} v{1}",
                    browser.Browser, browser.Version);
            }
            else
            {
                var userId = await UserHelper.GetUserId();
                Logger.InfoFormat("{0} (UserId: {1}) entering Proverb using {2} v{3}",
                    userName, userId, browser.Browser, browser.Version);
            }

            return View();
        }

        public JsonResult StartApp()
        {
            var startUpData = new StartUpData(
                _appConfigHelper.AppName,
                _appConfigHelper.InDebug,
                _appConfigHelper.Version);

            return Json(startUpData, JsonRequestBehavior.AllowGet);
        }
        
        public ViewResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ViewResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}