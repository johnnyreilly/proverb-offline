namespace Proverb.Web.Helpers
{
    public interface IAppConfigHelper
    {
        string AppName { get; }
        string Version { get; }
        bool InDebug { get; }

        int SystemUserId { get; }
        string UploadPath { get; }
    }
}
