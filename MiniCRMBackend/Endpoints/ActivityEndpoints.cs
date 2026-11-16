using Microsoft.EntityFrameworkCore;
using MiniCRMBackend.DBcontextes;
using MiniCRMBackend.DTOs.Activities;
using MiniCRMBackend.Entities;

namespace MiniCRMBackend.Endpoints
{
    public static class ActivityEndpoints
    {
        public static RouteGroupBuilder MapActivityEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/activities").WithTags("Activities");

            // 1. گرفتن لیست وقایع مربوط به یک مشتری خاص
            group.MapGet("/customer/{customerId:int}", async (int customerId, AppDbContext db) =>
            {
                var activities = await db.Activities
                    .AsNoTracking()
                    .Where(a => a.CustomerId == customerId)
                    .OrderByDescending(a => a.CreatedAt)
                    .ToListAsync();

                return Results.Ok(activities);
            });

            // 2. ثبت واقعه‌ی جدید
            group.MapPost("/", async (CreateActivityDto dto, AppDbContext db) =>
            {
                // بررسی وجود مشتری
                var customerExists = await db.Customers.AnyAsync(c => c.Id == dto.CustomerId);
                if (!customerExists)
                {
                    return Results.NotFound(new { message = "مشتری مورد نظر یافت نشد." });
                }

                var activity = new Activity
                {
                    CustomerId = dto.CustomerId,
                    Type = dto.Type,
                    Note = dto.Note,
                    DueDate = dto.DueDate,
                    IsCompleted = dto.IsCompleted,
                    CreatedAt = DateTime.UtcNow
                };

                db.Activities.Add(activity);
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "واقعه با موفقیت ثبت شد.", id = activity.Id });
            });

            return group;
        }
    }
}