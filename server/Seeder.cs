using System.Text;
using Isopoh.Cryptography.Argon2;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server;

public class Seeder(AppDbContext ctx, ILogger<Seeder> logger)
{
    public void Seed()
    {
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
    }
}