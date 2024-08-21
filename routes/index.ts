import { Router } from "express";
import github from "./auth/github/githubAuth"
import worldId from "./auth/worldid/worldidAuth"
import userTable from "./tables/userTable"

const routes = Router();

routes.use("/github", github)
routes.use("/worldid", worldId)
routes.use("/user-table", userTable)
routes.get('/', (req, res) => res.json(('Express + TypeScript Server on Vercel')));

export default routes;