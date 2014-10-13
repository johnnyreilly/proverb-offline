using log4net;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Proverb.Services.Interfaces;
using Proverb.Web.Controllers;
using Proverb.Web.Helpers;
using Proverb.Web.Models;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Proverb.Web.UnitTests.Controllers
{
    [TestClass]
    public class HomeControllerTests
    {
        const string CATEGORY = "Proverb.Web -> HomeController";

        Mock<IAppConfigHelper> _appConfigHelperMock;
        Mock<IUserService> _userServiceMock;
        Mock<IUserHelper> _userHelperMock;
        Mock<ILog> _loggerMock;
        HomeController _controller;

        [TestInitialize]
        public void Initialise()
        {
            _appConfigHelperMock = new Mock<IAppConfigHelper>();
            _userServiceMock = new Mock<IUserService>();
            _userHelperMock = new Mock<IUserHelper>();
            _loggerMock = new Mock<ILog>();

            _controller = new HomeController(_appConfigHelperMock.Object, _userServiceMock.Object, _userHelperMock.Object, _loggerMock.Object);
        }

        [TestMethod, TestCategory(CATEGORY)]
        public async Task Index_logs_user_and_browser_details_and_returns_ViewResult()
        {
            var browser = "InternetExplorer";
            var version = "11.0";
            var userId = 1;
            var userName = "john.reilly";

            var request = new Mock<HttpRequestBase>();
            request.SetupGet(b => b.Browser.Browser).Returns(browser);
            request.SetupGet(b => b.Browser.Version).Returns(version);

            var context = new Mock<HttpContextBase>();
            context.SetupGet(c => c.Request).Returns(request.Object);

            _controller.ControllerContext = new ControllerContext(context.Object, new RouteData(), _controller);

            _userHelperMock.SetupGet(u => u.UserName).Returns(userName);
            _userHelperMock
                .Setup(u => u.GetUserId())
                .ReturnsAsync(userId);

            ViewResult result = await _controller.Index();

            _loggerMock.Verify(l => l.InfoFormat("{0} (UserId: {1}) entering Proverb using {2} v{3}", userName, userId, browser, version));
        }

        [TestMethod, TestCategory(CATEGORY)]
        public void StartApp_returns_JsonResult_of_StartUpData()
        {
            var inDebug = true;
            var version = "Version";

            _userHelperMock.SetupGet(x => x.UserName).Returns("john.reilly");

            _appConfigHelperMock.SetupGet(x => x.InDebug).Returns(inDebug);
            _appConfigHelperMock.SetupGet(x => x.Version).Returns(version);

            JsonResult result = _controller.StartApp();

            var startUpData = result.Data as StartUpData;
            Assert.AreEqual(inDebug, startUpData.InDebug);
            Assert.AreEqual(version, startUpData.Version);
        }
    }
}
