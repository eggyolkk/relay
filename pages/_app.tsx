import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '../public/styles/main.scss';

function MyApp({ Component, pageProps}: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}

export default MyApp;