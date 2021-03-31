﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebApiCore.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class WebApiDataEntities : DbContext
    {
        public WebApiDataEntities()
            : base("name=WebApiDataEntities")
        {
        }

        public override int SaveChanges()
        {

            AddBaseInfomation();
            return base.SaveChanges();
        }
        public override Task<int> SaveChangesAsync()
        {

            AddBaseInfomation();
            return base.SaveChangesAsync();
        }
        public void AddBaseInfomation()
        {

            var entities = ChangeTracker.Entries().Where(x => (x.State == EntityState.Added || x.State == EntityState.Modified || x.State == EntityState.Deleted));

            var currentUsername = !string.IsNullOrEmpty(System.Web.HttpContext.Current?.User?.Identity?.Name)
                ? System.Web.HttpContext.Current.User.Identity.Name
                : "Anonymous";

            foreach (var entity in entities)
            {

                if (entity.State == EntityState.Added)
                {
                    if (entity.CurrentValues.PropertyNames.Contains("FInUse"))
                        entity.Property("FInUse").CurrentValue = true;

                }

                HandleUserLog(entity, currentUsername);


            }
        }
        private object GetPrimaryKeyValue(DbEntityEntry entry)
        {
            var objectStateEntry = ((IObjectContextAdapter)this).ObjectContext.ObjectStateManager.GetObjectStateEntry(entry.Entity);
            object o = objectStateEntry.EntityKey.EntityKeyValues[0].Value;
            return o;
        }
        private bool inExcludeList(string prop)
        {
            string[] excludeList = { "props", "to", "exclude" };
            return excludeList.Any(s => s.Equals(prop));
        }
        public void HandleUserLog(DbEntityEntry entity, string currentUsername)
        {
            var entityName = ObjectContext.GetObjectType(entity.Entity.GetType()).Name;

            string Thaotac = "";
            WebApiDataEntities db = new WebApiDataEntities();
            if (entity.State == EntityState.Added) Thaotac = "Thêm mới";
            else if (entity.State == EntityState.Modified) Thaotac = "Cập nhật";
            else Thaotac = "Xóa";

            if (entityName != "NhatKySuDung" && currentUsername != "Anonymous"
                        && (entityName == "tblDoiTuong_HoSo" || entityName == "Hosomuon" || entityName == "Phieumuonhoso"))
            {
                if (entity.State == EntityState.Modified)
                {
                    var primaryKey = GetPrimaryKeyValue(entity);
                    var DatabaseValues = entity.GetDatabaseValues();

                    foreach (var prop in entity.OriginalValues.PropertyNames)
                    {
                        if (inExcludeList(prop))
                        {
                            continue;
                        }

                        string originalValue = DatabaseValues.GetValue<object>(prop)?.ToString();
                        string currentValue = entity.CurrentValues[prop]?.ToString();

                        if (prop == "Id" || prop == "id" || prop == "ID" || prop == "iD")
                            Thaotac += " bản ghi có Id = " + primaryKey + "</br>";

                        if (originalValue != currentValue)
                        {
                            Thaotac += "- " + prop + ": " + originalValue + " => " + currentValue + "</br>";
                        }

                    }

                }

                Commons.Common.CreateUserLog(db, entity.Entity.GetType().Name, Thaotac, currentUsername);

            }
        }


        public virtual DbSet<Area> Areas { get; set; }
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }
        public virtual DbSet<AutoID> AutoIDs { get; set; }
        public virtual DbSet<DMDonVi> DMDonVis { get; set; }
        public virtual DbSet<FILE_DINH_KEM> FILE_DINH_KEM { get; set; }
        public virtual DbSet<Group_Menu> Group_Menu { get; set; }
        public virtual DbSet<Group_User> Group_User { get; set; }
        public virtual DbSet<Group> Groups { get; set; }
        public virtual DbSet<MainMenu> MainMenus { get; set; }
        public virtual DbSet<Menu> Menus { get; set; }
        public virtual DbSet<Message> Messages { get; set; }
        public virtual DbSet<NhatKySuDung> NhatKySuDungs { get; set; }
        public virtual DbSet<sysdiagram> sysdiagrams { get; set; }
        public virtual DbSet<tblDanhmuc> tblDanhmucs { get; set; }
        public virtual DbSet<tblDoituongThanhtich> tblDoituongThanhtiches { get; set; }
        public virtual DbSet<tblGiaytoDanhhieu> tblGiaytoDanhhieux { get; set; }
        public virtual DbSet<tblTieuchi> tblTieuchis { get; set; }
        public virtual DbSet<ThongBao> ThongBaos { get; set; }
        public virtual DbSet<UnreadMe> UnreadMes { get; set; }
        public virtual DbSet<UserProfile> UserProfiles { get; set; }
        public virtual DbSet<tblDoituong> tblDoituongs { get; set; }
        public virtual DbSet<tblThanhvienTapthe> tblThanhvienTapthes { get; set; }
        public virtual DbSet<tblKhenthuong> tblKhenthuongs { get; set; }
        public virtual DbSet<tblGiaytoKhenthuong> tblGiaytoKhenthuongs { get; set; }
        public virtual DbSet<tblTotrinh> tblTotrinhs { get; set; }
        public virtual DbSet<tblQuyetdinh> tblQuyetdinhs { get; set; }
        public virtual DbSet<tblDonviPhongtrao> tblDonviPhongtraos { get; set; }
        public virtual DbSet<tblPhongtrao> tblPhongtraos { get; set; }
        public virtual DbSet<tblDoituongKhenthuong> tblDoituongKhenthuongs { get; set; }
    
        [DbFunction("WebApiDataEntities", "SplitStringToTable")]
        public virtual IQueryable<string> SplitStringToTable(string myString, string deliminator)
        {
            var myStringParameter = myString != null ?
                new ObjectParameter("myString", myString) :
                new ObjectParameter("myString", typeof(string));
    
            var deliminatorParameter = deliminator != null ?
                new ObjectParameter("deliminator", deliminator) :
                new ObjectParameter("deliminator", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.CreateQuery<string>("[WebApiDataEntities].[SplitStringToTable](@myString, @deliminator)", myStringParameter, deliminatorParameter);
        }
    }
}
