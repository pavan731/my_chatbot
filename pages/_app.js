// pages/_app.js
import '../public/style.css'; // ✅ Import global CSS here

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
