using System.Security.Principal;
using System.Threading.Tasks;

namespace Proverb.Web.Helpers
{
    public interface IUserHelper
    {
        /// <summary>
        /// The UserId of the user (If no user exists in the database then this property will create one using the UserName)
        /// </summary>
        Task<int> GetUserId();

        /// <summary>
        /// The username stripped of any domain prefix.  eg "john.reilly" rather than "PANTHEON\john.reilly"
        /// </summary>
        string UserName { get; }

        /// <summary>
        /// This reveals the number of user ids currently stored in the cache - as a user starts using Proverb
        /// their user ids are added to the cache so this property doubles as a count of the number of recently
        /// active users
        /// </summary>
        int NumCachedUsers { get; }
    }
}