using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.EfRealtime;

namespace server.Controllers;

public class WebClientController(
    ISseBackplane backplane,
    WindmillService windmillService,
    AppDbContext db, IRealtimeManager realtimeManager
) : RealtimeControllerBase(backplane)
{
    private Guid CurrentUserId => Guid.Parse(User.FindFirst("Id")?.Value
                                             ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

    [HttpGet(nameof(SetReportingInterval))]
    public async Task SetReportingInterval(string turbineId, int interval)
    {
        if (interval < 1 || interval > 60)
            throw new ArgumentException("Interval must be between 1 and 60 seconds.");

        await windmillService.SendCommand(
            turbineId,
            CurrentUserId,
            new TurbineCommands.SetInterval { value = interval });
    }

    [HttpPost(nameof(SimulateAlert))]
    public async Task SimulateAlert(string turbineId)
    {
        var severities = new[] { "info", "warning", "critical" };
        var messages = new[]
        {
            "High vibration detected",
            "Generator temperature elevated",
            "Wind speed exceeding rated limit",
            "Gearbox oil pressure low",
            "Blade pitch motor fault",
            "Grid connection unstable",
            "Rotor imbalance detected",
            "Cooling system warning"
        };

        var rng = new Random();
        var alert = new TurbineAlert
        {
            Id        = Guid.NewGuid(),
            TurbineId = turbineId,
            FarmId    = "pawel",
            Severity  = severities[rng.Next(severities.Length)],
            Message   = messages[rng.Next(messages.Length)],
            Timestamp = DateTime.UtcNow
        };

        db.TurbineAlerts.Add(alert);
        await db.SaveChangesAsync();
    }
    
    [HttpGet(nameof(SetBladePitch))]
    public async Task SetBladePitch(string turbineId, double angle)
    {
        if (angle < 0 || angle > 30)
            throw new ArgumentException("Blade pitch angle must be between 0 and 30 degrees.");

        await windmillService.SendCommand(
            turbineId,
            CurrentUserId,
            new TurbineCommands.SetPitch { angle = angle });
    }

    [HttpGet(nameof(StopTurbine))]
    public async Task StopTurbine(string turbineId, string? reason) =>
        await windmillService.SendCommand(
            turbineId,
            CurrentUserId,
            new TurbineCommands.Stop
            {
                reason = reason
            });

    [HttpGet(nameof(StartTurbine))]
    public async Task StartTurbine(string turbineId) =>
        await windmillService.SendCommand(
            turbineId,
            CurrentUserId,
            new TurbineCommands.Start());
    
    [AllowAnonymous]
    [HttpGet(nameof(GetTelemetry))]
    public async Task<RealtimeListenResponse<List<TurbineTelemetry>>> GetTelemetry(string connectionId)
    {
        var group = "telemetry";
        await backplane.Groups.AddToGroupAsync(connectionId, group);
        realtimeManager.Subscribe<AppDbContext>(connectionId, group, 
            criteria: snapshot =>
            {
                return snapshot.HasChanges<TurbineTelemetry>();
            },
            query: async context =>
            {
                return context.TurbineTelemetries.ToList();
            }
        );
        return new RealtimeListenResponse<List<TurbineTelemetry>>(group, db.TurbineTelemetries.ToList());
    }
    [HttpGet(nameof(GetTelemetryHistory))]
    public async Task<List<TurbineTelemetry>> GetTelemetryHistory(string turbineId, string timeframe = "1h")
    {
        var cutoff = timeframe switch {
            "1m"  => DateTime.UtcNow.AddMinutes(-1),
            "1h"  => DateTime.UtcNow.AddHours(-1),
            "1d"  => DateTime.UtcNow.AddDays(-1),
            "1w"  => DateTime.UtcNow.AddDays(-7),
            _     => DateTime.UtcNow.AddHours(-1)
        };

        return await db.TurbineTelemetries
            .Where(t => t.TurbineId == turbineId && t.Timestamp >= cutoff)
            .OrderBy(t => t.Timestamp)
            .Take(500)
            .ToListAsync();
    }

    [HttpGet(nameof(GetTurbineTelemetryLive))]
    public async Task<RealtimeListenResponse<List<TurbineTelemetry>>> GetTurbineTelemetryLive(
        string connectionId, string turbineId)
    {
        var group = $"telemetry:{turbineId}";
        await backplane.Groups.AddToGroupAsync(connectionId, group);
    
        realtimeManager.Subscribe<AppDbContext>(connectionId, group,
            criteria: snapshot => snapshot.HasChanges<TurbineTelemetry>(),
            query: async context =>
            {
                return await context.TurbineTelemetries
                    .Where(t => t.TurbineId == turbineId)
                    .OrderBy(t => t.Timestamp)
                    .Take(500)
                    .ToListAsync();
            });

        var initial = await db.TurbineTelemetries
            .Where(t => t.TurbineId == turbineId)
            .OrderBy(t => t.Timestamp)
            .Take(500)
            .ToListAsync();

        return new RealtimeListenResponse<List<TurbineTelemetry>>(group, initial);
    }
    
    [HttpGet(nameof(GetAlerts))]
    public async Task<List<TurbineAlert>> GetAlerts(string turbineId)
    {
        return await db.TurbineAlerts
            .Where(a => a.TurbineId == turbineId)
            .OrderByDescending(a => a.Timestamp)
            .Take(50)
            .ToListAsync();
    }
}