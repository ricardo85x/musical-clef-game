import { Flex, ButtonGroup, IconButton, Box, Text, Icon, Select, usePrefersReducedMotion, keyframes, Button, Menu, MenuButton, MenuList, Image } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { IoMusicalNote } from "react-icons/io5"
import { FiChevronDown } from "react-icons/fi"
import { AddIcon, MinusIcon } from "@chakra-ui/icons"

interface EnabledTypesProps {
    index: number,
    type: number,
    enabled: boolean,
}

interface LineProps {

    notes: {
        index: number;
        enabled: boolean;
        additional: boolean;
        hasNote: boolean;
        hasLine: boolean;
        base: boolean;
        normalNote: boolean;
        sharpNote: boolean;
        flatNote: boolean;
        type: number[];
    }[]
    previous: number;
    max: number;
    min: number;

}

const arrayRange = (from: number, to: number) => {
    if (to > from) {
        return Array(to - from + 1).fill(0).map((_, i) => i + from);
    }
    return []
}

export default function Home() {


    let localStorage: Storage;

    if (typeof window !== 'undefined') {
        // You now have access to `window`
        localStorage = window.localStorage;
    }

    const defaultCookieOptions = {
        maxAge: 60 * 60 * 24 * 30,// 30 days
        path: "/" // valid on whole app
    }


    const [noteTextSize, setNoteTextSize] = useState<number>(
        !!localStorage?.getItem('noteTextSize') ? JSON.parse(localStorage.getItem('noteTextSize')) : 6
    );

    const [secondsInterval, setSecondsInterval] = useState(
        !!localStorage?.getItem('secondsInterval') ? JSON.parse(localStorage.getItem('secondsInterval')) : 3
    )

    const [enabledLines, setEnabledLines] = useState<number[]>(
        !!localStorage?.getItem('enabledLines') ? JSON.parse(localStorage.getItem('enabledLines')) : arrayRange(12, 22)

    )

    const [enabledTypes, setEnabledTypes] = useState<EnabledTypesProps[]>(

        !!localStorage?.getItem('enabledTypes') ? JSON.parse(localStorage.getItem('enabledTypes')) :
            [...[...[...new Array(31)].map((_, i) => {
                return {
                    index: i + 1,
                    type: 0,
                    enabled: false,
                }
            }), ...[...new Array(31)].map((_, i) => {
                return {
                    index: i + 1,
                    type: 1,
                    enabled: arrayRange(12, 20).includes(i + 1),
                }
            })], ...[...new Array(31)].map((_, i) => {
                return {
                    index: i + 1,
                    type: 2,
                    enabled: false,
                }
            })]
    )

    const componentLinesRef = useRef(null);

    const [lines, setLines] = useState<LineProps>({ notes: [], previous: 11, max: 0, min: 0 })

    const linesRef = useRef<LineProps>({ notes: [], previous: 11, max: 0, min: 0 })


    const handleSetEnabledTypes = (_enabledTypes: EnabledTypesProps[]) => {
        setEnabledTypes(_enabledTypes);
        localStorage?.setItem("enabledTypes", JSON.stringify(_enabledTypes));
    }

    const handleEnableNoteType = (index: number, type: number) => {

        if (!!enabledTypes.filter(f => f.index == index && f.type == type)) {

            handleSetEnabledTypes(enabledTypes.map(e => {

                if (e.index == index && e.type == type) {
                    return {
                        ...e, enabled: !e.enabled
                    }
                }

                return e
            }))

            handleSetEnabledLines(enabledLines.filter(line => line !== index))

        } else {
            handleSetEnabledLines([...enabledLines, index])
        }

        loadRandomNotes()

    }


    const loadRandomNotes = () => {

        let _lines = [...new Array(11 + 9 + 11)].map((_, i) => {
            return {
                index: i + 1,
                enabled: false,
                additional: false,
                hasNote: false,
                hasLine: false,
                base: false,
                normalNote: false,
                sharpNote: false,
                flatNote: false,
                type: [1]
            }
        }).map(line => {

            // check if enabledType array has index enabled, no mather the type.
            const currentEnabledType = enabledTypes.filter(f => f.index == line.index && f.enabled)

            return {
                ...line,
                enabled: !!currentEnabledType.length,
                additional: [
                    ...
                    arrayRange(1, 10),
                    ...arrayRange(21, 32)
                ].includes(line.index),
                hasLine: line.index % 2 == 0,
                base: arrayRange(12, 21).includes(line.index),
                type: !!currentEnabledType.length ?
                    currentEnabledType.map(e => e.type) : [1]
            }
        })

        const validIndexes = _lines.filter(
            line => line.enabled &&
                line.index !== linesRef.current.previous
        ).map(line => line.index)

        const selectedIndex = Math.floor(Math.random() * validIndexes.length);
        const selectedNote = validIndexes[selectedIndex]

        linesRef.current = {
            notes: _lines.map(line => {
                return {
                    ...line,
                    hasNote: selectedNote === line.index
                }
            }),
            previous: selectedNote,
            max: Math.max(..._lines.filter(f => f.enabled).map(m => m.index)),
            min: Math.min(..._lines.filter(f => f.enabled).map(m => m.index))
        }

        setLines(linesRef.current)

    }

    useEffect(() => {

        if (secondsInterval > 0) {
            const interval = setInterval(() => {
                loadRandomNotes()
            }, 1000 * secondsInterval)

            return () => {
                clearInterval(interval);
            }
        }

    }, [secondsInterval, enabledLines])


    useEffect(() => {
        loadRandomNotes();
    }, [])


    const handleSetSecondsInterval = (_interval: any) => {

        const valid_interval = Number(_interval);

        if (valid_interval !== NaN) {
            setSecondsInterval(valid_interval)
            localStorage?.setItem("secondsInterval", `${valid_interval}`);
        }

    }


    const handleSetNoteTextSize = (_value: number,) => {
        let new_size = noteTextSize + _value;

        if (new_size > 1) {

            if (new_size > 10) {
                if (new_size % 2 !== 0) {
                    if (_value > 0) {
                        new_size++;
                    } else {
                        new_size--;
                    }
                }
            }
            setNoteTextSize(new_size);
            localStorage?.setItem("noteTextSize", JSON.stringify(new_size));
        }


    }

    const handleSetEnabledLines = (_enabledLines: number[]) => {
        setEnabledLines(_enabledLines);
        localStorage?.setItem("enabledLines", JSON.stringify(_enabledLines));
    }





    const fadeOut = keyframes`
        0% { opacity: 1; }
        100% { opacity: 0; }
    `;

    const prefersReducedMotion = usePrefersReducedMotion()

    const fadeOutAnimation = prefersReducedMotion
        ? undefined
        : `${fadeOut} ${secondsInterval}s linear normal forwards`;

    return (
        <Flex align="center" justify="center" direction="column" >

            <Flex backgroundColor="gray.200" w="100%" gridGap="2" flexWrap="wrap" direction="row" width="100%" align="flex-start" justify={["center", "center", "space-between"]}>

                <Box p="3" >
                    <Text fontSize="28" fontWeight="medium" pb="2">The random Claf </Text>
                </Box>

                <Flex
                    p="3"
                    gridGap="2" flexWrap="wrap" direction="row" align="center" justify="center"
                >



                    <ButtonGroup colorScheme="black" size="sm" isAttached variant="outline">
                        <IconButton onClick={() => handleSetNoteTextSize(-1)} aria-label="decrease Size" icon={<MinusIcon />} />

                        <Button mr="-px">Size {noteTextSize}</Button>
                        <IconButton onClick={() => handleSetNoteTextSize(1)} aria-label="increase Size" icon={<AddIcon />} />
                    </ButtonGroup>

                    <Select fontWeight="bold" variant="filled" w="140px" value={secondsInterval} onChange={(e) => handleSetSecondsInterval(e.target.value)} >

                        <option value={0.5} key={0.5}>0.5 seconds</option>
                        {[...new Array(10)].map((_, s) => (
                            <option value={s + 1} key={s}>{`${s + 1} seconds`}</option>
                        ))}

                    </Select>

                    {[...new Array(3)].map((_, m) => (
                        <Menu key={`menu_${m + 1}`}>
                            <MenuButton as={Button} rightIcon={<FiChevronDown />}>
                                {m === 0 ? "Flat Notes" : m === 1 ? "Natural Notes" : "Sharp Notes"}
                            </MenuButton>
                            <MenuList
                                align="center"
                                minW="139px"
                                backgroundColor="gray.100"
                            >
                                {lines.notes.map((note) => {

                                    const enabled = !!enabledTypes.find(f => f.index === note.index && f.type === m && f.enabled) ? true : false;

                                    return (
                                        <Box
                                            align="center"
                                            key={note.index}
                                            backgroundColor={enabled ? "green.100" : "inherit"}
                                            cursor="pointer"
                                            _hover={{
                                                backgroundColor: "green.400"
                                            }}

                                            onClick={() => handleEnableNoteType(note.index, m)}

                                            title="Enable/Disable item to learn"

                                        >

                                            <Flex
                                                direction="row"
                                                align="center"
                                                justify="center"

                                                _after={note.hasLine ? {
                                                    flexGrow: 1,
                                                    flexShrink: 1,
                                                    flexBasis: "auto",
                                                    content: '""',
                                                    height: 0,
                                                    borderBottom: `2px solid ${enabled ? "green" : "black"}`,

                                                    marginLeft: `-6`
                                                } : {}}

                                                _before={note.hasLine ? {
                                                    flexGrow: 1,
                                                    flexShrink: 1,
                                                    flexBasis: "auto",
                                                    content: '""',
                                                    height: 0,
                                                    borderBottom: `2px solid ${enabled ? "green" : "black"}`,
                                                    marginRight: `-6`

                                                } : {}}

                                                w={note.additional ? "50px" : "90%"}

                                            >
                                                <Box
                                                    color={`${!!enabled ? "green" : "black"}`}
                                                >
                                                    {m == 0 ? "b" : m == 2 && "#"}
                                                    <Icon w={6} h={6} as={IoMusicalNote} />



                                                    {/* <Icon w={noteTextSize} h={noteTextSize} as={IoMusicalNote} /> */}




                                                </Box>
                                            </Flex>
                                        </Box>

                                    )
                                })}

                            </MenuList>
                        </Menu>
                    ))}

                </Flex>




            </Flex>

            <Box
                w="100%"
                ref={componentLinesRef}
                align="center"

                pt="10"

            >

                {lines.notes.filter(f =>
                    // show only between min and max enabled or base
                    (f.index >= lines.min && f.index <= lines.max) || f.base

                ).map((note) => {

                    const current_type = note.type[
                        Math.floor(Math.random() * note.type.length)
                    ]

                    return (
                        <Flex
                            key={note.index}
                            direction="row"
                            align="center"
                            justify="center"

                            _after={note.hasLine ? {
                                flexGrow: 1,
                                flexShrink: 1,
                                flexBasis: "auto",
                                content: '""',
                                height: 0,
                                borderBottom: `2px solid black`,

                                marginLeft: `-${noteTextSize}`
                            } : {}}

                            _before={note.hasLine ? {
                                flexGrow: 1,
                                flexShrink: 1,
                                flexBasis: "auto",
                                content: '""',
                                height: 0,
                                borderBottom: `2px solid black`,
                                marginRight: `-${noteTextSize}`

                            } : {}}

                            w={note.additional ? "40px" : "100%"}


                        >
                            <Flex direction="row" w={noteTextSize} minW={noteTextSize} h={noteTextSize} >
                                {
                                    note.hasNote &&
                                    (
                                        <Flex direction="row" align="flex-end" animation={fadeOutAnimation} >
                                            {current_type == 0 ?
                                                <Image w={noteTextSize * 0.5} h={noteTextSize * 0.5} src="/images/flat_music_note.svg" /> : current_type == 2 &&
                                                <Image w={noteTextSize * 0.5} h={noteTextSize * 0.5} src="/images/sharp_music_note.svg" />
                                            }
                                            {/* <Icon w={noteTextSize} h={noteTextSize} as={IoMusicalNote} /> */}
                                            <Image w={noteTextSize} h={noteTextSize} src="/images/quarter_note.svg" />
                                        </Flex>
                                    )
                                }
                            </Flex>
                        </Flex>
                    )
                })}
            </Box>
        </Flex>
    )
}
