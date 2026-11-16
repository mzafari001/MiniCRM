using MiniCRMBackend.Enums;

namespace MiniCRMBackend.DTOs.Activities
{
    public class CreateActivityDto
    {

        public int CustomerId { get; set; }
        public ActivityType Type { get; set; }
        public string Note { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public bool IsCompleted { get; set; }
    }
}
