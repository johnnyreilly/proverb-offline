using Microsoft.Owin;
using Owin;
using Proverb.Web;

[assembly: OwinStartup(typeof(Startup))]

namespace Proverb.Web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
        }
    }
}
