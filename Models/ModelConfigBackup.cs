using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApiCore.Models
{
    public class ModelConfigBackup
    {
        public string Folder { get; set; }
        public bool dtb { get; set; }
        public bool hsncc { get; set; }
        public bool IsLock { get; set; }
        public int hour { get; set; }
        public int min { get; set; }
        public bool isActive { get; set; }
        public DateTime? time { get; set; }
    }
}