using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class Command
{
    [Required]
    public string action { get; set; }
        
    public int value { get; set; }
        
    public string reason { get; set; }
        
    public double angle  { get; set; }
        
}