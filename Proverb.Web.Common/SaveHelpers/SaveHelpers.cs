using Proverb.Data.Common;
using System.Collections.Generic;
using System.Linq;

namespace Proverb.Web.Common.SaveHelpers
{
    public static class SaveHelpers
    {
        public static ValidationMessages ToValidationMessages(
            this System.Web.Http.ModelBinding.ModelStateDictionary modelState, bool camelCaseKeyName = true) 
        {
            var errors = modelState
                .Where(x => x.Value.Errors.Any())
                .ToDictionary(
                    kvp => CamelCasePropNames(kvp.Key),
                    kvp => kvp.Value.Errors.Select(e => e.ErrorMessage)
                );

            return new ValidationMessages(errors);
        }

        public static ValidationMessages WithCamelCaseKeys(this ValidationMessages validationMessages)
        {
            var errors = validationMessages.Errors
                .ToDictionary(
                    kvp => CamelCasePropNames(kvp.Key),
                    kvp => kvp.Value
                );

            return new ValidationMessages(errors);
        }

        public static string CamelCasePropNames(string propName)
        {
            var array = propName.Split('.');
            var camelCaseList = new string[array.Length];
            for (var i = 0; i < array.Length; i++)
            {
                var prop = array[i];
                camelCaseList[i] = prop.Substring(0, 1).ToLower() + prop.Substring(1, prop.Length - 1);
            }
            return string.Join(".", camelCaseList);
        }
    }
}
