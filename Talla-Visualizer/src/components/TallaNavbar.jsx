import React, { useState } from "react";
import { Link } from "react-router-dom";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useMode } from "../store/ModeContext.jsx";
import ModeSwitch from "./ModeSwitch.jsx";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

function TallaNavbar() {
  const { isOnline } = useMode();
  return (
    <nav className="bg-gradient-to-tl  from-secondary to-details-red  w-full p-4 z-50 fixed top-0">
      <div className="mx-auto flex justify-between items-center md:mx-7">
        <Link
          to="/"
          className="text-white text-3xl font-semibold hover:text-glow"
        >
          Talla
        </Link>
        <div className="block lg:hidden">
          <Dropdown>
            <DropdownTrigger className="rounded-md ">
              <Button variant="bordered rounded-full">
                <Bars3Icon className="h-6 w-6 text-white" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              className="bg-secondary/90 w-auto justify-center sm:w-40 lg:hidden rounded-lg"
            >
              {/* <DropdownItem key="home">
                <Link
                  to="/"
                  className="block text-primary px-3 py-2 rounded hover:bg-white/20"
                >
                  Home
                </Link>
              </DropdownItem> */}
              <DropdownItem key="Dashboard">
                <Link
                  to="/dashboard"
                  className="block text-primary px-3 py-2 rounded hover:bg-white/20"
                >
                  Dashboard
                </Link>
              </DropdownItem>
              {isOnline &&(
                <DropdownItem key="upload" className="flex justify-center">
                <Link
                  to="/upload"
                  className="block text-primary px-3 py-2 rounded hover:bg-white/20"
                >
                  Upload
                </Link>
              </DropdownItem>)}
              <DropdownItem
                key="mode"
                className="flex items-center justify-center"
              >
                <div className=" flex space-x-2 justify-center text-primary px-3 py-2 rounded hover:bg-white/20">
                  <label htmlFor="ModeSwitch" >Mode:</label>
                  <ModeSwitch />
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <ul
          className={`text-lg lg:flex lg:items-center lg:space-x-6 hidden w-full lg:w-auto`}
        >
          {/* <li>
            <Link
              to="/"
              className="block text-primary px-3 py-2 rounded hover:bg-white/20"
            >
              Home
            </Link>
          </li> */}
          <li>
            <Link
              to="/dashboard"
              className="block text-primary px-3 py-2 rounded hover:bg-white/20"
            >
              Dashboard
            </Link>
          </li>
          {isOnline &&<li>
            <Link
              to="/upload"
              className="block text-primary px-3 py-2 rounded hover:bg-white/20"
            >
              Upload
            </Link>
          </li>}
          <li className="flex items-center justify-center">
            <ModeSwitch />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default TallaNavbar;
