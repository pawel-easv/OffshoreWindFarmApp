using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace server.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<OperatorCommand> OperatorCommands { get; set; }

    public virtual DbSet<Turbine> Turbines { get; set; }

    public virtual DbSet<TurbineAlert> TurbineAlerts { get; set; }

    public virtual DbSet<TurbineTelemetry> TurbineTelemetries { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=ConnectionStrings:DbConnectionString");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("uuid-ossp");

        modelBuilder.Entity<OperatorCommand>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("operator_commands_pkey");

            entity.ToTable("operator_commands");

            entity.HasIndex(e => new { e.TurbineId, e.ExecutedAt }, "idx_commands_turbine").IsDescending(false, true);

            entity.HasIndex(e => new { e.UserId, e.ExecutedAt }, "idx_commands_user").IsDescending(false, true);

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Action).HasColumnName("action");
            entity.Property(e => e.Angle).HasColumnName("angle");
            entity.Property(e => e.ExecutedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("executed_at");
            entity.Property(e => e.IntervalValue).HasColumnName("interval_value");
            entity.Property(e => e.Reason).HasColumnName("reason");
            entity.Property(e => e.TurbineId).HasColumnName("turbine_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Turbine).WithMany(p => p.OperatorCommands)
                .HasForeignKey(d => d.TurbineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("operator_commands_turbine_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.OperatorCommands)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("operator_commands_user_id_fkey");
        });

        modelBuilder.Entity<Turbine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("turbines_pkey");

            entity.ToTable("turbines");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FarmId).HasColumnName("farm_id");
            entity.Property(e => e.Location).HasColumnName("location");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<TurbineAlert>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("turbine_alerts_pkey");

            entity.ToTable("turbine_alerts");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.FarmId).HasColumnName("farm_id");
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.Severity).HasColumnName("severity");
            entity.Property(e => e.Timestamp).HasColumnName("timestamp");
            entity.Property(e => e.TurbineId).HasColumnName("turbine_id");

            entity.HasOne(d => d.Turbine).WithMany(p => p.TurbineAlerts)
                .HasForeignKey(d => d.TurbineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("turbine_alerts_turbines_id_fk");
        });

        modelBuilder.Entity<TurbineTelemetry>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.Timestamp }).HasName("turbine_telemetry_pkey");

            entity.ToTable("turbine_telemetry");

            entity.HasIndex(e => new { e.TurbineId, e.Timestamp }, "idx_telemetry_turbine_time").IsDescending(false, true);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Timestamp).HasColumnName("timestamp");
            entity.Property(e => e.AmbientTemperature).HasColumnName("ambient_temperature");
            entity.Property(e => e.BladePitch).HasColumnName("blade_pitch");
            entity.Property(e => e.FarmId).HasColumnName("farm_id");
            entity.Property(e => e.GearboxTemp).HasColumnName("gearbox_temp");
            entity.Property(e => e.GeneratorTemp).HasColumnName("generator_temp");
            entity.Property(e => e.NacelleDirection).HasColumnName("nacelle_direction");
            entity.Property(e => e.PowerOutput).HasColumnName("power_output");
            entity.Property(e => e.RotorSpeed).HasColumnName("rotor_speed");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'running'::text")
                .HasColumnName("status");
            entity.Property(e => e.TurbineId).HasColumnName("turbine_id");
            entity.Property(e => e.Vibration).HasColumnName("vibration");
            entity.Property(e => e.WindDirection).HasColumnName("wind_direction");
            entity.Property(e => e.WindSpeed).HasColumnName("wind_speed");

            entity.HasOne(d => d.Turbine).WithMany(p => p.TurbineTelemetries)
                .HasForeignKey(d => d.TurbineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("turbine_telemetry_turbines_id_fk");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();

            entity.HasIndex(e => e.Username, "users_username_key").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
            entity.Property(e => e.Role)
                .HasDefaultValueSql("'inspector'::text")
                .HasColumnName("role");
            entity.Property(e => e.Username).HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
