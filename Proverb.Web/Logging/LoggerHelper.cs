using System;
using System.Reflection;
using log4net;
using log4net.Config;

namespace Proverb.Web.Logging
{
    public static class LoggerHelper
    {
        private static ILog _logger;

        /// <summary>
        /// Get a log4net instance based on the config
        /// </summary>
        public static ILog Logger
        {
            get { return GetLogger(); }
        }

        /// <summary>
        /// Get a log4net instance based on the config
        /// </summary>
        /// <returns></returns>
        public static ILog GetLogger()
        {
            //If _logger hasn't yet been initialised then create it
            if (_logger == null)
            {
                //Configure log4net if not already configured
                var configuredAlready = true;
                var logRepository = LogManager.GetRepository();
                if (!logRepository.Configured)
                {
                    configuredAlready = false;
                    XmlConfigurator.Configure();
                }

                //Come up with a name for our logger eg "Proverb.Web v1.0.4857.27024"
                var assembly = Assembly.GetExecutingAssembly();
                var folderNames = AppDomain.CurrentDomain.SetupInformation.ApplicationBase.Split('\\');
                var loggerNamePrefix = (folderNames.Length > 2)
                    ? folderNames[folderNames.Length - 2]
                    : AppDomain.CurrentDomain.SetupInformation.ApplicationBase; //If this lives is stored in the root of a drive (unlikely) then use the path for a name
                var loggerName = string.Format("{0} v{1}",
                    loggerNamePrefix, //The path of the application executing
                    assembly.GetName().Version);

                //Get our logger
                _logger = LogManager.GetLogger(loggerName);
                _logger.Debug(string.Format("Logger {0} with this name: {1}", configuredAlready ? "retrieved" : "configured and retrieved", loggerName));
            }

            //Return instance
            return _logger;
        }
    }
}