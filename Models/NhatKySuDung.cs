//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class NhatKySuDung
    {
        public long Id { get; set; }
        public string ThaoTac { get; set; }
        public string UserName { get; set; }
        public string TenBang { get; set; }
        public Nullable<long> IdDonVi { get; set; }
        public Nullable<System.DateTime> NgayGio { get; set; }
        public string NoiDung { get; set; }
    }
}