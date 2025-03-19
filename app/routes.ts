import { type RouteConfig, index, route, layout} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("account", "routes/account.tsx"),
    route("budget", "routes/budget.tsx"),
    route("login/*", "routes/login.tsx"),
    route("register/*", "routes/register.tsx")
        
] satisfies RouteConfig;
