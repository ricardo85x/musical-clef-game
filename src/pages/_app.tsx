import {ChakraProvider } from "@chakra-ui/react"
import Head from 'next/head'

import { theme } from "../styles/theme"

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
       <Head>
        <title>Smart Music Notes</title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
  
}

export default MyApp
