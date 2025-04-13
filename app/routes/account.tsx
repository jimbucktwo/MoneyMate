import Header from "../components/header";
import Footer from "../components/footer";
import { useUser, UserProfile, SignOutButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/account";
import { getAuth } from "@clerk/react-router/ssr.server";

export async function loader(context: Route.LoaderArgs) {
  let data = {};
  const { userId } = await getAuth(context);
  if (!userId) {
    return redirect("/landing");
  }

  try {
    // Fetch assigned user
    const response = await fetch(
      `${process.env.VITE_PUBLIC_BACKEND_URL}/users/get_user/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    // Throw an error if the response is not successful
    if (!response.ok) {
      throw new Error(
        `Failed to fetch assigned budgets. Status: ${response.status}`
      );
    }

    // Parse the response as JSON
    data = await response.json();
    console.log("Fetched data:", data);
  } catch (err) {
    console.error("Error fetching assigned routines:", err);
  }
  return data;
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Account({ loaderData }: Route.ComponentProps) {
  const { isSignedIn, user, isLoaded } = useUser();
  const [profile, setProfile] = useState(true);
  const [history, setHistory] = useState(false);
  const [settings, setSettings] = useState(false);

  if (!isSignedIn) {
    redirect("/landing");
  }

  const triggerHistory = () => {
    setProfile(false);
    setHistory(true);
    setSettings(false);
  }

  const triggerSettings = () => {
    setProfile(false);
    setHistory(false);
    setSettings(true);
  }

  const triggerProfile = () => {
    setProfile(true);
    setHistory(false);
    setSettings(false);}

  return (
    <main className="flex items-center justify-center size-full">
      <div className="flex flex-col items-center space-y-4 size-full h-screen justify-between">
        <Header />
          <div className="p-6 flex flex-row items-start space-y-4 size-full h-screen justify-between bg-white shadow-lg">
            <div className="flex flex-col items-start space-y-4 w-1/7 h-full border-r-2 border-gray-200 pr-4">
              <h1 className="text-3xl font-bold text-left">Account Information</h1>
              <button onClick={() => triggerProfile()} className="p-2 px-4 hover:bg-gray-300 hover:text-white hover:cursor-pointer rounded-full transition duration-200">Profile</button>
              <button onClick={() => triggerHistory()} className="p-2 px-4 hover:bg-gray-300 hover:text-white hover:cursor-pointer rounded-full transition duration-200">History</button>
              <button onClick={() => triggerSettings()} className="p-2 px-4 hover:bg-gray-300 hover:text-white hover:cursor-pointer rounded-full transition duration-200">Settings</button>
              <SignOutButton><p className="text-red-600 hover:bg-red-600 hover:text-white hover:cursor-pointer transition duraction-200 p-2 px-4 rounded-full">Logout</p></SignOutButton>
              
            </div>
            {profile &&
            <div className="flex flex-row items-start space-y-4 w-6/7 h-full p-8 justify-start">
              <h1 className="text-3xl font-bold text-center absolute">Profile Information</h1>
              <div className="flex flex-col items-end space-y-4 w-1/2 h-full justify-center pr-8">
              
              <p><b>Username:</b> {user?.username}</p>
              <p><b>Full Name:</b> {user?.firstName} {user?.lastName}</p>
              <p><b>Email:</b> {user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <div className="flex items-center justify-center w-1/7 h-full">
                <button className="w-full rounded-full overflow-hidden hover:cursor-pointer">
                  <img src={user?.imageUrl} className="rounded-full w-full"/> 
                </button>
                </div>
            </div>}

            {history &&
            <div className="flex flex-col items-start space-y-4 w-6/7 h-full p-8">

              <h1 className="text-3xl font-bold text-center">History</h1>
              </div>}

            {settings &&
            <div className="flex flex-col items-start p-8 space-y-4 w-6/7 h-full">
              <h1 className="text-3xl font-bold text-center">Settings</h1>
              </div>}
          </div>
        <Footer />
      </div>
    </main>
  );
}
