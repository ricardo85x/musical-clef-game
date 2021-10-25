import {
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";
import { ProgressBeat } from "../ProgressBeat";

import dynamic from "next/dynamic";

import { abcNotationArray } from "../../constants"
import { MenuButtons } from "./MenuButtons";
import { EnabledTypesProps, LineProps } from "./types";

const AbcJSComponent = dynamic(() => import("../AbcJS"), {
  ssr: false,
});

const arrayRange = (from: number, to: number) => {
  if (to > from) {
    return Array(to - from + 1)
      .fill(0)
      .map((_, i) => i + from);
  }
  return [];
};

export const Lesson1 = () => {

  const app_tittle = "Smart Music Notes";

  let localStorage: Storage;

  if (typeof window !== "undefined") {
    localStorage = window.localStorage;
  }

  // const listIntervals = [
  //   0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  // ];

  const range = (from: number, to: number, step: number) => {
    return [...Array(Math.floor((to - from) / step) + 1)].map((_,i) =>  from + i * step)
  }

  const listIntervals = range(10,960,10)

  const [secondsIntervalLesson1, setSecondsInterval] = useState(
    !!localStorage?.getItem("secondsIntervalLesson1")
      ? JSON.parse(localStorage.getItem("secondsIntervalLesson1"))
      : 3
  );

  const [enabledLinesLesson1, setEnabledLines] = useState<number[]>(
    !!localStorage?.getItem("enabledLinesLesson1")
      ? JSON.parse(localStorage.getItem("enabledLinesLesson1"))
      : arrayRange(12, 22)
  );

  const [enabledTypesLesson1, setEnabledTypes] = useState<EnabledTypesProps[]>(
    !!localStorage?.getItem("enabledTypesLesson1")
      ? JSON.parse(localStorage.getItem("enabledTypesLesson1"))
      : [
          ...[
            ...[...new Array(abcNotationArray.length)].map((_, i) => {
              return {
                index: i + 1,
                type: 0,
                enabled: false,
                notation: `
                    X:1
                    L:4/4
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
                    L:4/4
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
                    L:4/4
                    ^${abcNotationArray[i]}
                    `,
            };
          }),
        ]
  );

  const [lines, setLines] = useState<LineProps>({ notes: [], previous: 11 });

  const linesRef = useRef<LineProps>({ notes: [], previous: 11 });

  const handleSetEnabledTypes = (_enabledTypesLesson1: EnabledTypesProps[]) => {
    setEnabledTypes(_enabledTypesLesson1);
    localStorage?.setItem(
      "enabledTypesLesson1",
      JSON.stringify(_enabledTypesLesson1)
    );
  };

  const handleEnableNoteType = (index: number, type: number) => {
    if (
      !!enabledTypesLesson1.filter((f) => f.index == index && f.type == type)
    ) {
      handleSetEnabledTypes(
        enabledTypesLesson1.map((e) => {
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
        enabledLinesLesson1.filter((line) => line !== index)
      );
    } else {
      handleSetEnabledLines([...enabledLinesLesson1, index]);
    }

    loadRandomNotes();
  };

  const loadRandomNotes = () => {
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
        const currentEnabledType = enabledTypesLesson1.filter(
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

        return {
          ...line,
          hasNote: selectedNote === line.index,
          notation:
            selectedNote === line.index
              ? `
                        X:1
                        L:4/4
                        ${accident}${abcNotationArray[line.index - 1]}
                    `
              : line.notation,
        };
      }),
      previous: selectedNote,
    };

    setLines(linesRef.current);
  };

  useEffect(() => {
    if (secondsIntervalLesson1 > 0) {
      const interval = setInterval(() => {
        loadRandomNotes();
      }, 1000 * secondsIntervalLesson1);

      return () => {
        clearInterval(interval);
      };
    }
  }, [secondsIntervalLesson1, enabledLinesLesson1]);

  useEffect(() => {
    loadRandomNotes();
  }, []);


  const beatsToSeconds = (beats: number) => {
    // 60 beats = 1 second
    // 120 beats = 0.5 second
    // 30 beats = 2 second
    if(beats > 0 ){
      return (1/(beats/60)) * 4
    } else {
      return 4
    }
  }

  const handleSetSecondsInterval = (_interval: any) => {
    const valid_interval = Number(_interval);
    if (valid_interval !== NaN && valid_interval > 0) {
      const secondsInBeats = beatsToSeconds(valid_interval)
      setSecondsInterval(secondsInBeats);
      localStorage?.setItem("secondsIntervalLesson1", `${secondsInBeats}`);
    }
  };

  const handleSetEnabledLines = (_enabledLinesLesson1: number[]) => {
    setEnabledLines(_enabledLinesLesson1);
    localStorage?.setItem(
      "enabledLinesLesson1",
      JSON.stringify(_enabledLinesLesson1)
    );
  };

  return (
    <Flex align="center" justify="center" direction="column">
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
        <Text marginStart="2" fontSize="28" fontWeight="medium">
          {app_tittle}
        </Text>

        <MenuButtons 
          secondsIntervalLesson1={secondsIntervalLesson1} 
          handleSetSecondsInterval={handleSetSecondsInterval}
          listIntervals={listIntervals}
          lines={lines}
          enabledTypesLesson1={enabledTypesLesson1}
          handleEnableNoteType={handleEnableNoteType}
          beatsToSeconds={beatsToSeconds}
          
        />


      </Flex>

      <Box pt={5} width="100%" align="center" justify="center">
        <ProgressBeat count={lines.previous} time={secondsIntervalLesson1} />
      </Box>

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
