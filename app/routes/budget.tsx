import Header from "../components/header";
import Footer from "../components/footer";
import {useUser} from "@clerk/clerk-react";
import type {Route} from "./+types/account";
import { getAuth } from "@clerk/react-router/ssr.server";
import { redirect } from "react-router";
import {useState} from "react";

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
    console.error("Error fetching assigned budgets:", err);
  }
  return data;
}


// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}


export default function Budget({loaderData}: Route.ComponentProps) {
  const { isSignedIn, user, isLoaded } = useUser();
  const [budgets, setBudgets] = useState(loaderData ? loaderData.budgets : []);
  const [addBudget, setAddBudget] = useState(false);
  console.log(loaderData);
  
  if (!isSignedIn) {
      redirect("/landing");
  }

  const handleSubmit = async (event: any) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  const formattedData = {
    id: loaderData._id,
    category: data.category.toString().charAt(0).toUpperCase() + data.category.toString().slice(1),
    amount: data.amount,
    limit: data.limit,
  }
  

  try {
    // update budget
    const response = await fetch(`${process.env.VITE_PUBLIC_BACKEND_URL}/users/update_user/${loaderData._id}`, {
      method: 'PUT',
      body: JSON.stringify(formattedData),
      headers: { 'Content-Type': 'application/json' },
    });
        
    // Throw an error if the response is not successful
    if (!response.ok) {
      throw new Error(`Failed to update assigned budgets. Status: ${response.status}`);
    }

    // Parse the response as JSON
    console.log("Fetched data:", data);
    
  } catch (err) {
    console.error("Error updating assigned budgets:", err);
  };

  alert("Budget added successfully!");
  setAddBudget(false);
  event.target.reset();
  window.location.reload();
  }

    return (
        <main className="flex items-center justify-center size-full">
      <div className="flex flex-col items-center space-y-4 size-full h-screen justify-between">
        <Header/>
        {!addBudget && <div className="flex flex-col text-lg text-center justify-start w-4xl border-1 border-gray-200 p-4 rounded-2xl shadow-lg bg-white space-y-4">
          <h2 className="text-3xl font-bold text-center">Your Budgets</h2>
          <table>
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Spent</th>
                <th className="border border-gray-300 px-4 py-2">Limit</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {budget.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${budget.amount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${budget.limit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          
          <div>
            <button onClick={() => setAddBudget(true)}className="hover:cursor-pointer w-40 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-200">
              Add Budget
            </button>
          </div>
        </div>}
        
        {addBudget &&<div className="flex flex-col text-lg text-center justify-start w-sm border-1 border-gray-200 p-16 rounded-2xl shadow-lg bg-white space-y-4">
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
            <button type="submit" className="hover:cursor-pointer w-40 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-200">Add Budget</button>
          </form>
        </div>}
        <Footer/>
        </div>
      </main>
    );
  }
  