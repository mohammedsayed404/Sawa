

using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string UserName { get; set; }
        [Required] public string knownAs { get; set; }
        [Required] public string Gender { get; set; }
        [Required] public DateOnly? DateOfBirth { get; set; }
        [Required]public string City { get; set; }
        [Required]public string Country { get; set; }

        [Required]
        public string Password { get; set; }
    }
}