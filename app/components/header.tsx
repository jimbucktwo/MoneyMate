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
              <a href="/budget">Budget</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/register">Register</a>
            </li>
          </ul>
        </nav>
      </header>
    );
}