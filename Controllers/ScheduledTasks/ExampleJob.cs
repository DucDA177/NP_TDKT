using Microsoft.AspNet.SignalR;
using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace WebApiCore.Controllers.ScheduledTasks
{
    public class ExampleJob : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            
           // HandleJob.StopAllOtherJobs(context);

            GlobalHost.ConnectionManager.GetHubContext<HubStore.UserActivityHub>().Clients.All.receive(1, "Job1");
            throw new NotImplementedException();
        }
    }
    public class ExampleJob2 : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            HandleJob.StopAllOtherJobs(context);

            GlobalHost.ConnectionManager.GetHubContext<HubStore.UserActivityHub>().Clients.All.receive(1, "Job2");
            throw new NotImplementedException();
        }
    }
    public static class HandleJob
    {
        public static void StopAllOtherJobs(IJobExecutionContext context)
        {
            // construct a scheduler factory
            ISchedulerFactory schedFact = new StdSchedulerFactory();
            // get a scheduler, start the schedular before triggers or anything else
            var sched = schedFact.GetScheduler().GetAwaiter().GetResult();
            var executingJobs = sched.GetCurrentlyExecutingJobs().GetAwaiter().GetResult().Where(t=>t!= context);
            if ( executingJobs.Any() )
            {
                foreach ( var job in executingJobs )
                {
                    sched.Interrupt(job.JobDetail.Key);
                    sched.UnscheduleJob(job.Trigger.Key);
                    sched.DeleteJob(job.JobDetail.Key);
                }
                sched.Clear();
            }

        }
    }
}