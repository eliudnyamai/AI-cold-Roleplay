import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import ApplicationLogo from "./ApplicationLogo";
import ResponsiveNavLink from "./ResponsiveNavLink";
import Dropdown from "./Dropdown";
export default function NavBar({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className=" border-gray-200 bg-black dark:border-black">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex text-white text-2xl items-center space-x-3 rtl:space-x-reverse">
        AI Cold Roleplay
        </a>
        <button
          onClick={toggleMenu}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded={isMenuOpen ? "true" : "false"}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-dropdown"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-black md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-black md:dark:bg-black dark:border-black">
          
            {user ? (
              <>
                
                {/* <ResponsiveNavLink
                  href={route("dashboard")}
                  active={route().current("dashboard")}
                >
                  Dashboard
                </ResponsiveNavLink> */}
                <ResponsiveNavLink
                  href={route("assistants.index")}
                  active={route().current("assistants.index")}
                >
                  AI Sellers
                </ResponsiveNavLink>
                <ResponsiveNavLink
                  href={route("plays.index")}
                  active={route().current("plays.index")}
                >
                  My Plays
                </ResponsiveNavLink>

                <div className="hidden sm:flex sm:items-center sm:ms-6">
                  <div className="ms-3 relative">
                    <Dropdown>
                      <Dropdown.Trigger>
                        <span className="rounded-md">
                          <button
                            type="button"
                            className="inline-flex w-full items-center  border border-transparent  leading-4 rounded-md text-gray-500 dark:text-white bg-white dark:bg-black hover:text-green-700 dark:hover:text-green-700 focus:outline-none transition ease-in-out duration-150"
                          >
                            {user.name}

                            <svg
                              className="ms-2 -me-0.5 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </span>
                      </Dropdown.Trigger>

                      <Dropdown.Content>
                        <Dropdown.Link href={route("profile.edit")}>
                          Profile
                        </Dropdown.Link>
                        <Dropdown.Link
                          href={route("logout")}
                          method="post"
                          as="button"
                        >
                          Log Out
                        </Dropdown.Link>
                      </Dropdown.Content>
                    </Dropdown>
                  </div>
                </div>
              </>
            ) : (
              <>
                <ResponsiveNavLink
                  href={route("login")}
                  active={route().current("login")}
                >
                  Login
                </ResponsiveNavLink>
                <ResponsiveNavLink
                  href={route("register")}
                  active={route().current("register")}
                >
                  Register
                </ResponsiveNavLink>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
