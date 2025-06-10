namespace API.Helper
{
    public class MessageParams : PaginationParams
    {
        public string UserName { get; set; } //current loged in user name 

        public string Container { get; set; } = "Unread";
    }
}