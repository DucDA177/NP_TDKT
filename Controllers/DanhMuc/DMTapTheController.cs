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
    public class DMTapTheController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        public class CaNhanWithCheck : tblDoituong
        {
            public bool? Check { get; set; }
        };
        public class TapThe_ThanhVien
        {
            public tblDoituong tt { get; set; }
            public List<CaNhanWithCheck> listCN { get; set; }
            public int Nam { get; set; }
        }
        [HttpPost]
        [Route("api/DMTapThe/Save")]
        public IHttpActionResult Save([FromBody] TapThe_ThanhVien ndkt)
        {
            ndkt.tt.SearchKey = ndkt.tt.Ten + " " + Commons.Common.ReplaceUnicode(ndkt.tt.Ten);
            ndkt.tt.Loai = "TAPTHE";
            if (ndkt.tt.Id == null || ndkt.tt.Id == 0)
            {

                db.tblDoituongs.Add(ndkt.tt);
                db.SaveChanges();
            }
            else
            {
                db.Entry(ndkt.tt).State = EntityState.Modified;
                db.SaveChanges();

            }
            foreach (var item in ndkt.listCN)
            {
                if (item.Check == true)
                {
                    var isExist = db.tblThanhvienTapthes.Where(t => t.IdTapthe == ndkt.tt.Id && t.IdCanhan == item.Id && t.Nam == ndkt.Nam).Any();
                    if (!isExist)
                    {
                        tblThanhvienTapthe tv = new tblThanhvienTapthe();
                        tv.IdTapthe = ndkt.tt.Id;
                        tv.IdCanhan = item.Id;
                        tv.Nam = ndkt.Nam;
                        db.tblThanhvienTapthes.Add(tv);
                    }

                }
                else
                {
                    var tv = db.tblThanhvienTapthes.Where(t => t.IdTapthe == ndkt.tt.Id && t.IdCanhan == item.Id && t.Nam == ndkt.Nam).FirstOrDefault();
                    if (tv != null && tv.IdKhenthuong == null)
                        db.tblThanhvienTapthes.Remove(tv);
                }
            }
            db.SaveChanges();

            return Ok(ndkt);

        }

        [HttpGet]
        [Route("api/DMTapThe/Get")]
        public IHttpActionResult Get(int pageNumber, int pageSize, string searchKey, int IdDonvi)
        {
            var dt = db.tblDoituongs.Where(t =>
            (t.SearchKey.Contains(searchKey) || string.IsNullOrEmpty(searchKey))
            && (t.IdDonvi == IdDonvi || IdDonvi == 0) && t.Loai == "TAPTHE"
            )
            .OrderByDescending(t => t.Id);

            return Ok(Commons.Common.GetPagingList(dt, pageNumber, pageSize));
        }

        [HttpGet]
        [Route("api/DMTapThe/Del")]
        public IHttpActionResult Del(int Id)
        {
            var check = db.tblDoituongKhenthuongs.Where(t => t.IdDoituong == Id).Any();
            if (check) return BadRequest("Không được phép xóa đối tượng này do có dữ liệu liên quan!");

            db.tblDoituongs.Remove(db.tblDoituongs.Find(Id));

            return Ok(db.SaveChanges());
        }
        [HttpGet]
        [Route("api/DMTapThe/LoadTapTheByDonVi")]
        public IHttpActionResult LoadTapTheByDonVi(int IdDonvi)
        {
            var data = db.tblDoituongs.Where(t => t.IdDonvi == IdDonvi && t.Loai == "TAPTHE");

            return Ok(data);

        }
        [HttpGet]
        [Route("api/DMTapThe/LoadCaNhanTapThe")]
        public IHttpActionResult LoadCaNhanTapThe(int IdTapThe, int Nam)
        {
            var data = db.tblThanhvienTapthes.Where(t => t.IdTapthe == IdTapThe && t.Nam == Nam);

            return Ok(data);

        }
    }
}
