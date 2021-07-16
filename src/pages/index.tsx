
import { useRouter } from "next/router"
import { useEffect } from "react";



export default function Home() {

    const router = useRouter();



    useEffect(() => {
        router.push("/1")

    }, [])
    

    return (
        <h1>Loading</h1>
    )



}
