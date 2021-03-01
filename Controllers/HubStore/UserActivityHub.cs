using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using WebApiCore.Models;

namespace WebApiCore.Controllers.HubStore
{
    public class UserActivityHub : Hub
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        public static ConcurrentDictionary<string, List<string>> ConnectedUsers = new ConcurrentDictionary<string, List<string>>();
        public static List<Message> lms = new List<Message>();
        public override Task OnConnected()
        {
           
            Trace.TraceInformation("MapHub started. ID: {0}", Context.ConnectionId);

            var userName = Context.User.Identity.Name;
            // Try to get a List of existing user connections from the cache
            List<string> existingUserConnectionIds;
            ConnectedUsers.TryGetValue(userName, out existingUserConnectionIds);

            // happens on the very first connection from the user
            if ( existingUserConnectionIds == null )
            {
                existingUserConnectionIds = new List<string>();
            }

            // First add to a List of existing user connections (i.e. multiple web browser tabs)
            existingUserConnectionIds.Add(Context.ConnectionId);


            // Add to the global dictionary of connected users
            ConnectedUsers.TryAdd(userName, existingUserConnectionIds);

            SendUserList(ConnectedUsers);
            
            return base.OnConnected();
        }
        public override  Task OnDisconnected(bool StopCalled)

        {
             //db.SaveChanges();
            //db.Dispose();
            var userName = Context.User.Identity.Name;

            List<string> existingUserConnectionIds;
            ConnectedUsers.TryGetValue(userName, out existingUserConnectionIds);

            // remove the connection id from the List 
            existingUserConnectionIds.Remove(Context.ConnectionId);

            // If there are no connection ids in the List, delete the user from the global cache (ConnectedUsers).
            if ( existingUserConnectionIds.Count == 0 )
            {
                // if there are no connections for the user,
                // just delete the userName key from the ConnectedUsers concurent dictionary
                List<string> garbage; 
                ConnectedUsers.TryRemove(userName, out garbage);
            }

            SendUserList(ConnectedUsers);
            //db.Messages.AddRange(lms);
            //lms.Clear();
            //await db.SaveChangesAsync();
            return base.OnDisconnected(StopCalled);
            
        }

        #region Hub người dùng online
        public void SendUserList(ConcurrentDictionary<string, List<string>> users)
        {
            Clients.All.updateUserList(users);
        }
        #endregion
        #region Hub đẩy thông báo

        public void Push(long id, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.receive(id, message);
        }
        public void SendMes(string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.getMes(message);
        }
        #endregion

        #region Hub gửi tin nhắn
        public void Send(UserProfile userSend, string message, UserProfile userRecv)
        {
           
            IList<string> lsConnId = new List<string>();
            //string name = Context.User.Identity.Name;
            if ( ConnectedUsers.ContainsKey(userSend.UserName) ) lsConnId.Add(ConnectedUsers[userSend.UserName].Last());

            if ( ConnectedUsers.ContainsKey(userRecv.UserName) ) lsConnId.Add(ConnectedUsers[userRecv.UserName].Last());

            Message ms = new Message();
            ms.IdNguoigui = userSend.Id;
            ms.Tinnhan = message;
            ms.IdNguoinhan = userRecv.Id;
            ms.Thoigian = DateTime.Now;
            ms.IsRead = true;
            db.Messages.Add(ms);
            db.SaveChanges();
            //lms.Add(ms);
            Clients.Clients(lsConnId).sendmess(userSend, ms, userRecv);
        }
        public void IsTyping(UserProfile userSend, UserProfile userRecv, bool typingFlag)
        {
           
            IList<string> lsConnId = new List<string>();
            //string name = Context.User.Identity.Name;
            if ( ConnectedUsers.ContainsKey(userSend.UserName) ) lsConnId.Add(ConnectedUsers[userSend.UserName].Last());

            if ( ConnectedUsers.ContainsKey(userRecv.UserName) ) lsConnId.Add(ConnectedUsers[userRecv.UserName].Last());

            Clients.Clients(lsConnId).sendtyping(userSend, userRecv, typingFlag);
            
        }
        public void CheckReadMessage( UserProfile userSend,  Message dt, UserProfile userRecv)
        {
        
            var unmes = db.UnreadMes
                .Where(t => t.IdNguoigui == userSend.Id && t.IdNguoinhan == userRecv.Id).FirstOrDefault();
            if ( unmes != null ) unmes.Count += 1;
            else
            {
                UnreadMe un = new UnreadMe();
                un.IdNguoigui = userSend.Id;
                un.IdNguoinhan = userRecv.Id;
                un.Count = 1;
                db.UnreadMes.Add(un);
            }
            db.SaveChanges();

            List<string> lsConnId = new List<string>();

            if ( ConnectedUsers.ContainsKey(userRecv.UserName) ) lsConnId.AddRange(ConnectedUsers[userRecv.UserName]);


            Clients.Clients(lsConnId).sendnotimes(userSend, dt);


        }
        #endregion


    }
}