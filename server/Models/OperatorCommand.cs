using System;
using System.Collections.Generic;

namespace server.Models;

public partial class OperatorCommand
{
    public Guid Id { get; set; }

    public string Turbine { get; set; } = null!;

    public Guid UserId { get; set; }

    public string Action { get; set; } = null!;

    public string? Reason { get; set; }

    public double? Angle { get; set; }

    public int? IntervalValue { get; set; }

    public DateTime ExecutedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
