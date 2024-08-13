using JRC_Abogados.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace JRC_Abogados.Server.DataBaseContext
{
    public class DBaseContext : DbContext
    {
        public DbSet<Empleado> Empleado { get; set; }
        public DbSet<Caso> Caso { get; set; }
        public DbSet<Cita> Cita { get; set; }
        public DbSet<Cliente> Cliente { get; set; }
        public DbSet<Documento> Documento { get; set; }
        public DbSet<Expediente> Expediente { get; set; }
        public DbSet<Recordatorio> Recordatorio { get; set; }
        public DbSet<Ubicacion> Ubicacion { get; set; }
        public DbSet<Rol> Rol { get; set; }
        public DbSet<TipoCaso> TipoCaso { get; set; }
        public DbSet<Juzgado> Juzgado { get; set; }
        public DbSet<Estado> Estado { get; set; }

        public DBaseContext(DbContextOptions<DBaseContext> options)
        : base(options)
        { }
    }
}
