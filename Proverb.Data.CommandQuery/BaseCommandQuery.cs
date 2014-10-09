using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using Proverb.Data.EntityFramework;

namespace Proverb.Data.CommandQuery
{
    public abstract class BaseCommandQuery : IDisposable
    {
        protected ProverbContext _context;

        public BaseCommandQuery(ProverbContext context) 
        {
            _context = context;
        }

        private bool _disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }
    }
}
