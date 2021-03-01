using System;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    [Authorize]
    public class AreasController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        

        [Route("Area/{Type}/{Id}")]
        [ResponseType(typeof(object))]
        public async Task<IHttpActionResult> GetAreaByType(string Type, string Id)
        {
            var Area = await db.Areas.Where(x => (x.Type == Type && (Id == "0" || x.Parent == Id))).ToListAsync();
            if (Type == "TINH" && Id != "0")
            {
                Area = await db.Areas.Where(x => x.Type == Type && x.FCode == Id).ToListAsync();
            }
            return Ok(Area);
            
        }
        //[Route("Area/Type")]
        //[ResponseType(typeof(TypeCate))]
        //public IQueryable<TypeCate> GetType()
        //{
        //    return db.TypeCates.Where(t => t.Type == "DIABAN");
        //}

        [Route("api/Area/{FCode}")]
        [ResponseType(typeof(Area))]
        public async Task<IHttpActionResult> GetAreaFCode(string FCode)
        {
            return Ok(db.Areas.Where(t => t.FCode == FCode && t.FInUse == true).Single());
        }
        [Route("api/Area/GetAreasbyParent")]
        public IHttpActionResult GetAreasbyParent(int Id)
        {
            List<Area> ls = new List<Area>();
            var dt = db.Areas.Where(t => t.Id == Id && t.FInUse == true).Single();
            ls.Add(dt);
            var child = db.Areas.Where(t => t.Parent == dt.FCode && t.FInUse == true).ToList();
            if (child.Count() > 0)
                foreach (var item in child)
                {
                    // item.FName = "---| " + item.FName;
                    ls.Add(item);
                }
            return Ok(ls);
        }
        public class GetAreas
        {
            public long RowNum { get; set; }
            public int Id { get; set; }
            public string FCode { get; set; }

            public string FName { get; set; }
            public string Type { get; set; }
            public string FDescription { get; set; }
            public string Parent { get; set; }
            public string PhanLoai { get; set; }
            public string DVCha { get; set; }
            public Nullable<System.DateTime> FCreateTime { get; set; }
        }
        public class List
        {
            public List<Area> Areas { get; set; }
            public int totalCount { get; set; }
            public int pageStart { get; set; }
            public int pageEnd { get; set; }
            public int totalPage { get; set; }
        }
        [HttpGet]
        [Route("api/Area/GetDropArea")]
        public IHttpActionResult GetDropArea()
        {
            //var query = (from p in db.Areas
            //             join q in db.Areas on p.Parent equals q.FCode
            //             where p.Type != "XA" && q.Type != "XA"
            //             select new
            //             {
            //                 ParentName = db.Areas.Where(c => c.FCode == p.Parent).FirstOrDefault().FName,
            //                 ParentCode = db.Areas.Where(c => c.FCode == p.Parent).FirstOrDefault().FCode,
            //                 Code = p.FCode,
            //                 Name = p.FName

            //             }).ToList();
            List<Area> ls = new List<Area>();
            var tinh = db.Areas.Where(t => t.FInUse == true && t.Type == "TINH").ToList();
            foreach(var item in tinh)
            {
                var huyen = db.Areas.Where(t => t.FInUse == true && t.Type == "HUYEN" && t.Parent == item.FCode).ToList();
                ls.Add(item);
                ls.AddRange(huyen);
            }
            return Ok(ls);
        }
        
        // GET: api/Areas
        [HttpGet]
        [Route("api/GetAllAreas")]
        public List GetAllAreas(int pageNumber, int pageSize, string searchKey, string Type, string Parent,string Code)
        {
            if (searchKey == null) searchKey = "";
            if (Type == null) Type = "";
            if (Code == null) Code = "";
            List ls = new List();
            var cmd = db.Database.Connection.CreateCommand();
            cmd.CommandText = "[dbo].[GetArea]" + pageNumber + "," + pageSize + ",N'" + searchKey + "','"+Type+"','"+Parent+"','" + Code +"'";
            db.Database.Connection.Open();
            var reader = cmd.ExecuteReader();
            var areas = ((IObjectContextAdapter)db)
                .ObjectContext
                .Translate<Area>(reader).ToList();
            ls.Areas = areas;

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
        [HttpGet]
        [Route("Org/loadAreas")]
        [ResponseType(typeof(object))]
        public async Task<IHttpActionResult> loadAreas()
        {
            var a = ConfigurationManager.AppSettings["DefaultArea"];
            var Com = db.Areas.Where(x => x.FCode == a).FirstOrDefault();//.ToList();
            if (Com == null)
                return NotFound();
            ArrayList OrgList = new ArrayList();
            //foreach (var item in Com)
            //{
            OrgList.Add(Com);
            var child = db.Areas.Where(x => x.Parent == Com.FCode && x.Type == "HUYEN").OrderBy(t => t.FCode).ToList();
            foreach (var it_1 in child)
            {
                OrgList.Add(it_1);
                // }
            }

            return Ok(OrgList);
        }

        // GET: api/Areas/5
        [ResponseType(typeof(Area))]
        public async Task<IHttpActionResult> GetArea(int id)
        {
            Area area = await db.Areas.FindAsync(id);
            if (area == null)
            {
                return NotFound();
            }

            return Ok(area);
        }

        // PUT: api/Areas/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutArea(int id, Area area)
        {
            ValidateMenu(area);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != area.Id)
            {
                return BadRequest();
            }

            db.Entry(area).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AreaExists(id))
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

        // POST: api/Areas
        [ResponseType(typeof(Area))]
        public async Task<IHttpActionResult> PostArea(Area area)
        {
            ValidateMenu(area);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            area.FInUse = true;
            db.Areas.Add(area);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = area.Id }, area);
        }

        // DELETE: api/Areas/5
        [ResponseType(typeof(Area))]
        public async Task<IHttpActionResult> DeleteArea(int id)
        {
            Area area = await db.Areas.FindAsync(id);
            if (area == null)
            {
                return NotFound();
            }

            db.Areas.Remove(area);
            await db.SaveChangesAsync();

            return Ok(area);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AreaExists(int id)
        {
            return db.Areas.Count(e => e.Id == id) > 0;
        }
        private void ValidateMenu(Area type)
        {
            if (string.IsNullOrEmpty(type.FCode))
            {
                ModelState.AddModelError("FCode", "Mã địa bàn bắt buộc nhập");
                ModelState.AddModelError("FCode", "has-error");
            }
            if (string.IsNullOrEmpty(type.FName))
            {
                ModelState.AddModelError("FName", "Tên địa bàn bắt buộc nhập");
                ModelState.AddModelError("FName", "has-error");
            }
            if (string.IsNullOrEmpty(type.Type))
            {
                ModelState.AddModelError("Type", "Cấp địa bàn bắt buộc chọn");
                ModelState.AddModelError("Type", "has-error");
            }
        }

        #region tree area
        [Route("Area/Tree")]
        [ResponseType(typeof(object))]
        public async Task<IHttpActionResult> GetAreaTree(string AreaCode)
        {
            //var Com = await db.Areas.Where(x => x.FCode == AreaCode).SingleOrDefaultAsync();
            //if (Com == null)
            //    return NotFound();
            ArrayList AreaList = new ArrayList();
            var areas = db.Areas.Where(x => x.FInUse == true && x.Parent == "");
            foreach (var area in areas)
            {
                var o = new
                {
                    id = area.Id,
                    code = area.FCode,
                    text = area.FName,
                    children = await GetChild(area.FCode),
                    type = area.Type,
                    codeparent = area.Parent
                };
                AreaList.Add(o);
            }
            //foreach (Area area in areas)
            //{
            //    var o = new
            //    {
            //        id = area.Id,
            //        code = area.FCode,
            //        text = area.FName,
            //        children = await GetChild(area.FCode),
            //        type = area.Type,
            //        codeparent = area.Parent
            //    };
            //    AreaList.Add(o);
            //}
            //var oCom = new
            //{
            //    id = AreaCode,
            //    code = Com.FCode,
            //    text = Com.FName,
            //    type = Com.Type,
            //    codeparent = Com.Parent,
            //    children = AreaList,
            //    state = new
            //    {
            //        opened = true,  // is the node open
            //        disabled = false,  // is the node disabled
            //        selected = true // is the node selected
            //    }

            //};
            return Ok(AreaList);
        }
        public async Task<ArrayList> GetChild(string ComCode)
        {
            ArrayList Child = new ArrayList();
            //var Com = await db.Companies.Where(x => x.FCode == ComCode).SingleOrDefaultAsync();
            ArrayList AreaList = new ArrayList();
            var areas = db.Areas.Where(x => x.Parent == ComCode && x.FInUse == true);
            foreach (var area in areas)
            {
                var o = new
                {
                    id = area.Id,
                    code = area.FCode,
                    text = area.FName,
                    codeparent = area.Parent,
                    children = await GetChild(area.FCode),
                    type = area.Type
                };
                AreaList.Add(o);
            }
            Child = AreaList;
            return Child;

            //ArrayList Child = new ArrayList();
            //var Com = await db.Areas.Where(x => x.FCode == ComCode).SingleOrDefaultAsync();
            //ArrayList AreaList = new ArrayList();
            //var areas = db.Areas.Where(x => x.Parent == ComCode);
            //foreach (Area area in areas)
            //{
            //    var o = new
            //    {
            //        id = area.Id,
            //        code = area.FCode,
            //        text = area.FName,
            //        codeparent = area.Parent,
            //        children = await GetChild(area.FCode),
            //        type = area.Type
            //    };
            //    AreaList.Add(o);
            //}
            //Child = AreaList;
            //return Child;
        }

        [HttpGet]
        [Route("Area/TreeText/{ComCode}")]
        [ResponseType(typeof(object))]
        public async Task<IHttpActionResult> GetAreaTreeText(string ComCode)
        {
            var ListAreaCom = db.Areas.Where(x => x.FCode == ComCode || (ComCode == "ALL" && x.Type == "TINH")).ToList();//.SingleOrDefaultAsync();
            if (ListAreaCom.Count == 0)
                return NotFound();
            ArrayList AreaList = new ArrayList();
            foreach (var Com in ListAreaCom)
            {
                var oCom = new
                {
                    id = Com.FCode,
                    text = Com.FName,
                    code = Com.FCode,
                };
                AreaList.Add(oCom);
                int index = 1;
                //string strEnd = "";
                //string strBegin = "";
                //for (int i = 0; i < index; i++)
                //{
                //    strBegin += "  ";
                //    strEnd += "--";
                //}
                int stt = 1;
                var areas = db.Areas.Where(x => x.Parent == Com.FCode);
                foreach (Area area in areas)
                {
                    var o = new
                    {
                        id = area.FCode,
                        code = area.FCode,
                        text = stt + "." + area.FName,
                        // text = strBegin + "|" + strEnd + " " + area.FName,
                    };
                    AreaList.Add(o);
                    AreaList.AddRange(await GetChildText(area.FCode, index + 1, stt.ToString()));
                    stt++;
                }
            }
            return Ok(AreaList);
        }
        public async Task<ArrayList> GetChildText(string ComCode, int index, string stt)
        {
            ArrayList Child = new ArrayList();
            var Com = await db.Areas.Where(x => x.FCode == ComCode).SingleOrDefaultAsync();
            ArrayList AreaList = new ArrayList();
            var areas = db.Areas.Where(x => x.Parent == ComCode);
            //string strEnd = "";
            //string strBegin = "";
            //for (int i = 0; i < index; i++)
            //{
            //    strBegin += "  ";
            //    strEnd += "--";
            //}
            int stt2 = 1;
            foreach (Area area in areas)
            {
                string strstt = stt + "." + stt2;
                var o = new
                {
                    id = area.FCode,
                    code = area.FCode,
                    text = strstt + "." + area.FName,
                    //text = strBegin + "|" + strEnd + " " + area.FName,
                };
                AreaList.Add(o);
                AreaList.AddRange(await GetChildText(area.FCode, index + 1, strstt));
                stt2++;
            }
            Child = AreaList;
            return Child;
        }
        #endregion
        [HttpGet]
        [Route("api/CheckValidArea/{FCode}")]
        //[ResponseType(typeof(Area))]
        public async Task<IHttpActionResult> CheckValid(string FCode)
        {
            //string sql = "SELECT * FROM " + tbName + " WHERE FCode='" + FCode + "'";
            //var dt = db.Database.SqlQuery<>(sql);
            var dt = db.Areas.Where(t => t.FCode == FCode).FirstOrDefault();
            if (dt != null)
                return Ok(dt);
            else return Ok("undefined");
        }
        [HttpGet]
        [Route("api/DonViChuQuan")]
        public async Task<IHttpActionResult> GetListArea()
        {
            var a = ConfigurationManager.AppSettings["DefaultArea"];
            var Com = await db.Areas.Where(x => x.FCode == a).SingleOrDefaultAsync();
            if (Com == null)
                return NotFound();
            ArrayList AreaList = new ArrayList();
            var areas = db.Areas.Where(x => x.Parent == a);
            foreach (Area area in areas)
            {
                var o = new
                {
                    id = area.Id,
                    code = area.FCode,
                    text = area.FName,
                    children = await GetChild(area.FCode),
                    type = area.Type,
                    codeparent = area.Parent
                };
                AreaList.Add(o);
            }
            var oCom = new
            {
                id = Com.Id,
                code = Com.FCode,
                text = Com.FName,
                type = Com.Type,
                codeparent = Com.Parent,
                children = AreaList,
                state = new
                {
                    opened = true,  // is the node open
                    disabled = false,  // is the node disabled
                    selected = true // is the node selected
                }

            };
            return Ok(oCom);
        }
        //[HttpGet]
        //[Route("api/Area/GetAllTinh")]
        //public IHttpActionResult GetAllTinh()
        //{
        //    var tinh = db.Areas.Where(t => t.FInUse == true && t.Type == "TINH").ToList();
        //    return Ok();
        //}
    }
}
