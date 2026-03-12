using System.Text.Json;
using Mqtt.Controllers;
using server.Models;

public class WindmillService(IMqttClientService clientService, AppDbContext db)
{
    public async Task SendCommand(string turbineId, Guid userId, ITurbineCommand command)
    {
        var operatorCommand = new OperatorCommand
        {
            Id = Guid.NewGuid(),
            TurbineId = turbineId,
            UserId = userId,
            Action = command.action,
            Reason = command is TurbineCommands.Stop stop ? stop.reason : null,
            Angle = command is TurbineCommands.SetPitch pitch ? pitch.angle : null,
            IntervalValue = command is TurbineCommands.SetInterval interval ? interval.value : null
        };

        db.OperatorCommands.Add(operatorCommand);

        await clientService.PublishAsync(
            $"farm/pawel/windmill/{turbineId}/command",
            JsonSerializer.Serialize(command, command.GetType()));

        await db.SaveChangesAsync();
    }
}