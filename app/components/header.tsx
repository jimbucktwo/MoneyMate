import {SignedIn, SignedOut, SignOutButton} from "@clerk/clerk-react";

export default function Header() {
    return (
      <header className="flex items-center justify-between p-4 bg-gray-800 text-white w-full h-18">
        <h1 className="text-2xl font-bold">MoneyMate</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
                <a href="/">Home</a>
            </li>
            <li>
              <a href="/account">Account</a>
            </li>
            <li>
              <a href="/budget">New Budget</a>
            </li>
            <li>
              <SignedIn>
                <SignOutButton />
              </SignedIn>
              <SignedOut><a href="/login">Sign in</a></SignedOut>
              
            </li>
            <li>
              <SignedOut><a href="/register">Register</a></SignedOut>
            </li>
          </ul>
        </nav>
      </header>
    );
}