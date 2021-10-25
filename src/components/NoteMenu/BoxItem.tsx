import { Flex, Box, Icon, Button, Menu, MenuButton, MenuList } from "@chakra-ui/react"
import { IoMusicalNote } from "react-icons/io5"
import { FiChevronDown } from "react-icons/fi"
import { useState } from "react"


interface BoxItemProps {
    selectedClef: {
        from: number, 
        to: number
    };
    type: "upper" | "base" | "bottom";
    size: number;
    lesson: string;
    clef: "G" | "F" | "C";
}

type SelectedNoteType = {
    object: {
        clef: "G" | "F" | "C";
        lesson: string;
        notes: number[];
    }[]
}



export const BoxItem = ({ selectedClef, type, size, lesson, clef }: BoxItemProps) => {


    const [selected, setSelected] = useState<SelectedNoteType>({object:[
        {
            clef,
            lesson,
            notes: []
        }
    ]})

    const arrayRange = (from: number, to: number) => {
        if (to > from) {
            return Array(to - from + 1).fill(0).map((_, i) => i + from);
        }
        return []
    }

    const handleEnableNoteType = (index: number, type: number, valid: boolean) => {

        let _selected = selected;

        let itemIndex = _selected.object.findIndex(
            s => s.clef === clef && s.lesson === lesson
        )

        if(itemIndex !== -1) {
            const noteIndex = _selected.object[itemIndex].notes.indexOf(index);

            if (noteIndex !== -1) {
                _selected.object[itemIndex].notes.splice(noteIndex, 1);
            }else {
                _selected.object[itemIndex].notes.push(index)
            }
            setSelected(_selected)
        } else {
            _selected.object.push({
                clef,
                lesson,
                notes: [index]
            })
            setSelected(_selected)
        }
     
    }

    const currentNotes = selected.object.find(
        f => f.clef === clef && f.lesson === lesson
    )


    console.log(selected)


    return (
        <>
            {arrayRange(selectedClef.from, selectedClef.to)
                .map((_, i) => {

                    const index = i + selectedClef.from;

                    const enabled = currentNotes ? currentNotes.notes.includes(index) ?
                        true: false: false;

                    const hasLine = index % 2 === 0;
                    // is upper or botton
                    const additional = type === "base" ? false : true;

                    const valid = index < size;

                    return (

                        
                            <Box
                                align="center"
                                key={index}
                                backgroundColor={valid ? enabled ? "green.100" : "inherit" : "red.300"}
                                cursor={valid ?"pointer" : "not-allowed"}
                                _hover={{
                                    backgroundColor: valid ? "green.400" : "red.300"
                                }}

                                onClick={() => handleEnableNoteType(index, 1, valid)}

                                title="Enable/Disable item to learn"

                            >

                                <Flex
                                    direction="row"
                                    align="center"
                                    justify="center"

                                    _after={hasLine ? {
                                        flexGrow: 1,
                                        flexShrink: 1,
                                        flexBasis: "auto",
                                        content: '""',
                                        height: 0,
                                        borderBottom: `2px solid ${enabled ? "green" : "black"}`,

                                        marginLeft: `-6`
                                    } : {}}

                                    _before={hasLine ? {
                                        flexGrow: 1,
                                        flexShrink: 1,
                                        flexBasis: "auto",
                                        content: '""',
                                        height: 0,
                                        borderBottom: `2px solid ${enabled ? "green" : "black"}`,
                                        marginRight: `-6`

                                    } : {}}

                                    w={additional ? "50px" : "90%"}

                                >
                                    <Box
                                        color={`${!!enabled ? "green" : "black"}`}
                                    >
                                        <Icon w={6} h={6} as={IoMusicalNote} />

                                    </Box>
                                </Flex>
                            </Box>

                        

                    )
                })}
        </>
    )
}