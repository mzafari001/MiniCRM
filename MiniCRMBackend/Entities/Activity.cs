using MiniCRMBackend.Entities.Base;

using MiniCRMBackend.Enums;

namespace MiniCRMBackend.Entities
{
public class Activity : Thing
{
    public ActivityType Type { get; set; } = ActivityType.Call;
    public string Note { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public bool IsCompleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ارتباط با مشتری
    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    // کاربری که فعالیت را انجام می‌دهد
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
}