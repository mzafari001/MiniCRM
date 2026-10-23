using MiniCRMBackend.Entities.Base;
using MiniCRMBackend.Enums;

namespace MiniCRMBackend.Entities
{

    public class User : Thing
    {

        public required string FullName { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public UserRole Role { get; set; } = UserRole.User;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Customer> Customers { get; set; } = [];
        public ICollection<Activity> Activities { get; set; } = [];

    }
}
