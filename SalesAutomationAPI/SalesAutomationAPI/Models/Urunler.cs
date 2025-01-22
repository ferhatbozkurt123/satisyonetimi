using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesAutomationAPI.Models
{
    public class Urunler
    {
        [Key]
        public int UrunID { get; set; }

        [Required]
        [StringLength(200)]
        public string UrunAdi { get; set; } = string.Empty;

        public string? Aciklama { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Fiyat { get; set; }

        public int StokMiktari { get; set; }

        public int? KategoriID { get; set; }

        public string? UrunGorseli { get; set; }

        public string? Ozellikler { get; set; }

        public DateTime OlusturulmaTarihi { get; set; }

        public DateTime GuncellemeTarihi { get; set; }

        public virtual Kategoriler? Kategori { get; set; }
    }
}
