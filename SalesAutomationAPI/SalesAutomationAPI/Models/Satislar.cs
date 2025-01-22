using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesAutomationAPI.Models
{
    public class Satislar
    {
        [Key]
        public int SatisID { get; set; }

        public DateTime SatisTarihi { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ToplamTutar { get; set; }

        [StringLength(50)]
        public string? Musteri { get; set; }

        // Navigation property
        public virtual ICollection<SatisDetaylari> SatisDetaylari { get; set; }

        public Satislar()
        {
            SatisDetaylari = new List<SatisDetaylari>();
        }
    }
}
