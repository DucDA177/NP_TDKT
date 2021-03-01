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
    public class DanhMucChungController : ApiController
    {
        // GET: api/DanhMucChung
        private WebApiDataEntities db = new WebApiDataEntities();
        public IHttpActionResult Get()
        {
            return Ok(db.tblDanhmucs.Where(t => t.FInUse == true).OrderBy(t=>t.STT).ToList());
        }
        [HttpGet]
        [Route("api/DMChung/GetAll")]
        public IHttpActionResult GetAll()
        {
            return Ok(db.tblDanhmucs.OrderBy(t=>t.STT).ToList());
        }
        [HttpGet]
        [Route("api/DMChung/GetAllDMCha")]
        public IHttpActionResult GetAllDMCha()
        {
            return Ok(db.tblDanhmucs.Where(t => t.IdCha == 0 || t.IdCha == null ).OrderByDescending(t => t.Id).ToList());
        }
        [HttpGet]
        [Route("api/DMChung/GetAllbyDMCha")]
        public IHttpActionResult GetAllbyDMCha(int IdCha)
        {
            return Ok(db.tblDanhmucs.Where(t=>t.IdCha == IdCha).OrderBy(t => t.STT).ToList());
        }
        [HttpGet]
        [Route("api/DMChung/GetAllbyMaLoai")]
        public IHttpActionResult GetAllbyMaLoai(string Maloai,string TTKhac1,string TTKhac2,string TTKhac3)
        {
            if (Maloai == null || Maloai == "undefined" || Maloai == "null") Maloai = "";
            if (TTKhac1 == null || TTKhac1 == "undefined" || TTKhac1 == "null") TTKhac1 = "";
            if (TTKhac2 == null || TTKhac2 == "undefined" || TTKhac2 == "null") TTKhac2 = "";
            if (TTKhac3 == null || TTKhac3 == "undefined" || TTKhac3 == "null") TTKhac3 = "";
            return Ok(db.tblDanhmucs.Where(t =>t.FInUse == true && 
            (t.Maloai == Maloai || Maloai == "") &&
            (t.TTKhac1 == TTKhac1 || TTKhac1 == "") &&
            (t.TTKhac2 == TTKhac2 || TTKhac2 == "") &&
            (t.TTKhac3 == TTKhac3 || TTKhac3 == "")
            ).OrderBy(t => t.STT).ToList());
        }
        [HttpPost]
        [Route("api/DMChung/Save")]
        public IHttpActionResult Save([FromBody] tblDanhmuc ndkt)
        {

            Validate(ndkt);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            if (ndkt.STT == 0 || string.IsNullOrEmpty(ndkt.STT.ToString().Trim()))
            {
                var dt = db.tblDanhmucs.Where(t => t.FInUse == true && t.IdCha == ndkt.IdCha);
                if (dt != null && dt.Count() > 0)
                    ndkt.STT = dt.Max(t => t.STT) + 1;
                else ndkt.STT = 1;

            }
            if (ndkt.Id == null || ndkt.Id == 0)
            {
                db.tblDanhmucs.Add(ndkt);
                db.SaveChanges();
            }
            else
            {
                db.Entry(ndkt).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(ndkt);




        }
        private void Validate(tblDanhmuc item)
        {
            if (string.IsNullOrEmpty(item.Ma))
            {
                ModelState.AddModelError("Ma", "Mã bắt buộc nhập");
                ModelState.AddModelError("Ma", "has-error");
            }
            if (string.IsNullOrEmpty(item.Ten))
            {
                ModelState.AddModelError("Ten", "Tên bắt buộc nhập");
                ModelState.AddModelError("Ten", "has-error");
            }


        }
        [HttpGet]
        [Route("api/DMChung/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblDanhmucs.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            //dt.FInUse = false;
            db.tblDanhmucs.Remove(dt);
            db.SaveChanges();
            return Ok(dt);

        }
        [HttpGet]
        [Route("api/DMChung/ValidMa")]
        public IHttpActionResult ValidMa(string Ma,int? IdCha)
        {
            var dt = db.tblDanhmucs.Where(t => t.FInUse == true && t.Ma == Ma && t.IdCha == IdCha).FirstOrDefault();
            return Ok(dt);

        }
    }
}
