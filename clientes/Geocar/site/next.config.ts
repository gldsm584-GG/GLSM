import type { NextConfig } from "next";

// Fotos enviadas pelo painel ficam no Storage do Supabase — libera o domínio
// do projeto (vem da variável de ambiente, então não precisa editar aqui).
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
