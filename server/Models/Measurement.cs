using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Measurement
{
    public Guid Id { get; set; }

    public string StationId { get; set; } = null!;

    public string SensorId { get; set; } = null!;

    public DateTime Timestamp { get; set; }

    public double Temperature { get; set; }

    public double Humidity { get; set; }

    public double Pressure { get; set; }

    public int LightLevel { get; set; }
}
