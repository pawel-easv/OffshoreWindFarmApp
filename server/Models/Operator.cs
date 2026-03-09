using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Operator
{
    public string Id { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Role { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? LastLoginAt { get; set; }

    public virtual ICollection<OperatorCommand> OperatorCommands { get; set; } = new List<OperatorCommand>();
}
