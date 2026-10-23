
using MiniCRMBackend.Entities;
using Microsoft.EntityFrameworkCore;
namespace MiniCRMBackend.DBcontextes;
// namespace MiniCRMBackend.DBcontextes;

    
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {

        public DbSet<User> Users => Set<User>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Activity> Activities => Set<Activity>();
        public DbSet<Opportunity> Opportunities => Set<Opportunity>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // تنظیم دقت فیلد اعشاری مبلغ معامله
            modelBuilder.Entity<Opportunity>()
                .Property(o => o.Amount)
                .HasPrecision(18, 2);

            // اجباری بودن و محدودیت طول شماره تماس مشتری
            modelBuilder.Entity<Customer>()
                .Property(c => c.Phone)
                .IsRequired()
                .HasMaxLength(20);

            // یکتا بودن ایمیل کاربران سیستم
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // حفظ مشتریان در صورت حذف کارشناس فروش
            modelBuilder.Entity<Customer>()
                .HasOne(c => c.User)
                .WithMany(u => u.Customers)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }

