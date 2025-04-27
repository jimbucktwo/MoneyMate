import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import {getAuth} from '@clerk/react-router/ssr.server';
import { createClerkClient } from "@clerk/react-router/api.server";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personal Budget Manager" },
    { name: "Yep Yep", content: "Welcome to Money Mate!" },
  ];
}

export async function loader( context : Route.LoaderArgs) {
  const {userId} = await getAuth(context);
  
  if (!userId) {
    return redirect('/landing');
  }

   const user = await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.getUser(
    userId,
  )
  
  
  let data = user;
  try {
    // Fetch assigned budgets
    // const response = await fetch(`${process.env.VITE_PUBLIC_BACKEND_URL}/users/get_user/${user.id}`, {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    // });
    const baseURL = process.env.VITE_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
const response = await fetch(`${baseURL}/users/get_user/${user.id}`, {
  method: "GET",
  headers: { "Content-Type": "application/json" },
});
    // Throw an error if the response is not successful
    if (!response.ok) {
      throw new Error(`Failed to fetch assigned budgets. Status: ${response.status}`);
    }

    // Parse the response as JSON
    data = await response.json();
    console.log("Fetched data:", data);

  } catch (err) {
    console.error("Error fetching assigned budgets:", err);
  };
  return {
    user: JSON.stringify(data),
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome user={loaderData.user}/>;
}
