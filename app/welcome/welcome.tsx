import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import Header from "../components/header";
import Footer from "../components/footer";
import {useUser} from "@clerk/clerk-react";
import {useEffect, useState} from "react";
import { redirect } from "react-router";


export async function Welcome({user} : {user: string}) {
  const userInfo = JSON.parse(user);
  const [budgets, setBudgets] = useState(userInfo ? userInfo.budgets : []);

    
  return (
    <main className="flex items-center justify-center size-full ">
      <div className="flex flex-col items-center space-y-4 size-full h-screen">
        <Header/>
        <div className="flex flex-col items-center justify-center size-full h-screen">
        <h1 className="text-3xl font-bold text-center">Welcome, {userInfo.username}!</h1>
        <p className="text-lg text-center p-4">
          Manage your finances with ease. Choose an option below to get started.
        </p>
        <div className="flex space-x-4">
          <button
            
            className="bg-gray-800 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 transition duration-200"
          >
            <a href="/budget">
            View Budgets
            </a>
          </button>
          
        </div>
      </div>
        <Footer/>
      </div>
    </main>
  );
}
