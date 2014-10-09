namespace Proverb.Web.Models
{
    public class StartUpData
    {
        public StartUpData(string appName, bool inDebug, string version)
        {
            _appName = appName;
            _inDebug = inDebug;
            _version = version;
        }

        string _appName;
        bool _inDebug;
        string _version;

        public string AppName { get { return _appName; } }
        public bool InDebug { get { return _inDebug; } }
        public string Version { get { return _version; } }
    }
}