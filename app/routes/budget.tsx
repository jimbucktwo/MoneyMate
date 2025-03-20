import Header from "../components/header";
import Footer from "../components/footer";
import {useUser} from "@clerk/clerk-react";

export default function Budget() {
  const {isLoaded, user, isSignedIn} = useUser();
    return (
        <main className="flex items-center justify-center size-full">
      <div className="flex flex-col items-center space-y-4 size-full">
        <Header/>
        <div className="h-screen">
          <h1 className="text-4xl font-bold text-center">Add Budget</h1>
        </div>
        <Footer/>
        </div>
      </main>
    );
  }
  