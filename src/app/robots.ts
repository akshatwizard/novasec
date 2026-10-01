import type { MetadataRoute } from "next";

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.novasac.eu";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/profile/", "/search"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
