using Microsoft.EntityFrameworkCore;
using SalesAutomationAPI.Data;
using SalesAutomationAPI.Models;

namespace SalesAutomationAPI.Services
{
    public class UrunlerService : IUrunlerService
    {
        private readonly AppDbContext _context;

        public UrunlerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Urunler>> GetAllAsync()
        {
            return await _context.Urunler.Include(u => u.Kategori).ToListAsync();
        }

        public async Task<Urunler> GetByIdAsync(int id)
        {
            return await _context.Urunler
                .Include(u => u.Kategori)
                .FirstOrDefaultAsync(u => u.UrunID == id);
        }

        public async Task<IEnumerable<Urunler>> GetByKategoriIdAsync(int kategoriId)
        {
            return await _context.Urunler
                .Include(u => u.Kategori)
                .Where(u => u.KategoriID == kategoriId)
                .ToListAsync();
        }

        public async Task<Urunler> CreateAsync(Urunler urun)
        {
            // Kategori kontrolü
            if (urun.KategoriID.HasValue)
            {
                var kategori = await _context.Kategoriler.FindAsync(urun.KategoriID.Value);
                if (kategori != null)
                {
                    urun.Kategori = kategori;
                }
            }

            urun.OlusturulmaTarihi = DateTime.UtcNow;
            urun.GuncellemeTarihi = DateTime.UtcNow;
            
            _context.Urunler.Add(urun);
            await _context.SaveChangesAsync();
            return urun;
        }

        public async Task UpdateAsync(Urunler urun)
        {
            urun.GuncellemeTarihi = DateTime.UtcNow;
            _context.Entry(urun).State = EntityState.Modified;
            _context.Entry(urun).Property(x => x.OlusturulmaTarihi).IsModified = false;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var urun = await _context.Urunler.FindAsync(id);
            if (urun != null)
            {
                _context.Urunler.Remove(urun);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Urunler.AnyAsync(u => u.UrunID == id);
        }
    }
}
