import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import NavBar from '@/Components/NavBar';

export default function Authenticated({ user, header, children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    };
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
<div className="fixed top-0 left-0 w-full h-screen overflow-y-auto bg-black px-2 md:px-12 z-50">
            <NavBar user={user}/>
            {/* {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )} */}

            <main className=''>{children}</main>
        </div>
    );
}
