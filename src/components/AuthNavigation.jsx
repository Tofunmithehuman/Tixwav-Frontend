import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";

const AuthNavigation = () => {
  return (
    <div className="AuthNavigation">
      <header className="p-4 lg:p-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between">
            <nav>
              <Link to="/" className="QurovaDEMO text-[#ff7f11ff] text-3xl ">
                Tixwav
              </Link>
            </nav>
            <nav className="lg:flex items-center space-x-8 hidden text-gray-800">
              <Link to="/">Home</Link>
              <Link>About</Link>
              <Link>Discover</Link>
              <Link>Pricing</Link>
              <Link>
                <Search />
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
};

export default AuthNavigation;
