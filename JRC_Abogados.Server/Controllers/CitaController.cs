using JRC_Abogados.Server.DataBaseContext;
using JRC_Abogados.Server.Models;
using JRC_Abogados.Server.Models.EmailHelper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JRC_Abogados.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CitaController : ControllerBase
    {
        private readonly DBaseContext _context;
        private readonly IEmailSender _emailSender;

        public CitaController(DBaseContext context, IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cita>>> GetCitas()
        {
            var citas = await _context.Cita.ToListAsync();

            foreach (var cita in citas)
            {
                cita.Ubicacion = await _context.Ubicacion.FindAsync(cita.UbicacionId);
                cita.Estado = await _context.Estado.FindAsync(cita.EstadoId);
                cita.Cliente = await _context.Cliente.FindAsync(cita.ClienteId);
            }

            return citas;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cita>> GetCita(int id)
        {
            var cita = await _context.Cita.FindAsync(id);
#pragma warning disable CS8602 // Desreferencia de una referencia posiblemente NULL.
            cita.Ubicacion = await _context.Ubicacion.FindAsync(cita.UbicacionId);
#pragma warning restore CS8602 // Desreferencia de una referencia posiblemente NULL.
            cita.Estado = await _context.Estado.FindAsync(cita.EstadoId);
            cita.Cliente = await _context.Cliente.FindAsync(cita.ClienteId);

            if (cita == null)
            {
                return NotFound();
            }

            return cita;
        }


        [HttpPost]
        public async Task<ActionResult<Cita>> PostCita(Cita cita)
        {
            string emailSubject = "Tienes una cita con JRC Abogados!";
#pragma warning disable CS8602 // Desreferencia de una referencia posiblemente NULL.
            string emailBody = $"La cita esta programada este {cita.FechaInicio.Date} en la ciudad {cita.Ubicacion.Ciudad}. Codigo Postal: {cita.Ubicacion.CodigoPostal}.";
#pragma warning restore CS8602 // Desreferencia de una referencia posiblemente NULL.

            cita.Cliente = await _context.Cliente.FindAsync(cita.ClienteId);
#pragma warning disable CS8602 // Desreferencia de una referencia posiblemente NULL.
            bool resultado = await _emailSender.SendEmailAsync(cita.Cliente.CorreoElectronico, emailSubject, emailBody);
#pragma warning restore CS8602 // Desreferencia de una referencia posiblemente NULL.

            if (resultado)
            {
                cita.Ubicacion = null;
                cita.Estado = null;
                cita.Cliente = null;

                _context.Cita.Add(cita);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCita", new { id = cita.Id }, cita);
            }

            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCita(int id, Cita cita)
        {
            if (id != cita.Id)
            {
                return BadRequest();
            }

            var citaExisting = await _context.Cita.FindAsync(id);
            if (citaExisting.EstadoId != cita.EstadoId)
            {
                var estado = await _context.Estado.FindAsync(cita.EstadoId);
                string emailSubject = "Actualizacion de la Cita!";
                string emailBody = $"El estado de la caso es {estado.Nombre}.!";
                await _emailSender.SendEmailAsync(cita.Cliente.CorreoElectronico, emailSubject, emailBody);
            }

            cita.Cliente = null;
            cita.Estado = null;
            cita.Ubicacion = null;

            _context.Entry(citaExisting).CurrentValues.SetValues(cita);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CitaExists(id))
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
        public async Task<IActionResult> DeleteCita(int id)
        {
            var cita = await _context.Cita.FindAsync(id);
            if (cita == null)
            {
                return NotFound();
            }

            _context.Cita.Remove(cita);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CitaExists(int id)
        {
            return _context.Cita.Any(e => e.Id == id);
        }
    }
}
