using Microsoft.EntityFrameworkCore;
using SalesAutomationAPI.Data;
using SalesAutomationAPI.Models;
using SalesAutomationAPI.Models.DTOs;
using SalesAutomationAPI.Repositories;

namespace SalesAutomationAPI.Services
{
    public class SatisService : ISatisService
    {
        private readonly ISatislarRepository _satislarRepository;
        private readonly ISatisDetaylariRepository _satisDetaylariRepository;
        private readonly IUrunlerRepository _urunlerRepository;
        private readonly AppDbContext _context;

        public SatisService(
            ISatislarRepository satislarRepository,
            ISatisDetaylariRepository satisDetaylariRepository,
            IUrunlerRepository urunlerRepository,
            AppDbContext context)
        {
            _satislarRepository = satislarRepository;
            _satisDetaylariRepository = satisDetaylariRepository;
            _urunlerRepository = urunlerRepository;
            _context = context;
        }

        public async Task<IEnumerable<SatisDetailDto>> GetAllSatislarAsync()
        {
            var satislar = await _satislarRepository.GetAllAsync();
            return satislar.Select(s => MapToDetailDto(s));
        }

        public async Task<SatisDetailDto> GetSatisByIdAsync(int id)
        {
            var satis = await _satislarRepository.GetByIdAsync(id);
            if (satis == null)
                throw new KeyNotFoundException($"ID: {id} olan satış bulunamadı.");

            return MapToDetailDto(satis);
        }

        public async Task<IEnumerable<SatisDetailDto>> GetSatisByDateRangeAsync(DateTime baslangic, DateTime bitis)
        {
            var satislar = await _satislarRepository.GetByDateRangeAsync(baslangic, bitis);
            return satislar.Select(s => MapToDetailDto(s));
        }

        public async Task<IEnumerable<SatisDetailDto>> GetSatisByCustomerAsync(string musteri)
        {
            var satislar = await _satislarRepository.GetByCustomerAsync(musteri);
            return satislar.Select(s => MapToDetailDto(s));
        }

        public async Task<SatisDetailDto> CreateSatisAsync(SatisCreateDto satisDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var satis = new Satislar
                {
                    Musteri = satisDto.Musteri,
                    SatisTarihi = DateTime.Now,
                    ToplamTutar = 0
                };

                await _satislarRepository.CreateAsync(satis);

                decimal toplamTutar = 0;
                var satisDetaylari = new List<SatisDetaylari>();

                foreach (var detay in satisDto.SatisDetaylari)
                {
                    var urun = await _urunlerRepository.GetByIdAsync(detay.UrunId);
                    if (urun == null)
                    {
                        throw new Exception($"Ürün bulunamadı: {detay.UrunId}");
                    }

                    if (urun.StokMiktari < detay.Miktar)
                    {
                        throw new Exception($"Yetersiz stok: {urun.UrunAdi}");
                    }

                    var satisDetay = new SatisDetaylari
                    {
                        SatisId = satis.SatisID,
                        UrunId = detay.UrunId,
                        Miktar = detay.Miktar,
                        BirimFiyat = detay.BirimFiyat,
                        ToplamFiyat = detay.Miktar * detay.BirimFiyat
                    };

                    satisDetaylari.Add(satisDetay);
                    toplamTutar += satisDetay.ToplamFiyat;

                    urun.StokMiktari -= detay.Miktar;
                    await _urunlerRepository.UpdateAsync(urun);
                }

                await _satisDetaylariRepository.CreateRangeAsync(satisDetaylari);

                satis.ToplamTutar = toplamTutar;
                await _satislarRepository.UpdateAsync(satis);

                await transaction.CommitAsync();

                // Satış detaylarıyla birlikte satışı yeniden yükle
                var createdSatis = await _satislarRepository.GetByIdAsync(satis.SatisID);
                return MapToDetailDto(createdSatis!);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task UpdateSatisAsync(int id, SatisUpdateDto satisDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var existingSatis = await _satislarRepository.GetByIdAsync(id);
                if (existingSatis == null)
                    throw new KeyNotFoundException($"ID: {id} olan satış bulunamadı.");

                await _satisDetaylariRepository.DeleteBySatisIdAsync(id);

                decimal toplamTutar = 0;
                var yeniDetaylar = new List<SatisDetaylari>();

                foreach (var detayDto in satisDto.SatisDetaylari)
                {
                    var urun = await _urunlerRepository.GetByIdAsync(detayDto.UrunId);
                    if (urun == null)
                        throw new KeyNotFoundException($"ID: {detayDto.UrunId} olan ürün bulunamadı.");

                    if (urun.StokMiktari < detayDto.Miktar)
                        throw new InvalidOperationException($"Ürün: {urun.UrunAdi} için yeterli stok yok. Mevcut stok: {urun.StokMiktari}");

                    var yeniDetay = new SatisDetaylari
                    {
                        SatisId = id,
                        UrunId = detayDto.UrunId,
                        Miktar = detayDto.Miktar,
                        BirimFiyat = detayDto.BirimFiyat,
                        ToplamFiyat = detayDto.BirimFiyat * detayDto.Miktar
                    };

                    yeniDetaylar.Add(yeniDetay);
                    toplamTutar += yeniDetay.ToplamFiyat;
                    urun.StokMiktari -= detayDto.Miktar;
                }

                await _satisDetaylariRepository.CreateRangeAsync(yeniDetaylar);

                existingSatis.Musteri = satisDto.Musteri;
                existingSatis.ToplamTutar = toplamTutar;
                await _satislarRepository.UpdateAsync(existingSatis);

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task DeleteSatisAsync(int id)
        {
            var satis = await _satislarRepository.GetByIdAsync(id);
            if (satis == null)
                throw new KeyNotFoundException($"ID: {id} olan satış bulunamadı.");

            await _satislarRepository.DeleteAsync(id);
        }

        public async Task<decimal> GetTotalSalesByDateAsync(DateTime tarih)
        {
            return await _satislarRepository.GetTotalSalesByDateAsync(tarih);
        }

        public async Task<decimal> GetTotalSalesInDateRangeAsync(DateTime baslangic, DateTime bitis)
        {
            return await _satislarRepository.GetTotalSalesInDateRangeAsync(baslangic, bitis);
        }

        public async Task<object> GetSatisOzetiAsync()
        {
            var bugun = DateTime.Today;
            var haftaBasi = bugun.AddDays(-(int)bugun.DayOfWeek);
            var ayBasi = new DateTime(bugun.Year, bugun.Month, 1);
            var yilBasi = new DateTime(bugun.Year, 1, 1);

            var gunlukToplam = await GetTotalSalesByDateAsync(bugun);
            var haftalikToplam = await GetTotalSalesInDateRangeAsync(haftaBasi, bugun);
            var aylikToplam = await GetTotalSalesInDateRangeAsync(ayBasi, bugun);
            var yillikToplam = await GetTotalSalesInDateRangeAsync(yilBasi, bugun);

            return new
            {
                GunlukToplam = gunlukToplam,
                HaftalikToplam = haftalikToplam,
                AylikToplam = aylikToplam,
                YillikToplam = yillikToplam
            };
        }

        private SatisDetailDto MapToDetailDto(Satislar satis)
        {
            if (satis == null)
                throw new ArgumentNullException(nameof(satis));

            return new SatisDetailDto
            {
                SatisID = satis.SatisID,
                SatisTarihi = satis.SatisTarihi,
                ToplamTutar = satis.ToplamTutar,
                Musteri = satis.Musteri,
                SatisDetaylari = satis.SatisDetaylari?.Select(d => new SatisDetayDetailDto
                {
                    Id = d.Id,
                    UrunId = d.UrunId,
                    UrunAdi = d.Urun?.UrunAdi ?? "Bilinmeyen Ürün",
                    Miktar = d.Miktar,
                    BirimFiyat = d.BirimFiyat,
                    ToplamFiyat = d.ToplamFiyat
                }).ToList() ?? new List<SatisDetayDetailDto>()
            };
        }
    }
} 