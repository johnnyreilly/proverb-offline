using System.IO;
using System.Web.Hosting;

namespace Proverb.Web.Helpers
{
    public class FileHelper : IFileHelper
    {
        public bool Exists(string path)
        {
            return File.Exists(path);
        }

        public string MapPath(string virtualPath)
        {
            return HostingEnvironment.MapPath(virtualPath);
        }
    }
}