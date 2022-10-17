import logo from '../assets/logo.svg'

function Logo(){
    return(
        <div className="flex flex-row justify-start items-center pt-3 pb-3 sm:pb-6">
            <img src={logo} alt="Logo"  className="w-16 sm:ml-5 sm:mr-3"/>
            <h1 className="text-2xl font-semibold text-indigo-600 hidden sm:flex">Gamysh</h1>
        </div>
    );
};

export default Logo;