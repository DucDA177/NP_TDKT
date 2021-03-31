using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.KhenThuong
{
    [Authorize]
    public class KhenThuongController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        [HttpPost]
        [Route("api/KhenThuong/SaveDanhSach")]
        public IHttpActionResult SaveDanhSach([FromBody] tblKhenthuong ndkt)
        {

            if (ndkt.Id == null || ndkt.Id == 0)
            {
                db.tblKhenthuongs.Add(ndkt);
                db.SaveChanges();
            }
            else
            {
                db.Entry(ndkt).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(ndkt);

        }
        [HttpPost]
        [Route("api/KhenThuong/SaveDoiTuongKhenThuong")]
        public IHttpActionResult SaveDoiTuongKhenThuong([FromBody] tblDoituongKhenthuong ndkt)
        {

            if (ndkt.Id == null || ndkt.Id == 0)
            {
                db.tblDoituongKhenthuongs.Add(ndkt);
                db.SaveChanges();
            }
            else
            {
                if (ndkt.Trangthai == 3)
                {
                    FilesController fl = new FilesController();
                    fl.RemoveFileXetDuyetKhenThuong(ndkt.Duongdan, ndkt.Id);

                    ndkt.SoQD = null;
                    ndkt.TieuchiDat = null;
                    ndkt.Duongdan = null;
                    ndkt.IdHinhthucKhenthuong = null;

                }

                db.Entry(ndkt).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(ndkt);

        }
        [HttpPost]
        [Route("api/KhenThuong/SaveListDoiTuongKhenThuong")]
        public IHttpActionResult SaveListDoiTuongKhenThuong([FromBody] List<tblDoituongKhenthuong> ndkt)
        {
            if (!ndkt.Any())
                return BadRequest("Không có đối tượng nào được chọn!");

            db.tblDoituongKhenthuongs.AddRange(ndkt);
            db.SaveChanges();


            return Ok(ndkt);

        }
        [HttpGet]
        [Route("api/KhenThuong/DelDanhSach")]
        public IHttpActionResult DelDanhSach(long Id)
        {
            db.tblKhenthuongs.Remove(db.tblKhenthuongs.Find(Id));

            return Ok(db.SaveChanges());

        }
        [HttpGet]
        [Route("api/KhenThuong/LoadDanhSach")]
        public IHttpActionResult LoadDanhSach(int IdDonvi, int Nam, int Trangthai, string Loai)
        {
            var data = db.tblKhenthuongs.Where(t =>
           (t.IdDonvi == IdDonvi || IdDonvi == 0) && (t.Nam == Nam || Nam == 0)
           && (t.Trangthai == Trangthai || Trangthai == 0) && (t.Loai == Loai || Loai == "0")
            ).OrderByDescending(t => t.Id);

            return Ok(data);

        }
        //[HttpGet]
        //[Route("api/KhenThuong/GuiDanhSachDeNghi")]
        //public IHttpActionResult GuiDanhSach(int IdKhenthuong)
        //{
        //    var data = db.tblKhenthuongs.Find(IdKhenthuong);
        //    data.Ngaydenghi = DateTime.Now;
        //    data.Trangthai = 1;

        //    var lsDoituong = db.tblDoituongKhenthuongs.Where(t => t.IdKhenthuong == IdKhenthuong).ToList();
        //    foreach (var item in lsDoituong)
        //    {
        //        item.Ngaydenghi = DateTime.Now;
        //        item.Trangthai = 1;

        //        var lsCaNhan = db.tblThanhvienTapthes.Where(t => t.IdTapthe == item.IdDoituong).ToList();
        //        foreach (var cn in lsCaNhan)
        //            cn.IdKhenthuong = 1;
        //    }
        //    db.SaveChanges();
        //    return Ok(data);

        //}
        //[HttpGet]
        //[Route("api/KhenThuong/LoadDoiTuongKhenThuong")]
        //public IHttpActionResult LoadDoiTuongKhenThuong(long IdKhenthuong, int IdDonvi, bool Chuaduyet)
        //{
        //    if (Chuaduyet)
        //    {

        //        var data = db.tblDoituongKhenthuongs.Where(t => t.IdDonvi == IdDonvi
        //        && t.IdKhenthuong == IdKhenthuong
        //        && t.Trangthai != 2 && t.Trangthai != 3
        //        );

        //        return Ok(data);

        //    }
        //    else
        //    {
        //        var data = db.tblDoituongKhenthuongs.Where(t => t.IdDonvi == IdDonvi
        //        && t.IdKhenthuong == IdKhenthuong);

        //        return Ok(data);
        //    }

        //}
        [HttpGet]
        [Route("api/KhenThuong/LoadDoiTuongKhenThuong")]
        public IHttpActionResult LoadDoiTuongKhenThuong(int IdTotrinh, bool Chuaduyet, string Loai)
        {
            if (Chuaduyet)
            {
                var data = from dtkt in db.tblDoituongKhenthuongs
                           join tt in db.tblTotrinhs on dtkt.IdTotrinh equals tt.Id
                           join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                           join dh in db.tblDanhmucs on dtkt.MaDanhhieu equals dh.Ma
                           where tt.Id == IdTotrinh && dtkt.Trangthai == 4
                           && dh.Maloai == "LDH" && (dt.Loai == Loai || Loai == "ALL")
                           select new { dtkt, tt, dt, dh };
                return Ok(data);

            }
            else
            {
                var data = from dtkt in db.tblDoituongKhenthuongs
                           join tt in db.tblTotrinhs on dtkt.IdTotrinh equals tt.Id
                           join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                           join dh in db.tblDanhmucs on dtkt.MaDanhhieu equals dh.Ma
                           where tt.Id == IdTotrinh && dh.Maloai == "LDH" && (dt.Loai == Loai || Loai == "ALL")
                           && dtkt.Trangthai != null
                           select new { dtkt, tt, dt, dh };

                return Ok(data);
            }

        }

        [HttpGet]
        [Route("api/KhenThuong/DeleteDoiTuongKhenThuong")]
        public IHttpActionResult DeleteDoiTuongKhenThuong(long IdDoiTuongKhenThuong)
        {
            var data = db.tblDoituongKhenthuongs.Find(IdDoiTuongKhenThuong);
            db.tblDoituongKhenthuongs.Remove(data);

            var gtkt = db.tblGiaytoKhenthuongs.Where(t => t.IdDoituongKhenthuong == IdDoiTuongKhenThuong).ToList();
            foreach (var item in gtkt)
            {
                string dir = HttpContext.Current.Server.MapPath("~/") + item.Duongdan;
                if (File.Exists(dir))
                {
                    File.Delete(dir);
                }
                db.tblGiaytoKhenthuongs.Remove(item);
            }
            return Ok(db.SaveChanges());

        }

        [HttpGet]
        [Route("api/KhenThuong/LoadDanhMucGiayTo")]
        public IHttpActionResult LoadDanhMucGiayTo(long IdDoituongKhenthuong, string MaDanhhieu, int Nam)
        {
            var dt = (from dm in db.tblDanhmucs
                      join gtdh in db.tblGiaytoDanhhieux.Where(t => t.Nam == Nam) on dm.Id equals gtdh.IdGiayto
                      join gtkt in db.tblGiaytoKhenthuongs.Where(g => g.IdDoituongKhenthuong == IdDoituongKhenthuong)
                      on gtdh.IdGiayto equals gtkt.IdGiayto
                      into gt
                      from g in gt.DefaultIfEmpty()
                      where gtdh.MaDanhhieu == MaDanhhieu
                      select new { dm.Ten, gtdh.MaDanhhieu, gtdh.IdGiayto, g.IdDoituongKhenthuong, g.Tentep, g.Duongdan })
                     .GroupBy(t => t.IdGiayto);

            return Ok(dt);

        }
        [HttpGet]
        [Route("api/KhenThuong/LoadTheoDoi")]
        public IHttpActionResult LoadTheoDoi(int pageNumber, int pageSize, string Searchkey,
            int Nam, int IdDonvi, string Loaihinh, int? Trangthai, int IdCurDonVi)
        {
            //List<int> ls = new List<int>();
            //if (IdDonvi == 0)
            //{
            //    var curDV = db.DMDonVis.Find(IdCurDonVi);
            //    BaoCao.BaoCaoController bc = new BaoCao.BaoCaoController();
            //    ls = bc.GetAllDVBaoCao(curDV).Select(t => t.Id).ToList();
            //}
            var curDV = db.DMDonVis.Find(IdCurDonVi);
            var data = (from dtkt in db.tblDoituongKhenthuongs
                        join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                        join kt in db.tblTotrinhs on dtkt.IdTotrinh equals kt.Id
                        join dv in db.DMDonVis on dtkt.IdDonvi equals dv.Id
                        join dh in db.tblDanhmucs on dtkt.MaDanhhieu equals dh.Ma
                        where
                        dh.Maloai == "LDH"
                        && (dt.SearchKey.Contains(Searchkey) || string.IsNullOrEmpty(Searchkey))
                        && (dtkt.Nam == Nam || Nam == 0) 
                        && (
                        (curDV.LoaiDonVi == "XD" && dv.IDDVCha == IdCurDonVi && dv.LoaiDonVi == "TT" && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0))
                        || (curDV.LoaiDonVi == "CUM" && dv.IDDVQuanLy == IdCurDonVi && dv.LoaiDonVi == "TT" && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0))
                        || (curDV.LoaiDonVi == "TT" && dtkt.IdDonvi == IdCurDonVi)
                        )
                        && (dt.Loai == Loaihinh || Loaihinh == "0") && (dtkt.Trangthai == Trangthai || Trangthai == 0)
                        select new { dtkt, dt, kt, dv, dh })
                        .GroupBy(t => t.dtkt.IdDonvi).Select(gr => new
                        {
                            DonVi = gr.FirstOrDefault().dv,
                            ListKhenThuong = gr.OrderByDescending(t => t.dt.Loai).GroupBy(t => t.dtkt.IdTotrinh)
                             .Select(t => new
                             {
                                 Khenthuong = t.FirstOrDefault().kt,
                                 ListDoiTuong = t
                             }).OrderByDescending(t => t.Khenthuong.Id)
                        })
                        .OrderByDescending(t => t.ListKhenThuong.FirstOrDefault().Khenthuong.Nam)
                     //.GroupBy(t=>t.FirstOrDefault().dtkt.IdDonvi);
                     ;

            return Ok(Commons.Common.GetPagingList(data, pageNumber, pageSize));
        }
        [HttpGet]
        [Route("api/KhenThuong/LoadListNam")]
        public IHttpActionResult LoadListNam()
        {
            var data = db.tblDoituongKhenthuongs.Select(t => t.Nam).OrderByDescending(t => t).Distinct();

            return Ok(data);
        }

        //[HttpGet]
        //[Route("api/KhenThuong/LoadThongTinDoiTuongKhenThuong")]
        //public IHttpActionResult LoadThongTinDoiTuongKhenThuong(long IdKhenthuong, int IdDonvi, int? Trangthai)
        //{
        //    var data = from dtkt in db.tblDoituongKhenthuongs
        //               join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
        //               join dh in db.tblDanhmucs on dtkt.MaDanhhieu equals dh.Ma
        //               where dtkt.IdKhenthuong == IdKhenthuong && dtkt.IdDonvi == IdDonvi && dh.Maloai == "LDH"
        //               && ( dtkt.Trangthai == Trangthai || Trangthai == 0 )
        //               select new { dtkt, dt, dh };

        //    return Ok(data);

        //}

        [HttpPost]
        [Route("api/KhenThuong/CheckDuGiayTo")]
        public IHttpActionResult CheckDuGiayTo(List<tblDoituongKhenthuong> ls)
        {
            foreach(var item in ls)
            {
                var lsGT = db.tblGiaytoDanhhieux.Where(t=>t.MaDanhhieu == item.MaDanhhieu && t.Nam == item.Nam).Count();
                var avaGT = db.tblGiaytoKhenthuongs.Where(t => t.IdDoituongKhenthuong == item.Id).Count();

                if(lsGT == 0) return BadRequest("Chưa thiết lập giấy tờ minh chứng. Vui lòng kiểm tra lại hoặc liên hệ cấp trên!");

                if (lsGT != avaGT)
                {
                    var dt = db.tblDoituongs.Find(item.IdDoituong);
                    return BadRequest("Đối tượng " + dt.Hodem + " " + dt.Ten + " chưa cập nhật đủ giấy tờ minh chứng!");
                }
                   
            }
            return Ok(ls);
        }
    }
}
