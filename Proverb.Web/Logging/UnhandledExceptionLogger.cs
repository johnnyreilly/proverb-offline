using System.Web.Http.ExceptionHandling;

namespace Proverb.Web.Logging
{
    public class UnhandledExceptionLogger : ExceptionLogger
    {
        public override void Log(ExceptionLoggerContext context)
        {
            LoggerHelper.Logger.Error("Unhandled exception in " + context.Request.RequestUri + " " + context.Request.Method, context.Exception);
        }
    }
}