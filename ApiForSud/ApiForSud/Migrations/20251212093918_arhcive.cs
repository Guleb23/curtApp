using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiForSud.Migrations
{
    /// <inheritdoc />
    public partial class arhcive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedDate",
                table: "Cases",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsArhcived",
                table: "Cases",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ArchivedDate",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "IsArhcived",
                table: "Cases");
        }
    }
}
