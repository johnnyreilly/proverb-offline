using System.Security.Principal;
using System.Threading.Tasks;
using Proverb.Data.Models;
using Proverb.Services.Interfaces;

namespace Proverb.Web.Helpers
{
    public class UserHelper : IUserHelper
    {
        readonly IAppConfigHelper _appConfigHelper;
        readonly IAppCache _appCache;
        readonly IPrincipal _user;
        readonly IUserService _userService;

        string _userName;

        public const string UserIdKeyPrefix = "UserId:";

        public UserHelper(IAppConfigHelper appConfigHelper, IAppCache appCache, IPrincipal user, IUserService userService)
        {
            _appConfigHelper = appConfigHelper;
            _appCache = appCache;
            _user = user;
            _userService = userService;
        }

        private string UserIdKey
        {
            get
            {
                return UserIdKeyPrefix + _user.Identity.Name;
            }
        }

        public int NumCachedUsers
        {
            get
            {
                var count = _appCache.Count(x => x.Key.StartsWith(UserIdKeyPrefix));
                return count;
            }
        }

        public async Task<int> GetUserId()
        {
            if (_appCache.Contains(UserIdKey))
                return _appCache.Get<int>(UserIdKey);

            int userId;
            var user = await _userService.GetByUserNameAsync(UserName);

            if (user == null)
            {
                // No user exists so let's create one
                user = new User
                {
                    Name = UserName,
                    UserName = UserName
                };
                userId = await _userService.CreateAsync(user/*, _appConfigHelper.SystemUserId*/);
            }
            else
                userId = user.Id;

            _appCache.Add(UserIdKey, userId);

            return userId;
        }

        public string UserName
        {
            get
            {
                if (!string.IsNullOrEmpty(_userName))
                    return _userName;

                var name = _user.Identity.Name;
                var nameArray = name.Split('\\');
                _userName = nameArray[nameArray.Length - 1];

                return _userName;
            }
        }
    }
}