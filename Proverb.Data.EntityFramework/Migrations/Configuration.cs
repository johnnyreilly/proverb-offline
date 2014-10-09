namespace Proverb.Data.EntityFramework.Migrations
{
    using Proverb.Data.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Proverb.Data.EntityFramework.ProverbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Proverb.Data.EntityFramework.ProverbContext context)
        {
            //  This method will be called after migrating to the latest version and every time the 
            //  database is accessed when the solution runs when database initializations are active.

            var isSeededAlready = context.Users.Any();
            if (isSeededAlready) return;

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.

            context.Users.AddOrUpdate(
                l => l.Id,
                new User { Id = 1, Name = "Developer", UserName = "dev" }
            );

            context.Sages.AddOrUpdate(
                l => l.Id,
                new Sage
                {
                    Id = 2,
                    Name = "Arul Aruldas",
                    UserName = "arul.aruldas",
                    Sayings = new[] {
                        new Saying { Text = "Every storm starts with drops of rain..." },
                        new Saying { Text = "Call the class George Clooney" },
                        new Saying { Text = "Keeping Einstein's picture in the exam hall makes people nervous." },
                        new Saying { Text = "Who's the best? Developers or testers?  Answer - we carry each other..." },
                        new Saying { Text = "I have so many problems... which would you like to know?" },
                        new Saying { Text = "I did not break the build.. it is Microsofts inefficiency" },
                        new Saying { Text = "Tish: It works on my PC. Arul: Fix it - we are not shipping your PC to the customer!" },
                        new Saying { Text = "If you write some helpers for me I go down to a 5" },
                        new Saying { Text = "Salt is high, fat is high, in 5 years time you won't be able to eat those things" },
                        new Saying { Text = "True isn't it?" },
                        new Saying { Text = "I tell you one thing; it is always better to lose an argument than a friend" },
                        new Saying { Text = "He writes helpers so he calls himself a helper now" },
                        new Saying { Text = "A small hole can sink the whole ship" },
                        new Saying { Text = "It is not where you start the race but where you finish" },
                        new Saying { Text = "The whole ocean is never crossed until you start sailing" },
                        new Saying { Text = "My handwriting is not bad - I just have my own font" },
                        new Saying { Text = "You don't always get the right things but you can always get the things right" },
                        new Saying { Text = "When you're underwater it doesn't matter if it's by one foot or one metre" },
                        new Saying { Text = "To a frightened man everthing looks like a ghost" },
                        new Saying { Text = "Women drivers are like stars, you can see them but they can't see you" }
                    }
                },
                new Sage
                {
                    Id = 3,
                    Name = "John Reilly",
                    Email = "johnny_reilly@hotmail.com",
                    UserName = "john.reilly",
                    Sayings = new[] {
                        new Saying { Text = "I've got to join Marc's back end up with my front end... I do not see what is funny about that sentence." }
                    }
                },
                new Sage
                {
                    Id = 4,
                    Name = "Gemma Ozbek",
                    UserName = "gemma.ozbek",
                    Sayings = new[] {
                        new Saying { Text = "I've joined I.T., I've turned 30, life's boring, I feel like Bridget Jones, right, give me them donuts, let's get this over and done with" }
                    }
                },
                new Sage
                {
                    Id = 5,
                    Name = "Marc Talary",
                    UserName = "marc.talary",
                    Sayings = new[] {
                        new Saying { Text = "I am band 'C' because I see everything (Marc T speaking about Arul who had assigned developers to band 'A' and band 'B' depending on their grooming contributions)" }
                    }
                },
                new Sage
                {
                    Id = 6,
                    Name = "Pauline Davis",
                    UserName = "pauline.davis",
                    Sayings = new[] {
                        new Saying { Text = "Have you still got it up Marc and can I see it? Pauline enquiring about Five Guys webpage" }
                    }
                },
                new Sage
                {
                    Id = 7,
                    Name = "Denis Ewanzang",
                    UserName = "denis.ewanzang",
                    Sayings = new[] {
                        new Saying { Text = "Can I have gravy with that? (Said when ordering any meal at all)" }
                    }
                },
                new Sage
                {
                    Id = 8,
                    Name = "Sandeep Deo",
                    UserName = "sandeep.deo",
                    Sayings = new[] {
                        new Saying { Text = "Moyes needs to go" },
                        new Saying { Text = "First Capital Connect - I love them so!" }
                    }
                }
            );

        }
    }
}
