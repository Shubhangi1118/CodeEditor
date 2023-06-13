using CodeEditor;
using Autofac.Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Contest;
using Main.Supervisor;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/build";
});
//builder.Services.Configure<Participant>(
//   builder.Configuration.GetSection("User2Database"));
builder.Services.AddScoped<ParticipantSupervisor>();
builder.Services.AddScoped<IParticipant, Participant>();
builder.Services.AddSingleton<Participant>();
builder.Services.AddScoped<EditorSupervisor>();
builder.Services.AddScoped<IEditor,Editor>();
builder.Services.AddSingleton<Editor>();
builder.Services.AddScoped<ResultSupervisor>();
builder.Services.AddScoped<IResult,Result>();
builder.Services.AddSingleton<Result>();
builder.Services.AddScoped<CompilerRunSupervisor>();
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
