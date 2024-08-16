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
            cita.Cliente = await _context.Cliente.FindAsync(cita.ClienteId);

            cita.Estado = await _context.Estado.FindAsync(cita.EstadoId);

            _context.Cita.Add(cita);
            await _context.SaveChangesAsync();

            string confirmUrl = $"https://backendjrc-001-site1.ftempurl.com/api/Cita/confirmar/{cita.Id}";
            string cancelUrl = $"https://backendjrc-001-site1.ftempurl.com/api/Cita/cancelar/{cita.Id}";

            string emailSubject = "Confirmación de Cita";
            string emailBody = $@"
                <p>Estimado/a {cita.Cliente.Nombre},</p>
                <p>Esperamos que se encuentre bien.</p>
                <p>Le escribimos para confirmar su cita programada con nosotros para el día {cita.FechaInicio.Date.ToShortDateString()} a las {cita.Hora}. </p>
                <p>Para confirmar su cita, haga clic en el siguiente botón:</p>
                <a href='{confirmUrl}' style='padding: 10px 20px; color: white; background-color: blue; text-decoration: none;'>Confirmar</a>
                <p>Si desea cancelar la cita, puede hacerlo haciendo clic en el siguiente botón:</p>
                <a href='{cancelUrl}' style='padding: 10px 20px; color: white; background-color: red; text-decoration: none;'>Cancelar</a>
                <p>En caso de necesitar reprogramar su cita, le agradeceríamos que nos lo notificara lo antes posible para poder reprogramarla a una fecha y hora más conveniente para usted.</p>
                <p>Quedamos atentos a su respuesta.</p>
                <p>Gracias por su atención.</p>
                <p>Saludos cordiales,</p>
                <p>Equipo JRC Abogados.</p>
            ";


            bool resultado = await _emailSender.SendEmailAsync(cita.Cliente.CorreoElectronico, emailSubject, emailBody);

            if (resultado)
            {
                return CreatedAtAction("GetCita", new { id = cita.Id }, cita);
            }

            return BadRequest();
        }

        [AllowAnonymous]
        [HttpGet("confirmar/{id}")]
        public async Task<IActionResult> ConfirmarCita(int id)
        {
            var cita = await _context.Cita.FindAsync(id);
            if (cita == null)
            {
                return NotFound(new { message = "Cita no encontrada." });
            }

            var cliente = await _context.Cliente.FindAsync(cita.ClienteId);

            string emailSubject = "Estado de su Cita";
            string emailBody = $@"
                <p>Estimado/a {cliente.Nombre},</p>
                <p>Gracias por su respuesta. Le informamos que su cita para el día {cita.FechaInicio.Date.ToShortDateString()} a las {cita.FechaInicio.ToShortTimeString()} ha sido confirmada.</p>
                <p>Atentamente,</p>
                <p>Equipo JRC Abogados.</p>
            ";

            cita.EstadoId = 2;
            await _context.SaveChangesAsync();

            return Redirect("https://backendjrc-001-site1.ftempurl.com");
        }

        [AllowAnonymous]
        [HttpGet("cancelar/{id}")]
        public async Task<IActionResult> CancelarCita(int id)
        {
            var cita = await _context.Cita.FindAsync(id);
            if (cita == null)
            {
                return NotFound(new { message = "Cita no encontrada." });
            }

            cita.EstadoId = 3;
            await _context.SaveChangesAsync();

            return Redirect("https://backendjrc-001-site1.ftempurl.com");
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
