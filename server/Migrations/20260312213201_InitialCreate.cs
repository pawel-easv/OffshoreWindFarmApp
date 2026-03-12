using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:uuid-ossp", ",,");

            migrationBuilder.CreateTable(
                name: "turbines",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    farm_id = table.Column<string>(type: "text", nullable: false),
                    location = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("turbines_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    username = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    role = table.Column<string>(type: "text", nullable: false, defaultValueSql: "'inspector'::text"),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("users_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "turbine_alerts",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    turbine_id = table.Column<string>(type: "text", nullable: false),
                    farm_id = table.Column<string>(type: "text", nullable: false),
                    severity = table.Column<string>(type: "text", nullable: false),
                    message = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("turbine_alerts_pkey", x => x.id);
                    table.ForeignKey(
                        name: "turbine_alerts_turbines_id_fk",
                        column: x => x.turbine_id,
                        principalTable: "turbines",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "turbine_telemetry",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    turbine_id = table.Column<string>(type: "text", nullable: false),
                    farm_id = table.Column<string>(type: "text", nullable: false),
                    wind_speed = table.Column<double>(type: "double precision", nullable: true),
                    wind_direction = table.Column<double>(type: "double precision", nullable: true),
                    ambient_temperature = table.Column<double>(type: "double precision", nullable: true),
                    rotor_speed = table.Column<double>(type: "double precision", nullable: true),
                    power_output = table.Column<double>(type: "double precision", nullable: true),
                    nacelle_direction = table.Column<double>(type: "double precision", nullable: true),
                    blade_pitch = table.Column<double>(type: "double precision", nullable: true),
                    generator_temp = table.Column<double>(type: "double precision", nullable: true),
                    gearbox_temp = table.Column<double>(type: "double precision", nullable: true),
                    vibration = table.Column<double>(type: "double precision", nullable: true),
                    status = table.Column<string>(type: "text", nullable: false, defaultValueSql: "'running'::text")
                },
                constraints: table =>
                {
                    table.PrimaryKey("turbine_telemetry_pkey", x => new { x.id, x.timestamp });
                    table.ForeignKey(
                        name: "turbine_telemetry_turbines_id_fk",
                        column: x => x.turbine_id,
                        principalTable: "turbines",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "operator_commands",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    turbine_id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    action = table.Column<string>(type: "text", nullable: false),
                    reason = table.Column<string>(type: "text", nullable: true),
                    angle = table.Column<double>(type: "double precision", nullable: true),
                    interval_value = table.Column<int>(type: "integer", nullable: true),
                    executed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("operator_commands_pkey", x => x.id);
                    table.ForeignKey(
                        name: "operator_commands_turbine_id_fkey",
                        column: x => x.turbine_id,
                        principalTable: "turbines",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "operator_commands_user_id_fkey",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "idx_commands_turbine",
                table: "operator_commands",
                columns: new[] { "turbine_id", "executed_at" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "idx_commands_user",
                table: "operator_commands",
                columns: new[] { "user_id", "executed_at" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "IX_turbine_alerts_turbine_id",
                table: "turbine_alerts",
                column: "turbine_id");

            migrationBuilder.CreateIndex(
                name: "idx_telemetry_turbine_time",
                table: "turbine_telemetry",
                columns: new[] { "turbine_id", "timestamp" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "users_email_key",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "users_username_key",
                table: "users",
                column: "username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "operator_commands");

            migrationBuilder.DropTable(
                name: "turbine_alerts");

            migrationBuilder.DropTable(
                name: "turbine_telemetry");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "turbines");
        }
    }
}
