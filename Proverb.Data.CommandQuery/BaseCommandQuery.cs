using System;
using Proverb.Data.EntityFramework;

namespace Proverb.Data.CommandQuery
{
    public abstract class BaseCommandQuery : IDisposable
    {
        protected ProverbContext DbContext;

        protected BaseCommandQuery(ProverbContext dbContext) 
        {
            DbContext = dbContext;
        }

        private bool _disposed;

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    DbContext.Dispose();
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
