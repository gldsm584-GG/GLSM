import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // TODO: trocar pelo host do projeto Supabase da Bibi assim que ele existir
        // (Project Settings → API → Project URL, só o domínio).
        hostname: "TROCAR-projeto.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
