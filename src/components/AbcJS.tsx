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
        const abcInstance  = abcjs.renderAbc(
            abcRef.current,
            notation,
            { scale: 3.5}
            // { scale: 3.5, clickListener, add_classes: true, oneSvgPerLine: true }
            // { responsive: "resize" }
        )

        // function clickListener(abcelem, tuneNumber, classes, analysis, drag, mouseEvent) {
        //     console.log("abcelem",abcelem);
        //     // console.log(JSON.stringify(abcelem))
        //     // console.log("tuneNumber",tuneNumber)
        //     console.log("classes",classes)
        //     // // console.log("analysis",analysis)
        //     // // console.log("drag",drag)
        //     // // console.log("mouseEvent",mouseEvent)
        // }
    }

    useEffect(() => {
        renderAbcNotation()
    }, [notation])

    return (
        <Box width="100%" align="center" justify="center" >
            <b>{notation}</b>
            <Box width="310px"  ref={abcRef} />
            {/* <Box width="100%"  ref={abcRef} /> */}
        </Box>
    )
}

export default AbcJSComponent;