using System;
using System.ComponentModel.DataAnnotations;

namespace Proverb.Data.Models
{
    /// <summary>
    /// Represents the Log4Net logging entity
    /// </summary>
    public class Log4Net
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }

        [StringLength(10)]
        public string Thread { get; set; }

        [StringLength(10)]
        public string Level { get; set; }

        [StringLength(100)]
        public string Logger { get; set; }

        [StringLength(255)]
        public string Message { get; set; }

        public string Exception { get; set; }
    }
}
