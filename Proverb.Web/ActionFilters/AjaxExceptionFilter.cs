using log4net;
using Proverb.Web.Helpers;
using System;
using System.Net;
using System.Web.Mvc;

namespace Proverb.Web.ActionFilters
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class AjaxExceptionFilter : ActionFilterAttribute, IExceptionFilter
    {
        public IUserHelper UserHelper { get; set; }
        public ILog Logger { get; set; }

        public void OnException(ExceptionContext filterContext)
        {
            if (!filterContext.HttpContext.Request.IsAjaxRequest()) return;

            filterContext.ExceptionHandled = true;

            // We're consuming the exception here, so ensure it's still logged manually
            var request = filterContext.HttpContext.Request;
            var message = string.Format("{0} experienced an exception via AJAX: {1} {2}",
                UserHelper.UserName, request.HttpMethod, request.Url);
            Logger.Error(message, filterContext.Exception);

            //Set the response status code to 500
            filterContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            //Needed for IIS7.0
            filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;

            filterContext.Result = new JsonResult
            {
                Data = new { error = filterContext.Exception.Message },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
    }
}