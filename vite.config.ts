import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";



export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      'process.env.VITE_CLERK_PUBLISHABLE_KEY' : JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY),
      'process.env.VITE_PUBLIC_BACKEND_URL' : JSON.stringify(env.VITE_PUBLIC_BACKEND_URL),
    },
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    ssr: {
      noExternal: command === "build" ? true : undefined,
    },
  }
});