namespace Backend.Models
{
    public class Tema
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Bloque { get; set; } = string.Empty; // Ej: "Tecnología Básica"
        public bool Completado { get; set; } = false;
    }
}