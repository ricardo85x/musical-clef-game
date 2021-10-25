import {
  Flex,
  Box,
  Grid,
  Text,
  Icon,
  RadioGroup,
  Radio,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IoMusicalNote } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import Router from "next/router";
import dynamic from "next/dynamic";

import { abcNotationArray } from "../../constants"

const AbcJSComponent = dynamic(() => import("../AbcJS"), {
  ssr: false,
});

interface EnabledTypesProps {
  index: number;
  type: number;
  enabled: boolean;
}

interface NoteProps {
  index: number;
  enabled: boolean;
  additional: boolean;
  hasNote: boolean;
  hasLine: boolean;
  base: boolean;
  type: number[];
  notation: string;
  answer?: string;
}

interface LineProps {
  notes: NoteProps[];
  previous: number;
}

const arrayRange = (from: number, to: number) => {
  if (to > from) {
    return Array(to - from + 1)
      .fill(0)
      .map((_, i) => i + from);
  }
  return [];
};

export const Lesson2 = () => {

  const toast = useToast();

  const app_tittle = "Smart Music Notes";

  let localStorage: Storage;

  if (typeof window !== "undefined") {
    // You now have access to `window`
    localStorage = window.localStorage;
  }

  const [enabledLinesLesson2, setEnabledLines] = useState<number[]>(
    !!localStorage?.getItem("enabledLinesLesson2")
      ? JSON.parse(localStorage.getItem("enabledLinesLesson2"))
      : arrayRange(12, 22)
  );

  const [enabledTypesLesson2, setEnabledTypes] = useState<EnabledTypesProps[]>(
    !!localStorage?.getItem("enabledTypesLesson2")
      ? JSON.parse(localStorage.getItem("enabledTypesLesson2"))
      : [
          ...[
            ...[...new Array(abcNotationArray.length)].map((_, i) => {
              return {
                index: i + 1,
                type: 0,
                enabled: false,
                notation: `
                X:1
                L:2/4
                _${abcNotationArray[i]}
                `,
              };
            }),
            ...[...new Array(abcNotationArray.length)].map((_, i) => {
              return {
                index: i + 1,
                type: 1,
                enabled: arrayRange(11, 19).includes(i + 1),
                notation: `
                X:1
                L:2/4
                ${abcNotationArray[i]}
                `,
              };
            }),
          ],
          ...[...new Array(abcNotationArray.length)].map((_, i) => {
            return {
              index: i + 1,
              type: 2,
              enabled: false,
              notation: `
                X:1
                L:2/4
                ^${abcNotationArray[i]}
                `,
            };
          }),
        ]
  );

  const [lines, setLines] = useState<LineProps>({ notes: [], previous: 11 });

  const linesRef = useRef<LineProps>({ notes: [], previous: 11 });

  const [questions, setQuestions] = useState<
    {
      name: string;
      code: string;
      correct: boolean;
    }[]
  >([]);

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const [clef, setClef] = useState<string>(
    !!localStorage?.getItem("clef_ex2")
      ? localStorage.getItem("clef_ex2")
      : "sol"
  );

  const handleSetEnabledTypes = (_enabledTypesLesson2: EnabledTypesProps[]) => {
    setEnabledTypes(_enabledTypesLesson2);
    localStorage?.setItem(
      "enabledTypesLesson2",
      JSON.stringify(_enabledTypesLesson2)
    );
  };

  const handleEnableNoteType = (index: number, type: number) => {
    if (
      !!enabledTypesLesson2.filter((f) => f.index == index && f.type == type)
    ) {
      handleSetEnabledTypes(
        enabledTypesLesson2.map((e) => {
          if (e.index == index && e.type == type) {
            return {
              ...e,
              enabled: !e.enabled,
            };
          }

          return e;
        })
      );

      handleSetEnabledLines(
        enabledLinesLesson2.filter((line) => line !== index)
      );
    } else {
      handleSetEnabledLines([...enabledLinesLesson2, index]);
    }

    loadRandomNotes();
  };

  const loadRandomNotes = (_clef?: string) => {
    let _lines = [...new Array(abcNotationArray.length)]
      .map((_, i) => {
        return {
          index: i + 1,
          enabled: false,
          additional: false,
          hasNote: false,
          hasLine: false,
          base: false,

          notation: "E",
          type: [1],
        };
      })
      .map((line) => {
        // check if enabledType array has index enabled, no mather the type.
        const currentEnabledType = enabledTypesLesson2.filter(
          (f) => f.index == line.index && f.enabled
        );

        return {
          ...line,
          enabled: !!currentEnabledType.length,
          additional: [
            ...arrayRange(1, 10),
            ...arrayRange(20, abcNotationArray.length),
          ].includes(line.index),
          hasLine: line.index % 2 !== 0,
          base: arrayRange(11, 19).includes(line.index),
          type: !!currentEnabledType.length
            ? currentEnabledType.map((e) => e.type)
            : [1],
        };
      });

    const validIndexes = _lines
      .filter(
        (line) => line.enabled && line.index !== linesRef.current.previous
      )
      .map((line) => line.index);

    const selectedIndex = Math.floor(Math.random() * validIndexes.length);

    const selectedNote = validIndexes[selectedIndex];

    linesRef.current = {
      notes: _lines.map((line) => {
        const random_accident_type =
          line.type[Math.floor(Math.random() * line.type.length)];

        const accident =
          random_accident_type === 0
            ? "_"
            : random_accident_type === 2
            ? "^"
            : "";

        // bass = F
        // treble = G
        // alto = C 3
        // tenor = C 4
        // perc = bateria

        const clefNotation = {
          sol: "treble",
          fa: "bass",
          do: "alto",
        };

        return {
          ...line,
          hasNote: selectedNote === line.index,
          notation:
            selectedNote === line.index
              ? `
                        X:1
                        K: clef=${clefNotation[_clef ? _clef : clef]}
                        ${accident}${abcNotationArray[line.index - 1]}
                    `
              : line.notation,
          answer:
            selectedNote === line.index ? abcNotationArray[line.index - 1] : "",
        };
      }),
      previous: selectedNote,
    };

    setLines(linesRef.current);

    generateRandomQuestions();
  };

  const generateRandomQuestions = () => {
    const currentNote = linesRef.current.notes.find(
      (n) => n.hasNote && linesRef.current.previous == n.index
    );

    let answer = "";

    if (currentNote?.answer) {
      const m1 = currentNote.answer.match(/(\w)/);
      if (m1) {
        answer = m1[1].toUpperCase();
      }
    }

    const _questions = [
      { name: "Do", code: "C", correct: false },
      { name: "Re", code: "D", correct: false },
      { name: "Mi", code: "E", correct: false },
      { name: "Fa", code: "F", correct: false },
      { name: "Sol", code: "G", correct: false },
      { name: "La", code: "A", correct: false },
      { name: "Si", code: "B", correct: false },
    ].map((q) => {
      return {
        ...q,
        correct: answer === q.code,
      };
    });

    setQuestions(_questions);
    setSelectedAnswer("");
  };

  useEffect(() => {
    loadRandomNotes();
  }, []);

  const handleSelectQuestion = (selected: string) => {
    setSelectedAnswer(selected);

    const right_answer = questions.find((f) => f.correct);
    let interval = 1;
    if (right_answer.code === selected) {
      toast({
        title: "Correct!",
        status: "success",
        duration: 1000 * interval,
      });
    } else {
      interval = 3;
      toast({
        title: "Wrong Answer!",
        description: `The right answer is ( ${right_answer.code} - ${right_answer.name} )`,
        status: "error",
        duration: 1000 * interval,
      });
    }

    setTimeout(
      () => {
        loadRandomNotes();
      },
      1000 * interval // wait 1 seconds
    );
  };

  const handleSetEnabledLines = (_enabledLinesLesson2: number[]) => {
    setEnabledLines(_enabledLinesLesson2);
    localStorage?.setItem(
      "enabledLinesLesson2",
      JSON.stringify(_enabledLinesLesson2)
    );
  };

  const handleKeyPress = (event) => {
    if (["A", "B", "C", "D", "E", "F", "G"].includes(event.key.toUpperCase())) {
      handleSelectQuestion(event.key.toUpperCase());
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <Flex
        bgGradient="linear(to-br, gray.200, gray.400)"
        w="100%"
        gridGap="2"
        flexWrap="wrap"
        direction="row"
        width="100%"
        justify={["center", "center", "space-between"]}
        align="center"
        boxShadow="0 1px 1px rgba(0, 0, 0, 0.25)"
      >
        <Text fontSize="28" fontWeight="medium" paddingStart="2">
          {app_tittle}
        </Text>

        <Flex
          p="3"
          gridGap="2"
          flexWrap="wrap"
          direction="row"
          align="center"
          justify="center"
        >
          {/* <NoteMenu lesson="02" clef="C" /> */}

          <Menu id="menu_00003" isLazy>
            <MenuButton as={Button} rightIcon={<FiChevronDown />}>
              Lesson 2
            </MenuButton>
            <MenuList align="center" minW="139px" backgroundColor="gray.100">
              <MenuItem onClick={() => Router.push("/lesson/1")}>
                Lesson 1
              </MenuItem>
              <MenuItem>Lesson 2</MenuItem>
            </MenuList>
          </Menu>

          {[...new Array(1)].map((_, m) => (
            <Menu id="menu_00004" isLazy key={`menu_${m + 1}`}>
              <MenuButton as={Button} rightIcon={<FiChevronDown />}>
                Notes
              </MenuButton>
              <MenuList align="center" minW="139px" backgroundColor="gray.100">
                {lines.notes.map((note) => {
                  const enabled = !!enabledTypesLesson2.find(
                    (f) => f.index === note.index && f.type === 1 && f.enabled
                  )
                    ? true
                    : false;

                  return (
                    <Box
                      align="center"
                      key={note.index}
                      backgroundColor={enabled ? "green.100" : "inherit"}
                      cursor="pointer"
                      _hover={{
                        backgroundColor: "green.400",
                      }}
                      onClick={() => handleEnableNoteType(note.index, 1)}
                      title="Enable/Disable item to learn"
                    >
                      <Flex
                        direction="row"
                        align="center"
                        justify="center"
                        _after={
                          note.hasLine
                            ? {
                                flexGrow: 1,
                                flexShrink: 1,
                                flexBasis: "auto",
                                content: '""',
                                height: 0,
                                borderBottom: `2px solid ${
                                  enabled ? "green" : "black"
                                }`,

                                marginLeft: `-6`,
                              }
                            : {}
                        }
                        _before={
                          note.hasLine
                            ? {
                                flexGrow: 1,
                                flexShrink: 1,
                                flexBasis: "auto",
                                content: '""',
                                height: 0,
                                borderBottom: `2px solid ${
                                  enabled ? "green" : "black"
                                }`,
                                marginRight: `-6`,
                              }
                            : {}
                        }
                        w={note.additional ? "50px" : "90%"}
                      >
                        <Box color={`${!!enabled ? "green" : "black"}`}>
                          <Icon w={6} h={6} as={IoMusicalNote} />
                        </Box>
                      </Flex>
                    </Box>
                  );
                })}
              </MenuList>
            </Menu>
          ))}
        </Flex>
      </Flex>

      {/* 
            
        // bass = F
        // treble = G
        // alto = C 3
        // tenor = C 4
        // perc = drum

      */}

      <Text fontWeight="medium" fontSize="20" p={5}>
        Select the Right Answer
      </Text>

      <RadioGroup
        m={4}
        maxWidth="300"
        width="100%"
        defaultValue=""
        value={selectedAnswer}
        onChange={(_value) => handleSelectQuestion(_value)}
      >
        <Grid templateColumns="1fr 1fr 1fr">
          {questions.map((q, i) => (
            <Radio
              key={i}
              colorScheme={q.correct ? "green" : "red"}
              value={q.code}
            >
              <Text fontSize="20" fontWeight="medium">
                {q.code} - {q.name}
              </Text>
            </Radio>
          ))}
        </Grid>
      </RadioGroup>

      <Box width="100%" align="center" justify="center">
        <AbcJSComponent
          notation={
            lines.notes.find((f) => f.enabled && f.hasNote)
              ? lines.notes.find((f) => f.enabled && f.hasNote).notation
              : ""
          }
        />
      </Box>
    </Flex>
  );
};
