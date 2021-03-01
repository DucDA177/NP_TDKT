using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApiCore.Controllers.HubStore;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    public class MessageController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        //private WebApiDataEntities db = UserActivityHub.db;
        [HttpGet]
        [Route("api/Message/GetMessage")]
        public IHttpActionResult GetMessage(long IdNguoigui, long IdNguoinhan, int pageSize)
        {
            var curUser = HttpContext.Current.User.Identity.Name;
            var messages = ( from t in db.Messages
                             join us_send in db.UserProfiles on t.IdNguoigui equals us_send.Id
                             join us_recv in db.UserProfiles on t.IdNguoinhan equals us_recv.Id
                             where ( t.IdNguoigui == IdNguoigui && t.IdNguoinhan == IdNguoinhan )
                                  || ( t.IdNguoigui == IdNguoinhan && t.IdNguoinhan == IdNguoigui )

                             select new
                             {
                                 t.Id,
                                 us_send,
                                 time = t.Thoigian,
                                 message = t.Tinnhan,
                                 type = us_send.UserName == curUser ? "out" : "in",
                                 us_recv
                             } ).OrderByDescending(t => t.time);

            return Ok(new
            {
                count = messages.Count(),
                mes = messages.Take(20 + pageSize).OrderBy(t => t.time)
            });
        }

        [HttpGet]
        [Route("api/Message/ReadAllMessage")]
        public IHttpActionResult ReadAllMessage(long IdNguoigui, long IdNguoinhan)
        {
            var dt = db.UnreadMes
                .Where(t => t.IdNguoigui == IdNguoigui && t.IdNguoinhan == IdNguoinhan).FirstOrDefault();
            if ( dt != null )
                dt.Count = 0;
            db.SaveChanges();
            return Ok(dt);
        }
        [HttpGet]
        [Route("api/Message/LoadNhatKy")]
        public IHttpActionResult LoadNhatKy(int Id, int pageNumber, int pageSize, string username)
        {
            var nksd = db.NhatKySuDungs.Where(t => t.IdDonVi == Id && (string.IsNullOrEmpty(username) || t.UserName == username ))
                .OrderByDescending(t => t.Id);
            return Ok(Commons.Common.GetPagingList(nksd, pageNumber, pageSize));
        }

        [HttpGet]
        [Route("api/Message/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.NhatKySuDungs.Find(Id);
            db.NhatKySuDungs.Remove(dt);
            db.SaveChanges();
            return Ok(dt);
        }

        [HttpGet]
        [Route("api/Message/DelAll")]
        public IHttpActionResult DelAll(int Id)
        {
            var dt = db.NhatKySuDungs.Where(t => t.IdDonVi == Id);
            db.NhatKySuDungs.RemoveRange(dt);
            db.SaveChanges();

            var cmd = db.Database.Connection.CreateCommand();
            cmd.CommandText = "Delete from NhatKySuDung where IdDonVi = " + Id;
            db.Database.Connection.Open();
            var reader = cmd.ExecuteNonQuery();
          
            db.Database.Connection.Close();

            return Ok(reader);
        }

        [HttpPost]
        [Route("api/Message/DellCheck")]
        public IHttpActionResult DellCheck(List<NhatKySuDung> ListId)
        {
            foreach ( var data in ListId )

                db.Entry(data).State = EntityState.Deleted;


            db.SaveChanges();
            return Ok();
        }
    }
}
