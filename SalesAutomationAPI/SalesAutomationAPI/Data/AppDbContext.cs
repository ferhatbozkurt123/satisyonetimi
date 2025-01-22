using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SalesAutomationAPI.Models;

namespace SalesAutomationAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Kategoriler> Kategoriler { get; set; }
        public DbSet<Urunler> Urunler { get; set; }
        public DbSet<Satislar> Satislar { get; set; }
        public DbSet<SatisDetaylari> SatisDetaylari { get; set; }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            if (Database.CurrentTransaction != null)
            {
                return Database.CurrentTransaction;
            }
            return await Database.BeginTransactionAsync();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Kategoriler konfigürasyonu
            modelBuilder.Entity<Kategoriler>()
                .HasMany(k => k.Urunler)
                .WithOne(u => u.Kategori)
                .HasForeignKey(u => u.KategoriID)
                .OnDelete(DeleteBehavior.Restrict);

            // Satislar konfigürasyonu
            modelBuilder.Entity<Satislar>()
                .HasMany(s => s.SatisDetaylari)
                .WithOne(sd => sd.Satis)
                .HasForeignKey(sd => sd.SatisId)
                .OnDelete(DeleteBehavior.Cascade);

            // SatisDetaylari konfigürasyonu
            modelBuilder.Entity<SatisDetaylari>()
                .HasOne(sd => sd.Urun)
                .WithMany()
                .HasForeignKey(sd => sd.UrunId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SatisDetaylari>()
                .Property(sd => sd.BirimFiyat)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<SatisDetaylari>()
                .Property(sd => sd.ToplamFiyat)
                .HasColumnType("decimal(18,2)");
        }
    }
}
