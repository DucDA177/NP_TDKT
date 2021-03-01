using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Script.Serialization;
//using System.Web.Script.Serialization;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    [Authorize]
    public class GroupsController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        // GET: api/Groups
        public IHttpActionResult GetGroups()
        {
           
            return Ok(db.Groups.Where(t =>
            t.FInUse == true).ToList());
        }

        // GET: api/Groups/5
        [ResponseType(typeof(Group))]
        public async Task<IHttpActionResult> GetGroup(long id)
        {
            Group group = await db.Groups.FindAsync(id);
            if ( group == null )
            {
                return NotFound();
            }

            return Ok(group);
        }

        // PUT: api/Groups/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutGroup(long id, Group group)
        {
            Validate(group);
            if ( !ModelState.IsValid )
            {
                return BadRequest(ModelState);
            }

            if ( id != group.Id )
            {
                return BadRequest();
            }

            db.Entry(group).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch ( DbUpdateConcurrencyException )
            {
                if ( !GroupExists(id) )
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Groups
        [ResponseType(typeof(Group))]
        public async Task<IHttpActionResult> PostGroup(Group group)
        {
            Validate(group);
            if ( !ModelState.IsValid )
            {
                return BadRequest(ModelState);
            }

            db.Groups.Add(group);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = group.Id }, group);
        }

        // DELETE: api/Groups/5
        [ResponseType(typeof(Group))]
        public async Task<IHttpActionResult> DeleteGroup(long id)
        {
            Group group = await db.Groups.FindAsync(id);
            if ( group == null )
            {
                return NotFound();
            }

            db.Groups.Remove(group);

           
            await db.SaveChangesAsync();
            return Ok(group);
        }

        protected override void Dispose(bool disposing)
        {
            if ( disposing )
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool GroupExists(long id)
        {
            return db.Groups.Count(e => e.Id == id) > 0;
        }
       
     
        [HttpGet]
        [Route("Group/GetGroupByUser")]
        [ResponseType(typeof(object))]
        public string GetGroupByUser(string user)
        {
            string group = "[";
            var dt = db.Group_User.Where(t => t.UserName == user && t.CodeGroup != Commons.Constants.SUPPERADMIN && t.FInUse == true).ToList();
            var i = 1;
            foreach ( var item in dt )
            {
                if ( item.CodeGroup != Commons.Constants.SUPPERADMIN )
                {
                    if ( i < dt.Count() )
                        group += "\"" + item.CodeGroup + "\"" + ",";
                    if ( i == dt.Count() )
                        group += "\"" + item.CodeGroup + "\"" + "]";
                    i++;
                }

            }
            return group;
        }
        [HttpPost]
        [Route("Group/SaveGroupUser")]
        [ResponseType(typeof(object))]
        public void SaveGroupUser([FromBody] List<Object> listUserGroup, string CodeGroup)
        {
            int a = listUserGroup.Count;
            string list = ";";
            #region add user group
            for ( int i = 0; i < a; i++ )
            {
                UserProfile result = JsonConvert.DeserializeObject<UserProfile>(listUserGroup[i].ToString());
                var dt = db.Group_User.Where(t => t.UserName == result.UserName && t.CodeGroup == CodeGroup).FirstOrDefault();
                if ( dt == null )
                {
                    dt = new Group_User();
                    dt.FCode = System.Guid.NewGuid().ToString();
                    dt.FCreateTime = System.DateTime.Now;
                    dt.FUpdateTime = System.DateTime.Now;
                    dt.FUserCreate = RequestContext.Principal.Identity.Name;
                    dt.CodeGroup = CodeGroup;
                    dt.UserName = result.UserName;
                    // dt.FBranchCode = result.FBranchCode;
                    dt.FInUse = true;
                    db.Group_User.Add(dt);
                    db.SaveChanges();
                }
                else
                {
                    dt.FInUse = true;
                    db.SaveChanges();
                }
                list += result.UserName + ";";
            }
            #endregion

            #region xóa những user tồn tại trong group nhưng không có trong list add group ở trên
            var User = db.Group_User.Where(t => t.CodeGroup == CodeGroup && t.FInUse == true).ToList();
            //if (list != ";")
            //{
            foreach ( var it in User )
            {
                if ( !list.Contains(";" + it.UserName + ";") )
                {
                    it.FInUse = false;
                    db.SaveChanges();
                }
            }
            //}
            #endregion
        }
        [HttpPost]
        [Route("Group/SaveGroupByUser")]
        [ResponseType(typeof(object))]
        public void SaveGroupByUser(string CodeGroup, string user)
        {
            var check = db.Group_User.Where(t => t.UserName == user).ToList();
            if ( check.Any() )
            {
                db.Group_User.RemoveRange(check);
                db.SaveChanges();
            }
            var model = JsonConvert.DeserializeObject<List<string>>(CodeGroup);
            var ListGroup = ";";
            foreach ( var item in model )
            {
                if ( item != "" )
                {
                    var dt = db.Group_User.Where(t => t.UserName == user && t.CodeGroup == item).FirstOrDefault();
                    if ( dt != null )
                    {
                        dt.FInUse = true;
                        db.SaveChanges();
                    }
                    else
                    {
                        dt = new Group_User();
                        dt.FCode = Guid.NewGuid().ToString();
                        dt.UserName = user;
                        dt.CodeGroup = item;
                        db.Group_User.Add(dt);
                        db.SaveChanges();
                    }
                    ListGroup += item + ";";
                }

            }
            var DelGroup = db.Group_User.Where(t => t.UserName == user && t.CodeGroup != Commons.Constants.SUPPERADMIN).ToList();
            foreach ( var i in DelGroup )
            {
                if ( !ListGroup.Contains(i.CodeGroup) )
                {
                    i.FInUse = false;
                    db.SaveChanges();
                }
            }
        }
        private void Validate(Group pre)
        {
            if ( string.IsNullOrEmpty(pre.FCode) )
            {
                ModelState.AddModelError("FCode", "Bắt buộc nhập dữ liệu");
                ModelState.AddModelError("FCode", "has-error");

            }
            if ( string.IsNullOrEmpty(pre.FName) )
            {
                ModelState.AddModelError("FName", "Bắt buộc nhập dữ liệu");
                ModelState.AddModelError("FName", "has-error");
            }

        }
        [HttpGet]
        [Route("api/CheckValidGroup/{FCode}")]
        //[ResponseType(typeof(Area))]
        public async Task<IHttpActionResult> CheckValid(string FCode)
        {
            //string sql = "SELECT * FROM " + tbName + " WHERE FCode='" + FCode + "'";
            //var dt = db.Database.SqlQuery<>(sql);
            var dt = db.Groups.Where(t => t.FCode == FCode).FirstOrDefault();
            if ( dt != null )
                return Ok(dt);
            else return Ok("undefined");
        }

        public class Gr_Menu
        {
            public string CodeGroup { get; set; }
            public List<Menu> MenuArr { get; set; }
        }
        [HttpPost]
        [Route("api/Group/SaveGroupMenu")]
        public IHttpActionResult SaveGroupMenu([FromBody] Gr_Menu gr_Menu)
        {
            var menuBygr = db.Group_Menu.Where(t => t.FInUse == true && t.CodeGroup == gr_Menu.CodeGroup).ToList();
            //var newMn = gr_Menu.MenuArr.Select(t => t.FCode).ToList();
            if ( menuBygr != null )
            {
                db.Group_Menu.RemoveRange(menuBygr);
                db.SaveChanges();
            }

            foreach ( var item in gr_Menu.MenuArr )
            {
                Group_Menu gr = new Group_Menu();
                gr.CodeGroup = gr_Menu.CodeGroup;
                gr.CodeMenu = item.FCode;
                db.Group_Menu.Add(gr);
                db.SaveChanges();
            }

            return Ok();
        }
        class DataDC
        {
            public string name { get; set; }
        }
        [HttpPost]
        [Route("api/Group/SaveMenuGroup")]
        public IHttpActionResult SaveMenuGroup(string codeGr, string codeMn)
        {
            var d = db.Group_Menu.Where(t => t.FInUse == true && t.CodeMenu == codeMn).ToList();
            if ( d.Count() > 0 )
            {
                db.Group_Menu.RemoveRange(d);
                db.SaveChanges();
            }
            codeGr = codeGr.Replace("\"", string.Empty);
            codeGr = codeGr.Replace("[", string.Empty);
            codeGr = codeGr.Replace("]", string.Empty);

            string[] listGr = new string[] { "" };
            listGr = codeGr.Split(',');
            // var listGr = json_serializer.Deserialize<DataDC[]>(codeGr);
            foreach ( var item in listGr )
            {
                Group_Menu grmn = new Group_Menu();
                grmn.CodeGroup = item;
                grmn.CodeMenu = codeMn;
                db.Group_Menu.Add(grmn);
                db.SaveChanges();

            }

            return Ok();
        }
        [HttpGet]
        [Route("api/Group/LoadMenubyGroup")]
        public IHttpActionResult LoadMenubyGroup(string codeGr)
        {
            var menuBygr = db.Group_Menu.Where(t => t.FInUse == true && t.CodeGroup == codeGr).Select(t => t.CodeMenu).ToList();
            return Ok(menuBygr);
        }
        [HttpGet]
        [Route("api/Group/LoadGroupbyMenu")]
        public IHttpActionResult LoadGroupbyMenu(string codeMn)
        {
            var menuBygr = db.Group_Menu.Where(t => t.FInUse == true && t.CodeMenu == codeMn).Select(t => t.CodeGroup).ToList();
            return Ok(menuBygr);
        }
        [HttpGet]
        [Route("api/Group/LoadGroupbyUser")]
        public IHttpActionResult LoadGroupbyUser(string UserName)
        {
            var menuByUs = db.Group_User.Where(t => t.FInUse == true && t.UserName == UserName).Select(t => t.CodeGroup).ToList();
            return Ok(menuByUs);
        }
        [HttpGet]
        [Route("api/Group/DeleteGroupMenubyMenuFCode")]
        public IHttpActionResult DeleteGroupMenubyMenuFCode(string MenuFCode)
        {
            var menuByUs = db.Group_Menu.Where(t => t.FInUse == true && t.CodeMenu == MenuFCode).ToList();
            db.Group_Menu.RemoveRange(menuByUs);
            return Ok(db.SaveChanges());

        }
        [HttpGet]
        [Route("api/Group/DeleteGroupMenubyGroupFCode")]
        public IHttpActionResult DeleteGroupMenubyGroupFCode(string GroupFCode)
        {
            var menuByUs = db.Group_Menu.Where(t => t.FInUse == true && t.CodeGroup == GroupFCode).ToList();
            db.Group_Menu.RemoveRange(menuByUs);
            return Ok(db.SaveChanges());
        }
    }
}