namespace MiniCRMBackend.DTOs.Dashboard
{
    public sealed class DashboardSummaryDto
    {


        public int TotalCustomers { get; set; }
        public int LeadsCount { get; set; }          // تعداد سرنخ‌ها (CustomerStatus.Lead)
        public int ActiveCount { get; set; }         // مشتریان فعال (CustomerStatus.Active)
        public int InactiveCount { get; set; }       // مشتریان غیرفعال (CustomerStatus.Inactive)
        public int NewCustomersLast7Days { get; set; }

        public List<RecentCustomerDto> RecentCustomers { get; set; } = [];
    }
}
