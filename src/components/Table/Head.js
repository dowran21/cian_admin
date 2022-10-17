function Head({children}){
    return(
        <thead className="sticky top-0 border-b text-left bg-white z-30">
            {children}
        </thead>
    );
};

export default Head;