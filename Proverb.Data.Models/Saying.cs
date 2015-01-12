using System.ComponentModel.DataAnnotations;

namespace Proverb.Data.Models
{
    public class Saying
    {
        public int Id { get; set; }

        public int SageId { get; set; }
        public Sage Sage { get; set; }

        [Required]
        public string Text { get; set; }
    }
}
