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
    public class DMCacThanhVienController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        [HttpPost]
        [Route("api/DMCacThanhVien/Save")]
        public IHttpActionResult Save([FromBody] tblDoituong ndkt)
        {
            ndkt.SearchKey = Commons.Common.RenderSearchKey(ndkt.Hodem, ndkt.Ten);
            if (ndkt.Id == null || ndkt.Id == 0)
            {

                db.tblDoituongs.Add(ndkt);
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
        [Route("api/DMCacThanhVien/Get")]
        public IHttpActionResult Get(int pageNumber, int pageSize, string searchKey, int IdDonvi)
        {
            var dt = db.tblDoituongs.Where(t => 
            (t.SearchKey.Contains(searchKey) || string.IsNullOrEmpty(searchKey))
            && (t.IdDonvi == IdDonvi || IdDonvi == 0)
            )
            .OrderByDescending(t => t.Id);

            return Ok(Commons.Common.GetPagingList(dt, pageNumber, pageSize));
        }

        [HttpGet]
        [Route("api/DMCacThanhVien/Del")]
        public IHttpActionResult Del(int Id)
        {
            db.tblDoituongs.Remove(db.tblDoituongs.Find(Id));

            return Ok(db.SaveChanges());
        }
    }
}
