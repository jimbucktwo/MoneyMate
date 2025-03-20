import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import {getAuth} from '@clerk/react-router/ssr.server';
import { createClerkClient } from "@clerk/react-router/api.server";
import { redirect } from "react-router";
import {useUser} from "@clerk/clerk-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personal Budget Manager" },
    { name: "Yep Yep", content: "Welcome to Money Mate!" },
  ];
}

export async function loader( context : Route.LoaderArgs) {
  const {userId} = await getAuth(context);
  if (!userId) {
    return redirect('/login');
  }

   const user = await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.getUser(
    userId,
  )

  return {
    user: JSON.stringify(user),
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { isSignedIn, user, isLoaded } = useUser();
  return <Welcome user={loaderData.user}/>;
}
