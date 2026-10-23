using MiniCRMBackend.Enums;

namespace MiniCRMBackend.DTOs.Customers
{
    public class CreateCustomerDto
    {
        public required string FullName { get; set; }
        public required string Phone { get; set; }
        public string? Email { get; set; }
        public string? Company { get; set; }
        public CustomerStatus Status { get; set; } = CustomerStatus.Lead; 
        public int? UserId { get; set; }
    }
}