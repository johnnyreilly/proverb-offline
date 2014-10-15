using Autofac;
using Proverb.Web.Helpers;
using Proverb.Web.Logging;
using System;
using System.Web.Http;
using System.Web.Routing;

namespace Proverb.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        /// <summary>
        /// Will be instantiated in Application_Start - exists purely to allow Session_Start to use Autofac
        /// Based on Mark Seeman's first comment here: http://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/
        /// </summary>
        IContainer AutofacContainer
        {
            get { return Application["AutofacContainer"] as IContainer; }
            set { Application["AutofacContainer"] = value; }
        }

        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            AutofacContainer = AutofacConfig.RegisterAndBuild();

            string appName, version;
            using (var scope = AutofacContainer.BeginLifetimeScope())
            {
                var appConfigHelper = scope.Resolve<IAppConfigHelper>();

                appName = appConfigHelper.AppName;
                version = appConfigHelper.Version;
            }

            LoggerHelper.Logger.InfoFormat("{0} v{1} started.", appName, version);
        }

        protected void Application_End()
        {
            LoggerHelper.Logger.Info("Application stopping....");
        }

        protected void Session_End(object sender, EventArgs eventArgs)
        {
            LoggerHelper.Logger.InfoFormat("Session stopping for session id: {0}", Session.SessionID.ToString());
        }
    }
}
