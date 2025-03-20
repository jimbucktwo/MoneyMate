import Header from "../components/header";
import Footer from "../components/footer";
import {SignUp} from "@clerk/clerk-react";

export default function Register() {
    return (
        <main className="flex items-center justify-center size-full h-screen">
      <div className="flex flex-col items-center space-y-4 size-full">
        <Header/>
        <div className="flex items-center justify-center size-full">
          <SignUp signInUrl={"/login"}/>
          </div>
          <Footer/>
        </div>
      </main>
    );
  }
  