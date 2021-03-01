using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace WebApiCore
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            //
            // config.Formatters.JsonFormatter.SerializerSettings.Converters.Add(new MyDateTimeConvertor());
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Web API routes
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.Formatters.JsonFormatter.SerializerSettings.Converters.Add(new IsoDateTimeConverter() { Culture = new CultureInfo("en-GB") });
            // config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            //config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling
            //     = Newtonsoft.Json.ReferenceLoopHandling.Serialize;
            //config.Formatters.JsonFormatter.SerializerSettings.PreserveReferencesHandling
            //     = Newtonsoft.Json.PreserveReferencesHandling.Objects;
        }
        public static void ApplyCulureInfo()
        {
            // Creating a Global culture specific to our application.
            System.Globalization.CultureInfo cultureInfo =
                new System.Globalization.CultureInfo("en-US");
            // Creating the DateTime Information specific to our application.
            System.Globalization.DateTimeFormatInfo dateTimeInfo =
                new System.Globalization.DateTimeFormatInfo();
            // Defining various date and time formats.
            dateTimeInfo.DateSeparator = "/";
            dateTimeInfo.LongDatePattern = "dd/MM/yyyy";
            dateTimeInfo.ShortDatePattern = "dd/MM/yy";
            dateTimeInfo.LongTimePattern = "hh:mm:ss tt";
            dateTimeInfo.ShortTimePattern = "hh:mm tt";
            // Setting application wide date time format.
            cultureInfo.DateTimeFormat = dateTimeInfo;

            System.Globalization.NumberFormatInfo numInfo =
                new System.Globalization.NumberFormatInfo();
            numInfo.NumberDecimalSeparator = ",";
            numInfo.NumberGroupSeparator = ".";
            cultureInfo.NumberFormat = numInfo;
            System.Threading.Thread.CurrentThread.CurrentCulture = cultureInfo;
            System.Threading.Thread.CurrentThread.CurrentUICulture = cultureInfo;
        }
    }
}
