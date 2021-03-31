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
    [Authorize]
    public class ToTrinhController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        public class ObjectToTrinh
        {
            public tblTotrinh tt { get; set; }
            public List<tblDoituongKhenthuong> ls { get; set; }
        }
        [HttpPost]
        [Route("api/ToTrinh/SaveToTrinh")]
        public IHttpActionResult SaveDanhSach([FromBody] ObjectToTrinh ndkt)
        {
            if (ndkt.tt.Dotxuat == false) ndkt.tt.Dotxuat = null;

            if (ndkt.tt.Id == null || ndkt.tt.Id == 0)
            {
                db.tblTotrinhs.Add(ndkt.tt);

                db.SaveChanges();
            }
            else
            {
                if(ndkt.tt.Trangthai == 1)
                {

                    var dv = db.DMDonVis.Find(ndkt.tt.IdDonvi);
                    ThongBao tb = new ThongBao();
                    tb.FInUse = true;
                    tb.DonViNhan = dv.IDDVCha.ToString() + ";";
                    tb.NoiDung = "Đơn vị " + dv.TenDonVi + " đã gửi tờ trình số " + ndkt.tt.Sototrinh
                        + " bao gồm " + ndkt.ls.Count
                        + " đối tượng vào ngày " + DateTime.Now.ToString("dd/MM/yyyy");
                    tb.NguoiGui = HttpContext.Current.User.Identity.Name;
                    tb.NgayGui = DateTime.Now;
                    tb.Link = "XDDK";
                    db.ThongBaos.Add(tb);

                }

                db.Entry(ndkt.tt).State = EntityState.Modified;
                db.SaveChanges();

            }

            foreach (var item in ndkt.ls)
            {
                item.IdTotrinh = ndkt.tt.Id;
                item.Ngaytrinh = ndkt.tt.Ngaytrinh;
                //item.Trangthai = 4;

                if (item.Id == null || item.Id == 0)
                    db.tblDoituongKhenthuongs.Add(item);

                else if (db.tblDoituongKhenthuongs.Any(t => t.Id == item.Id))
                    db.Entry(item).State = EntityState.Modified;

            }
            db.SaveChanges();
            return Ok(ndkt);

        }
        [HttpPost]
        [Route("api/ToTrinh/UpdateToTrinh")]
        public IHttpActionResult UpdateToTrinh([FromBody] tblTotrinh ndkt)
        {
            if (!db.tblTotrinhs.Any(t => t.Id == ndkt.Id))
                return BadRequest("Không thể cập nhật tờ trình này!");
            db.Entry(ndkt).State = EntityState.Modified;
            db.SaveChanges();

            return Ok(ndkt);

        }
        [HttpGet]
        [Route("api/ToTrinh/Get")]
        public IHttpActionResult Get(int pageNumber, int pageSize, string searchKey, int IdDonvi, int Nam, bool? Dotxuat, int Trangthai)
        {

            if (Dotxuat == false) Dotxuat = null;

            var data = (from dtkt in db.tblDoituongKhenthuongs
                        join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                        join tt in db.tblTotrinhs on dtkt.IdTotrinh equals tt.Id
                        where (tt.Sototrinh.Contains(searchKey) || tt.Ten.Contains(searchKey) || string.IsNullOrEmpty(searchKey))
                             && (tt.IdDonvi == IdDonvi || IdDonvi == 0) && (tt.Nam == Nam || Nam == 0)
                             && (tt.Dotxuat == Dotxuat || Dotxuat == null)
                             && (tt.Trangthai == Trangthai || Trangthai == -1)
                        select new { dtkt, dt, tt }).GroupBy(t => t.tt.Id)
                            .Select(t => new
                            {
                                ToTrinh = t.FirstOrDefault().tt,
                                CaNhan = t.Where(c => c.dt.Loai == "CANHAN"),
                                TapThe = t.Where(c => c.dt.Loai == "TAPTHE"),

                            }).OrderByDescending(t => t.ToTrinh.Id);

            return Ok(Commons.Common.GetPagingList(data, pageNumber, pageSize));
        }
        [HttpGet]
        [Route("api/ToTrinh/GetToTrinhDotXuatNgoaiLuong")]
        public IHttpActionResult GetToTrinhDotXuat(int pageNumber, int pageSize, string searchKey, int IdDonvi, int Nam)
        {
            var data = (from tt in db.tblTotrinhs
                        where (tt.Sototrinh.Contains(searchKey) || string.IsNullOrEmpty(searchKey))
                             && (tt.IdDonvi == IdDonvi || IdDonvi == 0) && (tt.Nam == Nam || Nam == 0)
                             && tt.Dotxuat == true && tt.Ngoailuong == true
                        select tt).OrderByDescending(t => t.Id);

            return Ok(Commons.Common.GetPagingList(data, pageNumber, pageSize));
        }
        [HttpGet]
        [Route("api/ToTrinh/GetDoiTuongToTrinh")]
        public IHttpActionResult GetDoiTuongToTrinh(int IdTotrinh)
        {
            var data = from dtkt in db.tblDoituongKhenthuongs 
                       join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                       where dtkt.IdTotrinh == IdTotrinh
                       select new {
                           dtkt,
                           dt.Id,
                           dt.Hodem, dt.Ten, dt.Gioitinh, dt.Ngaysinh, dt.Dantoc, dt.SoCMND, dt.Diachi,
                           dt.Sdt, dt.Fax, dt.Email, dt.Chucvu, dt.Vitri, dt.Ghichu, dt.IdDonvi, dt.Loai, dt.SearchKey
                       };

            return Ok(data);
        }
        [HttpGet]
        [Route("api/ToTrinh/Delete")]
        public IHttpActionResult Delete(int Id)
        {
            var check = db.tblDoituongKhenthuongs.Where(t => t.IdTotrinh == Id && (t.Trangthai == 2 || t.Trangthai == 3)).Any();
            if (check)
                return BadRequest("Không thể xóa tờ trình này do đã có đối tượng được xét duyệt!");

            db.tblTotrinhs.Remove(db.tblTotrinhs.Find(Id));
            db.SaveChanges();

            var dtkt = db.tblDoituongKhenthuongs.Where(t => t.IdTotrinh == Id).AsEnumerable();
            KhenThuongController ktc = new KhenThuongController();

            foreach (var item in dtkt)
                ktc.DeleteDoiTuongKhenThuong(item.Id);

            return Ok();
        }
        [HttpGet]
        [Route("api/ToTrinh/LoadToTrinh")]
        public IHttpActionResult LoadToTrinh(int IdDonvi, int Nam, int Trangthai, bool? Dotxuat)
        {
            
            var data = db.tblTotrinhs.Where(t => t.IdDonvi == IdDonvi && t.Nam == Nam 
            && t.Dotxuat == Dotxuat  && (t.Trangthai == Trangthai || Trangthai == -1)).OrderByDescending(t=>t.Id);

            return Ok(data);
        }

        [HttpGet]
        [Route("api/ToTrinh/LoadAllDoiTuong")]
        public IHttpActionResult LoadAllDoiTuong(int pageNumber, int pageSize, string Searchkey, int IdDonvi, string Loai)
        {
            var data = db.tblDoituongs.Where(t => (t.IdDonvi == IdDonvi || IdDonvi == 0)
            && (t.Loai == Loai || Loai == "0")
            && (t.SearchKey.Contains(Searchkey) || string.IsNullOrEmpty(Searchkey)))
            .OrderBy(t => t.Loai)
            .ThenBy(t => t.Ten).ThenBy(t => t.Hodem);

            return Ok(Commons.Common.GetPagingList(data, pageNumber, pageSize));
        }

        [HttpGet]
        [Route("api/ToTrinh/LoadAllDoiTuongVuotCap")]
        public IHttpActionResult LoadAllDoiTuongVuotCap(int pageNumber, int pageSize, string Searchkey, int IdDonvi, string Loai, int Nam)
        {
            var data = (from dtkt in db.tblDoituongKhenthuongs 
                       join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                       join dh in db.tblDanhmucs on dtkt.MaDanhhieu equals dh.Ma
                       join ht in db.tblDanhmucs on dtkt.IdHinhthucKhenthuong equals ht.Id
                       join cap in db.tblDanhmucs on dtkt.IdCapKT equals cap.Id
                       where dtkt.Trangthai == 5 && dh.Maloai == "LDH"
                       && (dt.SearchKey.Contains(Searchkey) || string.IsNullOrEmpty(Searchkey))
                       && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0)
                       && (dt.Loai == Loai || Loai == "0")
                       && (dtkt.Nam == Nam || Nam == 0)
                       select new {dtkt,dt,dh,ht,cap }).OrderBy(t=>t.dt.Hodem).ThenBy(t=>t.dt.Ten);

            return Ok(Commons.Common.GetPagingList(data, pageNumber, pageSize));
        }
        [HttpGet]
        [Route("api/ToTrinh/DeleteDoiTuongVuotCap")]
        public IHttpActionResult DeleteDoiTuongVuotCap(long Id)
        {
           db.tblDoituongKhenthuongs.Remove(db.tblDoituongKhenthuongs.Find(Id));

            return Ok(db.SaveChanges());
        }
    }
}
