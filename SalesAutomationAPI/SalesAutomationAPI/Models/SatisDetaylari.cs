using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesAutomationAPI.Models
{
    public class SatisDetaylari
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int SatisId { get; set; }

        [Required]
        public int UrunId { get; set; }

        [Required]
        public int Miktar { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal BirimFiyat { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ToplamFiyat { get; set; }

        // Navigation properties
        public virtual Satislar Satis { get; set; }
        public virtual Urunler Urun { get; set; }
    }
} 