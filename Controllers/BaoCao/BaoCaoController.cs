using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.BaoCao
{
    [Authorize]
    public class BaoCaoController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        [HttpPost]
        [Route("api/BaoCao/GetAllDVBaoCao")]
        public IHttpActionResult GetAllDVBaoCao(DMDonVi CurDonVi)
        {
            //List<DMDonVi> ls = new List<DMDonVi>();
            //if(CurDonVi.LoaiDonVi == "XD")
            //{

            //        var lsDVCS = db.DMDonVis.Where(t => t.IDDVCha == CurDonVi.Id && t.LoaiDonVi == "TT" && t.FInUse == true);
            //        ls.AddRange(lsDVCS);

            //}
            //if (CurDonVi.LoaiDonVi == "TT")
            //{

            //    ls.Add(CurDonVi);

            //}
            //if (CurDonVi.LoaiDonVi == "CUM")
            //{

            //    var lsDVCS = db.DMDonVis.Where(t => t.IDDVQuanLy == CurDonVi.Id && t.LoaiDonVi == "TT" && t.FInUse == true);
            //    ls.AddRange(lsDVCS);

            //}
            var ls = db.DMDonVis.Where(t => t.LoaiDonVi == "TT" && (
                        (CurDonVi.LoaiDonVi == "XD" && t.IDDVCha == CurDonVi.Id)
                       || (CurDonVi.LoaiDonVi == "CUM" && t.IDDVQuanLy == CurDonVi.Id)
                       || (CurDonVi.LoaiDonVi == "TT" && t.Id == CurDonVi.Id)
                       )
                );

            return Ok(ls);
        }
        [HttpGet]
        [Route("api/BaoCao/LoadBaoCaoNam")]
        public IHttpActionResult LoadBaoCaoNam(int pageNumber, int pageSize, int Nam, int IdDonvi, int IdCurDonVi)
        {
            //List<int> ls = new List<int>();
            //if(IdDonvi == 0)
            //{
            //    var curDV = db.DMDonVis.Find(IdCurDonVi);
            //    ls = GetAllDVBaoCao(curDV).Select(t=>t.Id).ToList();
            //};
            var curDV = db.DMDonVis.Find(IdCurDonVi);

            var data = (from dtkt in db.tblDoituongKhenthuongs
                        join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                        join tt in db.tblTotrinhs on dtkt.IdTotrinh equals tt.Id
                        join dv in db.DMDonVis on dtkt.IdDonvi equals dv.Id
                        where
                        (
                        (curDV.LoaiDonVi == "XD" && dv.IDDVCha == IdCurDonVi && dv.LoaiDonVi == "TT" && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0))
                        || (curDV.LoaiDonVi == "CUM" && dv.IDDVQuanLy == IdCurDonVi && dv.LoaiDonVi == "TT" && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0))
                        || (curDV.LoaiDonVi == "TT" && dtkt.IdDonvi == IdCurDonVi )
                        )
                        && (dtkt.Nam == Nam || Nam == 0)
                        select new { dtkt, dt, tt, dv }
                       ).GroupBy(t => new { t.dtkt.Nam, t.dtkt.IdDonvi }).Select(t => new
                       {
                           t.FirstOrDefault().dtkt.Nam,
                           t.FirstOrDefault().dv.TenDonVi,

                           CNDaTrinh = t.Where(c => c.dtkt.IdTotrinh != null && c.dt.Loai == "CANHAN").Count(),
                           CNDat = t.Where(c => c.dtkt.Trangthai == 2 && c.dt.Loai == "CANHAN").Count(),
                           CNKoDat = t.Where(c => c.dtkt.Trangthai == 3 && c.dt.Loai == "CANHAN").Count(),
                           CNDinhKy = t.Where(c => c.dt.Loai == "CANHAN" && c.tt.Dotxuat != true).Count(),
                           CNDotXuat = t.Where(c => c.dt.Loai == "CANHAN" && c.tt.Dotxuat == true).Count(),

                           TTDaTrinh = t.Where(c => c.dtkt.IdTotrinh != null && c.dt.Loai == "TAPTHE").Count(),
                           TTDat = t.Where(c => c.dtkt.Trangthai == 2 && c.dt.Loai == "TAPTHE").Count(),
                           TTKoDat = t.Where(c => c.dtkt.Trangthai == 3 && c.dt.Loai == "TAPTHE").Count(),
                           TTDinhKy = t.Where(c => c.dt.Loai == "TAPTHE" && c.tt.Dotxuat != true).Count(),
                           TTDotXuat = t.Where(c => c.dt.Loai == "TAPTHE" && c.tt.Dotxuat == true).Count(),
                       }).OrderByDescending(t => t.Nam);


            return Ok(Commons.Common.GetPagingList(data, pageNumber, pageSize));
        }
        [HttpGet]
        [Route("api/BaoCao/LoadBaoCaoCaNhanTapThe")]
        public IHttpActionResult LoadBaoCaoCaNhan(int pageNumber, int pageSize, int Nam, int IdDonvi,
            int IdCurDonVi, string MaDanhhieu, int HTKT, string SearchKey, string Loai)
        {
            //List<int> ls = new List<int>();
            //if(IdDonvi == 0)
            //{
            //    var curDV = db.DMDonVis.Find(IdCurDonVi);
            //    ls = GetAllDVBaoCao(curDV).Select(t=>t.Id).ToList();
            //};
            var curDV = db.DMDonVis.Find(IdCurDonVi);

            var data = (from dtkt in db.tblDoituongKhenthuongs
                        join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                        join dv in db.DMDonVis on dtkt.IdDonvi equals dv.Id
                        join dh in db.tblDanhmucs on dtkt.MaDanhhieu equals dh.Ma
                        join _htkt in db.tblDanhmucs on dtkt.IdHinhthucKhenthuong equals _htkt.Id into gr
                        from htkt in gr.DefaultIfEmpty()

                        where (
                        (curDV.LoaiDonVi == "XD" && dv.IDDVCha == IdCurDonVi && dv.LoaiDonVi == "TT" && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0))
                        || (curDV.LoaiDonVi == "CUM" && dv.IDDVQuanLy == IdCurDonVi && dv.LoaiDonVi == "TT" && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0))
                        || (curDV.LoaiDonVi == "TT" && dtkt.IdDonvi == IdCurDonVi)
                        )
                        && (dtkt.Nam == Nam || Nam == 0)
                        && (dtkt.MaDanhhieu == MaDanhhieu || string.IsNullOrEmpty(MaDanhhieu))
                        && (dtkt.IdHinhthucKhenthuong == HTKT || HTKT == 0)
                        && (dt.SearchKey.Contains(SearchKey) || string.IsNullOrEmpty(SearchKey))
                        && dt.Loai == Loai && dh.Maloai == "LDH"
                        && dtkt.Trangthai == 2
                        select new { dtkt, dt, dv, dh, htkt }
                       ).OrderByDescending(t => t.dtkt.Nam).ThenBy(t => t.dv.TenDonVi)
                       .ThenBy(t => t.dt.Ten).ThenBy(t => t.dt.Hodem);


            return Ok(Commons.Common.GetPagingList(data, pageNumber, pageSize));
        }
        [HttpGet]
        [Route("api/BaoCao/LoadBaoCaoDanhHieu")]
        public IHttpActionResult LoadBaoCaoDanhHieu(int pageNumber, int pageSize, int Nam, int IdDonvi, int IdCurDonVi)
        {
            //List<int> ls = new List<int>();
            //if(IdDonvi == 0)
            //{
            //    var curDV = db.DMDonVis.Find(IdCurDonVi);
            //    ls = GetAllDVBaoCao(curDV).Select(t=>t.Id).ToList();
            //};
            var curDV = db.DMDonVis.Find(IdCurDonVi);

            var data = (from dtkt in db.tblDoituongKhenthuongs
                        join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                        join dv in db.DMDonVis on dtkt.IdDonvi equals dv.Id
                        join dh in db.tblDanhmucs on dtkt.MaDanhhieu equals dh.Ma
                        where (
                        (curDV.LoaiDonVi == "XD" && dv.IDDVCha == IdCurDonVi && dv.LoaiDonVi == "TT" && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0))
                        || (curDV.LoaiDonVi == "CUM" && dv.IDDVQuanLy == IdCurDonVi && dv.LoaiDonVi == "TT" && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0))
                        || (curDV.LoaiDonVi == "TT" && dtkt.IdDonvi == IdCurDonVi)
                        )
                        && (dtkt.Nam == Nam || Nam == 0) && dh.Maloai == "LDH" && dtkt.Trangthai == 2
                        select new { dtkt, dt, dv, dh }
                       ).GroupBy(t => new { t.dtkt.Nam, t.dtkt.IdDonvi, t.dtkt.MaDanhhieu })
                       .Select(t => new
                       {
                           t.FirstOrDefault().dtkt.Nam,
                           t.FirstOrDefault().dv.TenDonVi,
                           t.FirstOrDefault().dh.Ten,
                           SoCaNhan = t.Where(c => c.dt.Loai == "CANHAN").Count(),
                           SoTapThe = t.Where(c => c.dt.Loai == "TAPTHE").Count(),
                       }).OrderByDescending(t => t.Nam).ThenBy(t => t.TenDonVi).ThenBy(t => t.Ten);


            return Ok(Commons.Common.GetPagingList(data, pageNumber, pageSize));
        }

        [HttpGet]
        [Route("api/BaoCao/LoadBaoCaoHinhThuc")]
        public IHttpActionResult LoadBaoCaoHinhThuc(int pageNumber, int pageSize, int Nam, int IdDonvi, int IdCurDonVi)
        {
            //List<int> ls = new List<int>();
            //if(IdDonvi == 0)
            //{
            //    var curDV = db.DMDonVis.Find(IdCurDonVi);
            //    ls = GetAllDVBaoCao(curDV).Select(t=>t.Id).ToList();
            //};
            var curDV = db.DMDonVis.Find(IdCurDonVi);
            var data = (from dtkt in db.tblDoituongKhenthuongs
                        join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                        join dv in db.DMDonVis on dtkt.IdDonvi equals dv.Id
                        join ht in db.tblDanhmucs on dtkt.IdHinhthucKhenthuong equals ht.Id
                        where (
                        (curDV.LoaiDonVi == "XD" && dv.IDDVCha == IdCurDonVi && dv.LoaiDonVi == "TT" && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0))
                        || (curDV.LoaiDonVi == "CUM" && dv.IDDVQuanLy == IdCurDonVi && dv.LoaiDonVi == "TT" && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0))
                        || (curDV.LoaiDonVi == "TT" && dtkt.IdDonvi == IdCurDonVi)
                        )
                        && (dtkt.Nam == Nam || Nam == 0)
                        select new { dtkt, dt, dv, ht }
                       ).GroupBy(t => new { t.dtkt.Nam, t.dtkt.IdDonvi, t.dtkt.IdHinhthucKhenthuong })
                       .Select(t => new
                       {
                           t.FirstOrDefault().dtkt.Nam,
                           t.FirstOrDefault().dv.TenDonVi,
                           t.FirstOrDefault().ht.Ten,
                           SoCaNhan = t.Where(c => c.dt.Loai == "CANHAN").Count(),
                           SoTapThe = t.Where(c => c.dt.Loai == "TAPTHE").Count(),
                       }).OrderByDescending(t => t.Nam).ThenBy(t => t.TenDonVi).ThenBy(t => t.Ten);


            return Ok(Commons.Common.GetPagingList(data, pageNumber, pageSize));
        }

        [HttpGet]
        [Route("api/BaoCao/LoadBaoCaoXepHang")]
        public IHttpActionResult LoadBaoCaoXepHang(int pageNumber, int pageSize, string Loai, int IdDonvi, int IdCurDonVi, string searchKey)
        {
            //List<int> ls = new List<int>();
            //if(IdDonvi == 0)
            //{
            //    var curDV = db.DMDonVis.Find(IdCurDonVi);
            //    ls = GetAllDVBaoCao(curDV).Select(t=>t.Id).ToList();
            //};
            var curDV = db.DMDonVis.Find(IdCurDonVi);

            var data = (from dtkt in db.tblDoituongKhenthuongs
                        join dt in db.tblDoituongs on dtkt.IdDoituong equals dt.Id
                        join dv in db.DMDonVis on dtkt.IdDonvi equals dv.Id
                        join ht in db.tblDanhmucs on dtkt.IdHinhthucKhenthuong equals ht.Id
                        where (
                        (curDV.LoaiDonVi == "XD" && dv.IDDVCha == IdCurDonVi && dv.LoaiDonVi == "TT" && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0))
                        || (curDV.LoaiDonVi == "CUM" && dv.IDDVQuanLy == IdCurDonVi && dv.LoaiDonVi == "TT" && (dtkt.IdDonvi == IdDonvi || IdDonvi == 0))
                        || (curDV.LoaiDonVi == "TT" && dtkt.IdDonvi == IdCurDonVi)
                        )
                        && (dt.Loai == Loai || Loai == "0")
                        && (dt.SearchKey.Contains(searchKey) || string.IsNullOrEmpty(searchKey))
                        select new { dtkt, dt, dv, ht }
                       ).GroupBy(t => t.dtkt.IdDoituong)
                       .Select(t => new
                       {
                           t.FirstOrDefault().dt,
                           t.FirstOrDefault().dv,
                           SoDanhHieu = t.Select(c => c.dtkt.MaDanhhieu).Count(),
                           ListNam = t.Select(c => c.dtkt.Nam).Distinct(),
                           NamLienTiep = 1
                       }).OrderByDescending(t => t.ListNam.Count()).ThenByDescending(t => t.SoDanhHieu);


            return Ok(Commons.Common.GetPagingList(data, pageNumber, pageSize));
        }
    }
}
