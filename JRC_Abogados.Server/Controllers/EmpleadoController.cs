using JRC_Abogados.Server.DataBaseContext;
using JRC_Abogados.Server.Models;
using JRC_Abogados.Server.Models.EmailHelper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JRC_Abogados.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadoController : ControllerBase
    {
        private readonly DBaseContext _context;
        private readonly IEmailSender _emailSender;
        private readonly PasswordHasher<Empleado> _passwordHasher;

        public EmpleadoController(DBaseContext context, IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;
            _passwordHasher = new PasswordHasher<Empleado>();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Empleado>>> GetUsuarios()
        {
            var empleados = await _context.Empleado.ToListAsync();

            foreach (var empleado in empleados)
            {
                empleado.Rol = await _context.Rol.FindAsync(empleado.RolId);
            }

            return empleados;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Empleado>> GetUsuario(int id)
        {
            var empleado = await _context.Empleado.FindAsync(id);
            if (empleado == null)
            {
                return NotFound();
            }

            empleado.Rol = await _context.Rol.FindAsync(empleado.RolId);

            return empleado;
        }

        [HttpPost]
        public async Task<ActionResult<Empleado>> PostUsuario(Empleado usuario)
        {
            var existingEmpleado = await _context.Empleado.FirstOrDefaultAsync(c => c.CorreoElectronico == usuario.CorreoElectronico);

            if (existingEmpleado != null)
            {
                return Conflict(new { message = "El usuario ya está registrado con este correo electrónico." });
            }

            string emailSubject = "Bienvenido a JRC Abogados!";
            string emailBody = $"Estamos felices de que trabajes con nosotros!";

            bool resultado = await _emailSender.SendEmailAsync(usuario.CorreoElectronico, emailSubject, emailBody);

            if (resultado)
            {
                usuario.Contraseña = _passwordHasher.HashPassword(usuario, usuario.Contraseña);
                usuario.Rol = null;
                _context.Empleado.Add(usuario);
                await _context.SaveChangesAsync();

                usuario.Contraseña = null;

                return CreatedAtAction("GetUsuario", new { id = usuario.Id }, usuario);
            }

            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Empleado usuario)
        {
            if (id != usuario.Id)
            {
                return BadRequest();
            }

            if (!string.IsNullOrEmpty(usuario.Contraseña))
            {
                usuario.Contraseña = _passwordHasher.HashPassword(usuario, usuario.Contraseña);
            }

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
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
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var empleado = await _context.Empleado.FindAsync(id);
            if (empleado == null)
            {
                return NotFound();
            }

            _context.Empleado.Remove(empleado);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsuarioExists(int id)
        {
            return _context.Empleado.Any(e => e.Id == id);
        }
    }
}
