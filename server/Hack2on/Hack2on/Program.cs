using Hack2on.Core.Abstractions;
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

            // Get connection string
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? string.Empty;

            // Add services to the container
            builder.Services.AddControllers();


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

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
