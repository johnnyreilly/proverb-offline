namespace Proverb.Data.EntityFramework.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TweakSaying : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Saying", "Text", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Saying", "Text", c => c.String());
        }
    }
}
