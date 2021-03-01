using Newtonsoft.Json;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using OfficeOpenXml;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Http.Description;
using WebApiCore.Commons;
using WebApiCore.Controllers.HubStore;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    [Authorize]
    public class UserProfilesController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        [HttpGet]
        [Route("api/UserProfile/GetOtherUsers")]
        public IHttpActionResult GetOtherUsers()
        {
            var curUser = HttpContext.Current.User.Identity.Name;
            var IdCurUser = db.UserProfiles.Where(t => t.UserName == curUser).FirstOrDefault().Id;
            
            var dt = from usp in db.UserProfiles.Where(t => t.UserName != curUser)
                     join ms in db.UnreadMes.Where(t => t.IdNguoinhan == IdCurUser)
                     on usp.Id equals ms.IdNguoigui into gr
                     from g in gr.DefaultIfEmpty()
                     select new
                     {
                         usp.Id,
                         usp.STT,
                         usp.GhiChu,
                         usp.FInUse,
                         usp.Email,
                         usp.Mobile,
                         usp.UserName,
                         usp.HoTen,
                         usp.DiaChi,
                         usp.IDTinh,
                         usp.IDHuyen,
                         usp.IDXa,
                         usp.NgaySinh,
                         usp.GioiTinh,
                         usp.ChucVu,
                         usp.Avatar,
                         usp.IDDonVi,
                         usp.DaiDien,
                         usp.IsOnline,
                         ConnId = g != null ? g.Count.ToString() : "0"
                     };

            return Ok(dt);
        }

        public class Paging
        {
            public List<ListUser> list { get; set; }
            public int pageStart { get; set; }
            public int pageEnd { get; set; }
            public int totalCount { get; set; }
            public int totalPage { get; set; }
        }
        public class ListUser
        {
            public string ChucVu { get; set; }
            public string DonVi { get; set; }
            public string DonViChuQuan { get; set; }
            public UserProfile us { get; set; }
            public bool check { get; set; }

        }

        [HttpGet]
        [Route("api/UserProfile/GetUsers")]
        [ResponseType(typeof(object))]
        public List GetUsers(int pageNumber, int pageSize, string searchKey, string maDV)
        {
            if ( searchKey == null ) searchKey = "";
            if ( maDV == null || maDV == "0" ) maDV = "";
            List ls = new List();
            var cmd = db.Database.Connection.CreateCommand();
            cmd.CommandText = "[dbo].[GetUsers]" + pageNumber + "," + pageSize + ",N'" + searchKey + "','" + maDV + "'";
            db.Database.Connection.Open();
            var reader = cmd.ExecuteReader();
            var dt = ( (IObjectContextAdapter) db )
                .ObjectContext
                .Translate<Obj>(reader).ToList();
            ls.dt = dt;

            reader.NextResult();
            var totalCount = ( (IObjectContextAdapter) db )
                .ObjectContext
                .Translate<int>(reader).ToList();


            foreach ( var item in totalCount )
            {
                ls.totalCount = item;
            }

            db.Database.Connection.Close();
            ls.totalPage = System.Convert.ToInt32(System.Math.Ceiling(ls.totalCount / System.Convert.ToDouble(pageSize)));
            ls.pageStart = ( ( pageNumber - 1 ) * pageSize ) + 1;
            if ( ls.totalPage == pageNumber )
            {
                ls.pageEnd = ls.totalCount;
            }
            else ls.pageEnd = ( ( pageNumber - 1 ) * pageSize ) + pageSize;
            return ls;
        }
        public class Obj
        {
            public long Id { get; set; }
            public Nullable<long> STT { get; set; }
            public string GhiChu { get; set; }
            public Nullable<bool> FInUse { get; set; }
            public string Email { get; set; }
            public string UserName { get; set; }
            public string Mobile { get; set; }
            public string HoTen { get; set; }
            public string DiaChi { get; set; }
            public string IDTinh { get; set; }
            public string IDHuyen { get; set; }
            public string IDXa { get; set; }
            public Nullable<System.DateTime> NgaySinh { get; set; }
            public string GioiTinh { get; set; }
            public string ChucVu { get; set; }
            public string Avatar { get; set; }
            public Nullable<long> IDDonVi { get; set; }
            public Nullable<bool> DaiDien { get; set; }
            public string TenDonVi { get; set; }
            public string ConnId { get; set; }
            public Nullable<bool> IsOnline { get; set; }
        }
        public class List
        {
            public List<Obj> dt { get; set; }
            public int totalCount { get; set; }
            public int pageStart { get; set; }
            public int pageEnd { get; set; }
            public int totalPage { get; set; }
        }

        // GET: api/UserProfiles
        public IQueryable<UserProfile> GetUserProfiles()
        {

            return db.UserProfiles.Where(t => t.FInUse == true);
        }

        // GET: api/UserProfiles/5
        [ResponseType(typeof(UserProfile))]
        public async Task<IHttpActionResult> GetUserProfile(string id)
        {
            UserProfile userProfile = await db.UserProfiles.FindAsync(id);
            if ( userProfile == null )
            {
                return NotFound();
            }

            return Ok(userProfile);
        }

        // PUT: api/UserProfiles/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUserProfile(long id, UserProfile userProfile)
        {
          
            if ( id != userProfile.Id )
            {
                return BadRequest();
            }

            db.Entry(userProfile).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch ( DbUpdateConcurrencyException )
            {
                if ( !UserProfileExists(id) )
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            AspNetUser aspUser = db.AspNetUsers.Where(t => t.Id == id.ToString()).FirstOrDefault();
            if ( aspUser == null )
            {
                return NotFound();
            }
            else
            {
                aspUser.LockoutEnabled = false;
                db.SaveChanges();
            }
            return StatusCode(HttpStatusCode.NoContent);
        }
        private void ValidateMenu(UserProfile menu)
        {

            if ( menu.UserName == null || string.IsNullOrEmpty(menu.UserName) )
            {
                ModelState.AddModelError("UserName", "Tên đăng nhập bắt buộc nhập");
                ModelState.AddModelError("UserName", "has-error");
            }
        }
        //  POST: api/UserProfiles
        [ResponseType(typeof(UserProfile))]
        public async Task<IHttpActionResult> PostUserProfile(UserProfile userProfile)
        {
            
            Validate(userProfile);
            if ( !ModelState.IsValid )
            {
                return BadRequest(ModelState);
            }

            AspNetUser user = await db.AspNetUsers.Where(x => x.UserName == userProfile.UserName).SingleOrDefaultAsync();
            user.Email = userProfile.Email;
            user.PhoneNumber = userProfile.Mobile;

            if ( userProfile.Id == 0 )
            {
                db.UserProfiles.Add(userProfile);
                db.SaveChanges();
            }
            else
            {
                db.Entry(userProfile).State = EntityState.Modified;
                db.SaveChanges();

            }
            
            return CreatedAtRoute("DefaultApi", new { id = userProfile.Id }, userProfile);
        }
        [HttpPost]
        [Route("api/UserProfiles/DeleteUser")]
        [ResponseType(typeof(UserProfile))]
        public IHttpActionResult DeleteUser(string username)
        {
           
            UserProfile userProfile = db.UserProfiles.Where(t => t.UserName == username).FirstOrDefault();
            if ( userProfile == null )
                return NotFound();
            else
            {
               
                db.UserProfiles.Remove(userProfile);
            }
                
            
            AspNetUser aspUser = db.AspNetUsers.Where(t => t.UserName == username).FirstOrDefault();
            if ( aspUser == null )
                return NotFound();
            else
                db.AspNetUsers.Remove(aspUser);
            
            #region xóa nhóm của user liên quan
            var group_us = db.Group_User.Where(t => t.UserName == userProfile.UserName && t.FInUse == true).ToList();
            foreach ( var item in group_us )
            {
                db.Group_User.Remove(item);
            }
            #endregion
            db.SaveChanges();

            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            if ( disposing )
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserProfileExists(long id)
        {
            return db.UserProfiles.Count(e => e.Id == id) > 0;
        }

     
        [HttpGet]
        [Route("api/UserProfiles/GetUserbyGroup")]
        [ResponseType(typeof(string))]
        public IHttpActionResult GetUserbyGroup(string codeGroup)
        {
            var obj = ( from gr in db.Group_User
                        join us in db.UserProfiles on gr.UserName equals us.UserName
                        where gr.FInUse == true && gr.CodeGroup == codeGroup && gr.CodeGroup != Constants.SUPPERADMIN
                        select us );
            return Ok(obj);
        }


        [HttpGet]
        [Route("api/UserProfiles/GetUserbyUserName")]
        [ResponseType(typeof(UserProfile))]
        public async Task<IHttpActionResult> GetUserbyUserName(string UserName)
        {
            var obj = db.UserProfiles.Where(t => t.UserName == UserName).FirstOrDefault();
            if ( obj == null )
            {
                obj = new UserProfile();
                obj.UserName = UserName;
            }
            return Ok(obj);
        }

        [HttpGet]
        [Route("api/GetCurrentUserProfiles")]
        public async Task<IHttpActionResult> GetCurrentUserProfiles()
        {
            string curUser = HttpContext.Current.User.Identity.Name;
            var checkUpdatePass = db.AspNetUsers.Where(t => t.UserName == curUser).FirstOrDefault();
           
            var userProfile = db.UserProfiles.Where(t => 
            t.UserName == curUser
            && t.FInUse == true).FirstOrDefault();

            if( checkUpdatePass.FUpdateTime == null )
                userProfile.ConnId = null;
            else if ( checkUpdatePass.FUpdateTime.Value.AddDays(90) <= DateTime.Now )
                userProfile.ConnId = null;

            return Ok(userProfile);
        }
        [HttpPost]
        [Route("api/UpLoadImage")]
        public IHttpActionResult Upload()
        {

            bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath("~/Avatar"));

            if ( !exists )
                System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/Avatar"));
            System.Web.HttpFileCollection httpRequest = System.Web.HttpContext.Current.Request.Files;
            for ( int i = 0; i <= httpRequest.Count - 1; i++ )
            {
                System.Web.HttpPostedFile postedfile = httpRequest[i];
                if ( postedfile.ContentLength > 0 )
                {
                    var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Avatar"), postedfile.FileName);
                    postedfile.SaveAs(fileSavePath);
                }
            }
            return Ok();
        }
        [HttpGet]
        [Route("api/UserProfile/GetAllUser")]
        public IHttpActionResult GetAllUser()
        {
            var curUser = HttpContext.Current.User.Identity.Name;
            var cmd = db.Database.Connection.CreateCommand();
            cmd.CommandText = "[dbo].[GetUserReceived] '" + curUser + "'";
            db.Database.Connection.Open();
            var reader = cmd.ExecuteReader();
            var dt = ( (IObjectContextAdapter) db )
                .ObjectContext
                .Translate<UserProfile>(reader).ToList();

            db.Database.Connection.Close();
            return Ok(dt);
        }
        public class TaiKhoan
        {
            public long? STT { get; set; }
            public string UserName { get; set; }
            public string Password { get; set; }
            public string HoTen { get; set; }
            public string TenDonVi { get; set; }
        }
        [HttpGet]
        [Route("api/UserProfile/GetDSTaiKhoan")]
        public List<TaiKhoan> GetDSTaiKhoan(int IDDonVi)
        {
            
            var dt = ( from us in db.UserProfiles
                       join dv in db.DMDonVis on us.IDDonVi equals dv.Id
                       into gr
                       from
                       _dv in gr.DefaultIfEmpty()
                       where us.IDDonVi == IDDonVi || IDDonVi == 0
                       select new
                       {
                           us,
                           _dv
                       } ).Select(t => new TaiKhoan
                       {
                           STT = 0,
                           UserName = t.us.UserName,
                           Password = "",
                           HoTen = t.us.HoTen,
                           TenDonVi = t._dv != null ? t._dv.TenDonVi : ""
                       }).ToList();
            return dt;
        }
        [HttpPost]
        [Route("api/UserProfile/ExportDSTaiKhoan")]
        public HttpResponseMessage ExcelDownload(int IDDonVi)
        {
            HttpResponseMessage response;
            response = Request.CreateResponse(HttpStatusCode.OK);
            MediaTypeHeaderValue mediaType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.Content = new StreamContent(GetExcelSheet(IDDonVi));
            response.Content = response.Content;
            response.Content.Headers.ContentType = mediaType;
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            response.Content.Headers.ContentDisposition.FileName = "DSTaiKhoan.xls";
            return response;
        }
        public MemoryStream GetExcelSheet(int IDDonVi)
        {
            string filepath = HttpContext.Current.Server.MapPath("~/Excel_Template/DSTaiKhoan.xlsx");
            FileInfo template = new FileInfo(filepath);

            using ( var package = new ExcelPackage(template) )
            {
                
                ExcelWorksheet worksheet = package.Workbook.Worksheets["Sheet1"];


                worksheet.Cells["A4"].LoadFromCollection(GetDSTaiKhoan(IDDonVi), false);
            
                var stream = new MemoryStream(package.GetAsByteArray()); //capacidade
                return stream;
            }
        }

        [HttpGet]
        [Route("api/UserProfile/SetUserUpdatePass")]
        public void SetUserUpdatePass()
        {
            string curUser = HttpContext.Current.User.Identity.Name;
            var us = db.AspNetUsers.Where(t => t.UserName == curUser).FirstOrDefault();
            us.FUpdateTime = DateTime.Now;

            db.Entry(us).State = EntityState.Modified;

            db.SaveChanges();
        }
       
    }
}