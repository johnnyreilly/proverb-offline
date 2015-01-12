using System.Configuration;
using System.Reflection;
using System.Web;

namespace Proverb.Web.Helpers
{
    public class AppConfigHelper : IAppConfigHelper
    {
        Assembly _assembly;
        Assembly Assembly
        {
            get 
            {
                if (_assembly == null)
                    _assembly = Assembly.GetExecutingAssembly();

                return _assembly;
            }
        }

        public string AppName
        {
            get { return Assembly.GetName().Name; }
        }

        public string Version
        {
            get { return Assembly.GetName().Version.ToString(); }
        }

        public bool InDebug 
        {
            get { return HttpContext.Current.IsDebuggingEnabled; } 
        }

        public int SystemUserId 
        {
            get { return int.Parse(ConfigurationManager.AppSettings["SystemUserId"]); }
        }

        public string UploadPath
        {
            get { return ConfigurationManager.AppSettings["UploadPath"]; }
        }
    }
}