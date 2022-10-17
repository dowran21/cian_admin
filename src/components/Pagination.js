import Pagination from 'rc-pagination';

const MyPagination = ({limit, setLimit, setPage, count, page}) =>{
    return (
        <div className="relative flex flex-row w-full justify-between px-2">
            <div></div>
            <Pagination
                pageSize={limit}
                current={page + 1}
                // hideOnSinglePage
                className="" 
                total={count} 
                showTotal={(total, range) =>
                    <div className="hidden md:flex absolute top-0 left-2">{`${range[0]} - ${range[1]} из ${total}`}</div>
                }
                onChange={(page) => setPage(page - 1)}
                
            />
            <select className="focus:outline-none p-1" value={limit} onChange={(e) => setLimit(e.target.value)}> 
                <option value={10}>
                    10
                </option>
                <option value={20}>
                    20
                </option>
                <option value={30}>
                    30
                </option>
                <option value={40}>
                    40
                </option>
                <option value={50}>
                    50
                </option>
            </select>
        </div>
    );
};

export default MyPagination;

