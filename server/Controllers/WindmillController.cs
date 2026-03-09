using Mqtt.Controllers;
using server.Models;

namespace server.Controllers;

public class WindmillController (AppDbContext db): MqttController
{

    [MqttRoute("farm/pawel/windmill/{turbineId}/telemetry")]
    public async Task SubscribeToTelemetry(TurbineTelemetry data, string turbineId)
    {
        data.Id = Guid.NewGuid();
        db.TurbineTelemetries.Add(data);
        await db.SaveChangesAsync();
    }

    [MqttRoute("farm/pawel/windmill/{turbineId}/alert")]
    public async Task SubscribeToAlerts(TurbineAlert data, string turbineId)
    {
        data.Id = Guid.NewGuid();
        db.TurbineAlerts.Add(data);
        await db.SaveChangesAsync();
    }
}