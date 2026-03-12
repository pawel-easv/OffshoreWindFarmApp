using System.Text;
using Isopoh.Cryptography.Argon2;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server;

public class Seeder(AppDbContext ctx, ILogger<Seeder> logger)
{
    public void Seed()
    {
        // existing user seeding...
        var exists = ctx.Users.Any();
        if (!exists)
        { 
            var password = "pass";
            ctx.Users.Add(new User()
            {
                Id = Guid.NewGuid(),
                Username = "test",
                Email = "email",
                PasswordHash = Argon2.Hash(password)
            });
            ctx.SaveChanges();
        }

        // seed turbines
        if (!ctx.Turbines.Any())
        {
            ctx.Turbines.AddRange(
                new Turbine { Id = "turbine-alpha", Name = "Alpha", Location = "North Platform", FarmId = "farm-pawel" },
                new Turbine { Id = "turbine-beta",  Name = "Beta",  Location = "North Platform", FarmId = "farm-pawel" },
                new Turbine { Id = "turbine-gamma", Name = "Gamma", Location = "South Platform", FarmId = "farm-pawel" },
                new Turbine { Id = "turbine-delta", Name = "Delta", Location = "East Platform",  FarmId = "farm-pawel" }
            );
            ctx.SaveChanges();
        }
    }
}