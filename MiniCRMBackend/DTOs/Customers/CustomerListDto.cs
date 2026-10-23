using MiniCRMBackend.Enums;

namespace MiniCRMBackend.DTOs.Customers
{
    public class CustomerListDto
    {
        public int Id { get; set; }
        public required string FullName { get; set; } 
        public required string Phone { get; set; }         public string? Email { get; set; }
        public string? Company { get; set; }
        public CustomerStatus Status { get; set; }
        public int? UserId { get; set; }
        public DateTime CreatedAt { get; set; }
      
    }
}