using API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
public class BuggyController : BaseApiController
{
    
 private readonly DataContext _dbContext;

        public BuggyController(DataContext dbContext)
        {
            _dbContext = dbContext;
        }



        [HttpGet("not-found")]
        public  ActionResult GetNotFound() 
            =>  NotFound();


        [HttpGet("bad-request")]
        public ActionResult GetBadRequest() 
            => BadRequest("bad request to test");


        [HttpGet("test/{id}")] //Make Class To Solve it manually [validation error]
        public ActionResult GetBadRequestValidation (int id)
        {
            var product = _dbContext.Users.Find(id);

            return Ok(product);
        }


        [HttpGet("server-error")]   
        public ActionResult GetServerError() 
            => Ok(_dbContext.Users.Find(1000).ToString());

        [HttpGet("auth")]
        [Authorize]
        public ActionResult<string> GetSecret() 
            => "secret key test test "; 




}