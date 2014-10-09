using System;
using System.Collections.Generic;

namespace Proverb.Web.Helpers
{
    public interface IAppCache
    {
        void Add<T>(string key, T value);
        bool Contains(string key);
        int Count(Func<KeyValuePair<string, object>, bool> predicate);
        void Delete(string key);
        T Get<T>(string key);
    }
}