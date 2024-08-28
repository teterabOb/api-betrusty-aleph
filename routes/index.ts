import { Router } from "express";
import github from "./auth/github/githubAuth"
import worldId from "./auth/worldid/worldidAuth"
import ml from "./auth/ml/mlAuth"
import userTable from "./tables/userTable"
import user from "./user/user"

const routes = Router();

routes.use("/github", github)
routes.use("/worldid", worldId)
routes.use("/ml", ml)
routes.use("/user-table", userTable)
routes.use("/user", user)
routes.get('/', (req, res) => res.json(('API Trusthub - TypeScript Server Deployed on Vercel')));

export default routes;