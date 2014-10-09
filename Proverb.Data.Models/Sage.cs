using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Proverb.Data.Models
{
    public class Sage : User
    {
        [Range(0, int.MaxValue, ErrorMessage = "Sagacity can only be positive my friend")]
        public int? Sagacity { get; set; }
        public ICollection<Saying> Sayings { get; set; }
    }
}
