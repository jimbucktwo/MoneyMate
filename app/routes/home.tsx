import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personal Budget Manager" },
    { name: "description", content: "Welcome to Money Mate!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: "Hello from MoneyMate" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome message={loaderData.message} />;
}
