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
    
    public partial class tblDoituongKhenthuong
    {
        public long Id { get; set; }
        public Nullable<long> IdDoituong { get; set; }
        public Nullable<long> IdKhenthuong { get; set; }
        public Nullable<System.DateTime> Ngaydenghi { get; set; }
        public Nullable<System.DateTime> Ngayduyet { get; set; }
        public Nullable<int> Nam { get; set; }
        public Nullable<int> IdDonvi { get; set; }
        public string MaDanhhieu { get; set; }
        public Nullable<int> Trangthai { get; set; }
        public string TieuchiDat { get; set; }
        public string TieuchiKoDat { get; set; }
        public string Ghichu { get; set; }
    }
}