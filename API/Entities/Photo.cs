using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public bool IsMain { get; set; } = false;
        public string PublicId { get; set; } = string.Empty;
        public int AppUserId { get; set;} 

    }
}