namespace MiniCRMBackend.Enums
{
    public enum OpportunityStage
    {
        New = 1,          // فرصت جدید
        InProgress = 2,   // در حال مذاکره / پیگیری
        Won = 3,          // موفق (فروش انجام شد)
        Lost = 4          // ناموفق (لغو یا رد شد)
    }
}