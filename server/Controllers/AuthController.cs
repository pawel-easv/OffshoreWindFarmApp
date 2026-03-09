using System.ComponentModel.DataAnnotations;
using Isopoh.Cryptography.Argon2;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, JwtService jwtService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost(nameof(Register))]
    public async Task<AuthResponse> Register([FromBody] RegisterRequest request)
    {
        if (await db.Users.AnyAsync(u => u.Email == request.Email))
            throw new ValidationException("Email already exists.");

        var passwordHash = Argon2.Hash(request.Password);

        var user = new User
        {
            Email    = request.Email,
            Username = request.Username,
            PasswordHash = passwordHash,
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var token = jwtService.GenerateToken(user);
        return new AuthResponse(token, user.Id, user.Username, user.Email);
    }

    [AllowAnonymous]
    [HttpPost(nameof(Login))]
    public async Task<AuthResponse> Login([FromBody] LoginRequest request)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user is null || !Argon2.Verify(user.PasswordHash, request.Password))
            throw new ValidationException("Invalid credentials.");

        var token = jwtService.GenerateToken(user);
        return new AuthResponse(token, user.Id, user.Username, user.Email);
    }

    [HttpGet(nameof(WhoAmI))]
    public async Task<User> WhoAmI()
    {
        var userId = jwtService.GetUserId(User);
        if (userId is null) throw new ValidationException("Not authenticated.");

        var user = await db.Users.FindAsync(userId);
        if (user is null) throw new ValidationException("User not found.");

        return user;
    }
}


public record RegisterRequest(string Username, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, Guid Id, string Username, string Email);