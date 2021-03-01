using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApiCore.Models
{
    public class ViewMenu
    {
        public long Id { get; set; }
        public string FCode { get; set; }
        public string FName { get; set; }
        public Nullable<int> FIndex { get; set; }
        public string icon { get; set; }
        public string MainMenu { get; set; }
        public string ParentMenu { get; set; }
        public string ControllerName { get; set; }
        public string Url { get; set; }
    }
}