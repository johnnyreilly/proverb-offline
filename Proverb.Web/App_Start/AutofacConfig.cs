using Autofac;
using Autofac.Integration.WebApi;
using Proverb.Data.EntityFramework;
using Proverb.Web.Helpers;
using Proverb.Web.Logging;
using System.Reflection;
using System.Security.Principal;
using System.Web;

namespace Proverb.Web
{
    public class AutofacConfig
    {
        public static IContainer RegisterAndBuild()
        {
            var builder = new ContainerBuilder();

            // DbContext
            builder.RegisterType<ProverbContext>().As<ProverbContext>().InstancePerLifetimeScope();

            // Queries / Commands
            builder.RegisterAssemblyTypes(Assembly.Load("Proverb.Data.CommandQuery"))
                .Where(t => t.Name.EndsWith("Query") || t.Name.EndsWith("Command"))
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();

            // Domain Services
            builder.RegisterAssemblyTypes(Assembly.Load("Proverb.Services"))
                .Where(t => t.Name.EndsWith("Service"))
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();

            // Web Project
            var assembly = Assembly.GetExecutingAssembly();
            builder.RegisterApiControllers(assembly).InstancePerLifetimeScope();

            // Helpers
            builder.RegisterType<AppConfigHelper>().As<IAppConfigHelper>().InstancePerLifetimeScope();
            builder.RegisterType<AppCache>().As<IAppCache>().InstancePerLifetimeScope();
            builder.RegisterType<FileHelper>().As<IFileHelper>().InstancePerLifetimeScope();
            //builder.RegisterType<SessionHelper>().As<ISessionHelper>().InstancePerLifetimeScope();
            builder.RegisterType<UserHelper>().As<IUserHelper>().InstancePerLifetimeScope();

            // User
            builder.Register(c => HttpContext.Current.User).As<IPrincipal>().InstancePerLifetimeScope();

            // Logger
            //builder.Register(c => LoggerHelper.GetLogger()).As<ILog>().InstancePerLifetimeScope();
            builder.RegisterModule<LoggingModule>();

            var container = builder.Build();

            // Set the dependency resolver for Web API.
            var webApiResolver = new AutofacWebApiDependencyResolver(container);
            System.Web.Http.GlobalConfiguration.Configuration.DependencyResolver = webApiResolver;

            return container;
        }
    }
}
