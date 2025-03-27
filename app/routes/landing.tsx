import Header from "../components/header";
import Footer from "../components/footer";
import { redirect } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import type {Route} from "./+types/landing";


export default async function Landing() {
  return (
    <main className="flex items-center justify-center size-full ">
      <div className="bg-[url('app/images/landing.jpeg')] justify-center bg-cover bg-center flex flex-col items-center size-full h-screen">
          <div className="flex flex-col items-end justify-center w-8xl">
          <h1 className="flex text-6xl font-bold text-center">Welcome to MoneyMate!</h1>
          
          <p className="flex text-4xl font-semibold text-center p-4">MoneyMate is a personal finance management tool that helps you track your spending and saving habits.</p>
          
        <button className=" bg-white p-4 hover:text-white hover:bg-gray-200 px-20 py-4 rounded-full transition duration-200"><a className="text-xl"href="/register">Get Started</a></button>
      </div>
      </div>
    </main>
  );
}
