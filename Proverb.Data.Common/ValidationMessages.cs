using System.Collections.Generic;
using System.Linq;

namespace Proverb.Data.Common
{
    public class ValidationMessages
    {
        private readonly Dictionary<string, IEnumerable<string>> _errors = new Dictionary<string, IEnumerable<string>>();

        public ValidationMessages() 
        {
        }

        public ValidationMessages(Dictionary<string, IEnumerable<string>> errors)
        {
            _errors = errors;
        }

        public void AddError(string field, string error)
        {
            Errors.Add(field, new[] { error });
        }

        public Dictionary<string, IEnumerable<string>> Errors 
        { 
            get 
            { 
                return _errors; 
            } 
        }

        public string ErrorsAsString() 
        { 
            return string.Join(", ", Errors.Values); 
        } 

        public bool HasErrors() 
        { 
            return Errors.Keys.Any(); 
        }
    }
}
