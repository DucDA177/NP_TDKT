using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using WebApiCore.Models;

namespace WebApiCore.Controllers.ScheduledTasks
{
    public class JobScheduler
    {
        public static void StartBackup()
        {
            string text = File.ReadAllText(Path.Combine(HttpRuntime.AppDomainAppPath, "BackupConfig.json"));
            var model = Newtonsoft.Json.JsonConvert.DeserializeObject<ModelConfigBackup>(text);
            if ( model == null || !model.isActive )
                return;

            IScheduler scheduler = StdSchedulerFactory.GetDefaultScheduler().GetAwaiter().GetResult();

            scheduler.Start();

            IJobDetail job = JobBuilder.Create<BackupJob>().Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithDailyTimeIntervalSchedule
                  (s =>
                     // s.WithIntervalInHours(24)
                     //.OnEveryDay()
                     //.StartingDailyAt(TimeOfDay.HourAndMinuteOfDay(hour, min))

                     s.WithIntervalInHours(24)
                    .OnEveryDay()
                    .StartingDailyAt(TimeOfDay.HourAndMinuteOfDay(model.hour, model.min))
                  )

                .Build();
            
            scheduler.ScheduleJob(job, trigger);
        }
      
    }
}