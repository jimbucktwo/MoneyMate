import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import Header from "../components/header";
import Footer from "../components/footer";
import {useUser} from "@clerk/clerk-react";

export async function Welcome({user} : {user: string}) {
  const userInfo = JSON.parse(user);
  
  return (
    <main className="flex items-center justify-center pb-4 size-full ">
      <div className="flex flex-col items-center space-y-4 size-full">
        <Header/>
          <h1 className="text-lg text-center h-screen">Hello! {userInfo.username}</h1>
        <Footer/>
      </div>
    </main>
  );
}
