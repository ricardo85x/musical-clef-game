import { Box } from "@chakra-ui/react"
import abcjs from "abcjs"
import { useRef } from "react"
import { useEffect } from "react"

interface AbcJSProps {
    notation: string;
}

const AbcJSComponent = ({ notation }: AbcJSProps) => {


    // console.log("Current notation", notation)

    const abcRef = useRef<HTMLDivElement>(undefined)

    const renderAbcNotation = () => {

        // console.log("rendering abc notation", notation)
        abcjs.renderAbc(
            abcRef.current,
            notation,
            { scale: 3.5}
            // { responsive: "resize" }
        )
    }

    useEffect(() => {
        renderAbcNotation()
    }, [notation])

    return (
        <Box width="100%" align="center" justify="center" >
            <Box width="310px"  ref={abcRef} />
            {/* <Box width="100%"  ref={abcRef} /> */}
        </Box>
    )
}

export default AbcJSComponent;