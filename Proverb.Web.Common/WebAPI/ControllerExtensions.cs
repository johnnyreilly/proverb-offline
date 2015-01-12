using System.Net;
using System.Web.Http.Results;

namespace System.Web.Http
{
    public static class ControllerExtensions
    {
        public static IHttpActionResult BadRequest<T>(this ApiController controller, T obj)
        {
            return new NegotiatedContentResult<T>(HttpStatusCode.BadRequest, obj, controller);
        }
    }
}
