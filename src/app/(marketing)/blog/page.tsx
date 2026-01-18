'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { blogPosts, blogCategories } from '@/content/blog';
import CTASection from '@/components/marketing/CTASection';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPosts =
    activeCategory === 'all'
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  const featuredPosts = blogPosts.filter((post) => post.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="section-sm bg-gradient-to-b from-primary-50 to-white">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="badge-primary mb-4">Blog</span>
            <h1 className="heading-xl text-slate-900 mb-6">
              Dicas e insights para seu negócio
            </h1>
            <p className="body-lg">
              Artigos, guias e novidades para ajudar você a crescer e gerenciar
              seu negócio de forma mais eficiente.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container-marketing">
            <h2 className="heading-md text-slate-900 mb-8">Destaques</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 hover:shadow-soft-lg transition-shadow group h-full"
                  >
                    <span className="badge-primary text-xs mb-4">
                      {blogCategories.find((c) => c.id === post.category)?.name}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary-600">
                            {post.author.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">
                            {post.author.name}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">
                        {post.readingTime} min de leitura
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-slate-200 sticky top-16 md:top-20 z-40">
        <div className="container-marketing">
          <div className="flex flex-wrap justify-center gap-2">
            {blogCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="section bg-white">
        <div className="container-marketing">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="block bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-soft-lg hover:border-primary-200 transition-all group h-full"
                >
                  {/* Image placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-slate-300"
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

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-primary-600 font-medium">
                        {blogCategories.find((c) => c.id === post.category)?.name}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">
                        {post.readingTime} min
                      </span>
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary-600">
                          {post.author.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {post.author.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">
                Nenhum artigo encontrado nesta categoria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section bg-slate-50">
        <div className="container-marketing">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-lg text-slate-900 mb-4">
              Receba nossos artigos por email
            </h2>
            <p className="body-lg mb-8">
              Cadastre-se e receba as últimas dicas e novidades diretamente no
              seu inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="seu@email.com"
                className="input flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Inscrever
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection variant="gradient" />
    </>
  );
}
