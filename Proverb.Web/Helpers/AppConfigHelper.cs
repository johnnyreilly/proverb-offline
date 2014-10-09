using System.Reflection;

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
                    _assembly = System.Reflection.Assembly.GetExecutingAssembly();

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
            get { return System.Web.HttpContext.Current.IsDebuggingEnabled; } 
        }

        public int SystemUserId 
        {
            get { return int.Parse(System.Configuration.ConfigurationManager.AppSettings["SystemUserId"]); }
        }

        public string UploadPath
        {
            get { return System.Configuration.ConfigurationManager.AppSettings["UploadPath"]; }
        }
    }
}