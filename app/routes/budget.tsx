import Header from "../components/header";
import Footer from "../components/footer";

export default function Budget() {
    return (
        <main className="flex items-center justify-center pb-4 size-full">
      <div className="flex flex-col items-center space-y-4 size-full">
        <Header/>
          <h1 className="text-4xl font-bold text-center">Budget Page</h1>
        <Footer/>
        </div>
      </main>
    );
  }
  