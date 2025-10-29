using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiForSud.Migrations
{
    /// <inheritdoc />
    public partial class addIsntaceAndCase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cases",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NomerOfCase = table.Column<string>(type: "text", nullable: false),
                    NameOfCurt = table.Column<string>(type: "text", nullable: false),
                    Applicant = table.Column<string>(type: "text", nullable: false),
                    Defendant = table.Column<string>(type: "text", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false),
                    DateOfCurt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ResultOfCurt = table.Column<string>(type: "text", nullable: false),
                    DateOfResult = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cases", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CurtInstances",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    NameOfCurt = table.Column<string>(type: "text", nullable: false),
                    DateOfSession = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Link = table.Column<string>(type: "text", nullable: false),
                    Employee = table.Column<string>(type: "text", nullable: false),
                    ResultOfIstance = table.Column<string>(type: "text", nullable: false),
                    DateOfResult = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CaseId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CurtInstances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CurtInstances_Cases_CaseId",
                        column: x => x.CaseId,
                        principalTable: "Cases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CurtInstances_CaseId",
                table: "CurtInstances",
                column: "CaseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CurtInstances");

            migrationBuilder.DropTable(
                name: "Cases");
        }
    }
}
