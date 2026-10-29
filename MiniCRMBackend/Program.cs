
using Microsoft.EntityFrameworkCore;
using MiniCRMBackend.DBcontextes;
using MiniCRMBackend.Endpoints;
using Scalar.AspNetCore;


var builder = WebApplication.CreateBuilder(args);

// Database connection
var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=DBFiles/MiniCrm.sqlite";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// CORS configuration for Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
{
    options.WithTitle("Mini CRM API");
});
}

app.UseHttpsRedirection();
app.UseCors("AllowAngular");

// Test endpoint
// app.MapGet("/yy", () =>
// {
//     return Results.Ok(new
//     {
//         message = "Backend is running."
//     });
// });

app.MapCustomerEndpoints();
app.MapDashboardEndpoints();
app.Run();