using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;
using log4net;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Proverb.Data.Models;
using Proverb.Services.Interfaces;
using Proverb.Web.Controllers;
using Proverb.Web.Helpers;

namespace Proverb.Web.Tests.ASPNet.Controllers
{
    [TestClass]
    public class SayingControllerTests
    {
        private const string CATEGORY = "Proverb.Web -> SayingController";

        private Mock<ISayingService> _sayingServiceMock;
        private Mock<IUserHelper> _userHelperMock;
        private Mock<ILog> _loggerMock;
        private SayingController _controller;

        [TestInitialize]
        public void Initialise()
        {
            _sayingServiceMock = new Mock<ISayingService>();
            _userHelperMock = new Mock<IUserHelper>();
            _loggerMock = new Mock<ILog>();

            _controller = new SayingController(_sayingServiceMock.Object, _userHelperMock.Object, _loggerMock.Object);
        }

        [TestMethod, TestCategory(CATEGORY)]
        public async Task Get_returns_an_Ok_with_an_ICollection_of_Saying()
        {
            var sayings = new List<Saying>{
                new Saying{ Id = 1, Text = "Pithy comment", SageId = 2 }
            };

            _sayingServiceMock
                .Setup(x => x.GetAllAsync())
                .ReturnsAsync(sayings);

            IHttpActionResult result = await _controller.Get();

            var ok = result as OkNegotiatedContentResult<ICollection<Saying>>;
            Assert.IsNotNull(ok);
            Assert.AreSame(sayings, ok.Content);
            _sayingServiceMock.Verify(x => x.GetAllAsync());
        }

        /*
        private void Index_setup()
        {
            _sayingServiceMock
                .Setup(x => x.GetAll())
                .Returns(new List<SayingController>());
        }

        [TestMethod]
        public void Index_gets_Proverbs_from_repository()
        {
            Index_setup();

            ViewResult result = _controller.Index();

            _sayingServiceMock
                .Verify(x => x.GetAll(), Times.Once);
        }

        [TestMethod]
        public void Index_returns_Proverbs_as_model()
        {
            Index_setup();

            ViewResult result = _controller.Index();

            Assert.IsInstanceOfType(result.Model, typeof(ICollection<Proverb>));
        }
        */
    }

}
