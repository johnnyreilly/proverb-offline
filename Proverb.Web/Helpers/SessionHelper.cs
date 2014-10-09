using System;
using System.Collections.Generic;
using System.Web;
using System.Web.SessionState;

namespace Proverb.Web.Helpers
{
    public class SessionHelper : ISessionHelper
    {
        private HttpSessionState Session 
        { 
            get 
            {
                if (HttpContext.Current == null)
                    throw new ApplicationException("No Http Context, No Session to Get!");

                return HttpContext.Current.Session;
            }
        }

        public bool ContainsKey(string key)
        {
            return (Session[key] != null);
        }

        public T GetValue<T>(string key)
        {
            if (!ContainsKey(key))
                throw new KeyNotFoundException("There is no value stored for " + key);

            return (T)Session[key];
        }

        public void SetValue<T>(string keyName, T value)
        {
            Session[keyName] = value;
        }
    }
}