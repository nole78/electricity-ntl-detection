using System.Data;

namespace Hack2on.Core.Abstractions
{
    /// <summary>
    /// Provides abstraction for database operations and connection management.
    /// </summary>
    public interface IDatabase<T> where T : class
    {
        /// <summary>
        /// Gets a database connection for executing queries.
        /// </summary>
        IDbConnection GetConnection();

        /// <summary>
        /// Executes a query and returns results mapped to type T.
        /// </summary>
        Task<IReadOnlyList<T>> QueryAsync<T>(string sql, object? parameters = null, CancellationToken ct = default);

        /// <summary>
        /// Executes a query and returns a single result mapped to type T, or null if no results.
        /// </summary>
        Task<T?> QuerySingleOrDefaultAsync<T>(string sql, object? parameters = null, CancellationToken ct = default);

        /// <summary>
        /// Executes a non-query command (INSERT, UPDATE, DELETE).
        /// Returns the number of rows affected.
        /// </summary>
        Task<int> ExecuteAsync(string sql, object? parameters = null, CancellationToken ct = default);

        /// <summary>
        /// Executes a command and returns a scalar value.
        /// </summary>
        Task<T?> ExecuteScalarAsync<T>(string sql, object? parameters = null, CancellationToken ct = default);

        /// <summary>
        /// Tests the database connection.
        /// </summary>
        Task<bool> IsHealthyAsync(CancellationToken ct = default);
    }
}
