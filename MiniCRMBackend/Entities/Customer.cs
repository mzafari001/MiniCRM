using MiniCRMBackend.Entities.Base;
using MiniCRMBackend.Enums;

namespace MiniCRMBackend.Entities
{
    public class Customer : Thing
    {
        
    
        public required string FullName { get; set; }
        public string? Email { get; set; }
        public required string Phone { get; set; }
        public string? Company { get; set; }
        public CustomerStatus Status { get; set; } = CustomerStatus.Lead;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ارتباط با کاربری که این مشتری به او اختصاص دارد
        public int? UserId { get; set; }
        public User? User { get; set; }

        // روابط با فعالیت‌ها و فرصت‌ها
        public ICollection<Activity> Activities { get; set; } = [];
        public ICollection<Opportunity> Opportunities { get; set; } = [];
    }
}