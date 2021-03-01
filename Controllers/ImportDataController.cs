using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Controllers.QLHoSo;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    public class ImportDataController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        [HttpPost]
        [Route("api/ImportData/ImportPhieu")]
        public IHttpActionResult ImportPhieu(List<tblPhieumuonhoso> data)
        {
            foreach ( var item in data )
            {
                if ( item.trangthai == 1 || item.trangthai == 2 ) item.columnPhieu = "PM";
                if ( item.trangthai == 4 || item.trangthai == 5 ) item.columnPhieu = "PDC";
                if ( item.trangthai == 6 || item.trangthai == 7 ) item.columnPhieu = "PSL";
                if ( item.trangthai == 3 ) item.columnPhieu = "PTRA";
                db.tblPhieumuonhosoes.Add(item);
            }
            db.SaveChanges();
            return Ok(data);
        }
        [HttpPost]
        [Route("api/ImportData/ImportHSM")]
        public IHttpActionResult ImportHSM(List<tblHosomuon> data)
        {
            db.tblHosomuons.AddRange(data);
            db.SaveChanges();
            return Ok(data);
        }
        [HttpPost]
        [Route("api/ImportData/ImportKtraHoso")]
        public IHttpActionResult ImportKtraHoso(List<tblKiemtrahoso> data)
        {
            db.tblKiemtrahosoes.AddRange(data);
            db.SaveChanges();
            return Ok(data);
        }
        public class DataIn
        {
            public string HopSo { get; set; }
            public string SoHS { get; set; }
            public string TenDung { get; set; }
            public string MaHS { get; set; }
            public string HoTen { get; set; }
            public string HoDem { get; set; }
            public string Ten { get; set; }
            public string Hovaten { get; set; }
        }
        [HttpPost]
        [Route("api/ImportData/EditSaiTen")]
        public IHttpActionResult EditSaiTen(List<DataIn> data)
        {
            foreach ( var item in data )
            {
                int thoiky = 0;
                if ( item.MaHS == "TBBP" )
                {
                    item.MaHS = "TBB";
                    thoiky = 2;

                };
                if ( item.MaHS == "TBB" )
                {
                    thoiky = 3;

                };
                var lhs = db.tblDanhmucs.Where(t => t.Viettat == item.MaHS && t.Maloai == "LHS").FirstOrDefault().Ma;
                var hs = db.tblDoiTuong_HoSo.Where(t => t.MaLoaiHoSo == lhs && t.HopSo == item.HopSo
                && ( t.ThoiKy_Id == thoiky || thoiky == 0 )
                && t.SoHS.Contains(item.SoHS)).FirstOrDefault();
                if ( hs != null )
                {
                    hs.HoTen = item.HoTen;
                    hs.Hodem = item.HoDem;
                    hs.Ten = item.Ten;
                    hs.Hovaten = item.Hovaten;
                }
            }
            db.SaveChanges();
            return Ok(data);
        }
        [HttpGet]
        [Route("api/ImportData/EditMuonGanNhat")]
        public IHttpActionResult EditMuonGanNhat()
        {
            var dt = ( from hsm in db.tblHosomuons
                       join pm in db.tblPhieumuonhosoes
                       on hsm.PhieuID equals pm.id
                       select new
                       {
                           hsm.DoituonghosoID,
                           hsm.PhieuID,
                           pm.Maphieu,
                           pm.Tennguoimuon,
                           hsm.Ngayhentra
                       } ).GroupBy(t => t.DoituonghosoID);
            foreach ( var item in dt )
            {
                var _item = item.OrderByDescending(t => t.PhieuID).FirstOrDefault();
                if ( _item != null )
                {
                    decimal hsId = _item.DoituonghosoID.Value;
                    var hs = db.tblDoiTuong_HoSo.Find(hsId);
                    if ( hs != null )
                    {
                        string ngayht = _item.Ngayhentra.HasValue ? _item.Ngayhentra.Value.ToString("dd/MM/yyyy") : "";
                        string Maphieu = !string.IsNullOrEmpty(_item.Maphieu) ? _item.Maphieu : "";
                        string Tennguoimuon = !string.IsNullOrEmpty(_item.Tennguoimuon) ? _item.Tennguoimuon : "";
                        hs.MuonGanNhat = Maphieu + " - " + Tennguoimuon + " - " + ngayht;
                    }
                }
            }
            db.SaveChanges();
            return Ok();
        }
        public class HoSo
        {
            public string HopSo { get; set; }
            public int SoHS { get; set; }
            public string LHS { get; set; }
            public int STT { get; set; }
        }

        [HttpPost]
        [Route("api/ImportData/InMaVach")]
        public HttpResponseMessage InMaVach(List<HoSo> listHS)
        {
            var orderHS = listHS.Select(t =>
            {
                t.STT = Convert.ToInt32(t.HopSo.Replace("H", string.Empty));
                return t;
            }).OrderBy(t => t.STT).ThenBy(t => t.SoHS);

            List<tblDoiTuong_HoSo> lsdt = new List<tblDoiTuong_HoSo>();
            foreach ( var item in orderHS )
            {
                string MaHS = item.LHS; int thoiky = 0;
                if ( item.LHS.Contains("M") )
                {
                    MaHS = item.LHS.Replace("M", string.Empty);
                    thoiky = 3;
                }
                if ( item.LHS.Contains("P") )
                {
                    MaHS = item.LHS.Replace("P", string.Empty);
                    thoiky = 2;
                }

                var hs = db.tblDoiTuong_HoSo
                    .Where(t => (t.HopSo.Contains(item.HopSo) || string.IsNullOrEmpty(t.HopSo) )&& t.SoHS.Contains(item.SoHS.ToString())
                    && t.MaLoaiHoSo == MaHS && ( t.ThoiKy_Id == thoiky || thoiky == 0 )).FirstOrDefault();
                if ( hs != null )
                    lsdt.Add(hs);
            }

            HoSoNCCController hsc = new HoSoNCCController();
            // hsc.ExportBarCode(lsdt);

            return hsc.ExportBarCode(lsdt);
        }
        [HttpPost]
        [Route("api/ImportData/AddListHoSo")]
        public IHttpActionResult InMaVach(List<tblDoiTuong_HoSo> listHS)
        {
            db.tblDoiTuong_HoSo.AddRange(listHS);
            db.SaveChanges();
            return Ok(listHS);
        }
      
    }
}
