using Microsoft.EntityFrameworkCore;
using MiniCRMBackend.DBcontextes;
using MiniCRMBackend.DTOs.Common;
using MiniCRMBackend.DTOs.Customers;
using MiniCRMBackend.Entities;

namespace MiniCRMBackend.Endpoints;

public static class CustomerEndpoints
{
    public static RouteGroupBuilder MapCustomerEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/customers");

        group.MapGet("/list", async (AppDbContext db) =>
        {
            var customers = await db.Customers
                .AsNoTracking()
                .Select(c => new CustomerListDto
                {
                    Id = c.Id,
                    FullName = c.FullName,
                    Phone = c.Phone,
                    Email = c.Email,
                    Company = c.Company,
                    Status = c.Status,
                    UserId = c.UserId,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            return Results.Ok(customers);
        });


        group.MapGet("/details/{id:int}", async (int id, AppDbContext db) =>
        {
            var customer = await db.Customers
                .AsNoTracking()
                .Where(c => c.Id == id)
                .Select(c => new CustomerListDto
                {
                    Id = c.Id,
                    FullName = c.FullName,
                    Phone = c.Phone,
                    Email = c.Email,
                    Company = c.Company,
                    Status = c.Status,
                    UserId = c.UserId,
                    CreatedAt = c.CreatedAt
                })
                .FirstOrDefaultAsync();

            return customer is not null
                ? Results.Ok(customer)
                : Results.NotFound(new CommandResultDto
                {
                    Successful = false,
                    Message = $"مشتری با شناسه {id} یافت نشد."
                });
        });


        // POST: ایجاد مشتری جدید
        group.MapPost("/create", async (CreateCustomerDto dto, AppDbContext db) =>
        {
            var customer = new Customer
            {
                FullName = dto.FullName,
                Phone = dto.Phone,
                Email = dto.Email,
                Company = dto.Company,
                Status = dto.Status,
                UserId = dto.UserId,
                CreatedAt = DateTime.UtcNow
            };

            db.Customers.Add(customer);
            await db.SaveChangesAsync();

            var resultDto = new CustomerListDto
            {
                Id = customer.Id,
                FullName = customer.FullName,
                Phone = customer.Phone,
                Email = customer.Email,
                Company = customer.Company,
                Status = customer.Status,
                UserId = customer.UserId,
                CreatedAt = customer.CreatedAt
            };

            // return Results.Created($"/api/v1/customers/{customer.Id}", resultDto);
            return Results.Created(
                   $"/api/v1/customers/details/{customer.Id}",
                   new CommandResultDto
                   {
                       Successful = true,
                       Message = $"مشتری با شناسه {customer.Id} با موفقیت ثبت شد."
                   }
               );
        });

        // PUT: ویرایش مشتری
        group.MapPut("/update/{id:int}", async (int id, UpdateCustomerDto dto, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
            {
                return Results.BadRequest(new CommandResultDto
                {
                    Successful = false,
                    Message = "نام مشتری الزامی است."
                });
            }

            if (string.IsNullOrWhiteSpace(dto.Phone))
            {
                return Results.BadRequest(new CommandResultDto
                {
                    Successful = false,
                    Message = "شماره تلفن مشتری الزامی است."
                });
            }
            var customer = await db.Customers.FindAsync(id);
            if (customer is null)
            {
                // return Results.NotFound(new { message = $"مشتری با شناسه {id} یافت نشد." });د
                return Results.BadRequest(new CommandResultDto
                {
                    Successful = false,
                    Message = $"مشتری با شناسه {id} یافت نشد."
                });
            }

            customer.FullName = dto.FullName;
            customer.Phone = dto.Phone;
            customer.Email = dto.Email;
            customer.Company = dto.Company;
            customer.Status = dto.Status;
            customer.UserId = dto.UserId;

            await db.SaveChangesAsync();

            return Results.Ok(new CommandResultDto
            {
                Successful = true,
                Message = "مشتری با موفقیت ویرایش شد."
            });
        });
        group.MapDelete("/remove/{id:int}", async (int id, AppDbContext db) =>
        {
            var customer = await db.Customers.FindAsync(id);
            if (customer is null)
            {
                return Results.NotFound(new CommandResultDto
                {
                    Successful = false,
                    Message = $"مشتری با شناسه {id} یافت نشد."
                });
            }

            db.Customers.Remove(customer);
            await db.SaveChangesAsync();

            return Results.Ok(new CommandResultDto
            {
                Successful = true,
                Message = "مشتری با موفقیت حذف شد."
            });
        });

        return group;
    }
}
