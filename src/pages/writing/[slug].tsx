import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import ArrowLeft from "../../assets/arrow-left";
import Calendar from "../../assets/calendar";
import BlogDivider from "../../components/BlogDivider";
import { GetPost, GetPostSlug } from "../../graphql/data/posts/post";
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import Footer from "../../components/Footer";

interface Props {
  slug: string
  blog: {
    id: string
    title: string
    publishedAt: string
    excerpt: string
    coverImage: {
      url: string
      width: number
      height: number
    }
    body: {
      json: string
      markdown: string
    }
  }
  content: MDXRemoteSerializeResult
}

export async function getStaticPaths() {
  const data = await GetPostSlug()
  const slugs = data.blogPosts

  return {
    paths: slugs.map((slug) => ({
      params: { slug: slug.slug }
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = await GetPost(params.slug)

  return {
    revalidate: 60 * 60,
    props: {
      blog: post.blogPosts[0],
      content: await serialize(post.blogPosts[0].body.markdown)
    },
  }
}

export default function PostView({ blog, content }: Props) {
  console.log(blog);

  return (
    <Layout>
      <Head>
        <title>Writing</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="max-w-screen-md lg:max-w-6xl mx-auto">
        <Link href="/writing">
          <a>
            <nav className="max-w-screen-md inline-flex space-x-2 my-10 items-center">
              <ArrowLeft />
              <p className="font-medium text-gray-800 pb-1">Back to Writing</p>
            </nav>
          </a>
        </Link>
        <main className="max-w-screen-md mx-auto">
          <header className="flex-col mt-12 mb-10 space-y-4 justify-center">
            <h2 className="text-5xl text-gray-800 font-bold text-center">{blog.title}</h2>
            <p className="text-xl text-center text-gray-700">{blog.excerpt}</p>
            <div className="flex justify-center space-x-2">
              <Calendar />
              <p className="text-gray-500">{new Date(blog.publishedAt).toDateString()}</p>
            </div>
          </header>
          <BlogDivider />

          <div className="prose prose-lg my-10 mx-auto">
            <MDXRemote {...content} />
          </div>

        </main>

      </div>
      <Footer />


    </Layout>

  )
}