using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApiCore.Models
{
    public class PagingList
    {
        //public List<TypeCate> Types { get; set; }
        //public List<LOAI_HINH_DN> LOAI_HINH_DN { get; set; }
        //public List<TrangThai> TrangThai { get; set; }
        //public List<DTThanhTra> DTThanhTra { get; set; }
        //public List<LoaiGiayTo> LoaiGiayTo { get; set; }
        //public List<LoaiHinhTT> LoaiHinhTT { get; set; }
        //public List<BieuMauTT> BieuMauTT { get; set; }
        //public List<TypeInspection> TypeInspection { get; set; }
        //public List<ObjectInspect> ObjectInspect { get; set; }
        //public List<Area> Areas { get; set; }
        //public List<Position> Positions { get; set; }
        public int pageStart { get; set; }
        public int pageEnd { get; set; }
        public int totalCount { get; set; }
        public int totalPage { get; set; }
    }
    
}