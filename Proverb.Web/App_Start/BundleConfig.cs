using System.Web;
using System.Web.Optimization;

namespace Proverb.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            var angularApp = new ScriptBundle("~/angularApp").Include(

                // Vendor Scripts 
                "~/scripts/jquery-{version}.js",
                "~/scripts/angular.js",
                "~/scripts/angular-animate.js",
                "~/scripts/angular-route.js",
                "~/scripts/angular-sanitize.js",
                "~/scripts/angular-ui/ui-bootstrap-tpls.js",

                "~/scripts/toastr.js",
                "~/scripts/moment.js",
                "~/scripts/spin.js",
                "~/scripts/underscore.js",

                // Bootstrapping
                "~/app/app.js",
                "~/app/config.route.js",

                // common Modules
                "~/app/common/common.js",
                "~/app/common/logger.js",
                "~/app/common/spinner.js",

                // common.bootstrap Modules
                "~/app/common/bootstrap/bootstrap.dialog.js"
                );

            // directives
            angularApp.IncludeDirectory("~/app/directives", "*.js", true);

            // services
            angularApp.IncludeDirectory("~/app/services", "*.js", true);

            // controllers
            angularApp.IncludeDirectory("~/app/admin", "*.js", true);
            angularApp.IncludeDirectory("~/app/about", "*.js", true);
            angularApp.IncludeDirectory("~/app/dashboard", "*.js", true);
            angularApp.IncludeDirectory("~/app/layout", "*.js", true);
            angularApp.IncludeDirectory("~/app/sayings", "*.js", true);
            angularApp.IncludeDirectory("~/app/sages", "*.js", true);

            bundles.Add(angularApp);

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/content/ie10mobile.css",
                "~/content/bootstrap.css",
                "~/content/font-awesome.css",
                "~/content/toastr.css",
                "~/content/styles.css"
            ));
        }
    }
}
