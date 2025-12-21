import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StackSettle - Poker Game Settlement",
    short_name: "StackSettle",
    description:
      "Track buy-ins, cash-outs, and settle up with minimal transfers for your home poker games",
    start_url: "/",
    display: "standalone",
    background_color: "#18181b",
    theme_color: "#f59e0b",
    orientation: "portrait",
    categories: ["games", "finance", "utilities"],
    icons: [
      {
        src: "/images/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
