import Header from "../components/header";
import Footer from "../components/footer";
import {useUser} from "@clerk/clerk-react";
import type {Route} from "./+types/account";
import { getAuth } from "@clerk/react-router/ssr.server";
import { redirect } from "react-router";
import {useState} from "react";
import editing from "../images/editing.png";

export async function loader(context: Route.LoaderArgs) {
  let data = {};
  const { userId } = await getAuth(context);
  if (!userId) {
    return redirect("/landing");
  }

  try {
    // Fetch assigned user
    // const response = await fetch(
    //   `${process.env.VITE_PUBLIC_BACKEND_URL}/users/get_user/${userId}`,
    const baseURL = process.env.VITE_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
const response = await fetch(`${baseURL}/users/get_user/${userId}`, {
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
  //const [budgets, setBudgets] = useState(loaderData ? loaderData.budgets : []);
  const [budgets, setBudgets] = useState<any[]>((loaderData as any)?.budgets || []);
  const [addBudget, setAddBudget] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [budgetId, setBudgetId] = useState(0);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentAmount, setCurrentAmount] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(0);
  const [currentLength, setCurrentLength] = useState(0);
  const [currentRecurring, setCurrentRecurring] = useState(false);
  const [editingButtons, setEditingButtons] = useState(false);
  console.log("loaderData:", loaderData);

  if (!isSignedIn) {
      redirect("/landing");
  }

  const handleSubmit = async (event: any) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  const formattedData = {
    id: budgets.length + 1,
    category: data.category.toString().charAt(0).toUpperCase() + data.category.toString().slice(1),
    amount: data.amount,
    limit: data.limit,
    length: data.length,
    recurring: data.recurring === "on" ? true : false,
  }
  try {
    // update budget
  //  const response = await fetch(`${process.env.VITE_PUBLIC_BACKEND_URL}/users/update_user/${loaderData._id}`, {
  const response = await fetch(`${process.env.VITE_PUBLIC_BACKEND_URL}/users/update_user/${(loaderData as any)._id}`, {
      method: 'PUT',
      body: JSON.stringify(formattedData),
      headers: { 'Content-Type': 'application/json' },
    });
    // Throw an error if the response is not successful
    if (!response.ok) {
      throw new Error(`Failed to update assigned budgets. Status: ${response.status}`);
    }
    alert("Budget added successfully!");
  setAddBudget(false);
  event.target.reset();
  window.location.reload();
  } catch (err) {
    console.error("Error updating assigned budgets:", err);
  };
  }

  const handleEdit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const formattedData = {
    id: budgetId,
    category: currentCategory,
    amount: data.amount,
    limit: data.limit,
    length: data.length,
    recurring: data.recurring === "on" ? true : false,
  }
  try {
    const baseURL = process.env.VITE_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
    const response = await fetch(
  `${baseURL}/users/update_budget/${(loaderData as any)._id}/${budgetId}`,
  {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedData),
  }
);
    // Throw an error if the response is not successful
    if (!response.ok) {
      throw new Error(`Failed to update current budget. Status: ${response.status}`);
    }
  alert("Budget updated successfully!");
  setIsEditing(false);
  event.target.reset();
  window.location.reload();
    
  } catch (err) {
    console.error("Error updating assigned budgets:", err);
  };
  }
  const triggerAddScreen = () => {
    setAddBudget(true);
    setIsEditing(false);
    setEditingButtons(false);
  }
  const triggerEditScreen = () => {
    setAddBudget(false);
    setEditingButtons(true);
    setIsEditing(false);
  }
  const handleDelete = async (id: number) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this budget?");
  if (!confirmDelete) return;

  try {
    const baseURL = process.env.VITE_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
    const response = await fetch(
      `${baseURL}/users/delete_budget/${(loaderData as any)._id}/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete budget. Status: ${response.status}`);
    }

    alert("Budget deleted successfully!");
    window.location.reload();
  } catch (err) {
    console.error("Error deleting budget:", err);
  }
};

  const triggerBudgetScreen = () => {
    setAddBudget(false);
    setIsEditing(false);
    setEditingButtons(false);
  }
    return (
        <main className="flex items-center justify-center size-full">
      <div className="flex flex-col items-center space-y-4 size-full h-screen justify-between">
        <Header/>
        <div className="flex flex-row text-lg text-center justify-center items-center h-full w-full border-1 border-gray-200 p-4 shadow-lg bg-white space-y-4 px-12">
        <div className="pl-4 flex flex-col h-full items-start border-r-2 border-gray-200 pt-12 pr-4 w-1/6 space-y-4">
          <h2 className="text-3xl font-bold text-center">Your Budgets</h2>
          <button onClick={triggerAddScreen} className="p-2 px-4 hover:bg-gray-300 hover:text-white hover:cursor-pointer rounded-full transition duration-200">
              Add
          </button>
          {!editingButtons &&
          <button onClick={triggerEditScreen} className="p-2 px-4 hover:bg-gray-300 hover:text-white hover:cursor-pointer rounded-full transition duration-200">
              Edit
          </button>}
          {editingButtons &&
          <button onClick={triggerBudgetScreen} className="p-2 px-4 hover:bg-gray-300 hover:text-white hover:cursor-pointer rounded-full transition duration-200">
              <p className="text-red-600">Done Editing?</p>
          </button>}
        </div>
        {!addBudget && !isEditing && 
        <div className="flex flex-col text-lg text-center justify-start w-full border-gray-200 p-4 bg-white space-y-4 px-12">
          <table>
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Spent</th>
                <th className="border border-gray-300 px-4 py-2">Limit</th>
                <th className="border border-gray-300 px-4 py-2">Time Left</th>
                <th className="border border-gray-300 px-4 py-2">Recurring?</th>
                
              </tr>
            </thead>
            <tbody>
            {(budgets ?? []).map((budget: any, index: number) => (
              //{budgets.map((budget: any, index: number) => (
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
                  <td className="border border-gray-300 px-4 py-2">
                    {budget.length} days
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {budget.recurring ? "Yes" : "No"}
                  </td>
                  {editingButtons &&
                      <td>
                        <td>
                          <button
                              className="hover:cursor-pointer text-red-600"
                              onClick={() => handleDelete(budget.id)}
                          >
                            Delete
                          </button>
                        </td>D
                        <button className="hover:cursor-pointer" onClick={() => {
                          setIsEditing(true);
                          setBudgetId(budget.id);
                          setCurrentCategory(budget.category);
                          setCurrentAmount(budget.amount);
                          setCurrentLimit(budget.limit);
                          setCurrentLength(budget.length);
                          setCurrentRecurring(budget.recurring);
                        }}>
                          <img src={editing} alt="Edit" className="w-12 h-8"/>
                        </button>
                      </td>}
                </tr>
            ))}
            </tbody>
          </table>
        </div>}
          {isEditing &&
              <div className="w-5/6 flex flex-col text-lg text-center justify-start bg-white space-y-4 h-full">
           <button onClick={triggerEditScreen} className="mt-4 mb-30 hover:cursor-pointer text-red-600 rounded hover:bg-gray-300 transition duration-200 w-20 pl-0">{'<'} Back</button>
           <h1 className="text-4xl font-bold text-center">Edit Budget</h1>
           <form onSubmit={(event) => (handleEdit(event))} className="w-full flex flex-col items-start space-y-4 mt-4">
            <div className="flex flex-row items-center justify-center w-full">
              <p className="mr-4">Amount: </p>
             <input type="number" name="amount" value={currentAmount} onChange={(e) => setCurrentAmount(parseInt(e.target.value, 10))} placeholder="Budget Amount" className="w-20 border-2 border-gray-300 p-2 rounded-lg" required/>
             </div>
             <div className="flex flex-row items-center justify-center w-full">
              <p className="mr-4">Limit: </p>
             <input type="number" name="limit" value={currentLimit} onChange={(e) => setCurrentLimit(parseInt(e.target.value, 10))} placeholder="Budget Limit" className="w-20 border-2 border-gray-300 p-2 rounded-lg" required/>
             </div>
             <div className="flex flex-row items-center justify-center w-full">
              <p className="mr-4">Duration (in days): </p>
             <input type="number" name="length" value={currentLength} onChange={(e) => setCurrentLength(parseInt(e.target.value, 10))} placeholder="Budget Duration (in days)" className="w-20 border-2 border-gray-300 p-2 rounded-lg" required/>
              </div>
            <div className="flex flex-row items-center justify-center w-full">
              <p className="mr-4">Recurring?</p>
            <input type="checkbox" name="recurring" placeholder="Recurring?" className="border-2 border-gray-300 p-2 rounded-lg" required/>
            </div>
            <div className="w-full">
             <button type="submit" className="hover:cursor-pointer w-40 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-200">Confirm?</button>
           </div>
           </form>
         </div>
          }
        {addBudget && <div className="h-full w-5/6 flex flex-col text-lg items-center justify-start pl-12  border-gray-200 bg-white space-y-4">
          <button onClick={triggerBudgetScreen} className="mb-30 mt-4 flex self-start hover:cursor-pointer text-red-600 rounded hover:bg-gray-300 transition duration-200 w-20 pl-0">{'<'} Back</button>
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
            <input type="number" name="length" placeholder="Budget Duration (in days)" className="border-2 border-gray-300 p-2 rounded-lg" required/>
            <div className="flex flex-row">
              <p className="mr-4">Recurring?</p>
            <input type="checkbox" name="recurring" placeholder="Recurring?" className="border-2 border-gray-300 p-2 rounded-lg" required/>
            </div>
            <button type="submit" className="hover:cursor-pointer w-40 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-200">Add Budget</button>
          </form>
        </div>}
        </div>
        <Footer/>
        </div>
      </main>
    );
  }
  