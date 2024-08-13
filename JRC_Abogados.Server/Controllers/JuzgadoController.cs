using JRC_Abogados.Server.DataBaseContext;
using JRC_Abogados.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JRC_Abogados.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class JuzgadoController : ControllerBase
    {
        private readonly DBaseContext _context;

        public JuzgadoController(DBaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Juzgado>>> GetJuzgados()
        {
            return await _context.Juzgado.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Juzgado>> GetJuzgado(int id)
        {
            var juzgado = await _context.Juzgado.FindAsync(id);

            if (juzgado == null)
            {
                return NotFound();
            }

            return juzgado;
        }

        [HttpPost]
        public async Task<ActionResult<Juzgado>> PostJuzgado(Juzgado juzgado)
        {
            _context.Juzgado.Add(juzgado);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetJuzgado", new { id = juzgado.Id }, juzgado);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutJuzgado(int id, Juzgado juzgado)
        {
            if (id != juzgado.Id)
            {
                return BadRequest();
            }

            _context.Entry(juzgado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JuzgadoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJuzgado(int id)
        {
            var juzgado = await _context.Juzgado.FindAsync(id);
            if (juzgado == null)
            {
                return NotFound();
            }

            _context.Juzgado.Remove(juzgado);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool JuzgadoExists(int id)
        {
            return _context.Juzgado.Any(e => e.Id == id);
        }
    }
}
