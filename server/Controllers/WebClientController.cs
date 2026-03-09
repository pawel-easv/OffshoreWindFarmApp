using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using StateleSSE.AspNetCore;

namespace server.Controllers;

public class WebClientController(
    ISseBackplane backplane,
    WindmillService windmillService
) : RealtimeControllerBase(backplane)
{
    private Guid CurrentUserId => Guid.Parse(User.FindFirst("Id")?.Value
                                             ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

    [HttpGet(nameof(SetReportingInterval))]
    public async Task SetReportingInterval(string turbineId, int interval) =>
        await windmillService.SendCommand(turbineId, CurrentUserId, new Command
        {
            action = "setInterval",
            value = interval
        });

    [HttpGet(nameof(StopTurbine))]
    public async Task StopTurbine(string turbineId, string? reason) =>
        await windmillService.SendCommand(turbineId, CurrentUserId, new Command
        {
            action = "stop",
            reason = reason ?? "No reason provided"
        });

    [HttpGet(nameof(StartTurbine))]
    public async Task StartTurbine(string turbineId) =>
        await windmillService.SendCommand(turbineId, CurrentUserId, new Command
        {
            action = "start"
        });

    [HttpGet(nameof(SetBladePitch))]
    public async Task SetBladePitch(string turbineId, double angle) =>
        await windmillService.SendCommand(turbineId, CurrentUserId, new Command
        {
            action = "setPitch",
            angle = angle
        });
}