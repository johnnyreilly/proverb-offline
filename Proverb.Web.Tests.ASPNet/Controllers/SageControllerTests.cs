using log4net;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Proverb.Data.Common;
using Proverb.Data.Models;
using Proverb.Services.Interfaces;
using Proverb.Web.Controllers;
using Proverb.Web.Helpers;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;

namespace Proverb.Web.Tests.ASPNet.Controllers
{
    [TestClass]
    public class SageControllerTests
    {
        private const string CATEGORY = "Proverb.Web -> SageController";

        private Mock<ISageService> _sageServiceMock;
        private Mock<IUserHelper> _userHelperMock;
        private Mock<ILog> _loggerMock;
        private SageController _controller;

        private Sage _sage = new Sage { Id = 1, UserName = "wise.soul" };
        readonly Task TaskOfNowt = Task.Delay(0);
        //readonly Task TaskOfNowt = Task.FromResult<object>(null); - equally valid but slightly more verbose approach

        [TestInitialize]
        public void Initialise()
        {
            _sageServiceMock = new Mock<ISageService>();
            _userHelperMock = new Mock<IUserHelper>();
            _loggerMock = new Mock<ILog>();

            _controller = new SageController(_sageServiceMock.Object, _userHelperMock.Object, _loggerMock.Object);
        }

        [TestMethod, TestCategory(CATEGORY)]
        public async Task Get_with_an_id_returns_a_NotFound()
        {
            var sageId = 1;

            _sageServiceMock
                .Setup(x => x.GetByIdAsync(sageId))
                .ReturnsAsync(null);

            IHttpActionResult result = await _controller.Get(sageId);

            var notFound = result as NotFoundResult;
            Assert.IsNotNull(notFound);
            _sageServiceMock.Verify(x => x.GetByIdAsync(sageId));
        }

        [TestMethod, TestCategory(CATEGORY)]
        public async Task Get_with_an_id_returns_an_Ok_with_a_Sage()
        {
            _sageServiceMock
                .Setup(x => x.GetByIdAsync(_sage.Id))
                .ReturnsAsync(_sage);

            IHttpActionResult result = await _controller.Get(_sage.Id);

            var ok = result as OkNegotiatedContentResult<Sage>;
            Assert.IsNotNull(ok);
            Assert.AreSame(_sage, ok.Content);
            _sageServiceMock.Verify(x => x.GetByIdAsync(_sage.Id));
        }

        [TestMethod, TestCategory(CATEGORY)]
        public async Task Get_returns_an_Ok_with_an_ICollection_of_Sage()
        {
            var sages = new List<Sage>{
                _sage
            };

            _sageServiceMock
                .Setup(x => x.GetAllAsync())
                .ReturnsAsync(sages);

            IHttpActionResult result = await _controller.Get();

            var ok = result as OkNegotiatedContentResult<ICollection<Sage>>;
            Assert.IsNotNull(ok);
            Assert.AreSame(sages, ok.Content);
            _sageServiceMock.Verify(x => x.GetAllAsync());
        }

        [TestMethod, TestCategory(CATEGORY)]
        public async Task Post_returns_a_BadRequest_with_a_Dictionary_of_errors()
        {
            var key = "dummy error";
            var errorMessage = "to set ModelState.IsValid as false";
            _controller.ModelState.AddModelError(key, errorMessage);

            IHttpActionResult result = await _controller.Post(_sage);

            var badRequest = result as NegotiatedContentResult<ValidationMessages>;
            Assert.IsNotNull(badRequest);
            Assert.AreEqual(HttpStatusCode.BadRequest, badRequest.StatusCode);
            Assert.IsTrue(badRequest.Content.Errors.ContainsKey(key));
            Assert.IsTrue(badRequest.Content.Errors[key].Contains(errorMessage));
        }

        [TestMethod, TestCategory(CATEGORY)]
        public async Task Post_returns_an_Ok()
        {
            _sageServiceMock
                .Setup(x => x.UpdateAsync(_sage))
                .Returns(TaskOfNowt);

            IHttpActionResult result = await _controller.Post(_sage);

            var ok = result as OkResult;
            Assert.IsNotNull(ok);
            _sageServiceMock.Verify(x => x.UpdateAsync(_sage));
        }

        [Ignore]
        [TestMethod, TestCategory(CATEGORY)]
        public async Task Delete_returns_a_NotFound()
        {
            _sageServiceMock
                .Setup(x => x.DeleteAsync(_sage.Id));

            IHttpActionResult result = await _controller.Delete(_sage.Id);

            var notFound = result as NotFoundResult;
            Assert.IsNotNull(notFound);
            _sageServiceMock.Verify(x => x.DeleteAsync(_sage.Id));
        }

        [TestMethod, TestCategory(CATEGORY)]
        public async Task Delete_returns_an_Ok()
        {
            _sageServiceMock
                .Setup(x => x.DeleteAsync(_sage.Id))
                .Returns(TaskOfNowt);

            IHttpActionResult result = await _controller.Delete(_sage.Id);

            var ok = result as OkResult;
            Assert.IsNotNull(ok);
            _sageServiceMock.Verify(x => x.DeleteAsync(_sage.Id));
        }
    }

}
