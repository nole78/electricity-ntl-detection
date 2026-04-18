using Microsoft.Data.SqlClient;
using System.Data;

namespace Hack2on.Infrastructure.Persistence
{
    public interface ISqlConnectionFactory
    {
        IDbConnection Create();
    }

    public sealed class SqlConnectionFactory : ISqlConnectionFactory
    {
        private readonly string _connectionString;

        public SqlConnectionFactory(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SotexDb")
                ?? throw new InvalidOperationException(
                    "Connection string 'SotexDb' not found in configuration.");
        }

        public IDbConnection Create() => new SqlConnection(_connectionString);
    }
}
