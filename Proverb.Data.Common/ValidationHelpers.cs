using System;
using System.Linq.Expressions;

namespace Proverb.Data.Common
{
    public static class ValidationHelpers
    {
        public static string GetFieldName<T>(T entity, Expression<Func<T, object>> expression, bool camelCaseKeyName = true) where T : class
        {
            var body = expression.Body as MemberExpression;

            if (body == null)
            {
                var ubody = (UnaryExpression)expression.Body;
                body = ubody.Operand as MemberExpression;
            }

            if (body == null)
                throw new ArgumentException("Invalid property expression");

            var entityName = typeof(T).Name; // eg "Saying"
            var property = body.Member.Name; // eg "SageId"
            var combined = entityName + "." + property;

            return combined;
        }
    }
}
