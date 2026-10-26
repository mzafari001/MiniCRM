using Microsoft.EntityFrameworkCore;
using MiniCRMBackend.DBcontextes;
using MiniCRMBackend.DTOs.Dashboard;
using MiniCRMBackend.Enums;

namespace MiniCRMBackend.Endpoints;

public static class DashboardEndpoints
{
    public static RouteGroupBuilder MapDashboardEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/dashboard");

        group.MapGet("/summary", async (AppDbContext db) =>
        {
            var now = DateTime.UtcNow;
            var last7Days = now.AddDays(-7);

            // آمار شمارش بر اساس وضعیت‌های واقعی
            var totalCustomers = await db.Customers.AsNoTracking().CountAsync();
            var leadsCount = await db.Customers.AsNoTracking().CountAsync(c => c.Status == CustomerStatus.Lead);
            var activeCount = await db.Customers.AsNoTracking().CountAsync(c => c.Status == CustomerStatus.Active);
            var inactiveCount = await db.Customers.AsNoTracking().CountAsync(c => c.Status ==CustomerStatus.Inactive);
            
            var newLast7Days = await db.Customers.AsNoTracking().CountAsync(c => c.CreatedAt >= last7Days);

            // ۵ مشتری آخر ثبت‌شده
            var recentCustomers = await db.Customers
                .AsNoTracking()
                .OrderByDescending(c => c.CreatedAt)
                .Take(5)
                .Select(c => new RecentCustomerDto
                {
                    Id = c.Id,
                    FullName = c.FullName,
                    Phone = c.Phone,
                    Company = c.Company,
                    Status = (int)c.Status,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            var dto = new DashboardSummaryDto
            {
                TotalCustomers = totalCustomers,
                LeadsCount = leadsCount,
                ActiveCount = activeCount,
                InactiveCount = inactiveCount,
                NewCustomersLast7Days = newLast7Days,
                RecentCustomers = recentCustomers
            };

            return Results.Ok(dto);
        });

        return group;
    }
}
