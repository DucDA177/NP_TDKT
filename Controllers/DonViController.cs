using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    [Authorize]
    public class DonViController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        [HttpPost]
        [Route("api/DonVi/Save")]
        public IHttpActionResult Save([FromBody] DMDonVi ndkt)
        {

            Validate(ndkt);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (ndkt.MaDonVi == null || string.IsNullOrEmpty(ndkt.MaDonVi.Trim())) ndkt.MaDonVi = Commons.Common.AutoId(db, "DV");
            if (ndkt.STT == null || ndkt.STT == 0 || string.IsNullOrEmpty(ndkt.STT.ToString().Trim())) ndkt.STT = db.DMDonVis.Max(t => t.STT) + 1;

            if (ndkt.Id == null || ndkt.Id == 0)
            {
                db.DMDonVis.Add(ndkt);
                db.SaveChanges();
            }
            else
            {
                db.Entry(ndkt).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(ndkt);




        }
        private void Validate(DMDonVi item)
        {
            if (string.IsNullOrEmpty(item.MaDonVi))
            {
                ModelState.AddModelError("MaDonVi", "Mã đơn vị bắt buộc nhập");
                ModelState.AddModelError("MaDonVi", "has-error");
            }
            if (string.IsNullOrEmpty(item.TenDonVi))
            {
                ModelState.AddModelError("TenDonVi", "Tên đơn vị bắt buộc nhập");
                ModelState.AddModelError("TenDonVi", "has-error");
            }
            if (string.IsNullOrEmpty(item.LoaiDonVi))
            {
                ModelState.AddModelError("LoaiDonVi", "Loại đơn vị bắt buộc chọn");
                ModelState.AddModelError("LoaiDonVi", "has-error");
            }

        }
        [HttpGet]
        [Route("api/DonVi/ValidMaDV")]
        public IHttpActionResult ValidMaDV(string MaDV)
        {
            var dt = db.DMDonVis.Where(t => t.FInUse == true && t.MaDonVi == MaDV).FirstOrDefault();
            return Ok(dt);

        }
        [HttpGet]
        [Route("api/DonVi/LoadLoaiTruong")]
        public IHttpActionResult LoadLoaiTruong()
        {
            return Ok(db.tblDanhmucs.Where(t=>t.Maloai == "LOAITRUONG").ToList());

        }
      
        [HttpGet]
        [Route("api/DonVi/LoadAllDonVi")]
        public IHttpActionResult LoadAllDonVi()
        {
            return Ok(db.DMDonVis.Where(t => t.FInUse == true).ToList());

        }
        [HttpGet]
        [Route("api/DonVi/GetDVbyId")]
        public IHttpActionResult GetDVbyId(int Id)
        {
            return Ok(db.DMDonVis.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault());

        }
        [HttpGet]
        [Route("api/DonVi/GetListTruong")]
        public IHttpActionResult GetListTruong(long? ParId)
        {

            var dt = db.DMDonVis.Where(t => t.FInUse == true && (t.IDDVCha == ParId || ParId == null) && t.LoaiDonVi == "TRUONG").ToList();
            return Ok(dt);

        }

        public class TTDonVi
        {
            public int Id { get; set; }
            public int STT { get; set; }
            public string MaDonVi { get; set; }
            public string TenDonVi { get; set; }
            public string GhiChu { get; set; }
            public string LoaiDonVi { get; set; }
            public Nullable<int> IDDVCha { get; set; }
            public string NhomLoai { get; set; }
            public string SoDiemTruong { get; set; }
            public string TenLanhDao { get; set; }
            public string DiaChi { get; set; }
            public string IDTinh { get; set; }
            public string IDHuyen { get; set; }
            public string IDXa { get; set; }
            public string Email { get; set; }
            public string DienThoai { get; set; }
            public string Fax { get; set; }
            public string Website { get; set; }
            public string LoaiHinh { get; set; }
            public Nullable<int> IDLoaiTruong { get; set; }
            public string ThongTinKhac { get; set; }
            public Nullable<bool> FInUse { get; set; }
            public string TTGui { get; set; }
        }
  
        [HttpGet]
        [Route("api/DonVi/DelDv")]
        public IHttpActionResult DelDv(int Id)
        {
            var dt = db.DMDonVis.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            // dt.FInUse = false;
            db.DMDonVis.Remove(dt);
            db.SaveChanges();
            return Ok(dt);

        }
        [HttpGet]
        [Route("api/DonVi/GetDonViCon")]
        public IHttpActionResult GetDonViCon(int ParId, string typeDV, string searchkey)
        {
            if (typeDV == null || typeDV == "0") typeDV = "";
            if(searchkey == null || searchkey == "0") searchkey = "";
            var dt = db.DMDonVis.Where(t => t.FInUse == true && t.IDDVCha == ParId && (t.NhomLoai == typeDV || t.NhomLoai == null|| typeDV == "") && (t.TenDonVi.Contains(searchkey) || searchkey == "")).ToList();
            return Ok(dt);

        }
        [HttpGet]
        [Route("api/DonVi/GetDonViTheoLoai")]
        public IHttpActionResult GetDonViTheoLoai(string LoaiDV)
        {
            var dt = db.DMDonVis.Where(t => t.FInUse == true && t.LoaiDonVi == LoaiDV).ToList();
            return Ok(dt);

        }
        [HttpGet]
        [Route("api/DonVi/GetDonViDuocQuanLy")]
        public IHttpActionResult GetDonViDuocQuanLy(int IDDVQuanLy)
        {
            var dt = db.DMDonVis.Where(t => t.FInUse == true && t.IDDVQuanLy == IDDVQuanLy);
            return Ok(dt);

        }
        [HttpGet]
        [Route("api/DonVi/GetDonVi")]
        public List GetDonVi(int pageNumber, int pageSize, string searchKey, string LoaiDonVi, string DVCha, string LoaiTruong)//, string year, string plan, string FInspection, string Org, string TypeTT, string KieuTT)
        {

            if (searchKey == null) searchKey = "";
            if (LoaiDonVi == null || LoaiDonVi == "0") LoaiDonVi = "";
            if (DVCha == null || DVCha == "0") DVCha = "";
            if (LoaiTruong == null || LoaiTruong == "0") LoaiTruong = "";

            List ls = new List();
            var cmd = db.Database.Connection.CreateCommand();
            cmd.CommandText = "[dbo].[GetDonVi]" + pageNumber + "," + pageSize + ",N'" + searchKey + "','" + LoaiDonVi + "','" + DVCha + "','" + LoaiTruong + "'";
            db.Database.Connection.Open();
            var reader = cmd.ExecuteReader();
            var dt = ((IObjectContextAdapter)db)
                .ObjectContext
                .Translate<ObjDonVi>(reader).ToList();
            ls.DMDonVi = dt;

            reader.NextResult();
            var totalCount = ((IObjectContextAdapter)db)
                .ObjectContext
                .Translate<int>(reader).ToList();


            foreach (var item in totalCount)
            {
                ls.totalCount = item;
            }

            db.Database.Connection.Close();
            ls.totalPage = System.Convert.ToInt32(System.Math.Ceiling(ls.totalCount / System.Convert.ToDouble(pageSize)));
            ls.pageStart = ((pageNumber - 1) * pageSize) + 1;
            if (ls.totalPage == pageNumber)
            {
                ls.pageEnd = ls.totalCount;
            }
            else ls.pageEnd = ((pageNumber - 1) * pageSize) + pageSize;
            return ls;
        }
        public class ObjDonVi
        {
            public int Id { get; set; }
            public int STT { get; set; }
            public string MaDonVi { get; set; }
            public string TenDonVi { get; set; }
            public string GhiChu { get; set; }
            public string LoaiDonVi { get; set; }
            public Nullable<int> IDDVCha { get; set; }
            public Nullable<int> IDDVQuanLy { get; set; }
            public string NhomLoai { get; set; }
            public string SoDiemTruong { get; set; }
            public string TenLanhDao { get; set; }
            public string DiaChi { get; set; }
            public string IDTinh { get; set; }
            public string IDHuyen { get; set; }
            public string IDXa { get; set; }
            public string Email { get; set; }
            public string DienThoai { get; set; }
            public string Fax { get; set; }
            public string Website { get; set; }
            public string LoaiHinh { get; set; }
            public Nullable<int> IDLoaiTruong { get; set; }
            public string ThongTinKhac { get; set; }
            public Nullable<bool> FInUse { get; set; }
            public string FullAddress { get; set; }

        }
        public class List
        {
            public List<ObjDonVi> DMDonVi { get; set; }
            public int totalCount { get; set; }
            public int pageStart { get; set; }
            public int pageEnd { get; set; }
            public int totalPage { get; set; }
        }
    
    }
}
