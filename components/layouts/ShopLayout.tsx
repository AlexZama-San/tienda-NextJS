import Head from "next/head"
import { FC } from "react"
import Navbar from '../ui/Navbar';
import { SideMenu } from "../ui/SideMenu";

interface Props {
    title: string
    pageDescription: string
    imageFullUrl?: string
    children: JSX.Element | JSX.Element[]
}

export const ShopLayout: FC<Props> = ({children, title, pageDescription, imageFullUrl}) => {
  return (
    <>
        <Head>
            <title>{title}</title>
            <meta name="description" content={pageDescription} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={pageDescription} />
            
            {
                imageFullUrl && <meta property="og:image" content={imageFullUrl} />
            }

        </Head>

        <nav>
            <Navbar />
        </nav>

            <SideMenu />

        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0 30px'
        }}>
            {children}
        </main>

        <footer>
            {/*TODO: FOOTER */}
        </footer>

    </>
  )
}
