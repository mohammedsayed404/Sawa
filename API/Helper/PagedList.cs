using Microsoft.EntityFrameworkCore;

namespace API.Helper
{
    public class PagedList<TData> : List<TData>
    {
        public PagedList(IReadOnlyList<TData>items,int PageNumber, int count, int pageSize)
        {
            CurrentPage = PageNumber;
            TotalPages = (int)Math.Ceiling(count / (double) pageSize );
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }

        public int CurrentPage { get; private set; }
        public int TotalPages { get; private set; }
        public int PageSize { get; private set; }
        public int TotalCount { get; private set; }



        public static async Task<PagedList<TData>> CreateAsync(IQueryable<TData> source , int pageNumber , int pageSize  ) 
        {
            var count = await source.CountAsync();

            var items = await source.Skip((pageNumber -1 ) * pageSize ).Take(pageSize).ToListAsync();

            return new PagedList<TData>(items,pageNumber,count,pageSize);

        }
    }
}