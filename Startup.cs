using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Microsoft.Owin;
using Owin;
using Quartz;
using Quartz.Impl;
using WebApiCore.Models;

[assembly: OwinStartup(typeof(WebApiCore.Startup))]

namespace WebApiCore
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {

            ConfigureAuth(app);
            app.MapSignalR();

            //JobScheduler.StartBackup();

            //File.AppendAllText(HttpContext.Current.Server.MapPath("~/ServerLog.txt"),
            //    "Server start at " + DateTime.Now.ToString("HH:mm dd/MM/yyyy") + Environment.NewLine);
        }
       

    }
}
