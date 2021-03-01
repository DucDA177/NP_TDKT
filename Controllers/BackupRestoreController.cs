using Microsoft.AspNet.SignalR;
using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Timers;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using WebApiCore.Controllers.ScheduledTasks;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    [System.Web.Http.Authorize]
    public class BackupRestoreController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        private string folderNCC = Path.Combine(HttpRuntime.AppDomainAppPath, "DataNCC");
        private int fileCopy = 0; private int fileDelete = 0;

        [HttpGet]
        [Route("api/BackupRestore/BackUp")]
        public IHttpActionResult BackUp(string backupFolder, bool dtb, bool hsncc, bool IsLock)
        {
            //var timer = new Timer();

            //timer.Elapsed += delegate { ExeBackupDatabase(backupFolder); }; //new ElapsedEventHandler(ExeBackupDatabase(backupFolder));

            //timer.Interval = TimeSpan.FromMinutes(1).TotalMilliseconds;
            //timer.Enabled = true;
            //timer.Start();

            BackupRestoreLog bkrs = new BackupRestoreLog();
            bkrs.OriDisk = NormalizePath(backupFolder);
            bkrs.TimeBackup = DateTime.Now;
            bkrs.Type = 1;
            bkrs.UserName = HttpContext.Current.User.Identity.Name;
            
            if ( dtb )
            {
                Commons.Common.UnLockFolder(Path.Combine(backupFolder, "Database"));
                bkrs.LinkDatabase = NormalizePath(ExeBackupDatabase(backupFolder));
            }
            if ( hsncc )
            {
                Commons.Common.UnLockFolder(Path.Combine(backupFolder, "DataNCC"));
                bkrs.LinkDataNCC = NormalizePath(ExeBackupDataNCC(backupFolder));
            }
                

            db.BackupRestoreLogs.Add(bkrs);

            db.SaveChanges();

            if ( IsLock )
                LockBackupFolder(bkrs);

            // JobScheduler jb = new JobScheduler();
            //JobScheduler.Start();
            return Ok(new
            {
                LinkDatabase = bkrs.LinkDatabase == null ? "---Không sao lưu---" : bkrs.LinkDatabase,
                bkrs.LinkDataNCC,
                fileCopy,
                fileDelete
            });
        }
        private string ExeBackupDatabase(string backupFolder)
        {
            // read connectionstring from config file
            var connectionString = ConfigurationManager.ConnectionStrings["WebApiData"].ConnectionString;
            backupFolder = backupFolder + "/Database/";
            if ( !Directory.Exists(backupFolder) )
                Directory.CreateDirectory(backupFolder);

            var sqlConStrBuilder = new SqlConnectionStringBuilder(connectionString);

            // set backupfilename (you will get something like: "C:/temp/MyDatabase-2013-12-07.bak")
            var backupFileName = String.Format("{0}{1} {2}.bak",
                backupFolder, sqlConStrBuilder.InitialCatalog, DateTime.Now.ToString("HHmm dd-MM-yyyy"));

            using ( var connection = new SqlConnection(sqlConStrBuilder.ConnectionString) )
            {
                var query = String.Format("BACKUP DATABASE {0} TO DISK='{1}'",
                    sqlConStrBuilder.InitialCatalog, backupFileName);

                using ( var command = new SqlCommand(query, connection) )
                {
                    command.CommandTimeout = 1800;
                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
            return backupFileName;
        }

        private string ExeBackupDataNCC(string backupFolder)
        {
            fileCopy = 0; fileDelete = 0;

            string backupFolderDataNCC = backupFolder + "/DataNCC/";
            if ( !Directory.Exists(backupFolderDataNCC) )
                Directory.CreateDirectory(backupFolderDataNCC);
            //3 trường hợp
            foreach ( var item in db.FILE_DINH_KEM )
            {
                string srcFile = Path.Combine(folderNCC, item.DuongDanFile);
                string desFile = Path.Combine(backupFolderDataNCC, item.DuongDanFile);

                if ( File.Exists(srcFile) )
                {
                    try
                    {
                        if ( !Directory.Exists(Path.Combine(backupFolderDataNCC, item.FDescription)) )
                            Directory.CreateDirectory(Path.Combine(backupFolderDataNCC, item.FDescription));

                        if ( !File.Exists(desFile) )
                        {
                            File.Copy(srcFile, desFile);
                            fileCopy++;
                        }

                    }
                    catch { }
                }
                else
                {
                    if ( File.Exists(desFile) )
                    {
                        File.Delete(desFile);
                        fileDelete++;
                    }
                }
            }
            return backupFolderDataNCC;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("api/BackupRestore/SetScheduled")]
        public void SetScheduled(int hour, int min)
        {
            JobScheduler.StartBackup();

        }

        [HttpPost]
        [Route("api/BackupRestore/LockBackupFolder")]
        public void LockBackupFolder(BackupRestoreLog bk)
        {
            if ( !string.IsNullOrEmpty(bk.LinkDatabase) )
                Commons.Common.LockFolder(Path.GetDirectoryName(bk.LinkDatabase));

            if ( !string.IsNullOrEmpty(bk.LinkDataNCC) )
                Commons.Common.LockFolder(bk.LinkDataNCC);
        }
        [HttpPost]
        [Route("api/BackupRestore/UnLockBackupFolder")]
        public void UnLockBackupFolder(BackupRestoreLog bk)
        {
            if ( !string.IsNullOrEmpty(bk.LinkDatabase) )
                Commons.Common.UnLockFolder(Path.GetDirectoryName(bk.LinkDatabase));

            if ( !string.IsNullOrEmpty(bk.LinkDataNCC) )
                Commons.Common.UnLockFolder(bk.LinkDataNCC);

        }
        public class DiskInfo
        {
            public string DriveName { get; set; }
            public string DriveLabel { get; set; }
            public double TotalSize { get; set; }
            public double FreeSpace { get; set; }
        }
        [HttpGet]
        [Route("api/BackupRestore/GetAllDrives")]
        public IHttpActionResult GetAllDrives()
        {
            List<DiskInfo> ls = new List<DiskInfo>();
            foreach ( var drive in DriveInfo.GetDrives() )
            {
                DiskInfo dk = new DiskInfo();
                dk.DriveName = drive.Name;
                dk.DriveLabel = drive.VolumeLabel;
                dk.TotalSize = drive.TotalSize / 1024d / 1024d / 1024d;
                dk.FreeSpace = drive.AvailableFreeSpace / 1024d / 1024d / 1024d;
                ls.Add(dk);
            }
            return Ok(new
            {
                ls,
                server = HttpContext.Current.Server.MapPath("~/")
            });
        }
        public class FolderProp
        {
            public string Name { get; set; }
            public string Fullpath { get; set; }
            public string Type { get; set; }
        }
        [HttpGet]
        [Route("api/BackupRestore/GetSubFolders")]
        public IHttpActionResult GetSubFolders(string parFolder)
        {
            List<FolderProp> ls = new List<FolderProp>();
            foreach ( var item in Directory.GetDirectories(parFolder) )
            {
                var check = item.Split('\\');
                FolderProp fdp = new FolderProp();
                fdp.Fullpath = item;
                fdp.Name = check.LastOrDefault();
                fdp.Type = "folder";
                ls.Add(fdp);
            }
            foreach ( var item in Directory.GetFiles(parFolder) )
            {
                var check = item.Split('\\');
                FolderProp fdp = new FolderProp();
                fdp.Fullpath = item;
                fdp.Name = check.LastOrDefault();
                fdp.Type = "file";
                ls.Add(fdp);
            }
            return Ok(ls);
        }
        [HttpGet]
        [Route("api/BackupRestore/GetParentFolders")]
        public IHttpActionResult GetParentFolders(string subFolder)
        {

            return Ok(Directory.GetParent(subFolder));
        }
        [HttpGet]
        [Route("api/BackupRestore/LoadLogBackup")]
        public IHttpActionResult LoadLogBackup(int pageNumber, int pageSize)
        {
            var dt = db.BackupRestoreLogs.Where(t => t.Type == 1).OrderByDescending(t => t.Id);

            return Ok(Commons.Common.GetPagingList(dt, pageNumber, pageSize));
        }
        [HttpGet]
        [Route("api/BackupRestore/CreateFolder")]
        public IHttpActionResult CreateFolder(string path)
        {
            if ( Directory.Exists(path) ) return BadRequest("Thư mục đã tồn tại!");
            else
                Directory.CreateDirectory(path);
            return Ok(path);
        }

        [HttpGet]
        [Route("api/BackupRestore/LoadAllBak")]
        public IHttpActionResult LoadAllBak()
        {
            var dt = db.BackupRestoreLogs.Where(t => t.Type == 1 && !string.IsNullOrEmpty(t.LinkDatabase)).OrderByDescending(t => t.Id).ToList();
            if ( dt.Any() )
                dt.Remove(dt.FirstOrDefault());
            return Ok(dt);
        }
        private static string NormalizePath(string path)
        {
            return Path.GetFullPath(new Uri(path).LocalPath)
                       .TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
        }
        [HttpPost]
        [Route("api/BackupRestore/DeleteBak")]
        public IHttpActionResult DeleteBak(List<BackupRestoreLog> ls)
        {
            var lastBak = db.BackupRestoreLogs.Where(t => t.Type == 1).OrderByDescending(t => t.Id).FirstOrDefault();
            var lastdtb = db.BackupRestoreLogs.Where(t => t.Type == 1
            && !string.IsNullOrEmpty(t.LinkDatabase)).OrderByDescending(t => t.Id).FirstOrDefault();

            var lss = ls.Where(t => t.Id != lastBak.Id && t.Id != lastdtb.Id);
            foreach ( var item in lss )
            {
                try
                {
                    if ( File.Exists(item.LinkDatabase) )
                        File.Delete(item.LinkDatabase);
                    if ( NormalizePath(item.LinkDataNCC) != NormalizePath(lastBak.LinkDataNCC)
                        && Directory.Exists(item.LinkDataNCC) )
                        Directory.Delete(item.LinkDataNCC, true);
                }
                catch { }
                db.Entry(item).State = System.Data.Entity.EntityState.Deleted;
            }

            db.SaveChanges();
            return Ok(ls);
        }
        public class DataRestore
        {
            public BackupRestoreLog bk { get; set; }
            public bool dtb { get; set; }
            public bool hsncc { get; set; }
        }
        [HttpPost]
        [Route("api/BackupRestore/Restore")]
        public IHttpActionResult Restore(DataRestore dti)
        {
            var tempLog = db.BackupRestoreLogs.ToList();

            BackupRestoreLog bkrs = new BackupRestoreLog();
            bkrs.OriDisk = dti.bk.OriDisk;
            bkrs.TimeBackup = dti.bk.TimeBackup;
            bkrs.Type = 2;
            bkrs.UserName = HttpContext.Current.User.Identity.Name;
            bkrs.TimeRestore = DateTime.Now;

            if ( dti.dtb )
            {
                if ( !File.Exists(dti.bk.LinkDatabase) )
                    return BadRequest("Tệp tin sao lưu cơ sở dữ liệu không tồn tại. Vui lòng kiểm tra lại!");
                ExeRestoreDatabase(dti.bk.LinkDatabase);
                ReSaveLog(tempLog);
                bkrs.LinkDatabase = dti.bk.LinkDatabase;
            }

            if ( dti.hsncc )
            {
                if ( !NormalizePath(dti.bk.LinkDataNCC).EndsWith("DataNCC") )
                    return BadRequest("Đường dẫn đến dữ liệu Hồ sơ NCC không hợp lệ! Đường dẫn phải kết thúc bởi thư mục DataNCC");
                if ( !Directory.Exists(dti.bk.LinkDataNCC) )
                    return BadRequest("Thư mục sao lưu hồ sơ người có công không tồn tại. Vui lòng kiểm tra lại!");

                DirectoryInfo src = new DirectoryInfo(dti.bk.LinkDataNCC);
                DirectoryInfo des = new DirectoryInfo(folderNCC);
                fileCopy = 0;
                ExeRestoreDataNCC(src, des);
                bkrs.LinkDataNCC = dti.bk.LinkDataNCC;
            }
            db.BackupRestoreLogs.Add(bkrs);

            db.SaveChanges();
            return Ok(new
            {
                fileCopy
            });
        }
        private void ExeRestoreDatabase(string restorefilepath)
        {
            var connetionString = ConfigurationManager.ConnectionStrings["WebApiData"].ConnectionString;
            var sqlConStrBuilder = new SqlConnectionStringBuilder(connetionString);
            string databaseName = sqlConStrBuilder.InitialCatalog;
            SqlConnection connection = new SqlConnection(connetionString);

            string query = @"USE master Alter DATABASE " + databaseName
                + @" Set Single_User With Rollback Immediate" + Environment.NewLine
                + " Restore Database " + databaseName
                + @" From Disk =N'" + restorefilepath + "' WITH REPLACE,RECOVERY" + Environment.NewLine
                + " Alter Database " + databaseName + " Set Multi_User";

            int result = 0;

            using ( SqlCommand cmd = new SqlCommand(query, connection) )
            {
                cmd.CommandTimeout = 1800;
                connection.Open();
                result = cmd.ExecuteNonQuery();
                connection.Close();
            }
        }
        private void ExeRestoreDataNCC(DirectoryInfo source, DirectoryInfo target)
        {
            if ( source == null || target == null )
            {
                return;
            }
            if ( source.FullName.ToLower() == target.FullName.ToLower() )
            {
                return;
            }

            // Check if the target directory exists, if not, create it.
            if ( Directory.Exists(target.FullName) == false )
            {
                Directory.CreateDirectory(target.FullName);
            }

            // Copy each file into it's new directory.
            foreach ( FileInfo fi in source.GetFiles() )
            {
                // string filetype = fi.Extension;
                if ( Commons.Common.IsPdf(fi.FullName) || Commons.Common.IsImage(fi.FullName) )
                {
                    string des = Path.Combine(target.FullName, fi.Name);
                    if ( !File.Exists(des) )
                    {
                        fi.CopyTo(des);
                        fileCopy++;
                    }
                }


            }

            // Copy each subdirectory using recursion.
            foreach ( DirectoryInfo diSourceSubDir in source.GetDirectories() )
            {
                DirectoryInfo nextTargetSubDir =
                    target.GetDirectories().Where(t => t.Name == diSourceSubDir.Name).FirstOrDefault();

                if ( nextTargetSubDir == null )
                    nextTargetSubDir = target.CreateSubdirectory(diSourceSubDir.Name);

                ExeRestoreDataNCC(diSourceSubDir, nextTargetSubDir);
            }
        }
        private void ReSaveLog(List<BackupRestoreLog> ndkt)
        {
            foreach ( var item in ndkt )
            {
                var check = db.BackupRestoreLogs.Where(t => t.Id == item.Id).Any();
                if ( !check )
                    db.BackupRestoreLogs.Add(item);
            }


        }
        [HttpGet]
        [Route("api/BackupRestore/LoadRestoreLog")]
        public IHttpActionResult LoadRestoreLog()
        {

            return Ok(db.BackupRestoreLogs.Where(t => t.Type == 2).OrderByDescending(t => t.TimeRestore));
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("api/BackupRestore/SetWebConfig")]
        public IHttpActionResult SetWebConfig(string servername, string databasename, string id, string password)
        {
            string conStringData = "Data Source=" + servername + ";initial catalog=" + databasename
                + ";user id=" + id + ";password=" + password + ";Integrated Security=False";
            string conStringEntity = "metadata=res://*/Models.WebApiDataCore.csdl|res://*/Models.WebApiDataCore.ssdl|res://*/Models.WebApiDataCore.msl;provider=System.Data.SqlClient;provider connection string=\"data Source=" + servername
                + ";initial catalog=" + databasename + ";integrated security=False;user id=" + id
                + ";password=" + password + ";MultipleActiveResultSets=True;App=EntityFramework\"";

            if ( !IsServerConnected(conStringData) )
                return Ok(0);

            var configuration = WebConfigurationManager.OpenWebConfiguration("~");
            var section = (ConnectionStringsSection) configuration.GetSection("connectionStrings");

            section.ConnectionStrings["WebApiData"].ConnectionString = conStringData;

            section.ConnectionStrings["WebApiDataEntities"].ConnectionString = conStringEntity;

            configuration.Save();

            return Ok(1);
        }
        private static bool IsServerConnected(string connectionString)
        {
            try
            {
                using ( var connection = new SqlConnection(connectionString) )
                {
                    connection.Open();
                    return true;
                }
            }
            catch ( Exception ex )
            {

                return false; // any error is considered as db connection error for now
            }

        }


        [HttpPost]
        [Route("api/BackupRestore/SetTimeBackup")]
        public IHttpActionResult SetTimeBackup(ModelConfigBackup model)
        {
            string text = Newtonsoft.Json.JsonConvert.SerializeObject(model);

            File.WriteAllText(Path.Combine(HttpRuntime.AppDomainAppPath, "BackupConfig.json"), text);

            IScheduler scheduler = StdSchedulerFactory.GetDefaultScheduler().GetAwaiter().GetResult();
            scheduler.Shutdown();

            JobScheduler.StartBackup();



            return Ok(text);
        }
        [AllowAnonymous]
        [HttpGet]
        [Route("api/BackupRestore/EncodeString")]
        public IHttpActionResult EncodeString(string text)
        {

            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(text);

            return Ok(System.Convert.ToBase64String(plainTextBytes));
        }
        [AllowAnonymous]
        [HttpGet]
        [Route("api/BackupRestore/DecodeString")]
        public IHttpActionResult DecodeString(string text)
        {

            var base64EncodedBytes = System.Convert.FromBase64String(text);
            return Ok(System.Text.Encoding.UTF8.GetString(base64EncodedBytes));
        }
        [HttpGet]
        [Route("api/BackupRestore/CancelTimeBackup")]
        public IHttpActionResult CancelTimeBackup()
        {

            File.WriteAllText(Path.Combine(HttpRuntime.AppDomainAppPath, "BackupConfig.json"), string.Empty);

            IScheduler scheduler = StdSchedulerFactory.GetDefaultScheduler().GetAwaiter().GetResult();
            scheduler.Shutdown();

            return Ok();
        }
        [HttpGet]
        [Route("api/BackupRestore/LoadConfig")]
        public IHttpActionResult LoadConfig()
        {
            string text = File.ReadAllText(Path.Combine(HttpRuntime.AppDomainAppPath, "BackupConfig.json"));

            var obj = Newtonsoft.Json.JsonConvert.DeserializeObject<ModelConfigBackup>(text);

            return Ok(obj);
        }
        public void AutoBackUp()
        {
            string text = File.ReadAllText(Path.Combine(HttpRuntime.AppDomainAppPath, "BackupConfig.json"));

            var obj = Newtonsoft.Json.JsonConvert.DeserializeObject<ModelConfigBackup>(text);

            if ( obj != null )
                if ( obj.isActive )
                {
                    File.AppendAllText(Path.Combine(HttpRuntime.AppDomainAppPath, "BackupLog.txt"),
                "Backup start at " + DateTime.Now.ToString("HH:mm dd/MM/yyyy") + Environment.NewLine);

                    // GlobalHost.ConnectionManager.GetHubContext<HubStore.UserActivityHub>().Clients.All.receive(1, "Job1");

                    BackupRestoreLog bkrs = new BackupRestoreLog();
                    bkrs.OriDisk = NormalizePath(obj.Folder);
                    bkrs.TimeBackup = DateTime.Now;
                    bkrs.Type = 1;
                    bkrs.UserName = "Hệ thống";
                    
                    if ( obj.dtb )
                    {
                        Commons.Common.UnLockFolder(Path.Combine(obj.Folder, "Database"));
                        bkrs.LinkDatabase = NormalizePath(ExeBackupDatabase(obj.Folder));
                    }
                    if ( obj.hsncc )
                    {
                        Commons.Common.UnLockFolder(Path.Combine(obj.Folder, "DataNCC"));
                        bkrs.LinkDataNCC = NormalizePath(ExeBackupDataNCC(obj.Folder));
                    }
                        

                    db.BackupRestoreLogs.Add(bkrs);

                    db.SaveChanges();

                    if ( obj.IsLock )
                        LockBackupFolder(bkrs);

                    File.AppendAllText(Path.Combine(HttpRuntime.AppDomainAppPath, "BackupLog.txt"),
               "Backup end at " + DateTime.Now.ToString("HH:mm dd/MM/yyyy") + Environment.NewLine);
                }
        }
        [AllowAnonymous]
        [HttpGet]
        [Route("api/BackupRestore/LoadPhieuTra")]
        public IHttpActionResult LoadPhieuTra()
        {
            List<tblHosomuon> ls = new List<tblHosomuon>();
            var dt = ( from hsm in db.tblHosomuons
                       join pm in db.tblPhieumuonhosoes
                       on hsm.PhieuID equals pm.id

                       select new { pm, hsm }
                        )
                        .GroupBy(t => t.hsm.DoituonghosoID);
            foreach ( var item in dt )
            {
                var check = item.OrderByDescending(t => t.pm.id).FirstOrDefault();
                if ( check.hsm.Tinhtrang == 3 )
                {
                    //var checkhs = db.tblDoiTuong_HoSo.Where(t=>t.);
                }
                ls.Add(check.hsm);
            }

            return Ok(ls.Count());
        }
        [AllowAnonymous]
        [HttpGet]
        [Route("api/BackupRestore/RenameFolderNCC")]
        public void RenameFolderNCC(string type)
        {
            if ( string.IsNullOrEmpty(type) )
                return;
            var lsFolder = Directory.GetDirectories(folderNCC);
            foreach ( string item in lsFolder )
            {
                DirectoryInfo drInfo = new DirectoryInfo(item);
                string folderName = "";
                if ( type == "encode" )
                    folderName = Commons.Common.EncodeString(drInfo.Name);
                if ( type == "decode" )
                    folderName = Commons.Common.DecodeString(drInfo.Name);
                Directory.Move(item, Path.Combine(folderNCC, folderName));
            }
        }
        [AllowAnonymous]
        [HttpGet]
        [Route("api/BackupRestore/RenameAllDuongDanNCC")]
        public void RenameAllDuongDanNCC(string type)
        {
            var dt = db.tblDoiTuong_HoSo.Where(t => !string.IsNullOrEmpty(t.Duongdan));
            foreach(var item in dt )
            {
                if ( type == "encode" )
                    item.Duongdan = Commons.Common.EncodePathNCC(item.Duongdan);
                if ( type == "decode" )
                    item.Duongdan = Commons.Common.DecodePathNCC(item.Duongdan);
                db.Entry(item).State = EntityState.Modified;
            }
            db.SaveChanges();
        }
    }
}
