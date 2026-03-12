using Microsoft.AspNetCore.Authorization;
using Mqtt.Controllers;
using server.Models;

namespace server.Controllers;

public class IotController (AppDbContext db): MqttController
{

    [AllowAnonymous]
    [MqttRoute("farm/pawel/windmill/{turbineId}/telemetry")]
    public async Task SubscribeToTelemetry(TurbineTelemetry data, string turbineId)
    {
        data.Id = Guid.NewGuid();
        db.TurbineTelemetries.Add(data);
        await db.SaveChangesAsync();
    }

    [AllowAnonymous]
    [MqttRoute("farm/pawel/windmill/{turbineId}/alert")]
    public async Task SubscribeToAlerts(TurbineAlert data, string turbineId)
    {
        data.Id = Guid.NewGuid();
        db.TurbineAlerts.Add(data);
        await db.SaveChangesAsync();
    }
}