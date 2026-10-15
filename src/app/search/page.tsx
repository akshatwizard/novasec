import SearchedProducts from "@/components/searchedProduct"
import Section from "@/components/ui/section"
import Wrapper from "@/components/ui/wrapper"
import { SearchProductAPIResponse } from "@/types/search_product.type"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Metadata } from "next"

async function fetchSearchProducts(query: string, page = 1): Promise<SearchProductAPIResponse> {
    const res = await axios.get<SearchProductAPIResponse>("https://www.gangapapers.in/novasac/api/search", {
        params: { query, page },
    })
    return res.data
}

export default async function QueryPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
    const { q } = await searchParams

    const queryClient = new QueryClient()

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['search', q],
        queryFn: ({ pageParam = 1 }) => fetchSearchProducts(q, pageParam as number),
        getNextPageParam: (lastPage: SearchProductAPIResponse) =>
            lastPage.pagination.has_next_page ? lastPage.pagination.current_page + 1 : undefined,
        initialPageParam: 1,
    })

    const cachedData = queryClient.getQueryData<{ pages: SearchProductAPIResponse[] }>(['search', q])
    const firstPage = cachedData?.pages?.[0]
    const initialProducts = firstPage?.products ?? []
    const initialTotalProducts = firstPage?.pagination.total_products ?? 0

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Section>
                <Wrapper>
                    <div className="mb-10">
                        <nav className="text-xs text-stone-400 tracking-wide mb-3 flex items-center gap-1.5">
                            <span>Home</span>
                            <span>/</span>
                            <span className="text-stone-600">Search</span>
                        </nav>
                        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 tracking-tight">
                            Results for &ldquo;{q}&rdquo;
                        </h1>
                        {firstPage && (
                            <p className="mt-2 text-sm text-stone-500">
                                {initialTotalProducts} products found
                            </p>
                        )}
                    </div>

                    <SearchedProducts
                        query={q}
                        initialProducts={initialProducts}
                        initialTotalProducts={initialTotalProducts}
                    />
                </Wrapper>
            </Section>
        </HydrationBoundary>
    )
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q: string }> }): Promise<Metadata> {
    const { q } = await searchParams
    try {
        const res = await axios.get("https://www.gangapapers.in/novasac/api/search", { params: { query: q } })
        const { meta } = res.data
        return { title: meta.title, description: meta.description, keywords: meta.keywords }
    } catch {
        return { title: 'Search | Novasac' }
    }
}