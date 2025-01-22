using Microsoft.AspNetCore.Mvc;
using SalesAutomationAPI.Models;
using SalesAutomationAPI.Models.DTOs;
using SalesAutomationAPI.Models.Requests;
using SalesAutomationAPI.Services;

namespace SalesAutomationAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SatislarController : ControllerBase
    {
        private readonly ISatisService _satisService;

        public SatislarController(ISatisService satisService)
        {
            _satisService = satisService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SatisDetailDto>>> GetSatislar()
        {
            var satislar = await _satisService.GetAllSatislarAsync();
            return Ok(satislar);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SatisDetailDto>> GetSatis(int id)
        {
            try
            {
                var satis = await _satisService.GetSatisByIdAsync(id);
                return Ok(satis);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("musteri/{musteriAdi}")]
        public async Task<ActionResult<IEnumerable<SatisDetailDto>>> GetSatisByMusteri(string musteriAdi)
        {
            var satislar = await _satisService.GetSatisByCustomerAsync(musteriAdi);
            return Ok(satislar);
        }

        [HttpGet("tarih-araligi")]
        public async Task<ActionResult<IEnumerable<SatisDetailDto>>> GetSatisByDateRange(
            [FromQuery] DateTime baslangic,
            [FromQuery] DateTime bitis)
        {
            var satislar = await _satisService.GetSatisByDateRangeAsync(baslangic, bitis);
            return Ok(satislar);
        }

        [HttpPost]
        public async Task<ActionResult<SatisDetailDto>> CreateSatis([FromBody] SatisCreateRequest request)
        {
            try
            {
                var satisDto = new SatisCreateDto
                {
                    Musteri = request.Musteri,
                    SatisDetaylari = request.Detaylar.Select(d => new SatisDetayCreateDto
                    {
                        UrunId = d.UrunId,
                        Miktar = d.Miktar,
                        BirimFiyat = d.BirimFiyat
                    }).ToList()
                };

                var createdSatis = await _satisService.CreateSatisAsync(satisDto);
                return CreatedAtAction(
                    nameof(GetSatis),
                    new { id = createdSatis.SatisID },
                    createdSatis);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSatis(int id, SatisUpdateDto satisDto)
        {
            try
            {
                await _satisService.UpdateSatisAsync(id, satisDto);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSatis(int id)
        {
            try
            {
                await _satisService.DeleteSatisAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("gunluk-toplam")]
        public async Task<ActionResult<decimal>> GetDailySalesTotal([FromQuery] DateTime tarih)
        {
            var toplam = await _satisService.GetTotalSalesByDateAsync(tarih);
            return Ok(toplam);
        }

        [HttpGet("tarih-araligi-toplam")]
        public async Task<ActionResult<decimal>> GetDateRangeSalesTotal(
            [FromQuery] DateTime baslangic,
            [FromQuery] DateTime bitis)
        {
            var toplam = await _satisService.GetTotalSalesInDateRangeAsync(baslangic, bitis);
            return Ok(toplam);
        }

        [HttpGet("ozet")]
        public async Task<ActionResult<object>> GetSatisOzeti()
        {
            var ozet = await _satisService.GetSatisOzetiAsync();
            return Ok(ozet);
        }
    }
}
