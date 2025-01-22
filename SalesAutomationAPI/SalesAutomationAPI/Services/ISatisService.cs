using SalesAutomationAPI.Models;
using SalesAutomationAPI.Models.DTOs;

namespace SalesAutomationAPI.Services
{
    public interface ISatisService
    {
        Task<IEnumerable<SatisDetailDto>> GetAllSatislarAsync();
        Task<SatisDetailDto> GetSatisByIdAsync(int id);
        Task<IEnumerable<SatisDetailDto>> GetSatisByDateRangeAsync(DateTime baslangic, DateTime bitis);
        Task<IEnumerable<SatisDetailDto>> GetSatisByCustomerAsync(string musteri);
        Task<SatisDetailDto> CreateSatisAsync(SatisCreateDto satisDto);
        Task UpdateSatisAsync(int id, SatisUpdateDto satisDto);
        Task DeleteSatisAsync(int id);
        Task<decimal> GetTotalSalesByDateAsync(DateTime tarih);
        Task<decimal> GetTotalSalesInDateRangeAsync(DateTime baslangic, DateTime bitis);
        Task<object> GetSatisOzetiAsync();
    }
} 