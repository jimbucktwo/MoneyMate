import Header from "../components/header";
import Footer from "../components/footer";
import {useUser} from "@clerk/clerk-react";
import type {Route} from "./+types/account";
import { getAuth } from "@clerk/react-router/ssr.server";
import { redirect } from "react-router";

export async function loader(context: Route.LoaderArgs) {
  const {userId} = await getAuth(context);
  if (!userId) {
    return redirect('/landing');
  }
  return userId;
}


// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}


export default function Budget(loaderData: Route.ComponentProps) {

  const handleSubmit = async (event: any) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  const formattedData = {
    id: loaderData.loaderData,
    category: data.category.toString().charAt(0).toUpperCase() + data.category.toString().slice(1),
    amount: data.amount,
    limit: data.limit,
  }
  

  try {
    // Fetch assigned routines
    const response = await fetch(`${process.env.VITE_PUBLIC_BACKEND_URL}users/update_user/${loaderData.loaderData}`, {
      method: 'PUT',
      body: JSON.stringify(formattedData),
      headers: { 'Content-Type': 'application/json' },
    });
        
    // Throw an error if the response is not successful
    if (!response.ok) {
      throw new Error(`Failed to fetch assigned budgets. Status: ${response.status}`);
    }

    // Parse the response as JSON
    console.log("Fetched data:", data);
    
  } catch (err) {
    console.error("Error fetching assigned budgets:", err);
  };

  alert("Budget added successfully!");
  event.target.reset();
  window.location.reload();
  }

  const {isLoaded, user, isSignedIn} = useUser();
    return (
        <main className="flex items-center justify-center size-full">
      <div className="flex flex-col items-center space-y-4 size-full h-screen justify-between">
        <Header/>
        <div className="flex flex-col text-lg text-center justify-start w-sm border-1 border-gray-200 p-16 rounded-2xl shadow-lg bg-white space-y-4">
          <h1 className="text-4xl font-bold text-center">Add Budget</h1>
          <form onSubmit={(event) => (handleSubmit(event))} className="flex flex-col items-center space-y-4 mt-4">
            <select name="category" className="border-2 border-gray-300 p-2 rounded-lg" required>
            <option value="" disabled>  
                Select Category
              </option>
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
              </select>
            <input type="number" name="amount" placeholder="Budget Amount" className="border-2 border-gray-300 p-2 rounded-lg" required/>
            <input type="number" name="limit" placeholder="Budget Limit" className="border-2 border-gray-300 p-2 rounded-lg" required/>
            <button type="submit" className="w-40 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-200">Add Budget</button>
          </form>
        </div>
        <Footer/>
        </div>
      </main>
    );
  }
  