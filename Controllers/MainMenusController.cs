using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    [Authorize]
    public class MainMenusController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        // GET: api/MainMenus
        public IQueryable<MainMenu> GetMainMenus()
        {
            
            return db.MainMenus;
        }

        // GET: api/MainMenu/5
        [ResponseType(typeof(MainMenu))]
        public async Task<IHttpActionResult> GetMainMenu(long id)
        {
            MainMenu MainMenu = await db.MainMenus.FindAsync(id);
            if (MainMenu == null)
            {
                return NotFound();
            }

            return Ok(MainMenu);
        }

        // PUT: api/MainMenu/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutMainMenu(long id, MainMenu MainMenu)
        {
            Validate(MainMenu);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != MainMenu.Id)
            {
                return BadRequest();
            }
            MainMenu.FUpdateTime = System.DateTime.Now;
            db.Entry(MainMenu).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GroupExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/MainMenus
        [ResponseType(typeof(MainMenu))]
        public async Task<IHttpActionResult> PostGroup(MainMenu MainMenu)
        {
            Validate(MainMenu);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            MainMenu.FCode = MainMenu.FCode.ToUpper();
            MainMenu.FCreateTime = System.DateTime.Now;
            MainMenu.FUpdateTime = System.DateTime.Now;
            MainMenu.FUserCreate = RequestContext.Principal.Identity.Name;
            db.MainMenus.Add(MainMenu);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = MainMenu.Id }, MainMenu);
        }

        // DELETE: api/MainMenus/5
        [ResponseType(typeof(MainMenu))]
        public async Task<IHttpActionResult> DeleteGroup(long id)
        {
            MainMenu MainMenu = await db.MainMenus.FindAsync(id);
            if (MainMenu == null)
            {
                return NotFound();
            }

            db.MainMenus.Remove(MainMenu);
            await db.SaveChangesAsync();

            return Ok(MainMenu);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool GroupExists(long id)
        {
            return db.MainMenus.Count(e => e.Id == id) > 0;
        }
        private void Validate(MainMenu pre)
        {
            if (string.IsNullOrEmpty(pre.FCode))
            {
                ModelState.AddModelError("FCode", "Bắt buộc nhập dữ liệu");
                ModelState.AddModelError("FCode", "has-error");

            }
            if (string.IsNullOrEmpty(pre.FName))
            {
                ModelState.AddModelError("FName", "Bắt buộc nhập dữ liệu");
                ModelState.AddModelError("FName", "has-error");
            }

        }
    }
}