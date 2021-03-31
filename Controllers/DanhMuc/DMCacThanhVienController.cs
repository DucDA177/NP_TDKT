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
            ndkt.Loai = "CANHAN";
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
            && (t.IdDonvi == IdDonvi || IdDonvi == 0) && t.Loai == "CANHAN"
            )
            .OrderByDescending(t => t.Id);

            return Ok(Commons.Common.GetPagingList(dt, pageNumber, pageSize));
        }

        [HttpGet]
        [Route("api/DMCacThanhVien/Del")]
        public IHttpActionResult Del(int Id)
        {
            var check = db.tblDoituongKhenthuongs.Where(t => t.IdDoituong == Id).Any();
            if (check) return BadRequest("Không được phép xóa đối tượng này do có dữ liệu liên quan!");

            db.tblDoituongs.Remove(db.tblDoituongs.Find(Id));

            return Ok(db.SaveChanges());
        }
        [HttpGet]
        [Route("api/DMCacThanhVien/LoadCaNhanByDonVi")]
        public IHttpActionResult LoadCaNhanByDonVi(int IdDonvi)
        {
            var data = db.tblDoituongs.Where(t => t.IdDonvi == IdDonvi && t.Loai == "CANHAN");
            
            return Ok(data);

        }
        [HttpGet]
        [Route("api/DMCacThanhVien/LoadCaNhanByDonViForTapThe")]
        public IHttpActionResult LoadCaNhanByDonViForTapThe(int IdDonvi)
        {
            //var data = db.tblDoituongs.Where(t => t.IdDonvi == IdDonvi && t.Loai == "CANHAN");
            var data = from dt in db.tblDoituongs
                       join dttt in db.tblThanhvienTapthes on dt.Id equals dttt.IdCanhan into gr
                       from tv in gr.DefaultIfEmpty()
                       where dt.IdDonvi == IdDonvi && dt.Loai == "CANHAN" 
                       select new { dt, tv };
            return Ok(data);

        }
    }
}
