using CodeEditor;
using CodeEditor.Models;
using CodeEditor.Services;
using Autofac.Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
//builder.Services.AddScoped<IService, Service>();

builder.Services.AddControllersWithViews();
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/build";
});
builder.Services.Configure<EditorSetting>(
   builder.Configuration.GetSection("User1Database"));
builder.Services.Configure<ParticipantSetting>(
   builder.Configuration.GetSection("User2Database"));
builder.Services.Configure<ResultSetting>(
   builder.Configuration.GetSection("User3Database"));
builder.Services.AddSingleton<EditorService>();
builder.Services.AddSingleton<ParticipantService>();
builder.Services.AddSingleton<ResultService>();
var app = builder.Build();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSpaStaticFiles();
app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");
});
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";

    if (app.Environment.IsDevelopment())
    {
        spa.UseReactDevelopmentServer(npmScript: "start");
    }
});
app.Run();
