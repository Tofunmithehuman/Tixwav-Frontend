import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

const Navigation = () => {
  return (
    <div className="Navigation">
      <header className="p-4 lg:p-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between">
            <nav>
              <Link to="/" className="QurovaDEMO text-[#ff7f11ff] text-3xl ">
                Tixwav
              </Link>
            </nav>
            <nav className="lg:flex items-center space-x-8 hidden text-gray-800">
              <Link>About</Link>
              <Link>Discover</Link>
              <Link>Pricing</Link>
              <Link>
                <Search />
              </Link>
            </nav>
            <nav className="md:flex items-center space-x-4 hidden">
              <Link to="/login" className="text-gray-800">Login</Link>
              <Link className="bg-[#ff7f11ff] hover:bg-[#e66f00] text-white py-2 px-4">
                Register
              </Link>
            </nav>
            <nav className="block md:hidden">
              <Menu size={25} />
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navigation;
