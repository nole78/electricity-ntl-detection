using Hack2on.Analysis;
using Hack2on.Core.Abstractions;
using Hack2on.Core.Common;
using Hack2on.Infrastructure;
using Hack2on.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);


// MVC / API / OpenAPI

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// CORS — frontend on another port needs this

const string CorsPolicy = "AllowFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy => policy
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});


// Analysis configuration

var analysisConfig = builder.Configuration
    .GetSection("Analysis")
    .Get<AnalysisConfig>() ?? new AnalysisConfig();
builder.Services.AddSingleton(analysisConfig);


// Infrastructure (DB access)

builder.Services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
builder.Services.AddScoped<IFeederRepository, FeederRepository>();
builder.Services.AddScoped<IMeterReadRepository, MeterReadRepository>();


// Analysis (pure logic)

builder.Services.AddSingleton<BaselineCalculator>();
builder.Services.AddSingleton<AnomalyScorer>();

// Pipeline registered concretely, interface resolves to cached wrapper
builder.Services.AddScoped<NtlDetectionPipeline>();
builder.Services.AddScoped<IAnomalyDetector, CachedAnomalyDetector>();


// In-memory cache for expensive aggregation

builder.Services.AddMemoryCache();


// Build + pipeline

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsPolicy);
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();using Hack2on.Core.Abstractions;
using Hack2on.Core.Abstractions.Services;
using Hack2on.Infrastructure.RepositoryImplementations;
using Hack2on.Infrastructure.ServiceImplementation;

namespace Hack2on
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            const string FrontendCorsPolicy = "FrontendCorsPolicy";

            // Get connection string
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? string.Empty;

            // Add services to the container
            builder.Services.AddControllers();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(FrontendCorsPolicy, policy =>
                {
                    policy
                        .WithOrigins(
                            "http://localhost:3000",
                            "https://localhost:3000",
                            "http://127.0.0.1:3000",
                            "https://127.0.0.1:3000",
                            "http://localhost:3001",
                            "https://localhost:3001"
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });


            // Register Repositories
            builder.Services.AddScoped(_ => new FeederRepository(connectionString));
            builder.Services.AddScoped<IFeederRepository>(sp => sp.GetRequiredService<FeederRepository>());

            builder.Services.AddScoped(_ => new MeterReadRepository(connectionString));
            builder.Services.AddScoped<IMeterReadRepository>(sp => sp.GetRequiredService<MeterReadRepository>());

            builder.Services.AddScoped(_ => new DistributionSubstationRepository(connectionString));
            builder.Services.AddScoped<IDistributionSubstationRepository>(sp => sp.GetRequiredService<DistributionSubstationRepository>());

            builder.Services.AddScoped(_ => new SubstationRepository(connectionString));
            builder.Services.AddScoped<ISubstationRepository>(sp => sp.GetRequiredService<SubstationRepository>());

            builder.Services.AddScoped(_ => new TransmissionStationRepository(connectionString));
            builder.Services.AddScoped<ITransmissionStationRepository>(sp => sp.GetRequiredService<TransmissionStationRepository>());

            // Register Services
            builder.Services.AddScoped<ITransmissionStationService, TransmissionStationService>();
            builder.Services.AddScoped<ISubstationService, SubstationService>();
            builder.Services.AddScoped<IDistributionSubstationService, DistributionSubstationService>();

            // Add Swagger/OpenAPI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors(FrontendCorsPolicy);

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}