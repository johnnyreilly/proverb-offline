using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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