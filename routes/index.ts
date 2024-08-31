import { Router } from "express";
import github from "./auth/github/githubAuth"
import worldId from "./auth/worldid/worldidAuth"
import ml from "./auth/ml/mlAuth"
import userTable from "../data/tables/userTable"
import user from "./user/user"

const routes = Router();

routes.use("/api/github", github)
routes.use("/api/worldid", worldId)
routes.use("/api/ml", ml)
routes.use("/api/user-table", userTable)
routes.use("/api/user", user)
routes.get('/', (_req, res) => res.json(('API Trusthub - TypeScript Server Deployed on Vercel')));

export default routes;