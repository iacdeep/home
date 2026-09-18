import Head from 'next/head';
import styles from './layout.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const siteTitle = 'Artificial Intelligence and Advanced Inference (IA2)';

export default function Layout({ children, home }) {
  const { basePath } = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" type="image/svg+xml" href={`${basePath}/images/ia2-logo.svg`} />
        <meta
          name="description"
          content="Artificial Intelligence and Advanced Inference (IA2) at the Instituto de Astrofísica de Canarias."
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  );
}
