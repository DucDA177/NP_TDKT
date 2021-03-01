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
    public class AutoIDsController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        // GET: api/AutoIDs
        public IQueryable<AutoID> GetAutoIDs()
        {
            return db.AutoIDs;
        }

        // GET: api/AutoIDs/5
        [ResponseType(typeof(AutoID))]
        public async Task<IHttpActionResult> GetAutoID(long id)
        {
            AutoID autoID = await db.AutoIDs.FindAsync(id);
            if (autoID == null)
            {
                return NotFound();
            }

            return Ok(autoID);
        }

        // PUT: api/AutoIDs/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutAutoID(long id, AutoID autoID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != autoID.Id)
            {
                return BadRequest();
            }

            db.Entry(autoID).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AutoIDExists(id))
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

        // POST: api/AutoIDs
        [ResponseType(typeof(AutoID))]
        public async Task<IHttpActionResult> PostAutoID(AutoID autoID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.AutoIDs.Add(autoID);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = autoID.Id }, autoID);
        }

        [Route("AutoId/{Code}")]
        [ResponseType(typeof(AutoID))]
        // Khởi tạo ID tự động
        public async Task<IHttpActionResult> CreateNewID(string Code)
        {
            try
            {
                Code = Code.ToUpper();
                AutoID AutoId = db.AutoIDs.Where(x => x.FCode == Code).SingleOrDefault();
                if (AutoId == null)
                {
                    AutoId = new AutoID();
                    AutoId.FCode = Code;
                    AutoId.Counter = 1;
                    db.AutoIDs.Add(AutoId);
                }
                AutoId.FName = Code;
                for (int i = 0; i < 6 - AutoId.Counter.ToString().Length; i++)
                    AutoId.FName += 0;
                AutoId.FName += AutoId.Counter.ToString();
                AutoId.Counter += 1;
                await db.SaveChangesAsync();
                return Ok(AutoId);
            }
            catch
            {
                return StatusCode(HttpStatusCode.ExpectationFailed);
            }
        }
        [HttpGet]
        [Route("api/AutoId/{Code}")]
        [ResponseType(typeof(AutoID))]
        // Khởi tạo ID tự động
        public IHttpActionResult AutoId(string Code)
        {
            try
            {
                Code = Code.ToUpper();
                AutoID AutoId = db.AutoIDs.Where(x => x.FCode == Code).SingleOrDefault();
                if (AutoId == null)
                {
                    AutoId = new AutoID();
                    AutoId.FCode = Code;
                    AutoId.Counter = 1;
                    db.AutoIDs.Add(AutoId);
                }
                AutoId.FName = Code;
                for (int i = 0; i < 6 - AutoId.Counter.ToString().Length; i++)
                    AutoId.FName += 0;
                AutoId.FName += AutoId.Counter.ToString();
                AutoId.Counter += 1;
                db.SaveChanges();
                return Ok(AutoId);
            }
            catch
            {
                return StatusCode(HttpStatusCode.ExpectationFailed);
            }
        }
        // DELETE: api/AutoIDs/5
        [ResponseType(typeof(AutoID))]
        public async Task<IHttpActionResult> DeleteAutoID(long id)
        {
            AutoID autoID = await db.AutoIDs.FindAsync(id);
            if (autoID == null)
            {
                return NotFound();
            }

            db.AutoIDs.Remove(autoID);
            await db.SaveChangesAsync();

            return Ok(autoID);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AutoIDExists(long id)
        {
            return db.AutoIDs.Count(e => e.Id == id) > 0;
        }
    }
}