import { Flex, Box, Icon, Button, Menu, MenuButton, MenuList } from "@chakra-ui/react"
import { IoMusicalNote } from "react-icons/io5"
import { FiChevronDown } from "react-icons/fi"
import { BoxItem } from "./BoxItem"


interface NoteMenuProps {
    storage?: boolean;
    lesson?: string;
    clef: "G" | "F" | "C";
}


export const NoteMenu = ({ storage = true, lesson, clef = "G" }: NoteMenuProps) => {

    const abcNotationArray = [
        "b'", "a'", "g'", "f'", "e'", "d'", "c'", "b", "a", "g",
        "f", "e", "d", "c", "B", "A", "G", "F", "E",
        "D", "C", "B,", "A,", "G,", "F", "E,", "D,", "C,"
    ]

    const sheetConfig = {
        base: {
            size: 28
        },
        G: {
            upper: {
                from: 0, to: 9
            },
            base: {
                from: 10, to: 18
            },
            bottom: {
                from: 19, to: 27
            }
        },
        F: {
            upper: {
                from: 0, to: 21
            },
            base: {
                from: 22, to: 30
            },
            bottom: {
                from: -1, to: -1
            }
        },
        C: {
            upper: {
                from: 0, to: 15
            },
            base: {
                from: 16, to: 24
            },
            bottom: {
                from: 25, to: 27
            }

        },
    }

    const selectedClef = sheetConfig[clef];


    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<FiChevronDown />}>
                Notes 
            </MenuButton>
            <MenuList
                align="center"
                minW="139px"
                backgroundColor="gray.100"
            >
                <BoxItem clef={clef} selectedClef={selectedClef.upper} type="upper" size={sheetConfig.base.size} lesson={lesson} />
                <BoxItem clef={clef} selectedClef={selectedClef.base} type="base" size={sheetConfig.base.size} lesson={lesson}  />
                {
                    selectedClef.bottom.from !== -1 && 
                    <BoxItem clef={clef} selectedClef={selectedClef.bottom} type="bottom" size={sheetConfig.base.size} lesson={lesson}  />
                }

            </MenuList>
        </Menu>
    )



}