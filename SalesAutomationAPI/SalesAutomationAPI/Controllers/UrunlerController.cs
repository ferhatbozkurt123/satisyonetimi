using Microsoft.AspNetCore.Mvc;
using SalesAutomationAPI.Models;
using SalesAutomationAPI.Services;
using System.IO;

[ApiController]
[Route("api/[controller]")]
public class UrunlerController : ControllerBase
{
    private readonly IUrunlerService _urunlerService;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public UrunlerController(IUrunlerService urunlerService, IWebHostEnvironment webHostEnvironment)
    {
        _urunlerService = urunlerService;
        _webHostEnvironment = webHostEnvironment;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Urunler>>> GetUrunler()
    {
        var urunler = await _urunlerService.GetAllAsync();
        return Ok(urunler);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Urunler>> GetUrun(int id)
    {
        var urun = await _urunlerService.GetByIdAsync(id);
        if (urun == null)
        {
            return NotFound();
        }
        return Ok(urun);
    }

    [HttpGet("kategori/{kategoriId}")]
    public async Task<ActionResult<IEnumerable<Urunler>>> GetUrunlerByKategori(int kategoriId)
    {
        var urunler = await _urunlerService.GetByKategoriIdAsync(kategoriId);
        return Ok(urunler);
    }

    [HttpPost]
    public async Task<ActionResult<Urunler>> CreateUrun([FromBody] UrunCreateDto urunDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var urun = new Urunler
            {
                UrunAdi = urunDto.UrunAdi,
                Aciklama = urunDto.Aciklama ?? string.Empty,
                Fiyat = urunDto.Fiyat,
                StokMiktari = urunDto.StokMiktari,
                KategoriID = urunDto.KategoriID,
                Ozellikler = urunDto.Ozellikler ?? string.Empty,
                UrunGorseli = urunDto.UrunGorseli ?? string.Empty,
                OlusturulmaTarihi = DateTime.UtcNow,
                GuncellemeTarihi = DateTime.UtcNow
            };

            var createdUrun = await _urunlerService.CreateAsync(urun);
            return CreatedAtAction(nameof(GetUrun), new { id = createdUrun.UrunID }, createdUrun);
        }
        catch (Exception ex)
        {
            // Detaylı hata loglama
            var errorMessage = $"Ürün oluşturma hatası: {ex.Message}";
            if (ex.InnerException != null)
            {
                errorMessage += $"\nİç hata: {ex.InnerException.Message}";
            }
            Console.WriteLine(errorMessage);
            return BadRequest(errorMessage);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUrun(int id, [FromBody] UrunUpdateDto urunDto)
    {
        if (id != urunDto.UrunID)
        {
            return BadRequest();
        }

        try
        {
            var existingUrun = await _urunlerService.GetByIdAsync(id);
            if (existingUrun == null)
            {
                return NotFound();
            }

            existingUrun.UrunAdi = urunDto.UrunAdi;
            existingUrun.Aciklama = urunDto.Aciklama;
            existingUrun.Fiyat = urunDto.Fiyat;
            existingUrun.StokMiktari = urunDto.StokMiktari;
            existingUrun.KategoriID = urunDto.KategoriID;
            existingUrun.Ozellikler = urunDto.Ozellikler;
            existingUrun.UrunGorseli = urunDto.UrunGorseli;
            existingUrun.GuncellemeTarihi = DateTime.UtcNow;

            await _urunlerService.UpdateAsync(existingUrun);
            return NoContent();
        }
        catch (Exception)
        {
            if (!await _urunlerService.ExistsAsync(id))
            {
                return NotFound();
            }
            throw;
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUrun(int id)
    {
        var urun = await _urunlerService.GetByIdAsync(id);
        if (urun == null)
        {
            return NotFound();
        }

        await _urunlerService.DeleteAsync(id);
        return NoContent();
    }
}
