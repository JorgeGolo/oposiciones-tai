using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TemasController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TemasController(ApplicationDbContext _context)
    {
        this._context = _context;
    }

    // GET: api/temas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tema>>> GetTemas()
    {
        return await _context.Temas.ToListAsync();
    }

    // GET: api/temas/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Tema>> GetTema(int id)
    {
        var tema = await _context.Temas.FindAsync(id);
        if (tema == null) return NotFound();
        return tema;
    }

    // POST: api/temas
    [HttpPost]
    public async Task<ActionResult<Tema>> PostTema(Tema tema)
    {
        _context.Temas.Add(tema);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTema), new { id = tema.Id }, tema);
    }

    // PUT: api/temas/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTema(int id, Tema tema)
    {
        if (id != tema.Id) return BadRequest();
        _context.Entry(tema).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/temas/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTema(int id)
    {
        var tema = await _context.Temas.FindAsync(id);
        if (tema == null) return NotFound();
        _context.Temas.Remove(tema);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}