using Microsoft.EntityFrameworkCore;
using SalesAutomationAPI.Data;
using SalesAutomationAPI.Models;

namespace SalesAutomationAPI.Repositories
{
    public class KategorilerRepository : IKategorilerRepository
    {
        private readonly AppDbContext _context;

        public KategorilerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Kategoriler>> GetAllAsync()
        {
            return await _context.Kategoriler.ToListAsync();
        }

        public async Task<Kategoriler> GetByIdAsync(int id)
        {
            return await _context.Kategoriler.FindAsync(id);
        }

        public async Task<Kategoriler> CreateAsync(Kategoriler kategori)
        {
            kategori.OlusturulmaTarihi = DateTime.Now;
            kategori.GuncellemeTarihi = DateTime.Now;

            await _context.Kategoriler.AddAsync(kategori);
            await _context.SaveChangesAsync();
            return kategori;
        }

        public async Task UpdateAsync(Kategoriler kategori)
        {
            var existingKategori = await _context.Kategoriler.FindAsync(kategori.KategoriID);
            if (existingKategori != null)
            {
                existingKategori.KategoriAdi = kategori.KategoriAdi;
                existingKategori.Aciklama = kategori.Aciklama;
                existingKategori.GuncellemeTarihi = DateTime.Now;

                _context.Kategoriler.Update(existingKategori);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var kategori = await _context.Kategoriler.FindAsync(id);
            if (kategori != null)
            {
                _context.Kategoriler.Remove(kategori);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Kategoriler.AnyAsync(k => k.KategoriID == id);
        }
    }
}
