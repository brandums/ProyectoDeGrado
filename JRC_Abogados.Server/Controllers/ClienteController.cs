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
    public class ClienteController : ControllerBase
    {
        private readonly DBaseContext _context;
        private readonly IEmailSender _emailSender;

        public ClienteController(DBaseContext context, IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            var clientes = await _context.Cliente.ToListAsync();

            foreach (var cliente in clientes)
            {
                cliente.Ubicacion = await _context.Ubicacion.FindAsync(cliente.UbicacionId);
            }

            return clientes;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Cliente.FindAsync(id);
#pragma warning disable CS8602 // Desreferencia de una referencia posiblemente NULL.
            cliente.Ubicacion = await _context.Ubicacion.FindAsync(cliente.UbicacionId);
#pragma warning restore CS8602 // Desreferencia de una referencia posiblemente NULL.

            if (cliente == null)
            {
                return NotFound();
            }

            return cliente;
        }

        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            var existingCliente = await _context.Cliente.FirstOrDefaultAsync(c => c.CorreoElectronico == cliente.CorreoElectronico);

            if (existingCliente != null)
            {
                return Conflict(new { message = "El cliente ya está registrado con este correo electrónico." });
            }

            string emailSubject = "¡Bienvenido a JRC Abogados!";
            string emailBody = $"<p>Estimado/a {cliente.Nombre},</p>" +
                   "<p>Es un placer para nosotros darle la más cordial bienvenida a JRC Abogados. Agradecemos la confianza que ha depositado en nuestro equipo para atender sus necesidades legales.</p>" +
                   "<p>En JRC Abogados, nos enorgullece ofrecer un servicio jurídico de excelencia, respaldado por años de experiencia y un compromiso inquebrantable con la justicia y la satisfacción de nuestros clientes.</p>" +
                   "<p>A partir de este momento, cuenta con un equipo de profesionales dedicados que estarán a su disposición para asesorarlo y representarlo en todo lo que necesite. Nuestro objetivo es brindarle soluciones eficientes y personalizadas, siempre manteniendo una comunicación abierta y transparente.</p>" +
                   "<p>Nuevamente, agradecemos su confianza y esperamos construir una relación duradera basada en la excelencia y el respeto mutuo.</p>" +
                   "<p>Atentamente,<br>" +
                   "Equipo de JRC Abogados</p>";


            bool resultado = await _emailSender.SendEmailAsync(cliente.CorreoElectronico, emailSubject, emailBody);

            if (resultado)
            {
                cliente.Ubicacion = null;
                _context.Cliente.Add(cliente);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCliente", new { id = cliente.Id }, cliente);
            }

            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {
            if (id != cliente.Id)
            {
                return BadRequest();
            }

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
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
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Cliente.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            _context.Cliente.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClienteExists(int id)
        {
            return _context.Cliente.Any(e => e.Id == id);
        }
    }
}
