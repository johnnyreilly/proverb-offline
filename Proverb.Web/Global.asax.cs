using Autofac;
using Proverb.Web.Helpers;
using Proverb.Web.Logging;
using System;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
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
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
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

        /// <summary>
        /// Necessary for Web API to have access to Session
        /// </summary>
        //protected void Application_PostAuthorizeRequest()
        //{
        //    System.Web.HttpContext.Current.SetSessionStateBehavior(System.Web.SessionState.SessionStateBehavior.Required);
        //}

        protected void Application_End()
        {
            LoggerHelper.Logger.Info("Application stopping....");
        }

        /// <summary>
        /// Sessions not being used at present - code left in case they are later
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="eventArgs"></param>
        protected void Session_Start(object sender, EventArgs eventArgs)
        {
            string userName;
            using (var scope = AutofacContainer.BeginLifetimeScope())
            {
                var userHelper = scope.Resolve<IUserHelper>();

                userName = userHelper.UserName;
            }

            var browser = Request.Browser;
            LoggerHelper.Logger.InfoFormat("Session starting for {0} using {1} v{2} session id: {3}",
                userName, browser.Browser, browser.Version, Session.SessionID.ToString());
        }

        protected void Session_End(object sender, EventArgs eventArgs)
        {
            LoggerHelper.Logger.InfoFormat("Session stopping for session id: {0}", Session.SessionID.ToString());
        }
    }
}
