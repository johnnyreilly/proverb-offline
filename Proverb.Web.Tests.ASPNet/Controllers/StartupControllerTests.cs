using log4net;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Proverb.Services.Interfaces;
using Proverb.Web.Controllers;
using Proverb.Web.Helpers;
using Proverb.Web.Models;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.Mvc;
using System.Web.Routing;

namespace Proverb.Web.UnitTests.Controllers
{
    [TestClass]
    public class StartupControllerTests
    {
        const string CATEGORY = "Proverb.Web -> StartupController";

        Mock<IAppConfigHelper> _appConfigHelperMock;
        Mock<IUserService> _userServiceMock;
        Mock<IUserHelper> _userHelperMock;
        Mock<ILog> _loggerMock;
        StartupController _controller;

        string _appName = "Proverb";
        string _version = "11.0";
        bool _inDebug = true;

        [TestInitialize]
        public void Initialise()
        {
            _appConfigHelperMock = new Mock<IAppConfigHelper>();
            _loggerMock = new Mock<ILog>();
            _userHelperMock = new Mock<IUserHelper>();
            _userServiceMock = new Mock<IUserService>();

            _controller = new StartupController(_appConfigHelperMock.Object, _loggerMock.Object, _userServiceMock.Object, _userHelperMock.Object);
            _controller.Request = new HttpRequestMessage { RequestUri = new Uri("http://localhost/api/startup") };

            _appConfigHelperMock.SetupGet(x => x.AppName).Returns(_appName);
            _appConfigHelperMock.SetupGet(x => x.InDebug).Returns(_inDebug);
            _appConfigHelperMock.SetupGet(x => x.Version).Returns(_version);
        }

        [TestMethod, TestCategory(CATEGORY)]
        public async Task Get_logs_specific_user()
        {
            _userHelperMock.SetupGet(u => u.UserName).Returns("john.reilly");
            _userHelperMock
                .Setup(u => u.GetUserId())
                .ReturnsAsync(1);

            IHttpActionResult result = await _controller.Get();

            _loggerMock.Verify(l => l.Info("john.reilly (UserId: 1) starting up Proverb"));
        }

        [TestMethod, TestCategory(CATEGORY)]
        public async Task Get_logs_anonymous_user()
        {
            IHttpActionResult result = await _controller.Get();

            _loggerMock.Verify(l => l.Info("Anonymous user starting up Proverb"));
        }

        [TestMethod, TestCategory(CATEGORY)]
        public async Task Get_returns_StartUpData()
        {
            IHttpActionResult result = await _controller.Get();

            var ok = result as OkNegotiatedContentResult<StartUpData>;
            var startUpData = ok.Content as StartUpData;
            Assert.AreEqual(_appName, startUpData.AppName);
            Assert.AreEqual("http://localhost/", startUpData.AppRoot);
            Assert.AreEqual(_inDebug, startUpData.InDebug);
            Assert.AreEqual("http://localhost/api/", startUpData.RemoteServiceRoot);
            Assert.AreEqual(_version, startUpData.Version);
        }
    }
}
