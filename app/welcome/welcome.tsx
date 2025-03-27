import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import Header from "../components/header";
import Footer from "../components/footer";
import {useUser} from "@clerk/clerk-react";
import {useEffect, useState} from "react";


export async function Welcome({user} : {user: string}) {
  const userInfo = JSON.parse(user);
  const [budgets, setBudgets] = useState(userInfo.budgets);
  console.log(budgets);

    
  return (
    <main className="flex items-center justify-center size-full ">
      <div className="flex flex-col items-center space-y-4 size-full">
        <Header/>
        <div className="text-lg text-center h-screen w-4xl border-1 border-gray-200 p-4 rounded-lg shadow-lg">
          <h2 className="text-4xl font-bold text-center">Current Budgets:</h2>
          <ul className="flex flex-col">
            {budgets.map((budget: any) => (
            <li className="flex justify-around">
              <h1>{budget.category}</h1>
              <p>${budget.amount}</p>
            </li>
            ))}
          </ul>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"><a href="/budget">Add Budget</a></button>
        </div>
        <Footer/>
      </div>
    </main>
  );
}
