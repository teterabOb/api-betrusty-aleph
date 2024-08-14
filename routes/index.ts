import { Router } from "express";
import express from "express"
import github from "./auth/github/githubAuth"

const routes = Router();

routes.use("/github", github)
routes.get('/', (req, res) => res.json(('express vercel boiler plate')));

export default routes;