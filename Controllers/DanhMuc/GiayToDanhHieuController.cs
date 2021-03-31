using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.DanhMuc
{
    [Authorize]
    public class GiayToDanhHieuController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        [HttpGet]
        [Route("api/GiayToDanhHieu/Save")]
        public IHttpActionResult Save(string MaDH, int IdGiayto, int Nam ,bool isCheck)
        {
            var check = db.tblGiaytoDanhhieux.Where(t => t.MaDanhhieu == MaDH && t.IdGiayto == IdGiayto && t.Nam == Nam).FirstOrDefault();
            if (isCheck)
            {
                if (check == null)
                {
                    tblGiaytoDanhhieu gt = new tblGiaytoDanhhieu();
                    gt.MaDanhhieu = MaDH;
                    gt.IdGiayto = IdGiayto;
                    gt.Nam = Nam;
                    db.tblGiaytoDanhhieux.Add(gt);
                }
            }
            else db.tblGiaytoDanhhieux.Remove(check);

            return Ok(db.SaveChanges());
        }
        [HttpGet]
        [Route("api/GiayToDanhHieu/Load")]
        public IHttpActionResult Load(string MaDH, int Nam)
        {
            var data = db.tblGiaytoDanhhieux.Where(t => t.MaDanhhieu == MaDH && t.Nam == Nam);
            return Ok(data);
        }
    }
}
