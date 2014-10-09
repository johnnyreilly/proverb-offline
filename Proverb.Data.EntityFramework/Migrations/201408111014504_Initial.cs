namespace Proverb.Data.EntityFramework.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Log4Net",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                        Thread = c.String(maxLength: 10),
                        Level = c.String(maxLength: 10),
                        Logger = c.String(maxLength: 100),
                        Message = c.String(maxLength: 255),
                        Exception = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 30),
                        Email = c.String(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Saying",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SageId = c.Int(nullable: false),
                        Text = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.User", t => t.SageId, cascadeDelete: true)
                .Index(t => t.SageId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Saying", "SageId", "dbo.User");
            DropIndex("dbo.Saying", new[] { "SageId" });
            DropTable("dbo.Saying");
            DropTable("dbo.User");
            DropTable("dbo.Log4Net");
        }
    }
}
