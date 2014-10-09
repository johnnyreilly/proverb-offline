using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proverb.Web.Helpers
{
    public interface ISessionHelper
    {
        bool ContainsKey(string key);
        T GetValue<T>(string key);
        void SetValue<T>(string key, T value);
    }
}