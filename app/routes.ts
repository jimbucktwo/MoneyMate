import { type RouteConfig, index, route, layout} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("account", "routes/account.tsx"),
    route("budget", "routes/budget.tsx"),
    layout("./auth/layout.tsx", [
        route("login", "./auth/login.tsx"),
        route("register", "./auth/register.tsx")
    ])
] satisfies RouteConfig;
