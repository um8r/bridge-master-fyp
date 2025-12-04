import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Project Explorer</h1>
        <div>
          <Link href="/explore-projects" className="text-gray-300 hover:text-white px-4">Explore</Link>
          <Link href="/student" className="text-gray-300 hover:text-white px-4">Student Page</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
