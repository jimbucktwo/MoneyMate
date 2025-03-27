import Header from "../components/header";
import Footer from "../components/footer";
import {useUser} from "@clerk/clerk-react";
import {useEffect, useState} from "react";
import { redirect } from "react-router";
import type {Route} from "./+types/account";
import { getAuth } from "@clerk/react-router/ssr.server";

export async function loader(context: Route.LoaderArgs) {
  let data = {};
  const {userId} = await getAuth(context);
  if (!userId) {
    return redirect('/landing');
  }
  
  try {
    // Fetch assigned routines
    const response = await fetch(`${process.env.VITE_PUBLIC_BACKEND_URL}/users/get_user/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
        
    // Throw an error if the response is not successful
    if (!response.ok) {
      throw new Error(`Failed to fetch assigned routines. Status: ${response.status}`);
    }

    // Parse the response as JSON
    data = await response.json();
    console.log("Fetched data:", data);
    
  } catch (err) {
    console.error("Error fetching assigned routines:", err);
  };
  return data;
}


// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Account({
  loaderData,
}: Route.ComponentProps) {
  const { isSignedIn, user, isLoaded} = useUser();
  const[budgets, setBudgets] = useState(loaderData.budgets);
  console.log(loaderData);

  if (!isSignedIn) {
    redirect('/landing');
  }

  return (
    <main className="flex items-center justify-center size-full">
      <div className="flex flex-col items-center space-y-4 size-full">
        <Header/>
        <div className="flex flex-col text-lg text-center justify-start h-screen w-4xl border-1 border-gray-200 p-4 rounded-lg shadow-lg bg-white">
          <h2 className="text-4xl font-bold text-center">Current Budgets:</h2>
          <ul className="flex flex-col">
            {budgets.map((budget: any) => (
            <li className="flex justify-around">
              <h1>{budget.category}</h1>
              <p>${budget.amount}</p>
            </li>
            ))}
          </ul>
          <div>
          <button className="w-40 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-200"><a href="/budget">Add Budget</a></button>
        </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
