import Loader from "./Loader"

function BgLoader({loading}){
    return(
        <div className={`${loading ? 'absolute z-50 w-full h-full flex justify-center items-center' : 'hidden'}`}>
            <Loader size="2xl"/>
            <div className="opacity-50 z-0 absolute w-full h-full bg-indigo-200 rounded-lg"></div>
        </div> 
    );
};

export default BgLoader;