namespace Proverb.Web.Helpers
{
    public interface IFileHelper
    {
        bool Exists(string path);
        string MapPath(string virtualPath);
    }
}
