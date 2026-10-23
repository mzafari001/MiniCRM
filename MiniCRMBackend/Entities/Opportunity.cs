using MiniCRMBackend.Entities.Base;
using MiniCRMBackend.Enums;

namespace MiniCRMBackend.Entities;

public class Opportunity :Thing
{
    
    public required string Title { get; set; } 
    public decimal Amount { get; set; }
    public OpportunityStage Stage { get; set; } = OpportunityStage.New;
    public DateTime? ExpectedCloseDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;
}