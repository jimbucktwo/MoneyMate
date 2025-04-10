import Header from "../components/header";
import Footer from "../components/footer";
import { useUser } from "@clerk/clerk-react";
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
        <div className="flex flex-col text-lg text-center justify-start w-4xl border-1 border-gray-200 p-4 rounded-2xl shadow-lg bg-white space-y-4">
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
            <button className="w-40 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-200">
              <a href="/budget">Add Budget</a>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
