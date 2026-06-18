using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Esto le dice a EF que cree una tabla llamada "Temas" basada en el modelo anterior
        public DbSet<Tema> Temas { get; set; }
    }
}