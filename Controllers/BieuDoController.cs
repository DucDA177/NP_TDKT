using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    [Authorize]
    public class BieuDoController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        [HttpGet]
        [Route("api/BieuDo/SoLuongHoSo")]
        public IHttpActionResult SoLuongHoSo()
        {
            var dt = ( from hs in db.tblDoiTuong_HoSo
                       join dm in db.tblDanhmucs on hs.MaLoaiHoSo equals dm.Ma
                       where dm.Maloai == "LHS"
                       select hs
                        );
            var dthsm = from hsm in db.tblHosomuons
                        join pm in db.tblPhieumuonhosoes
                        on hsm.PhieuID equals pm.id
                        join hs in db.tblDoiTuong_HoSo
                        on hsm.DoituonghosoID equals hs.Id
                        join dm in db.tblDanhmucs on hs.MaLoaiHoSo equals dm.Ma
                        where dm.Maloai == "LHS"
                        select hsm;
            return Ok(new
            {
                dki = dthsm.Where(t => t.Tinhtrang == 1 || t.Tinhtrang == 4 || t.Tinhtrang == 6).Count(),
                hsm = dthsm.Where(t => t.Tinhtrang == 2).Count(),
                hsdc = dthsm.Where(t => t.Tinhtrang == 5).Count(),
                hssl = dthsm.Where(t => t.Tinhtrang == 7).Count(),
                tong = dt.Count(),
                tansuat = dthsm.Count()
            });

        }
        public class DataOut
        {
            public string name { get; set; }
            public int value { get; set; }
            public string fullname { get; set; }
        }
        [HttpGet]
        [Route("api/BieuDo/PhanLoaiHoSo")]
        public IHttpActionResult PhanLoaiHoSo()
        {
            List<DataOut> ls = new List<DataOut>();
            var lhs = db.tblDanhmucs.Where(t => t.Maloai == "LHS").AsNoTracking();
            foreach ( var item in lhs )
            {
                var hs = db.tblDoiTuong_HoSo.Where(t => t.MaLoaiHoSo == item.Ma).AsNoTracking().Count();
                if ( hs > 0 )
                {
                    DataOut loaihs = new DataOut();
                    loaihs.name = item.Viettat;
                    loaihs.value = hs;
                    loaihs.fullname = item.Ten;
                    ls.Add(loaihs);
                }
            }
            return Ok(ls);

        }
        [HttpGet]
        [Route("api/BieuDo/PhanLoaiPhieu")]
        public IHttpActionResult PhanLoaiPhieu(string Tungay, string Denngay)
        {
            DateTime From = new DateTime();
            DateTime To = new DateTime();
            if ( !string.IsNullOrEmpty(Tungay) )
                From = DateTime.ParseExact(Tungay, "dd/MM/yyyy",
                                           System.Globalization.CultureInfo.InvariantCulture);
            if ( !string.IsNullOrEmpty(Denngay) )
                To = DateTime.ParseExact(Denngay, "dd/MM/yyyy",
                                       System.Globalization.CultureInfo.InvariantCulture);

            List<DataOut> ls = new List<DataOut>();

            var pmhs = db.tblPhieumuonhosoes.Where(t =>
            ( t.Ngaydangky >= From || string.IsNullOrEmpty(Tungay) )
            && ( t.Ngaydangky <= To || string.IsNullOrEmpty(Denngay) )
            ).AsNoTracking();

            DataOut dt1 = new DataOut();
            dt1.name = "Mượn";
            dt1.value = pmhs.Where(t => t.trangthai == 1 || t.trangthai == 2).Count();
            ls.Add(dt1);


            DataOut dt3 = new DataOut();
            dt3.name = "Di chuyển";
            dt3.value = pmhs.Where(t => t.trangthai == 4 || t.trangthai == 5).Count();
            ls.Add(dt3);


            DataOut dt5 = new DataOut();
            dt5.name = "Sao lục";
            dt5.value = pmhs.Where(t => t.trangthai == 6 || t.trangthai == 7).Count();
            ls.Add(dt5);



            return Ok(ls);

        }
        [HttpGet]
        [Route("api/BieuDo/PhanLoaiHoSoMuon")]
        public IHttpActionResult PhanLoaiHoSoMuon(string Tungay, string Denngay)
        {
            DateTime From = new DateTime();
            DateTime To = new DateTime();
            if ( !string.IsNullOrEmpty(Tungay) )
                From = DateTime.ParseExact(Tungay, "dd/MM/yyyy",
                                           System.Globalization.CultureInfo.InvariantCulture);
            if ( !string.IsNullOrEmpty(Denngay) )
                To = DateTime.ParseExact(Denngay, "dd/MM/yyyy",
                                       System.Globalization.CultureInfo.InvariantCulture);

            List<DataOut> ls = new List<DataOut>();

            var pmhs = from hsm in db.tblHosomuons
                       join pm in db.tblPhieumuonhosoes
                       on hsm.PhieuID equals pm.id
                       join dt in db.tblDoiTuong_HoSo 
                       on hsm.DoituonghosoID equals dt.Id
                       join dm in db.tblDanhmucs on dt.MaLoaiHoSo equals dm.Ma

                       where dm.Maloai == "LHS"
                       && ( pm.Ngaydangky >= From || string.IsNullOrEmpty(Tungay) )
                        && ( pm.Ngaydangky <= To || string.IsNullOrEmpty(Denngay) )
                       select hsm;

            DataOut dt1 = new DataOut();
            dt1.name = "Mượn";
            dt1.value = pmhs.Where(t =>  t.Tinhtrang == 2).Count();
            ls.Add(dt1);


            DataOut dt3 = new DataOut();
            dt3.name = "Di chuyển";
            dt3.value = pmhs.Where(t =>  t.Tinhtrang == 5).Count();
            ls.Add(dt3);


            DataOut dt4 = new DataOut();
            dt4.name = "Hủy di chuyển";
            dt4.value = pmhs.Where(t => t.Tinhtrang == 8).Count();
            ls.Add(dt4);


            DataOut dt5 = new DataOut();
            dt5.name = "Sao lục";
            dt5.value = pmhs.Where(t =>  t.Tinhtrang == 7).Count();
            ls.Add(dt5);

            return Ok(ls);

        }
    }
}
