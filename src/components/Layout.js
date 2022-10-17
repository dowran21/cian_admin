function Layout({children, header, footer}){
    return(
        <div className="flex flex-col justify-between relative w-full h-full px-1 sm:px-4 py-2 overflow-y-hidden">
            <div className="w-full z-50 pr-3">
                {header}
            </div>
            <div className="relative w-full h-full shadow-lg rounded-2xl overflow-hidden bg-white max-h-87 2xl:max-h-90 4xl:max-h-90">
                {children}
            </div>
            <div className="w-full">
               {footer}
            </div>
        </div>
    );
};

export default Layout;