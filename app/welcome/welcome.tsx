import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import Header from "../components/header";
import Footer from "../components/footer";

export function Welcome({ message }: { message: string }) {
  return (
    <main className="flex items-center justify-center pb-4 size-full">
      <div className="flex flex-col items-center space-y-4 size-full">
        <Header/>
        <p className="text-lg text-center">{message}</p>
        <Footer/>
      </div>
    </main>
  );
}
