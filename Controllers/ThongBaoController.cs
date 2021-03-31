using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    [System.Web.Http.Authorize]
    public class ThongBaoController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        // GET: api/DMXepLoaiHanhKiem
        public IHttpActionResult Get()
        {
            string curUser = HttpContext.Current.User.Identity.Name;
            return Ok(db.ThongBaos.Where(t => t.FInUse == true && t.Link == curUser).ToList());
        }

        [HttpPost]
        [Route("api/ThongBao/Save")]
        public IHttpActionResult Save([FromBody] ThongBao ndkt)
        {

            Validate(ndkt);
            if ( !ModelState.IsValid )
            {
                return BadRequest(ModelState);
            }
            if ( ndkt.Id == null || ndkt.Id == 0 )
            {
                ndkt.Link = HttpContext.Current.User.Identity.Name;
                ndkt.NgayGui = DateTime.Now;
                db.ThongBaos.Add(ndkt);
                db.SaveChanges();
            }
            else
            {
                db.Entry(ndkt).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(ndkt);

        }
        private void Validate(ThongBao item)
        {
            if ( string.IsNullOrEmpty(item.NoiDung) )
            {
                ModelState.AddModelError("NoiDung", "Nội dung bắt buộc nhập");
                ModelState.AddModelError("NoiDung", "has-error");
            }
            //if ( string.IsNullOrEmpty(item.DonViNhan) )
            //{
            //    ModelState.AddModelError("DonViNhan", "Đơn vị nhận bắt buộc nhập");
            //    ModelState.AddModelError("DonViNhan", "has-error");
            //}


        }
        [HttpGet]
        [Route("api/ThongBao/Del")]
        public IHttpActionResult Del(long Id)
        {
            var dt = db.ThongBaos.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            //dt.FInUse = false;
            db.ThongBaos.Remove(dt);
            db.SaveChanges();
            return Ok(dt);

        }
        [HttpGet]
        [Route("api/ThongBao/GetThongBao")]
        public IHttpActionResult GetThongBao(string DonViNhan)
        {
            List<ThongBao> ltb = new List<ThongBao>();
            //var result = JsonConvert.DeserializeObject<List<string>>(json);
            var dt = db.ThongBaos.Where(t => t.FInUse == true).OrderByDescending(t => t.Id).Take(100);

            if ( dt.Count() > 0 )
                foreach ( var item in dt )
                {
                    if ( string.IsNullOrEmpty(item.DonViNhan) ) ltb.Add(item);
                    else
                    {
                        //var rs = JsonConvert.DeserializeObject<List<string>>(item.DonViNhan);
                        //if ( rs.Contains(DonViNhan) || !rs.Any() ) ltb.Add(item);
                        if (item.DonViNhan.Contains(DonViNhan)) ltb.Add(item);
                    }

                }
            return Ok(ltb);
        }
        [HttpGet]
        [Route("api/ThongBao/CheckReadTB")]
        public IHttpActionResult CheckReadTB(long IdTB, string User)
        {
            var dt = db.ThongBaos.Where(t => t.FInUse == true && t.Id == IdTB).FirstOrDefault();
            dt.NguoiDoc = dt.NguoiDoc + User + "#";
            db.SaveChanges();
            return Ok(dt);
        }
        [HttpGet]
        [Route("api/ThongBao/CheckReadAll")]
        public IHttpActionResult CheckReadAll()
        {
            var curUser = HttpContext.Current.User.Identity.Name;

            db.ThongBaos.Where(t => t.FInUse == true
        && ( !t.NguoiDoc.Contains(curUser + "#") || string.IsNullOrEmpty(t.NguoiDoc) ))
            .ToList().ForEach(item => item.NguoiDoc += curUser + "#");

            db.SaveChanges();
            return Ok(curUser);
        }
        [AllowAnonymous]
        [HttpPost]
        [Route("api/ThongBao/YeuCauDoiMatKhau")]
        public IHttpActionResult YeuCauDoiMatKhau([FromBody] ThongBao ndkt)
        {
            string nameUser = "";
            var user = db.UserProfiles.Where(t => t.UserName == ndkt.NguoiGui).FirstOrDefault();
            if ( user != null )
                nameUser = "( có thể là " + user.HoTen + ")";
            else return BadRequest("Tài khoản " + ndkt.NguoiGui + " không tồn tại. Vui lòng kiểm tra lại!");
            // var listAdmin = db.Group_User.Where(t => t.FInUse == true && t.CodeGroup.Contains("ADMIN")).Select(t => t.UserName).ToList();
            var lsAdmin = from usg in db.Group_User
                          join usp in db.UserProfiles on usg.UserName equals usp.UserName
                          where usg.FInUse == true && usg.CodeGroup.Contains("ADMIN")
                          && usp.FInUse == true
                          select usp.Id;

            var json = JsonConvert.SerializeObject(lsAdmin);

            if ( ndkt.Id == null || ndkt.Id == 0 )
            {
                ndkt.Loai = 1;
                ndkt.TrangThai = 1;
                ndkt.NgayGui = DateTime.Now;
                ndkt.DonViNhan = json;
                ndkt.NoiDung = "Tài khoản " + ndkt.NguoiGui + nameUser + " yêu cầu đặt lại mật khẩu vào lúc "
                    + ndkt.NgayGui.Value.ToString("HH:mm") + " ngày " + ndkt.NgayGui.Value.ToString("dd/MM/yyyy");
                ndkt.Link = "XLYC";
                db.ThongBaos.Add(ndkt);
                db.SaveChanges();

                var context = GlobalHost.ConnectionManager.GetHubContext<HubStore.UserActivityHub>();
                context.Clients.All.receive(ndkt.Id, ndkt.NoiDung, "ADMIN");
            }

            return Ok(ndkt);

        }
        [HttpGet]
        [Route("api/ThongBao/LoadYeuCauDoiMK")]
        public IHttpActionResult LoadYeuCau(int pageNumber, int pageSize, int TrangThai, int Loai)
        {
            var ls = db.ThongBaos.Where(t => t.FInUse == true && t.Loai == Loai
            && ( t.TrangThai == TrangThai || TrangThai == 0 ))
                 .OrderBy(t => t.TrangThai).ThenByDescending(t => t.Id);

            return Ok(Commons.Common.GetPagingList(ls, pageNumber, pageSize));

        }
      
        public class DataIn
        {
            public int currentPage { get; set; }
            public int pageSize { get; set; }
            public int TrangThai { get; set; }
            public int Loai { get; set; }
            public string MaLoaiHoSo { get; set; }
            public string HoTen { get; set; }
            public string NguyenQuan { get; set; }
            public string SoHS { get; set; }
            public int IsLock { get; set; }
            public string NguoiGui { get; set; }
        }
        
    }
}
