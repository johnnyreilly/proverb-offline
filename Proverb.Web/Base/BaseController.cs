using log4net;
using Proverb.Web.ActionFilters;
using Proverb.Web.Helpers;
using System.Web.Mvc;
using System.Web.UI;

namespace Proverb.Web.Base
{
    [AjaxExceptionFilter]
    [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
    public abstract class BaseController : Controller
    {
        protected readonly IUserHelper UserHelper;
        protected readonly ILog Logger;

        protected BaseController(IUserHelper userHelper, ILog logger)
        {
            UserHelper = userHelper;
            Logger = logger;
        }

        protected override System.IAsyncResult BeginExecute(System.Web.Routing.RequestContext requestContext, System.AsyncCallback callback, object state)
        {
            Logger.InfoFormat("{0} hit this endpoint{1}: {2} {3}",
                UserHelper.UserName, 
                ((requestContext.HttpContext.Request.IsAjaxRequest()) ? " via AJAX" : ""),
                requestContext.HttpContext.Request.HttpMethod,
                requestContext.HttpContext.Request.Url);

            return base.BeginExecute(requestContext, callback, state);
        }

        /// <summary>
        /// Ensure we aren't limited in the size of returned JSON
        /// http://stackoverflow.com/a/12278956/761388
        /// </summary>
        /// <param name="data"></param>
        /// <param name="contentType"></param>
        /// <param name="contentEncoding"></param>
        /// <param name="behavior"></param>
        /// <returns></returns>
        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            /*
            return new JsonResult
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                MaxJsonLength = int.MaxValue
            };
            */
            // Using JSON.Net serializer for ISO 8601 dates (easier when debugging) and added performance
            return new JsonNetResult
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                MaxJsonLength = int.MaxValue
            };
        }

    }
}