'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import { BlogPost, blogCategories } from '@/content/blog';
import CTASection from '@/components/marketing/CTASection';

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const categoryName = blogCategories.find((c) => c.id === post.category)?.name;

  return (
    <>
      {/* Header */}
      <section className="section-sm bg-gradient-to-b from-primary-50 to-white">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <Link href="/blog" className="hover:text-primary-600">
                Blog
              </Link>
              <span>/</span>
              <span className="text-slate-700">{categoryName}</span>
            </nav>

            {/* Category badge */}
            <span className="badge-primary mb-4">{categoryName}</span>

            {/* Title */}
            <h1 className="heading-xl text-slate-900 mb-6">{post.title}</h1>

            {/* Excerpt */}
            <p className="body-lg mb-8">{post.excerpt}</p>

            {/* Author and meta */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary-600">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{post.author.name}</p>
                  <p className="text-sm text-slate-500">{post.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>{post.readingTime} min de leitura</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image Placeholder */}
      <section className="py-8 bg-white">
        <div className="container-marketing">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <svg
                className="w-24 h-24 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-white">
        <div className="container-marketing">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main content */}
            <article className="lg:col-span-3 prose prose-slate prose-lg max-w-none">
              {/* In a real app, this would be MDX content */}
              <div
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .replace(/^# .+$/gm, '') // Remove first h1 (already in header)
                    .replace(/## /g, '<h2>')
                    .replace(/### /g, '<h3>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/- /g, '<li>')
                }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-slate-200 not-prose">
                <p className="text-sm font-medium text-slate-700 mb-3">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-slate-200 not-prose">
                <p className="text-sm font-medium text-slate-700 mb-3">
                  Compartilhar:
                </p>
                <div className="flex gap-3">
                  <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Newsletter */}
              <div className="bg-primary-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Newsletter
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Receba artigos como este diretamente no seu email.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="input text-sm"
                  />
                  <button type="submit" className="btn-primary btn-sm w-full">
                    Inscrever
                  </button>
                </form>
              </div>

              {/* Author card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Sobre o autor</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary-600">
                      {post.author.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{post.author.name}</p>
                    <p className="text-sm text-slate-500">{post.author.role}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Especialista em gestão de negócios e tecnologia.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-marketing">
            <h2 className="heading-md text-slate-900 mb-8">Artigos relacionados</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-soft-lg transition-shadow"
                >
                  <span className="text-xs text-primary-600 font-medium">
                    {blogCategories.find((c) => c.id === relatedPost.category)?.name}
                  </span>
                  <h3 className="font-semibold text-slate-900 mt-2 mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection variant="gradient" />
    </>
  );
}
