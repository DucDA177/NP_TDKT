using AutoMapper;
using GemBox.Spreadsheet;
using ICSharpCode.SharpZipLib.Core;
using ICSharpCode.SharpZipLib.Zip;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Spire.Pdf;
using Spire.Pdf.Graphics;
using Spire.Pdf.HtmlConverter;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web;
using WebApiCore.Models;
using WebGrease.Css.Extensions;
using Image = iTextSharp.text.Image;

namespace WebApiCore.Commons
{
    public class PropertyCopier<TParent, TChild> where TParent : class
                                          where TChild : class
    {
        public static void Copy(TParent parent, TChild child)
        {
            var parentProperties = parent.GetType().GetProperties();
            var childProperties = child.GetType().GetProperties();

            foreach ( var parentProperty in parentProperties )
            {
                foreach ( var childProperty in childProperties )
                {
                    if ( parentProperty.Name == childProperty.Name && parentProperty.PropertyType == childProperty.PropertyType )
                    {
                        childProperty.SetValue(child, parentProperty.GetValue(parent));
                        break;
                    }
                }
            }
        }
    }
    public class ConvertObject<TParent, TChild> where TParent : class
                                          where TChild : class
    {
        public static TChild Copy(TParent parent)
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<TParent, TChild>();
            });
            IMapper iMapper = config.CreateMapper();

            return iMapper.Map<TParent, TChild>(parent); ;
        }
    }
    public class Common
    {

        public class ListPaging<T>
        {
            public IQueryable<T> ListOut { get; set; }
            public int totalCount { get; set; }
            public int pageStart { get; set; }
            public int pageEnd { get; set; }
            public int totalPage { get; set; }
        }
        public static ListPaging<T> GetPagingList<T>(IQueryable<T> listAll, int pageNumber, int pageSize)
        {
            ListPaging<T> ls = new ListPaging<T>();

            ls.totalCount = listAll.Count();
            if ( pageSize == 0 ) pageSize = listAll.Count() == 0 ? 1 : listAll.Count();

            ls.ListOut = listAll.Skip(pageSize * ( pageNumber - 1 )).Take(pageSize);


            ls.totalPage = System.Convert.ToInt32(System.Math.Ceiling(ls.totalCount / System.Convert.ToDouble(pageSize)));
            ls.pageStart = ( ( pageNumber - 1 ) * pageSize ) + 1;
            if ( ls.totalPage == pageNumber )
            {
                ls.pageEnd = ls.totalCount;
            }
            else ls.pageEnd = ( ( pageNumber - 1 ) * pageSize ) + pageSize;

            return ls;
        }
        public static long? GetLoaiTruong(WebApiDataEntities db, string MaDV)
        {
            var dv = ( from u in db.DMDonVis where u.MaDonVi == MaDV select u ).FirstOrDefault();
            return dv.IDLoaiTruong;
        }

        public static long? GetCurrentDonVi(WebApiDataEntities db, string user)
        {
            var oUser = ( from u in db.UserProfiles where u.UserName == user select u ).FirstOrDefault();
            if ( oUser != null )
                return oUser.IDDonVi;
            else return null;
        }
        public static Bitmap ResizeImage(System.Drawing.Image image, int width, int height)
        {
            var destRect = new System.Drawing.Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using ( var graphics = Graphics.FromImage(destImage) )
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                using ( var wrapMode = new ImageAttributes() )
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
        }
        public static void CreateUserLog(WebApiDataEntities db, string TenBang, string ThaoTac, string user)
        {
            NhatKySuDung nksd = new NhatKySuDung();
            nksd.IdDonVi = GetCurrentDonVi(db, user);
            nksd.NgayGio = DateTime.Now;
            nksd.NoiDung = "Người dùng " + user + " đã " + ThaoTac + " dữ liệu trong bảng " + TenBang + " lúc " + DateTime.Now.ToString();
            nksd.TenBang = TenBang;
            nksd.ThaoTac = ThaoTac;
            nksd.UserName = user;
            db.NhatKySuDungs.Add(nksd);
            db.SaveChanges();
        }

        public static byte[] ConvertToPdf(string fileName)
        {
            string contentType = MimeMapping.GetMimeMapping(fileName);
            MemoryStream mem = new MemoryStream();
            switch ( contentType.ToLower() )
            {

                case "image/gif":
                case "image/jpg":
                case "image/png":
                case "image/jpeg":
                case "application/BMP":
                case "image/bmp":
                case "image/tiff":
                    if ( !string.IsNullOrEmpty(fileName) )
                    {
                        Document document = new Document(PageSize.LETTER, 10, 10, 10, 10);
                        //using ( var stream = new MemoryStream() )
                        //{
                        PdfWriter.GetInstance(document, mem);

                        document.Open();
                        using ( var imageStream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite) )
                        {
                            var image = Image.GetInstance(imageStream);
                            image.ScaleAbsolute(585, 750);
                            //image.ScaleAbsoluteHeight(PageSize.A4.Height - 20);
                            //image.ScaleToFit(PageSize.LETTER);

                            document.Add(image);
                        }
                        document.Close();

                        // return stream.ToArray();
                        //}

                    }

                    break;
                case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                case "application/vnd.ms-excel":
                case "application/xlsx":
                case "application/xls":
                case "application/vnd.ms-excel.sheet.macroEnabled.12":
                case "application/XLSM":
                    if ( !string.IsNullOrEmpty(fileName) )
                    {

                        Spire.Xls.Workbook workbook = new Spire.Xls.Workbook();
                        workbook.LoadFromFile(fileName, true);
                        workbook.SaveToStream(mem, Spire.Xls.FileFormat.PDF);

                    }

                    break;
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                case "application/msword":
                case "application/docx":
                case "application/doc":
                    if ( !string.IsNullOrEmpty(fileName) )
                    {
                        Spire.Doc.Document document = new Spire.Doc.Document();
                        document.LoadFromFile(fileName, Spire.Doc.FileFormat.Auto);
                        document.SaveToStream(mem, Spire.Doc.FileFormat.PDF);
                        document.Close();
                    }

                    break;
                case "application/html":
                case "application/txt":
                case "application/htm":
                case "text/html":
                case "application/xml":
                case "text/plain":
                    if ( !string.IsNullOrEmpty(fileName) )
                    {
                        Spire.Pdf.PdfDocument pdf = new Spire.Pdf.PdfDocument();
                        PdfHtmlLayoutFormat htmlLayoutFormat = new PdfHtmlLayoutFormat
                        {
                            Layout = PdfLayoutType.Paginate,
                            FitToPage = Clip.Width,
                            LoadHtmlTimeout = 60 * 1000
                        };
                        htmlLayoutFormat.IsWaiting = true;
                        PdfPageSettings setting = new PdfPageSettings();
                        setting.Size = PdfPageSize.A4;
                        Thread thread = new Thread(() => { pdf.LoadFromHTML(fileName, true, true, true); });
                        thread.SetApartmentState(ApartmentState.STA);
                        thread.Start();
                        thread.Join();
                        pdf.SaveToStream(mem, Spire.Pdf.FileFormat.PDF);
                    }
                    break;
                case "application/msg":
                case "application/octet-stream":
                case "multipart/related":
                case "application/ZIP":
                case "application/VCF":
                default:
                    break;
            }

            return mem.ToArray();
        }

        public static bool IsPdf(string path)
        {
            var pdfString = "%PDF-";
            var pdfBytes = Encoding.ASCII.GetBytes(pdfString);
            var len = pdfBytes.Length;
            var buf = new byte[len];
            var remaining = len;
            var pos = 0;
            using ( var f = File.OpenRead(path) )
            {
                while ( remaining > 0 )
                {
                    var amtRead = f.Read(buf, pos, remaining);
                    if ( amtRead == 0 ) return false;
                    remaining -= amtRead;
                    pos += amtRead;
                }
            }
            return pdfBytes.SequenceEqual(buf);
        }
        public static bool IsImage(string path)
        {
            return MimeMapping.GetMimeMapping(path).StartsWith("image/");
        }
        public static string ReplaceUnicode(object input)
        {
            string strInput = "";
            if ( input != null )
            {
                strInput = input.ToString();
                string[] VietNamChar = new string[] { "aAeEoOuUiIdDyY", "áàạảãâấầậẩẫăắằặẳẵ", "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ", "éèẹẻẽêếềệểễ", "ÉÈẸẺẼÊẾỀỆỂỄ", "óòọỏõôốồộổỗơớờợởỡ", "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ", "úùụủũưứừựửữ", "ÚÙỤỦŨƯỨỪỰỬỮ", "íìịỉĩ", "ÍÌỊỈĨ", "đ", "Đ", "ýỳỵỷỹ", "ÝỲỴỶỸ" };
                for ( int i = 1; i <= VietNamChar.Length - 1; i++ )
                {
                    for ( int j = 0; j <= VietNamChar[i].Length - 1; j++ )
                    {
                        strInput = strInput.Replace(VietNamChar[i][j], VietNamChar[0][i - 1]);
                    }
                }
            }

            return strInput;
        }
        public static string TaoTuVietTat(string input)
        {
            string namevt = "";
            input.Split(' ').ForEach(t => namevt += t.ToCharArray().FirstOrDefault());
            return namevt;
        }

        #region ExtractImagesFromPDF
        public static void ExtractImagesFromPDF(string sourcePdf, string outputPath, int index)
        {
            // NOTE:  This will only get the first image it finds per page.
            PdfReader pdf = new PdfReader(sourcePdf);
            RandomAccessFileOrArray raf = new iTextSharp.text.pdf.RandomAccessFileOrArray(sourcePdf);

            try
            {
                for ( int pageNumber = 1; pageNumber <= pdf.NumberOfPages; pageNumber++ )
                {
                    PdfDictionary pg = pdf.GetPageN(pageNumber);
                    PdfDictionary res =
                      (PdfDictionary) PdfReader.GetPdfObject(pg.Get(PdfName.RESOURCES));
                    PdfDictionary xobj =
                      (PdfDictionary) PdfReader.GetPdfObject(res.Get(PdfName.XOBJECT));
                    if ( xobj != null )
                    {
                        foreach ( PdfName name in xobj.Keys )
                        {
                            PdfObject obj = xobj.Get(name);
                            if ( obj.IsIndirect() )
                            {
                                PdfDictionary tg = (PdfDictionary) PdfReader.GetPdfObject(obj);
                                PdfName type =
                                  (PdfName) PdfReader.GetPdfObject(tg.Get(PdfName.SUBTYPE));
                                if ( PdfName.IMAGE.Equals(type) )
                                {

                                    int XrefIndex = Convert.ToInt32(( (PRIndirectReference) obj ).Number.ToString(System.Globalization.CultureInfo.InvariantCulture));
                                    PdfObject pdfObj = pdf.GetPdfObject(XrefIndex);
                                    PdfStream pdfStrem = (PdfStream) pdfObj;
                                    byte[] bytes = PdfReader.GetStreamBytesRaw((PRStream) pdfStrem);
                                    if ( ( bytes != null ) )
                                    {
                                        using ( System.IO.MemoryStream memStream = new System.IO.MemoryStream(bytes) )
                                        {
                                            memStream.Position = 0;
                                            System.Drawing.Image img = System.Drawing.Image.FromStream(memStream);
                                            // must save the file while stream is open.
                                            if ( !Directory.Exists(outputPath) )
                                                Directory.CreateDirectory(outputPath);

                                            //string path = Path.Combine(outputPath, String.Format(@"{0}.jpg", pageNumber));
                                            string _pageNumber = pageNumber.ToString().PadLeft(3, '0');
                                            string path = Path.Combine(outputPath, index + "_" + _pageNumber + ".jpg");
                                            EncoderParameters parms = new EncoderParameters(1);
                                            parms.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Compression, 0);
                                            // GetImageEncoder is found below this method
                                            ImageCodecInfo jpegEncoder = GetImageEncoder("JPEG");
                                            img.Save(path, jpegEncoder, parms);
                                            break;

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            catch
            {
                // throw;
            }
            finally
            {
                pdf.Close();
            }


        }
        #endregion

        #region GetImageEncoder
        public static System.Drawing.Imaging.ImageCodecInfo GetImageEncoder(string imageType)
        {
            imageType = imageType.ToUpperInvariant();



            foreach ( ImageCodecInfo info in ImageCodecInfo.GetImageEncoders() )
            {
                if ( info.FormatDescription == imageType )
                {
                    return info;
                }
            }

            return null;
        }
        #endregion

        public static void AddWatermarkImage(string filename)
        {
            string text = "SỞ LAO ĐỘNG THƯƠNG BINH VÀ XÃ HỘI HẢI DƯƠNG";
            System.Drawing.Font font = new System.Drawing.Font("Arial", 20, FontStyle.Regular);

            System.Drawing.Image image = (System.Drawing.Image) Bitmap.FromFile(filename);
            using ( Graphics g = Graphics.FromImage(image) )
            {
                g.TranslateTransform(image.Width / 2, image.Height / 2);
                g.RotateTransform(45);
                SizeF textSize = g.MeasureString(text, font);
                g.DrawString(text, font, Brushes.Chocolate, -( textSize.Width / 2 ), -( textSize.Height / 2 ));

            }
            MemoryStream m = new MemoryStream();
            image.Save(m, ImageFormat.Jpeg);
            image.Dispose();
            byte[] convertedToBytes = m.ToArray();
            File.WriteAllBytes(filename, convertedToBytes);

        }
        public static void WaterMarkImage(string folderPath)
        {
            bool exists = Directory.Exists(folderPath);
            if ( exists )
            {
                DirectoryInfo d = new DirectoryInfo(folderPath);//Assuming Test is your Folder
                FileInfo[] Files = d.GetFiles(); //Getting Text files

                if ( Files.Length > 0 )
                    foreach ( var img in Files )
                    {
                        AddWatermarkImage(img.FullName);
                    }
            }

        }


        public static byte[] WaterMarkPdf(string pathfile)
        {
            using ( Stream inputPdfStream = new FileStream(@pathfile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite) )
            using ( MemoryStream outputPdfStream = new MemoryStream() )
            {

                var reader = new PdfReader(inputPdfStream);
                var stamper = new PdfStamper(reader, outputPdfStream);
                PdfContentByte pdfContentByte = null;

                int c = reader.NumberOfPages;


                float rotation = 45f;
                float ageW = 600;
                float mPageH = 842;

                for ( int i = 1; i <= c; i++ )
                {
                    
                    string ARIALUNI_TFF = Path.Combine(HttpContext.Current.Server.MapPath("~/fonts/"), "ARIAL.ttf");
                    //Create a base font object making sure to specify IDENTITY-H
                    BaseFont bf = BaseFont.CreateFont(ARIALUNI_TFF, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);

                    pdfContentByte = stamper.GetOverContent(i);
                    pdfContentByte.SetRGBColorFillF(0.8f, 0.8f, 0.8f);
                    pdfContentByte.SetFontAndSize(bf, 25);
                    float x = ageW / 2;
                    float y = mPageH / 2;
                    PdfGState gState = new PdfGState();
                    gState.FillOpacity = 0.25f;
                    pdfContentByte.SetGState(gState);
                    pdfContentByte.SetColorFill(BaseColor.BLACK);

                    pdfContentByte.BeginText();
                    pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_CENTER, "SỞ LAO ĐỘNG THƯƠNG BINH VÀ XÃ HỘI HẢI DƯƠNG", x, y, rotation);
                    pdfContentByte.EndText();

                    pdfContentByte.SetRGBColorFillF(0, 0, 0);
                    pdfContentByte.SetFontAndSize(bf, 10.5f);
                    x = 10;
                    y = mPageH- mPageH * 96 / 100;
                    gState = new PdfGState();
                    gState.FillOpacity = 0.5f;
                    pdfContentByte.SetGState(gState);
                    pdfContentByte.SetColorFill(BaseColor.BLACK);

                    pdfContentByte.BeginText();
                    pdfContentByte.ShowTextAligned(PdfContentByte.ALIGN_LEFT, "Cấm sao lưu tài liệu dưới mọi hình thức khi chưa có sự phê duyệt của Sở Lao động Thương binh và Xã hội tỉnh Hải Dương", x, y,0);
                    pdfContentByte.EndText();

                }


                stamper.Close();

                return outputPdfStream.ToArray();
            }
        }

        public class PaingPropety
        {
            public int pageStart { get; set; }
            public int pageEnd { get; set; }
            public int totalCount { get; set; }
            public int totalPage { get; set; }
        }

        public static MemoryStream ZipFiles(string srcFolder)
        {
            MemoryStream outputMemoryStream = new MemoryStream();
            ZipOutputStream zipOutputStream = new ZipOutputStream(outputMemoryStream);
            zipOutputStream.SetLevel(3);

            foreach ( FileInfo fi in new DirectoryInfo(srcFolder).GetFiles() )
            {
                if ( fi.Extension != ".zip" )
                {
                    using ( var inputMemoryStream = new MemoryStream() )
                    {
                        inputMemoryStream.Position = 0;

                        var fileContent = File.ReadAllBytes(fi.FullName);

                        inputMemoryStream.Write(fileContent, 0, fileContent.Length);

                        var newEntry = new ZipEntry(fi.Name);
                        newEntry.DateTime = DateTime.Now;

                        zipOutputStream.PutNextEntry(newEntry);

                        inputMemoryStream.Position = 0;

                        StreamUtils.Copy(inputMemoryStream, zipOutputStream, new byte[4096]);
                        zipOutputStream.CloseEntry();
                    }
                }
            }

            zipOutputStream.IsStreamOwner = false;
            zipOutputStream.Finish();
            zipOutputStream.Close();
            zipOutputStream.Dispose();

            outputMemoryStream.Position = 0;
            return outputMemoryStream;
        }

        // Hàm ghi lỗi try catch ra file
        public static void WriteLogToTextFile(string Error)
        {
            string directoryPath = HttpContext.Current.Server.MapPath("~/Log_Error");
            if ( !Directory.Exists(directoryPath) )
                Directory.CreateDirectory(directoryPath);
            string FileName = string.Format("log_{0}.txt", System.DateTime.Now.ToString("yyyyMMdd"));
            string path = Path.Combine(HttpContext.Current.Server.MapPath("~/Log_Error"), FileName); ;// AppDomain.CurrentDomain.BaseDirectory + string.Format("\\Log_Error\\log_{0}.txt", System.DateTime.Now.ToString("yyyyMMdd"));
            if ( !File.Exists(path) )
            {
                StreamWriter sw = File.CreateText(path);
                sw.Close();
            }
            if ( File.Exists(path) )
            {
                using ( StreamWriter sw = File.AppendText(path) )
                {
                    sw.WriteLine(DateTime.Now.ToString() + ": " + Error);
                    sw.Close();
                }
            }
        }

        public static string AutoId(WebApiDataEntities db, string Code)
        {
            try
            {
                Code = Code.ToUpper();
                AutoID AutoId = db.AutoIDs.Where(x => x.FCode == Code).SingleOrDefault();
                if ( AutoId == null )
                {
                    AutoId = new AutoID();
                    AutoId.FCode = Code;
                    AutoId.Counter = 1;
                    db.AutoIDs.Add(AutoId);
                }
                AutoId.FName = Code;
                for ( int i = 0; i < 6 - AutoId.Counter.ToString().Length; i++ )
                    AutoId.FName += 0;

                AutoId.FName += AutoId.Counter.ToString();
                AutoId.Counter += 1;
                db.SaveChanges();
                return AutoId.FName;
            }
            catch
            {
                return "";
            }
        }

        public static bool CheckSupperAdmin(WebApiDataEntities db, string user)
        {
            var oUser = ( from u in db.Group_User
                          join i in db.UserProfiles on u.UserName equals i.UserName
                          where u.CodeGroup == Constants.SUPPERADMIN && u.UserName == user && u.FInUse == true
                          select u
                         ).FirstOrDefault();
            if ( oUser != null )
                return true;
            else return false;
        }
        
       public static void LockFolder(string folderPath)
        {
            if ( !Directory.Exists(folderPath) )
                return;

            DirectoryInfo di = new DirectoryInfo(folderPath);

            di.Attributes = FileAttributes.Directory | FileAttributes.Hidden;


            DirectorySecurity ds = Directory.GetAccessControl(folderPath);
            
            ds.SetAccessRuleProtection(isProtected: true, preserveInheritance: false);

            FileSystemAccessRule fsa = new FileSystemAccessRule("IIS_IUSRS", FileSystemRights.FullControl, InheritanceFlags.ContainerInherit | InheritanceFlags.ObjectInherit, PropagationFlags.None, AccessControlType.Allow);
            ds.AddAccessRule(fsa);
           
            var lsAccess = ds.GetAccessRules(true, true, typeof(NTAccount));

            foreach ( FileSystemAccessRule fsar in lsAccess )
            {
                string userName = fsar.IdentityReference.Value;
                if ( !userName.Contains("IIS_IUSRS") )
                    ds.PurgeAccessRules(fsar.IdentityReference);
                    //ds.RemoveAccessRule(fsar);

            }

            //FileSystemAccessRule fsa2 = new FileSystemAccessRule("Everyone", FileSystemRights.FullControl, InheritanceFlags.ContainerInherit | InheritanceFlags.ObjectInherit, PropagationFlags.None, AccessControlType.Allow);
            //ds.RemoveAccessRule(fsa2);

            

            Directory.SetAccessControl(folderPath, ds);


        }
        public static void UnLockFolder(string folderPath)
        {
            if ( !Directory.Exists(folderPath) )
                return;

            DirectoryInfo di = new DirectoryInfo(folderPath);
            di.Attributes = di.Attributes & ~FileAttributes.Hidden;


            string adminUserName = Environment.UserName;// getting your adminUserName
            DirectorySecurity ds = Directory.GetAccessControl(folderPath);


            FileSystemAccessRule fsa = new FileSystemAccessRule("Everyone", FileSystemRights.FullControl, InheritanceFlags.ContainerInherit | InheritanceFlags.ObjectInherit, PropagationFlags.None, AccessControlType.Allow);
            ds.AddAccessRule(fsa);

            Directory.SetAccessControl(folderPath, ds);

        }
        public static string NormalizePath(string path)
        {
            return Path.GetFullPath(new Uri(path).LocalPath)
                       .TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
        }
        public static string EncodePathNCC(string path)
        {
            string norPath = path.Split('\\').FirstOrDefault();
            if ( norPath == null ) return null;

            string encodePath = EncodeString(norPath);
            return path.Replace(norPath, encodePath);
        }
        public static string DecodePathNCC(string path)
        {
            string norPath = path.Split('\\').FirstOrDefault();
            if ( norPath == null ) return null;

            string decodePath = DecodeString(norPath);
            return path.Replace(norPath, decodePath);
        }

        public static string EncodeString(string text)
        {

            var plainTextBytes = Encoding.UTF8.GetBytes(text);

            return Convert.ToBase64String(plainTextBytes);
        }
       
        public static string DecodeString(string text)
        {

            var base64EncodedBytes = System.Convert.FromBase64String(text);
            return Encoding.UTF8.GetString(base64EncodedBytes);
        }
        public static string RenderSearchKey(string Hodem, string Ten, string Mahoso, string Sohieu, string Sovaoso)
        {
            string Ho = Hodem.Split(' ')[0];
            string searchName = Hodem + " " + Ten + " " + Common.ReplaceUnicode(Hodem + " " + Ten) + " "
                + Ho + " " + Ten + " " + Common.ReplaceUnicode(Ho + " " + Ten);
            string otherSearch = " " + Mahoso + " " + Sohieu + " " + Sovaoso;

            return searchName + otherSearch;
        }
        public static string RenderSearchKey(string Hodem, string Ten)
        {
            string Ho = Hodem.Split(' ')[0];
            string searchName = Hodem + " " + Ten + " " + Common.ReplaceUnicode(Hodem + " " + Ten) + " "
                + Ho + " " + Ten + " " + Common.ReplaceUnicode(Ho + " " + Ten);

            return searchName;
        }
    }
}