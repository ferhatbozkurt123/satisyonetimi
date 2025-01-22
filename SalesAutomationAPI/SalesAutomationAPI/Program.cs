using Microsoft.EntityFrameworkCore;
using SalesAutomationAPI.Data;
using SalesAutomationAPI.Models;
using SalesAutomationAPI.Repositories;
using SalesAutomationAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// DbContext Configuration
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SalesDbConnection")));

// Repository Dependencies
builder.Services.AddScoped<IKategorilerRepository, KategorilerRepository>();
builder.Services.AddScoped<IUrunlerRepository, UrunlerRepository>();
builder.Services.AddScoped<ISatislarRepository, SatislarRepository>();
builder.Services.AddScoped<ISatisDetaylariRepository, SatisDetaylariRepository>();

// Service Dependencies
builder.Services.AddScoped<IUrunlerService, UrunlerService>();
builder.Services.AddScoped<ISatisService, SatisService>();

// CORS Policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Swagger/OpenAPI Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();

