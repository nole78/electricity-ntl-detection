using Hack2on.Analysis;
using Hack2on.Core.Abstractions;
using Hack2on.Core.Abstractions.Services;
using Hack2on.Core.Common;
using Hack2on.Infrastructure;
using Hack2on.Infrastructure.Persistence;
using Hack2on.Infrastructure.RepositoryImplementations;
using Hack2on.Infrastructure.ServiceImplementation;


var builder = WebApplication.CreateBuilder(args);


// MVC / API / OpenAPI


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters
            .Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("SotexDb");

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
builder.Services.AddScoped<IRegistryRepository, RegistryRepository>();
builder.Services.AddSingleton<TechnicalLossCalculator>();

// Analysis (pure logic)

builder.Services.AddSingleton<BaselineCalculator>();
builder.Services.AddSingleton<AnomalyScorer>();

// Pipeline registered concretely, interface resolves to cached wrapper
builder.Services.AddScoped<NtlDetectionPipeline>();
builder.Services.AddScoped<IAnomalyDetector, CachedAnomalyDetector>();

builder.Services.AddScoped<ISubstationRepository>(_ => new SubstationRepository(connectionString));
builder.Services.AddScoped<ITransmissionStationRepository>(_ => new TransmissionStationRepository(connectionString));

builder.Services.AddScoped<IOutageRepository>(_ => new OutageRepository(connectionString));
builder.Services.AddScoped<IOutageService, OutageService>();

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

app.Run();

