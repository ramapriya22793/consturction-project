import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../config/supabase";
import { prisma } from "../config/prisma";
import { Role } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  supabaseId: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // In development / demo mode, allow fallback or require token
      if (process.env.NODE_ENV === "development" && req.headers["x-demo-user-id"]) {
        const demoUser = await prisma.user.findUnique({
          where: { id: req.headers["x-demo-user-id"] as string },
        });
        if (demoUser) {
          req.user = {
            id: demoUser.id,
            supabaseId: demoUser.supabaseId || "demo-sub",
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
          };
          return next();
        }
      }
      res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const { data: { user: authUser }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !authUser) {
      res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
      return;
    }

    // Find or create local user record synced with Supabase
    let localUser = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });

    if (!localUser && authUser.email) {
      localUser = await prisma.user.findUnique({
        where: { email: authUser.email },
      });
      if (localUser) {
        localUser = await prisma.user.update({
          where: { id: localUser.id },
          data: { supabaseId: authUser.id },
        });
      } else {
        localUser = await prisma.user.create({
          data: {
            supabaseId: authUser.id,
            email: authUser.email,
            name: (authUser.user_metadata?.full_name as string) || authUser.email.split("@")[0],
            role: (authUser.user_metadata?.role as Role) || Role.SITE_ENGINEER,
          },
        });
      }
    }

    if (!localUser) {
      res.status(401).json({ error: "User account not found" });
      return;
    }

    req.user = {
      id: localUser.id,
      supabaseId: localUser.supabaseId || authUser.id,
      email: localUser.email,
      name: localUser.name,
      role: localUser.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
