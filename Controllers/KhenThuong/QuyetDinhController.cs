using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.KhenThuong
{
    public class QuyetDinhController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        public class ObjectQuyetDinh
        {
            public tblQuyetdinh tt { get; set; }
            public List<tblDoituongKhenthuong> ls { get; set; }
        }
        [HttpPost]
        [Route("api/QuyetDinh/SaveQuyetDinh")]
        public IHttpActionResult SaveQuyeDinh([FromBody] ObjectQuyetDinh ndkt)
        {

            if (ndkt.tt.Id == null || ndkt.tt.Id == 0)
            {
                db.tblQuyetdinhs.Add(ndkt.tt);
                db.SaveChanges();
            }
            else
            {
                db.Entry(ndkt.tt).State = EntityState.Modified;

                if (ndkt.ls.Any())
                {
                    var dv = db.DMDonVis.Find(ndkt.tt.IdDonvi);
                    var tt = db.tblTotrinhs.Find(ndkt.ls.First().IdTotrinh);
                    var check = db.ThongBaos.Where(t => t.Loai == ndkt.tt.Id).FirstOrDefault();

                    if (check == null)
                    {
                        ThongBao tb = new ThongBao();
                        tb.FInUse = true;
                        tb.DonViNhan = ndkt.ls.First().IdDonvi.ToString() + ";";
                        tb.NoiDung = dv.TenDonVi + " đã ra quyết định khen thưởng số " + ndkt.tt.SoQD
                            + " bao gồm " + ndkt.ls.Count
                            + " đối tượng vào ngày " + DateTime.Now.ToString("dd/MM/yyyy")
                            + " dựa theo tờ trình số " + tt.Sototrinh + " ngày " + tt.Ngaytrinh.Value.ToString("dd/MM/yyyy");
                        tb.NguoiGui = HttpContext.Current.User.Identity.Name;
                        tb.NgayGui = DateTime.Now;
                        tb.Link = "DSTT";
                        tb.Loai = ndkt.tt.Id;

                        db.ThongBaos.Add(tb);
                    }
                    else
                    {
                        check.NoiDung = dv.TenDonVi + " đã ra quyết định khen thưởng số " + ndkt.tt.SoQD
                           + " bao gồm " + ndkt.ls.Count
                           + " đối tượng vào ngày " + DateTime.Now.ToString("dd/MM/yyyy")
                           + " dựa theo tờ trình số " + tt.Sototrinh + " ngày " + tt.Ngaytrinh.Value.ToString("dd/MM/yyyy");
                        check.NgayGui = DateTime.Now;
                    }
                    
                }
               

                db.SaveChanges();

            }

            foreach (var item in ndkt.ls)
            {
                item.IdQuyetdinh = ndkt.tt.Id;
                item.Ngayduyet = ndkt.tt.NgayQD;
                item.SoQD = ndkt.tt.SoQD;
                item.Trangthai = 2;

                if (db.tblDoituongKhenthuongs.Any(t => t.Id == item.Id))
                    db.Entry(item).State = EntityState.Modified;

            }
            db.SaveChanges();
            return Ok(ndkt);

        }
        [HttpGet]
        [Route("api/QuyetDinh/Delete")]
        public IHttpActionResult Delete(int Id)
        {
            var dtkt = db.tblDoituongKhenthuongs.Where(t => t.IdTotrinh == Id).ToList();
           
            foreach (var item in dtkt)
            {
                item.TieuchiKoDat = null;
                item.Trangthai = 4;
                item.IdQuyetdinh = null;
                item.SoQD = null;
                item.IdHinhthucKhenthuong = null;
                item.Ngayduyet = null;
            }
            db.tblQuyetdinhs.Remove(db.tblQuyetdinhs.Find(Id));
           
            return Ok(db.SaveChanges());
        }
        [HttpPost]
        [Route("api/QuyetDinh/UpdateQuyetDinh")]
        public IHttpActionResult UpdateQuyetDinh([FromBody] tblQuyetdinh ndkt)
        {
            if (!db.tblQuyetdinhs.Any(t => t.Id == ndkt.Id))
                return BadRequest("Không thể cập nhật quyết định này!");
            db.Entry(ndkt).State = EntityState.Modified;
            db.SaveChanges();

            return Ok(ndkt);

        }
        [HttpGet]
        [Route("api/QuyetDinh/Get")]
        public IHttpActionResult Get(int pageNumber, int pageSize, string searchKey, int IdDonvi, int Nam)
        {
            
            var data = (from dtkt in db.tblDoituongKhenthuongs
                        join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                        join qd in db.tblQuyetdinhs on dtkt.IdQuyetdinh equals qd.Id
                        join dh in db.tblDanhmucs on dtkt.MaDanhhieu equals dh.Ma
                        where 
                        (qd.SoQD.Contains(searchKey) || qd.Ten.Contains(searchKey) || string.IsNullOrEmpty(searchKey))
                             && (qd.IdDonvi == IdDonvi || IdDonvi == 0) && (qd.Nam == Nam || Nam == 0)
                          && dh.Maloai == "LDH"
                        select new { dtkt, dt, qd, dh }).GroupBy(t => t.qd.Id)
                            .Select(t => new
                            {
                                qd = t.FirstOrDefault().qd,
                                CaNhan = t.Where(c => c.dt.Loai == "CANHAN"),
                                TapThe = t.Where(c => c.dt.Loai == "TAPTHE"),

                            }).OrderByDescending(t => t.qd.Id);

            return Ok(Commons.Common.GetPagingList(data, pageNumber, pageSize));
        }
        [HttpGet]
        [Route("api/QuyetDinh/GetDoiTuongQuyetDinh")]
        public IHttpActionResult GetDoiTuongQuyetDinh(int IdQuyetdinh)
        {
            var data = from dtkt in db.tblDoituongKhenthuongs
                       join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                       join dh in db.tblDanhmucs on dtkt.MaDanhhieu equals dh.Ma
                       where dtkt.IdQuyetdinh == IdQuyetdinh && dh.Maloai == "LDH"
                       select new
                       {
                           dtkt,dt, dh
                       };

            return Ok(data);
        }
    }
}
