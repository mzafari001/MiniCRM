using MiniCRMBackend.Enums;

namespace MiniCRMBackend.DTOs.Customers
{
    public class UpdateCustomerDto
    {
        public required  string FullName { get; set; }
        public required  string Phone { get; set; }
        public string? Email { get; set; }
        public string? Company { get; set; }
        public int? UserId { get; set; }
        public CustomerStatus Status { get; set; }
    }
}