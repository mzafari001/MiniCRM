namespace MiniCRMBackend.DTOs.Dashboard
{
    public sealed class RecentCustomerDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Company { get; set; }
        public int Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}