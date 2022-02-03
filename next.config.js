const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    debug: process.env.NODE_ENV === 'development',
  },
  images: {
    domains: ['yts.mx', process.env.NEXT_PUBLIC_SUPABASE_URL, 'www.themoviedb.org'],
    loader: 'akamai',
    path: '',
  },
});
