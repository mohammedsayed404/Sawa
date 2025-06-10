namespace API.Entities
{
    public class AppUser
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; } = null!;
        public byte[] PasswordSalt { get; set; } = null!;
        public DateOnly DateOfBirth { get; set; }

        public string KnownAs { get; set; } = string.Empty;
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;

        public string Gender { get; set; } = string.Empty;
        public string Introduction { get; set; } = string.Empty;
        public string LookingFor { get; set; } = string.Empty;
        public string Interests { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public ICollection<Photo> Photos { get; set; } = new HashSet<Photo>();

        public ICollection<UserLike> LikedByUsers { get; set; } = new HashSet<UserLike>(); //user they make like to me 
        public ICollection<UserLike> LikedUsers { get; set; } = new HashSet<UserLike>(); //user that i make like to them  



        public ICollection<Message> MessagesSent { get; set; } = new HashSet<Message>(); //sent
        public ICollection<Message> MessagesReceived { get; set; } = new HashSet<Message>(); //recived


        // public int GetAge()
        //     => DateOfBirth.CalculateAge();





    }
}