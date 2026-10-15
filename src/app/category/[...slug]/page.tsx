import CatalogClient from '@/components/catalog_client'
import Section from '@/components/ui/section'
import Wrapper from '@/components/ui/wrapper'
import { catalogKeys, fetchCatalog } from '@/hooks/catalog'
import { CatalogApiResponse } from '@/types/catalog.types'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
    const { slug } = await params

    try {
        const res: CatalogApiResponse = await fetchCatalog({ slug, page: 1 })
        const { meta } = res.data
        return {
            title: meta.title,
            description: meta.description,
            keywords: meta.keywords,
        }
    } catch {
        return { title: 'Product Catalog | Novasac' }
    }
}

export default async function ProductsLists({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params

    const queryClient = new QueryClient()
    const activeFilters = {}

    await queryClient.prefetchInfiniteQuery({
        queryKey: catalogKeys.list(slug, activeFilters),
        queryFn: ({ pageParam = 1 }) => fetchCatalog({ slug, page: pageParam as number, filters: activeFilters }),
        getNextPageParam: (lastPage: CatalogApiResponse) => {
            const { pagination } = lastPage.data
            return pagination.has_next_page ? pagination.current_page + 1 : undefined
        },
        initialPageParam: 1,
    })

    const cachedData = queryClient.getQueryData<{ pages: CatalogApiResponse[] }>(catalogKeys.list(slug, activeFilters))

    const firstPage = cachedData?.pages?.[0]?.data

    const initialFilters = firstPage?.product_filters ?? []
    const initialProducts = firstPage?.products ?? []
    const initialTotalProducts = firstPage?.pagination.total_products ?? 0
    const attribute_value = firstPage?.attribute_value?.slug ?? firstPage?.products[0].attributes_value_slug

    const pageTitle = firstPage?.attribute_value ? `${firstPage?.attribute_value?.name}` : firstPage?.category.title

    const shortContent = firstPage?.primary_category?.short_content
    const longContent = firstPage?.primary_category?.long_content

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Section className='relative bg-black overflow-hidden'>
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(ellipse 60% 80% at 15% 60%, rgba(255,89,3,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 85% 10%, rgba(255,113,10,0.12) 0%, transparent 65%)",
                    }}
                />

                {/* Bottom fade into page */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/60 to-transparent" />
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary-500/70 to-transparent" />

                <Wrapper>
                    <div>
                        <nav className="text-xs text-stone-300 tracking-wide mb-3 flex items-center gap-1.5">
                            <span>Home</span>
                            <span>/</span>
                            <span>{firstPage?.category.title}</span>
                            {firstPage?.attribute_value && (
                                <>
                                    <span>/</span>
                                    <span className="text-stone-500">{firstPage.attribute_value.name}</span>
                                </>
                            )}
                        </nav>

                        <h1 className="font-serif text-3xl md:text-4xl text-stone-200 tracking-tight">
                            {pageTitle}
                        </h1>

                        {firstPage && (
                            <div className="mt-4 shrink-0 inline-flex items-center gap-2 border border-stone-700/60 bg-stone-900/60 backdrop-blur-sm rounded-full px-4 py-2 self-start sm:self-auto">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                                <span className="text-xs text-stone-300 tracking-wide whitespace-nowrap">
                                    {firstPage.pagination.total_products} products
                                </span>
                            </div>
                        )}

                        {shortContent && (
                            <div className="mt-6 relative">
                                {/* Decorative left border accent */}
                                <div className="absolute left-0 top-0 bottom-0 w-0.75 rounded-full bg-linear-to-b from-primary-400 via-primary-300 to-primary-100" />
                                <div className="pl-5">
                                    <div
                                        className="text-sm md:text-[15px] leading-relaxed text-stone-300 font-light [&>p]:m-0"
                                        dangerouslySetInnerHTML={{ __html: shortContent }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </Wrapper>
            </Section>

            <Section>
                <Wrapper>
                    <CatalogClient
                        slug={slug}
                        initialFilters={initialFilters}
                        initialProducts={initialProducts}
                        initialTotalProducts={initialTotalProducts}
                        attributeValue={attribute_value!}
                    />

                    {longContent && (
                        <div className="mt-20 mb-10">
                            {/* Divider with label */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px flex-1 bg-stone-200" />
                                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium whitespace-nowrap">
                                    About {pageTitle}
                                </span>
                                <div className="h-px flex-1 bg-stone-200" />
                            </div>

                            {/* Content card */}
                            <div className="relative bg-stone-50 border border-stone-200 rounded-2xl px-7 py-8 md:px-12 md:py-10 overflow-hidden">
                                {/* Decorative corner grain texture via box-shadow */}
                                <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full opacity-15 bg-primary-500 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-tr-full opacity-15 bg-primary-500 pointer-events-none" />

                                {/* Prose content */}
                                <div
                                    className="ws-prose"
                                    dangerouslySetInnerHTML={{ __html: longContent }}
                                />
                            </div>
                        </div>
                    )}
                </Wrapper>
            </Section>
        </HydrationBoundary>
    )
}
