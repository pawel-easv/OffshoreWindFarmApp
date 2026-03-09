using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Turbine
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string FarmId { get; set; } = null!;

    public string Location { get; set; } = null!;

    public virtual ICollection<OperatorCommand> OperatorCommands { get; set; } = new List<OperatorCommand>();

    public virtual ICollection<TurbineAlert> TurbineAlerts { get; set; } = new List<TurbineAlert>();

    public virtual ICollection<TurbineTelemetry> TurbineTelemetries { get; set; } = new List<TurbineTelemetry>();
}
