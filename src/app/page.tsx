import About from '@/components/about'
// import AdditionalDetails from '@/components/additional_details'
import BentoGrid from '@/components/bento_grid'
// import Blogs from '@/components/blogs'
import ContactUs from '@/components/contact'
import Faq from '@/components/faq'
// import Hero from '@/components/hero/hero'
import Industry from '@/components/industry'
// import NewsLetter from '@/components/news_letter'
import ProductCategory from '@/components/product_category'
import RecycledBagsSection from '@/components/recycled_bags_section'
import Products from '@/components/new_arrival_products'
// import Promotional from '@/components/promotional'
// import Testimonials from '@/components/testimonials'
import WhyChooseUs from '@/components/why_choose_us'
// import TrendingProducts from '@/components/trending_product'

export default function Home() {
  return (
    <main className='overflow-hidden'>
      <BentoGrid />
      <RecycledBagsSection />
      {/* <AdditionalDetails /> */}
      {/* <Hero/> */}
      <About />
      <ProductCategory />
      <Products />
      <Industry />
      {/* <BentoGrid /> */}
      {/* <TrendingProducts /> */}
      <WhyChooseUs />
      {/* <Testimonials /> */}
      {/* <Blogs /> */}
      <ContactUs />
      <Faq />
      {/* <NewsLetter /> */}
    </main>
  )
}
