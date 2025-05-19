
using API.Helper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] //! localhost:port/api/users
    [LogUserActivity] //i don't need to usinr serviceFilter(typeof(LogUserActivity)) cause don't using any DI service in Ctor 
    public class BaseApiController : ControllerBase
    {

    }
}