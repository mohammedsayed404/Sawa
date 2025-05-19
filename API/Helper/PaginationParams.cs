namespace API.Helper
{
    public class PaginationParams
    {
            private const int MaxPageSize = 10;
        private int _PageSize = 10;
        public int PageNumber { get; set; } = 1;

        public int PageSize
        {
            get => _PageSize;
            set => _PageSize = value > MaxPageSize ? MaxPageSize : value;
        }

    }
}