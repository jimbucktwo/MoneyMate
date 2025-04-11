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
  const [budgets, setBudgets] = useState(loaderData ? loaderData.budgets : []);

  if (!isSignedIn) {
    redirect("/landing");
  }

  return (
    <main className="flex items-center justify-center size-full">
      <div className="flex flex-col items-center space-y-4 size-full h-screen justify-between">
        <Header />
          <div className="p-6 flex flex-row items-start space-y-4 size-full h-screen justify-between bg-white shadow-lg">
            <div className="flex flex-col items-start space-y-4 w-1/7 h-full border-r-2 border-gray-200 pr-4">
              <h1 className="text-3xl font-bold text-left">Account Information</h1>
              <button>Profile</button>
              <button>History</button>
              <button>Settings</button>
              <SignOutButton>Logout</SignOutButton>
              
            </div>
            <div className="flex flex-col items-center space-y-4 w-6/7 h-full"></div>
          </div>
        <Footer />
      </div>
    </main>
  );
}
