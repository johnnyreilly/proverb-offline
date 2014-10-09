namespace Proverb.Data.EntityFramework.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddSagacityToSage : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.User", "Sagacity", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("dbo.User", "Sagacity");
        }
    }
}
