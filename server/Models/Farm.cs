using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Farm
{
    public string Id { get; set; } = null!;

    public string DisplayName { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<TurbineAlert> TurbineAlerts { get; set; } = new List<TurbineAlert>();

    public virtual ICollection<TurbineTelemetry> TurbineTelemetries { get; set; } = new List<TurbineTelemetry>();

    public virtual ICollection<Turbine> Turbines { get; set; } = new List<Turbine>();
}
