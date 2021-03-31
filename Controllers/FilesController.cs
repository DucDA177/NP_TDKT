using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Web.UI;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using WebApiCore.Models;
using System.Security.AccessControl;
using System.Security.Principal;

namespace WebApiCore.Controllers
{
    [Authorize]
    public class FilesController : ApiController
    {

        private WebApiDataEntities db = new WebApiDataEntities();
        private string folderNCC = HttpContext.Current.Server.MapPath("~/DataNCC/");
        private string folderDinhKem = HttpContext.Current.Server.MapPath("~/FileUploads/");

        [HttpPost]
        [Route("api/Files/UploadFile")]
        public string UploadFile()
        {
            string ListDinhKem = "#";
            try
            {

                string directoryPath = HttpContext.Current.Server.MapPath("~/Uploads");
                string path1 = Request.RequestUri.GetLeftPart(UriPartial.Authority) + "/Uploads"; ;// Request.GetRequestContext().VirtualPathRoot;// Request.Url.GetLeftPart(UriPartial.Authority) + "/Uploads";

                if (!Directory.Exists(directoryPath))
                    Directory.CreateDirectory(directoryPath);

                System.Web.HttpFileCollection httpRequest = System.Web.HttpContext.Current.Request.Files;
                using (var context = new WebApiDataEntities())
                {
                    using (DbContextTransaction transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            for (int i = 0; i <= httpRequest.Count - 1; i++)
                            {
                                string MaDinhKem = "";
                                MaDinhKem = Auto_ID("FILE");
                                var oDK = new FILE_DINH_KEM();
                                System.Web.HttpPostedFile postedfile = httpRequest[i];
                                if (postedfile.ContentLength > 0)
                                {
                                    oDK.FCode = MaDinhKem;
                                    oDK.FName = postedfile.FileName;
                                    string Filesave = MaDinhKem + postedfile.FileName;
                                    if (Filesave.Length > 150)
                                        Filesave = Filesave.Substring(0, 149);
                                    var fileSavePath = Path.Combine(directoryPath, Filesave);
                                    if (File.Exists(fileSavePath))
                                    {
                                        File.Delete(fileSavePath);
                                    }
                                    postedfile.SaveAs(fileSavePath);

                                    oDK.DuongDanFile = Path.Combine(path1, Filesave);// fileSavePath;
                                    if (MaDinhKem != "")
                                    {
                                        context.FILE_DINH_KEM.Add(oDK);
                                        context.SaveChanges();
                                        ListDinhKem = ListDinhKem + MaDinhKem + "#";
                                    }
                                }
                            }
                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            Commons.Common.WriteLogToTextFile(ex.ToString());
                        }
                    }
                }
            }
            catch (Exception ex) { Commons.Common.WriteLogToTextFile(ex.ToString()); }
            return ListDinhKem;
        }

        private string Auto_ID(string Code)
        {
            try
            {
                Code = Code.ToUpper();
                AutoID AutoId = db.AutoIDs.Where(x => x.FCode == Code).SingleOrDefault();
                if (AutoId == null)
                {
                    AutoId = new AutoID();
                    AutoId.FCode = Code;
                    AutoId.Counter = 1;
                    db.AutoIDs.Add(AutoId);
                }
                AutoId.FName = Code;
                for (int i = 0; i < 6 - AutoId.Counter.ToString().Length; i++)
                    AutoId.FName += 0;
                AutoId.FName += AutoId.Counter.ToString();
                AutoId.Counter += 1;
                db.SaveChanges();
                return AutoId.FName;
            }
            catch (Exception ex)
            {
                Commons.Common.WriteLogToTextFile(ex.ToString());
                return "";
            }

        }
        [HttpPost]
        [Route("api/Files/FileUpload")]
        public IHttpActionResult Upload()
        {

            bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath("~/FILE_DINH_KEM"));

            if (!exists)
                System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/FILE_DINH_KEM"));
            System.Web.HttpFileCollection httpRequest = System.Web.HttpContext.Current.Request.Files;
            for (int i = 0; i <= httpRequest.Count - 1; i++)
            {
                System.Web.HttpPostedFile postedfile = httpRequest[i];
                if (postedfile.ContentLength > 0)
                {
                    var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/FILE_DINH_KEM"), postedfile.FileName);
                    if (File.Exists(fileSavePath))
                    {
                        File.Delete(fileSavePath);
                    }
                    postedfile.SaveAs(fileSavePath);
                }
            }
            return Ok();
        }
        public class FileToUpload
        {
            public string FName { get; set; }
            public string key { get; set; }
            public string filename { get; set; }
            public bool isSaved { get; set; }
        }
        [HttpPost]
        [Route("api/Files/UploadFileDoiTuongKhenThuong")]
        public IHttpActionResult UploadFileCaNhanKhenThuong(long IdDoituongKhenthuong, int IdGiayto, int Nam, string Loai)
        {
            // string commonFolder = ""
            string Link = Path.Combine(folderDinhKem, Loai, IdDoituongKhenthuong.ToString());

            bool exists = Directory.Exists(Link);

            if (!exists)
                Directory.CreateDirectory(Link);
            HttpFileCollection httpRequest = HttpContext.Current.Request.Files;


            for (int i = 0; i <= httpRequest.Count - 1; i++)
            {
                HttpPostedFile postedfile = httpRequest[i];
                if (postedfile.ContentLength > 0)
                {
                    string filename = postedfile.FileName;
                    var fileSavePath = Path.Combine(Link, filename);
                    if (File.Exists(fileSavePath))
                    {
                        File.Delete(fileSavePath);
                    }
                    postedfile.SaveAs(fileSavePath);

                    tblGiaytoKhenthuong gtkt = new tblGiaytoKhenthuong();
                    gtkt.IdDoituongKhenthuong = IdDoituongKhenthuong;
                    gtkt.IdGiayto = IdGiayto;
                    gtkt.Tentep = filename;
                    gtkt.Duongdan = Path.Combine("FileUploads", Loai, IdDoituongKhenthuong.ToString(), filename);
                    gtkt.Nam = Nam;
                    gtkt.Loai = Loai;
                    db.tblGiaytoKhenthuongs.Add(gtkt);
                }
            }


            return Ok(db.SaveChanges());
        }
        [HttpPost]
        [Route("api/Files/UploadFileQuyetDinhKhenThuong")]
        public IHttpActionResult UploadFileQuyetDinhKhenThuong(long IdDoituongKhenthuong)
        {
            // string commonFolder = ""
            string Link = Path.Combine(folderDinhKem, "QUYETDINH", IdDoituongKhenthuong.ToString());

            bool exists = Directory.Exists(Link);

            if (!exists)
                Directory.CreateDirectory(Link);
            HttpFileCollection httpRequest = HttpContext.Current.Request.Files;


            for (int i = 0; i <= httpRequest.Count - 1; i++)
            {
                HttpPostedFile postedfile = httpRequest[i];
                if (postedfile.ContentLength > 0)
                {
                    string filename = postedfile.FileName;
                    var fileSavePath = Path.Combine(Link, filename);
                    if (File.Exists(fileSavePath))
                    {
                        File.Delete(fileSavePath);
                    }
                    postedfile.SaveAs(fileSavePath);

                    var gtkt = db.tblDoituongKhenthuongs.Find(IdDoituongKhenthuong);
                    
                    gtkt.Duongdan = Path.Combine("FileUploads", "QUYETDINH", IdDoituongKhenthuong.ToString(), filename);
                   
                }
            }


            return Ok(db.SaveChanges());
        }
        [HttpGet]
        [Route("api/Files/RemoveFileDoiTuongKhenThuong")]
        public IHttpActionResult RemoveFile(string link, long IdDoituongKhenthuong, int IdGiayto, int Nam)
        {
            string dir = HttpContext.Current.Server.MapPath("~/") + link;
            if (File.Exists(dir))
            {
                File.Delete(dir);
            }
            var check = db.tblGiaytoKhenthuongs.Where(t => t.IdDoituongKhenthuong == IdDoituongKhenthuong && t.IdGiayto == IdGiayto && t.Nam == Nam).FirstOrDefault();
            if (check != null)
            {
                db.tblGiaytoKhenthuongs.Remove(check);
                db.SaveChanges();
            }

            return Ok();
        }
        [HttpGet]
        [Route("api/Files/RemoveFileXetDuyetKhenThuong")]
        public IHttpActionResult RemoveFileXetDuyetKhenThuong(string link, long IdDoituongKhenthuong)
        {
            string dir = HttpContext.Current.Server.MapPath("~/") + link;
            if (File.Exists(dir))
            {
                File.Delete(dir);
            }
            var check = db.tblDoituongKhenthuongs.Find(IdDoituongKhenthuong);
            check.Duongdan = null;
            db.SaveChanges();

            return Ok(check);
        }
        [HttpGet]
        [Route("api/Files/RemoveTempFolder")]
        public IHttpActionResult RemoveTempFolder(string tempFolder)
        {
            if (!string.IsNullOrEmpty(tempFolder))
            {
                string dir = folderNCC + tempFolder + "/Images";
                if (Directory.Exists(dir))
                {
                    Directory.Delete(dir, true);
                }

            }

            return Ok();
        }

        [HttpGet]
        [Route("api/Files/LockFolder")]
        public IHttpActionResult LockFolder()
        {

            string curUser = HttpContext.Current.User.Identity.Name;
            var curGroup = db.Group_User.Where(t => t.FInUse == true && t.UserName == curUser).FirstOrDefault().CodeGroup;

            if (!curGroup.Contains("ADMIN"))
                return Ok("Bạn không có quyền thao tác này!");

            Commons.Common.LockFolder(folderNCC);

            return Ok("Đã khóa folder " + folderNCC);
        }
        [HttpGet]
        [Route("api/Files/UnLockFolder")]
        public IHttpActionResult UnLockFolder()
        {
            string curUser = HttpContext.Current.User.Identity.Name;
            var curGroup = db.Group_User.Where(t => t.FInUse == true && t.UserName == curUser).FirstOrDefault().CodeGroup;

            if (!curGroup.Contains("ADMIN"))
                return Ok("Bạn không có quyền thao tác này!");

            Commons.Common.UnLockFolder(folderNCC);

            return Ok("Đã mở khóa folder " + folderNCC);
        }
    }
}