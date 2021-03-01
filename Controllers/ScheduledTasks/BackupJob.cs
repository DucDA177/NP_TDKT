using Microsoft.AspNet.SignalR;
using Quartz;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using WebApiCore.Models;

namespace WebApiCore.Controllers.ScheduledTasks
{
    public class BackupJob : IJob
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        public Task Execute(IJobExecutionContext context)
        {
            //BackupRestoreController bkrs = new BackupRestoreController();
            //bkrs.AutoBackUp();
            

            throw new NotImplementedException();
        }
       
    }
}