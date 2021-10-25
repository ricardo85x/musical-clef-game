import { Box } from "@chakra-ui/react"
import abcjs from "abcjs"
import { useRef, memo } from "react"
import { useEffect } from "react"

interface AbcJSProps {
    notation: string;
}

const AbcJS = ({ notation }: AbcJSProps) => {

    const abcRef = useRef<HTMLDivElement>(undefined)

    const renderAbcNotation = () => {

        abcjs.renderAbc(
            abcRef.current,
            notation,
            { scale: 3.5}
        )
    }

    useEffect(() => {
        renderAbcNotation()
    }, [notation])

    return (
        <Box width="100%" align="center" justify="center" >
            <Box width="100%" maxWidth="310px"  ref={abcRef} />
        </Box>
    )
}

const AbcJSComponent = memo(AbcJS, (prev, actual) => {
    return Object.is(prev.notation, actual.notation)
} );

export default AbcJSComponent;
