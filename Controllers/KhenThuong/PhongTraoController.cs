using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.KhenThuong
{
    [Authorize]
    public class PhongTraoController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        public class DonViWithCheck : DMDonVi
        {
            public bool? Check { get; set; }
        };
        public class PhongTrao_DonVi
        {
            public tblPhongtrao pt { get; set; }
            public List<DonViWithCheck> listDV { get; set; }
        }
        [HttpPost]
        [Route("api/PhongTrao/Save")]
        public IHttpActionResult Save([FromBody] PhongTrao_DonVi ndkt)
        {

            if (ndkt.pt.Id == null || ndkt.pt.Id == 0)
            {

                db.tblPhongtraos.Add(ndkt.pt);
                db.SaveChanges();
            }
            else
            {
                db.Entry(ndkt.pt).State = EntityState.Modified;
                db.SaveChanges();

            }
            foreach (var item in ndkt.listDV)
            {
                if (item.Check == true)
                {
                    var isExist = db.tblDonviPhongtraos.Where(t => t.IdPhongtrao == ndkt.pt.Id && t.IdDonvi == item.Id).Any();
                    if (!isExist)
                    {
                        tblDonviPhongtrao tv = new tblDonviPhongtrao();
                        tv.IdPhongtrao = ndkt.pt.Id;
                        tv.IdDonvi = item.Id;
                        db.tblDonviPhongtraos.Add(tv);
                    }

                }
                else
                {
                    var tv = db.tblDonviPhongtraos.Where(t => t.IdPhongtrao == ndkt.pt.Id && t.IdDonvi == item.Id).FirstOrDefault();
                    if (tv != null)
                        db.tblDonviPhongtraos.Remove(tv);
                }
            }
            db.SaveChanges();

            return Ok(ndkt);

        }
        [HttpPost]
        [Route("api/PhongTrao/UpdatePT")]
        public IHttpActionResult UpdatePT([FromBody] tblPhongtrao ndkt)
        {

            if (ndkt.Id == null || ndkt.Id == 0)
            {

                db.tblPhongtraos.Add(ndkt);
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
        [Route("api/PhongTrao/Get")]
        public IHttpActionResult Get(int pageNumber, int pageSize, string searchKey, int IdDonvi, int Nam, int Trangthai)
        {
            var dt = db.tblPhongtraos.Where(t =>
            (t.Ten.Contains(searchKey) || string.IsNullOrEmpty(searchKey))
            && (t.IdDonvi == IdDonvi || IdDonvi == 0) && (t.Nam == Nam || Nam == 0)
             && (t.Trangthai == Trangthai || Trangthai == 0)
            )
            .OrderByDescending(t => t.Id);

            return Ok(Commons.Common.GetPagingList(dt, pageNumber, pageSize));
        }
        [HttpGet]
        [Route("api/PhongTrao/GetByDVThamGia")]
        public IHttpActionResult GetByDVThamGia(int pageNumber, int pageSize, string searchKey, int IdDonvi, int Nam, int Trangthai)
        {
            //var dt = db.tblPhongtraos.Where(t =>
            //(t.Ten.Contains(searchKey) || string.IsNullOrEmpty(searchKey))
            //&& (t.IdDonvi == IdDonvi || IdDonvi == 0) && (t.Nam == Nam || Nam == 0)
            // && (t.Trangthai == Trangthai || Trangthai == 0)
            //)
            //.OrderByDescending(t => t.Id);

            var dt = (from dvpt in db.tblDonviPhongtraos
                      join t in db.tblPhongtraos on dvpt.IdPhongtrao equals t.Id
                      where (t.Ten.Contains(searchKey) || string.IsNullOrEmpty(searchKey))
                             && (dvpt.IdDonvi == IdDonvi || IdDonvi == 0) && (t.Nam == Nam || Nam == 0)
                             && (t.Trangthai == Trangthai || Trangthai == 0)
                      select t).OrderByDescending(t => t.Id);
                            

            return Ok(Commons.Common.GetPagingList(dt, pageNumber, pageSize));
        }
        [HttpGet]
        [Route("api/PhongTrao/Del")]
        public IHttpActionResult Del(int Id)
        {

            db.tblPhongtraos.Remove(db.tblPhongtraos.Find(Id));

            return Ok(db.SaveChanges());
        }

        [HttpGet]
        [Route("api/PhongTrao/LoadDonViPhongTrao")]
        public IHttpActionResult LoadDonViPhongTrao(int IdPhongtrao)
        {
            var data = db.tblDonviPhongtraos.Where(t => t.IdPhongtrao == IdPhongtrao);

            return Ok(data);

        }

        [HttpGet]
        [Route("api/PhongTrao/LoadInfoDonViPhongTrao")]
        public IHttpActionResult LoadInfoDonViPhongTrao(int IdPhongtrao)
        {
            var data = from pt in db.tblDonviPhongtraos
                       join dv in db.DMDonVis on pt.IdDonvi equals dv.Id
                       where pt.IdPhongtrao == IdPhongtrao
                       select new { pt, dv };

            return Ok(data);

        }
    }
}
