import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ArrowRight, Tag, Users, TrendingUp, Sparkles } from 'lucide-react';

const categories = [
  { name: 'All Posts', icon: <BookOpen className="w-4 h-4" /> },
  { name: 'NDIS Updates', icon: <TrendingUp className="w-4 h-4" /> },
  { name: 'Provider Tips', icon: <Sparkles className="w-4 h-4" /> },
  { name: 'Community Stories', icon: <Users className="w-4 h-4" /> },
  { name: 'Events', icon: <Calendar className="w-4 h-4" /> },
  { name: 'Resources', icon: <Tag className="w-4 h-4" /> },
];

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Your NDIS Plan: A Complete Guide',
    excerpt:
      'Navigate your NDIS plan with confidence. Learn how to read, understand, and make the most of your funding categories and support budgets.',
    category: 'Resources',
    date: 'March 22, 2026',
    gradient: 'from-purple-500 to-pink-500',
    readTime: '8 min read',
  },
  {
    id: 2,
    title: 'Top 5 Tips for NDIS Providers to Grow Their Business',
    excerpt:
      'Discover proven strategies that help NDIS providers expand their reach, build stronger participant relationships, and grow sustainably.',
    category: 'Provider Tips',
    date: 'March 18, 2026',
    gradient: 'from-blue-500 to-indigo-500',
    readTime: '6 min read',
  },
  {
    id: 3,
    title: 'Community Spotlight: Making a Difference Together',
    excerpt:
      'Meet the local providers and participants who are building meaningful connections and transforming lives in their communities.',
    category: 'Community Stories',
    date: 'March 14, 2026',
    gradient: 'from-green-500 to-teal-500',
    readTime: '5 min read',
  },
  {
    id: 4,
    title: 'NDIS Price Guide Updates 2026: What You Need to Know',
    excerpt:
      'Stay up to date with the latest NDIS price guide changes, new support categories, and what they mean for participants and providers.',
    category: 'NDIS Updates',
    date: 'March 10, 2026',
    gradient: 'from-orange-500 to-red-500',
    readTime: '7 min read',
  },
  {
    id: 5,
    title: 'How to Choose the Right Support Worker',
    excerpt:
      'Finding the right support worker is essential. Here are the key qualities to look for and questions to ask during the selection process.',
    category: 'Resources',
    date: 'March 5, 2026',
    gradient: 'from-cyan-500 to-blue-500',
    readTime: '6 min read',
  },
  {
    id: 6,
    title: 'Upcoming Events: Connect with Your Local NDIS Community',
    excerpt:
      'Join workshops, networking meetups, and community gatherings designed to strengthen connections across the disability services sector.',
    category: 'Events',
    date: 'February 28, 2026',
    gradient: 'from-pink-500 to-purple-500',
    readTime: '4 min read',
  },
];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All Posts');

  const filteredPosts =
    activeCategory === 'All Posts'
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  const categoryColor = (category) => {
    const colors = {
      'NDIS Updates': 'bg-orange-100 text-orange-700',
      'Provider Tips': 'bg-purple-100 text-purple-700',
      'Community Stories': 'bg-green-100 text-green-700',
      Events: 'bg-pink-100 text-pink-700',
      Resources: 'bg-blue-100 text-blue-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-5 h-5 text-white" />
            <span className="text-white/90 text-sm font-medium">
              Insights, Updates & Community Stories
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Blog & News
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
            Stay informed with the latest NDIS updates, provider tips, community
            stories, and resources to help you thrive.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.name
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No posts found in this category yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
              >
                {/* Placeholder Image */}
                <div
                  className={`h-48 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm ${categoryColor(post.category).replace('bg-', 'text-').split(' ')[1] || 'text-gray-700'}`}
                    >
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 opacity-20">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-pink-600 transition-colors duration-200 group/link"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More / Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-300 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Stay in the Loop
            </h2>
            <p className="text-purple-100 mb-6 max-w-lg mx-auto">
              Get the latest NDIS news, provider tips, and community updates
              delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors duration-200 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
