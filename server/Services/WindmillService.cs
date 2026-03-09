using System.Text.Json;
using Mqtt.Controllers;
using server.Models;

public class WindmillService(IMqttClientService clientService, AppDbContext db)
{
    public async Task SendCommand(string turbineId, Guid userId, Command command)
    {
        var operatorCommand = new OperatorCommand
        {
            UserId = userId,
            Action = command.action,
            Reason = command.reason,
            Angle = command.angle,
            IntervalValue = command.value
        };

        db.OperatorCommands.Add(operatorCommand);
        await clientService.PublishAsync(
            $"farm/pawel/windmill/{turbineId}/command",
            JsonSerializer.Serialize(command));
        await db.SaveChangesAsync();
    }

}