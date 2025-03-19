import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personal Budget Manager" },
    { name: "Yep Yep", content: "Welcome to Money Mate!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: "Welcome!" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome message={loaderData.message} />;
}
