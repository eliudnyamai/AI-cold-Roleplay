import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Dropdown from '@/Components/Dropdown';
import NavBar from '@/Components/NavBar';
export default function Guest({ children, user }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
    return (
        <>
        <div className="fixed top-0 left-0 w-full h-screen overflow-y-auto bg-black px-12 z-50">
        <NavBar user={user}/>    
        <div className="w-full  sm:px-0 ">
        {children}
    </div>
</div>

        </>
      
    );
}
