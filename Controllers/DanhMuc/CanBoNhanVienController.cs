using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.DanhMuc
{
    [Authorize]
    public class CanBoNhanVienController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        [HttpPost]
        [Route("api/CanBoNhanVien/Save")]
        public IHttpActionResult Save([FromBody] tblCanbo ndkt)
        {

            Validate(ndkt);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (ndkt.Id == null || ndkt.Id == 0)
            {
                
                db.tblCanboes.Add(ndkt);
                db.SaveChanges();
            }
            else
            {
                db.Entry(ndkt).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(ndkt);

        }

        [HttpGet]
        [Route("api/CanBoNhanVien/Get")]
        public IHttpActionResult Get(int pageNumber, int pageSize, string searchKey)
        {

            if (searchKey == null) searchKey = "";
         
            var dt = db.tblCanboes.Where(t => t.Hovaten.Contains(searchKey) || searchKey == "")
            .OrderByDescending(t => t.Id);

            return Ok(Commons.Common.GetPagingList(dt, pageNumber, pageSize));
        }

        [HttpGet]
        [Route("api/CanBoNhanVien/Del")]
        public IHttpActionResult Del(int Id)
        {
            db.tblCanboes.Remove(db.tblCanboes.Find(Id));

            return Ok(db.SaveChanges());
        }
    }
}
