import {SignedIn, SignedOut, SignOutButton} from "@clerk/clerk-react";

export default function Header() {
    return (
      <header className="flex items-center justify-between p-4 w-full h-18">
        <h1 className="text-2xl font-semibold bg-white rounded-full pl-6 pr-6 pt-3 pb-3 shadow-lg">MoneyMate</h1>
        <nav className=" bg-white rounded-full pl-12 pr-12 pt-4 pb-4 shadow-lg">
          <ul className="flex justify-center items-center ">
            <li>
                <a className="mx-5 hover:text-white hover:bg-gray-200 px-4 py-2 rounded-full transition duration-200" href="/">Home</a>
            </li>
            <li>
              <a className=" mx-5 hover:text-white hover:bg-gray-200 px-4 py-2 rounded-full transition duration-200" href="/account">Account</a>
            </li>
            <li>
              <a className=" mx-5 hover:text-white hover:bg-gray-200 px-4 py-2 rounded-full transition duration-200" href="/budget">New Budget</a>
            </li>
            <li>
              <SignedIn>
                <SignOutButton>
                  <a className="mx-5 hover:text-white hover:bg-gray-200 px-4 py-2 rounded-full transition duration-200" href="/login">Sign out</a>
                </SignOutButton>
              </SignedIn>
              <SignedOut><a className="mx-5 hover:text-white hover:bg-gray-200 px-4 py-2 rounded-full transition duration-200" href="/login">Sign in</a></SignedOut>
              
            </li>
            <li>
              <SignedOut><a  className="mx-5 hover:text-white hover:bg-gray-200 px-4 py-2 rounded-full transition duration-200" href="/register">Register</a></SignedOut>
            </li>
          </ul>
        </nav>
      </header>
    );
}