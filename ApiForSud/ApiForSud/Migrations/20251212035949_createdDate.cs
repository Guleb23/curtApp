using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiForSud.Migrations
{
    /// <inheritdoc />
    public partial class createdDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Cases",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Cases");
        }
    }
}
