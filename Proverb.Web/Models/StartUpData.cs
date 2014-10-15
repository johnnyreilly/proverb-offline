namespace Proverb.Web.Models
{
    public class StartUpData
    {
        public StartUpData(string appName, string appRoot, bool inDebug, string remoteServiceRoot, string version)
        {
            _appName = appName;
            _appRoot = appRoot;
            _inDebug = inDebug;
            _remoteServiceRoot = remoteServiceRoot;
            _version = version;
        }

        string _appName;
        string _appRoot;
        bool _inDebug;
        string _remoteServiceRoot;
        string _version;

        public string AppName { get { return _appName; } }
        public string AppRoot { get { return _appRoot; } }
        public bool InDebug { get { return _inDebug; } }
        public string RemoteServiceRoot { get { return _remoteServiceRoot; } }
        public string Version { get { return _version; } }
    }
}