using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.OAuth;
using Owin;
using WebApiCore.Providers;
using WebApiCore.Models;
using Microsoft.Owin.Security.Facebook;
using WebApiCore.Controllers;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace WebApiCore
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context and user manager to use a single instance per request
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Configure the application for OAuth based flow
            PublicClientId = "self";
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(60),
                // In production mode set AllowInsecureHttp = false
                AllowInsecureHttp = true
            };

            // Enable the application to use bearer tokens to authenticate users
             app.UseOAuthBearerTokens(OAuthOptions);
           
            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //    consumerKey: "",
            //    consumerSecret: "");

            //app.UseFacebookAuthentication(
            // appId: "296791257615702",
            // appSecret: "fdbd69766f14fe28dfe430696d496ae1");

            var facebookOptions = new FacebookAuthenticationOptions()
            {
                AppId = "296791257615702",
                AppSecret = "fdbd69766f14fe28dfe430696d496ae1",
                Scope = { "email", "public_profile" }
            };
            facebookOptions.Provider = new FacebookAuthenticationProvider()
            {
                OnAuthenticated = (context) =>
                {
                    context.Identity.AddClaim(new Claim("urn:facebook:access_token", context.AccessToken, ClaimValueTypes.String, "Facebook"));
                    context.Identity.AddClaim(new Claim("urn:facebook:email", context.Email, ClaimValueTypes.Email, "Facebook"));
                    return Task.FromResult(0);
                }
            };
            app.UseFacebookAuthentication(facebookOptions);
            //app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            //{
            //    ClientId = "800873577526-nvklkufdj4q09okjfsfie2o973h4d68c.apps.googleusercontent.com",
            //    ClientSecret = "YC98Wv9BBnNsO-Gen4Puercf"
            //});

            
        }
    }
}
