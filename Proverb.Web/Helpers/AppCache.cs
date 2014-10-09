using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;

namespace Proverb.Web.Helpers
{
    public class AppCache : IAppCache
    {
        private ObjectCache Cache 
        { 
            get 
            {
                return MemoryCache.Default;
            }
        }

        public void Add<T>(string key, T value)
        {
            // Will cache for 1 hour
            Cache.Add(key, value, DateTimeOffset.UtcNow.AddHours(1));
        }

        public bool Contains(string key)
        {
            return Cache.Contains(key);
        }

        public int Count(Func<KeyValuePair<string, object>, bool> predicate)
        {
            return Cache.Count(predicate);
        }

        public void Delete(string key)
        {
            if (!Contains(key))
                throw new KeyNotFoundException("There is no value stored for " + key);

            Cache.Remove(key);
        }

        public T Get<T>(string key)
        {
            if (!Contains(key))
                throw new KeyNotFoundException("There is no value stored for " + key);

            return (T)Cache.Get(key);
        }
    }
}