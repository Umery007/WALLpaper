import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import env from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import billingRoutes from "./routes/billing.js";
import favoriteRoutes from "./routes/favorites.js";
import imageRoutes from "./routes/images.js";
import userRoutes from "./routes/users.js";
import wallpaperRoutes from "./routes/wallpapers.js";
import folderRoutes from "./routes/folders.js";
import { serveWallpaperImage } from "./middleware/wallpaperMedia.js";
import { optionalAuth } from "./middleware/auth.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet({
    // As imagens geradas sao servidas daqui e exibidas no frontend (outra porta).
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }));

  const allowedOrigins = new Set([env.frontendUrl, "http://localhost:5173", "http://127.0.0.1:5173"]);
  app.use(cors({
    origin(origin, callback) {
      // Sem origin = mesma origem, curl, apps nativos.
      let localDevelopmentOrigin = false;
      if (origin && !env.isProduction) {
        try {
          const url = new URL(origin);
          localDevelopmentOrigin = url.protocol === "http:"
            && ["localhost", "127.0.0.1"].includes(url.hostname);
        } catch {
          localDevelopmentOrigin = false;
        }
      }
      if (!origin || allowedOrigins.has(origin) || localDevelopmentOrigin) {
        return callback(null, true);
      }
      return callback(new Error(`Origem nao autorizada: ${origin}`));
    },
    credentials: true,
  }));

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  if (!env.isProduction) app.use(morgan("dev"));

  // Imagens geradas: verifica a visibilidade do wallpaper antes de servir.
  app.get("/uploads/wallpapers/:filename", optionalAuth, serveWallpaperImage);

  // Outros arquivos de upload (como avatares).
  app.use("/uploads", express.static(env.uploadsDir, {
    maxAge: "7d",
    fallthrough: true,
  }));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "wa1paper-api",
      ai_configured: Boolean(env.geminiApiKey),
      billing_configured: Boolean(env.mercadoPagoAccessToken),
      time: new Date().toISOString(),
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/wallpapers", wallpaperRoutes);
  app.use("/api/favorites", favoriteRoutes);
  app.use("/api/folders", folderRoutes);
  app.use("/api/images", imageRoutes);
  app.use("/api/billing", billingRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
