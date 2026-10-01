import type { MetadataRoute } from "next";
import axios from "axios";
import { industryDetails } from "@/constant/industries_data";
import { fetchCatalog } from "@/hooks/catalog";
import type { MenuResponse } from "@/types/menu.types";
import type { BlogResponse } from "@/types/blog.types";

/**
 * Dynamic sitemap (App Router convention).
 *
 * This file IS the sitemap — Next.js serves it at /sitemap.xml automatically.
 * There is nothing to "regenerate" by hand:
 *
 *  - Static routes below update the moment this file is edited and deployed.
 *  - Industries pull from `industryDetails`, so adding/removing an industry
 *    there updates the sitemap on the next deploy with no extra step.
 *  - Categories, products and blog posts are fetched live from the site's
 *    own API (the same functions the pages themselves use), and the
 *    `revalidate` setting below makes Next.js refresh that data in the
 *    background at most once an hour — so a new product added in the
 *    backend admin shows up in the sitemap within the hour, with zero
 *    deploys and zero manual edits.
 *
 * If you add a new STATIC page (not driven by the catalog/industries data),
 * add one line to `staticRoutes` below. That's the only manual step this
 * setup ever needs.
 */

export const revalidate = 3600; // refresh dynamic (catalog/blog) entries at most every hour

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.novasac.eu";

const BASE_URL = "https://www.gangapapers.in/novasac/api";

type SitemapEntry = MetadataRoute.Sitemap[number];

function abs(path: string): string {
    return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// ---------------------------------------------------------------------------
// Static routes — pages that aren't generated from catalog/industries data.
// Add a line here whenever a new static page is added to src/app/.
// ---------------------------------------------------------------------------
function getStaticRoutes(): SitemapEntry[] {
    const now = new Date();

    const routes: { path: string; changeFrequency: SitemapEntry["changeFrequency"]; priority: number }[] = [
        { path: "/", changeFrequency: "weekly", priority: 1.0 },
        { path: "/about", changeFrequency: "monthly", priority: 0.7 },
        { path: "/company-information", changeFrequency: "yearly", priority: 0.4 },
        { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
        { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
        { path: "/custom-made-bags", changeFrequency: "monthly", priority: 0.8 },
        { path: "/industries", changeFrequency: "monthly", priority: 0.6 },
        { path: "/novasac-recycling", changeFrequency: "monthly", priority: 0.6 },
        { path: "/popular-products", changeFrequency: "weekly", priority: 0.7 },
        { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
        { path: "/recycled-bags", changeFrequency: "monthly", priority: 0.8 },
        { path: "/technical-textiles", changeFrequency: "monthly", priority: 0.8 },
        { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
    ];

    return routes.map((r) => ({
        url: abs(r.path),
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }));
}

// ---------------------------------------------------------------------------
// Industries — sourced from the same data file that drives
// generateStaticParams on /industries/[slug], so this can never drift
// out of sync with what pages actually exist.
// ---------------------------------------------------------------------------
function getIndustryRoutes(): SitemapEntry[] {
    return industryDetails.map((industry) => ({
        url: abs(`/industries/${industry.slug}`),
        changeFrequency: "monthly",
        priority: 0.6,
    }));
}

// ---------------------------------------------------------------------------
// Categories + Products — fetched live from the catalog API.
// Wrapped defensively: if the API is briefly unavailable at build/refresh
// time, we log it and return what we already have rather than let a single
// failed request take down the whole sitemap.
// ---------------------------------------------------------------------------
async function getCategorySlugs(): Promise<string[]> {
    try {
        const { data } = await axios.get<MenuResponse>(`${BASE_URL}/menu`, {
            timeout: 10_000,
        });
        if (!data?.status || !Array.isArray(data.data)) return [];
        return data.data.map((c) => c.category_slug).filter(Boolean);
    } catch (err) {
        console.error("[sitemap] failed to fetch category list:", err);
        return [];
    }
}

async function getCatalogRoutes(): Promise<SitemapEntry[]> {
    const categorySlugs = await getCategorySlugs();
    if (categorySlugs.length === 0) return [];

    const entries: SitemapEntry[] = [];
    const MAX_PAGES_PER_CATEGORY = 200; // safety cap — generous, prevents a runaway loop if the API's pagination ever misbehaves

    for (const categorySlug of categorySlugs) {
        entries.push({
            url: abs(`/category/${categorySlug}`),
            changeFrequency: "weekly",
            priority: 0.7,
        });

        try {
            let page = 1;
            let hasNextPage = true;

            while (hasNextPage && page <= MAX_PAGES_PER_CATEGORY) {
                const res = await fetchCatalog({ slug: [categorySlug], page });
                const { products, pagination } = res.data;

                for (const product of products) {
                    if (!product.slug || !product.attributes_value_slug) continue;
                    entries.push({
                        url: abs(`/products/${product.slug}/${product.attributes_value_slug}`),
                        changeFrequency: "weekly",
                        priority: 0.65,
                    });
                }

                hasNextPage = pagination.has_next_page;
                page += 1;
            }
        } catch (err) {
            console.error(`[sitemap] failed to fetch products for category "${categorySlug}":`, err);
            // Continue to the next category rather than aborting the whole sitemap.
        }
    }

    return entries;
}

// ---------------------------------------------------------------------------
// Blog — NOTE: the only blog endpoint this app currently calls
// (/api/home/blog) is the homepage "Latest Blogs" teaser, which may only
// return a limited recent set rather than the full archive. There's no
// dedicated full-list blog endpoint in use elsewhere in the codebase as of
// this writing. This will include whatever that endpoint returns; if the
// blog grows a real archive beyond that, a bulk listing endpoint should be
// added on the backend and this function pointed at it.
// ---------------------------------------------------------------------------
async function getBlogRoutes(): Promise<SitemapEntry[]> {
    try {
        const { data } = await axios.get<BlogResponse>(`${BASE_URL}/home/blog`, {
            timeout: 10_000,
        });
        if (!data?.status || !Array.isArray(data.data)) return [];
        return data.data
            .filter((post) => Boolean(post.slug))
            .map((post) => ({
                url: abs(`/blog/${post.slug}`),
                lastModified: post.published_at ? new Date(post.published_at) : undefined,
                changeFrequency: "monthly" as const,
                priority: 0.5,
            }));
    } catch (err) {
        console.error("[sitemap] failed to fetch blog posts:", err);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [catalogRoutes, blogRoutes] = await Promise.all([
        getCatalogRoutes(),
        getBlogRoutes(),
    ]);

    return [
        ...getStaticRoutes(),
        ...getIndustryRoutes(),
        ...catalogRoutes,
        ...blogRoutes,
    ];
}
