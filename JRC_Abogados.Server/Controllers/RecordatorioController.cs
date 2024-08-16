using JRC_Abogados.Server.DataBaseContext;
using JRC_Abogados.Server.Models;
using JRC_Abogados.Server.Models.EmailHelper;
using JRC_Abogados.Server.ModelsDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JRC_Abogados.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RecordatorioController : ControllerBase
    {
        private readonly DBaseContext _context;
        private readonly IEmailSender _emailSender;

        public RecordatorioController(DBaseContext context, IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recordatorio>>> GetRecordatorios()
        {
            var recordatorios = await _context.Recordatorio.ToListAsync();

            foreach (var recordatorio in recordatorios)
            {
                recordatorio.Cliente = await _context.Cliente.FindAsync(recordatorio.ClienteId);
            }

            return recordatorios;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Recordatorio>> GetRecordatorio(int id)
        {
            var recordatorio = await _context.Recordatorio.FindAsync(id);

            if (recordatorio == null)
            {
                return NotFound();
            }

            return recordatorio;
        }

        [HttpPost("CheckReminders")]
        public async Task<IActionResult> CheckAndSendReminders()
        {
            var now = DateTime.Now;
            var recordatorios = await _context.Recordatorio
            .Where(r => r.Fecha <= now.Date && r.Hora != "Expirado" && r.Hora.CompareTo(now.ToString("HH:mm")) <= 0)
            .Include(r => r.Cliente)
            .ToListAsync();

            foreach (var recordatorio in recordatorios)
            {
                try
                {
                    string emailSubject = "Recordatorio vencido!";
                    string emailBody = $"El recordatorio '{recordatorio.Titulo}' ha vencido.";

                    var cliente = await _context.Cliente.FindAsync(recordatorio.ClienteId);
                    await _emailSender.SendEmailAsync(cliente.CorreoElectronico, emailSubject, emailBody);

                    recordatorio.Hora = "Expirado";
                    _context.Entry(recordatorio).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending email for recordatorio ID {recordatorio.Id}: {ex.Message}");
                }
            }

            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult<Recordatorio>> PostRecordatorio(RecordatorioDTO recordatorioDTO)
        {
            var cliente = await _context.Cliente.FindAsync(recordatorioDTO.ClienteId);

            string emailSubject = "Nuevo Recordatorio!";
            string emailBody = $@"
                <p>Asunto: Recordatorio Importante de JRC Abogados</p>
                <p>Estimado/a {cliente.Nombre},</p>
                <p>Esperamos que se encuentre bien. Nos dirigimos a usted para recordarle que {recordatorioDTO.Descripcion}. La fecha programada es el {recordatorioDTO.Fecha.Date.ToShortDateString()} a las {recordatorioDTO.Hora}.</p>
                <p>Le recomendamos que revise toda la documentación necesaria y se asegure de que todo esté en orden antes de esa fecha. Si necesita asistencia adicional o tiene alguna pregunta, no dude en ponerse en contacto con nosotros.</p>
                <p>Estamos aquí para ayudarle en todo lo que necesite.</p>
                <p>Gracias por su atención a este asunto.</p>
                <p>Saludos cordiales,</p>
                <p>Equipo JRC Abogados.</p>
            ";

            await _emailSender.SendEmailAsync(cliente.CorreoElectronico, emailSubject, emailBody);

            Recordatorio recordatorio = new Recordatorio();
            recordatorio.Titulo = recordatorioDTO.Titulo;
            recordatorio.Descripcion = recordatorioDTO.Descripcion;
            recordatorio.Fecha = recordatorioDTO.Fecha;
            recordatorio.Hora = recordatorioDTO.Hora;
            recordatorio.ClienteId = recordatorioDTO.ClienteId;

            _context.Recordatorio.Add(recordatorio);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRecordatorio", new { id = recordatorio.Id }, recordatorio);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecordatorio(int id, Recordatorio recordatorio)
        {
            if (id != recordatorio.Id)
            {
                return BadRequest();
            }

            var recordatorioExisting = await _context.Recordatorio.FindAsync(id);

            _context.Entry(recordatorioExisting).CurrentValues.SetValues(recordatorio);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecordatorioExists(id))
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
        public async Task<IActionResult> DeleteRecordatorio(int id)
        {
            var recordatorio = await _context.Recordatorio.FindAsync(id);
            if (recordatorio == null)
            {
                return NotFound();
            }

            _context.Recordatorio.Remove(recordatorio);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RecordatorioExists(int id)
        {
            return _context.Recordatorio.Any(e => e.Id == id);
        }
    }
}
