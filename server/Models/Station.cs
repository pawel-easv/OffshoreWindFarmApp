using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Station
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string CreatedBy { get; set; } = null!;
}
