using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApiCore.Models
{
    public class ViewPermission
    {
        public long Id { get; set; }
        public string FCode { get; set; }
        public string FName { get; set; }
        public Nullable<int> FIndex { get; set; }
        public string CodePermission { get; set; }
    }
}