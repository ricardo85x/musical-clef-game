import { CircularProgress, CircularProgressLabel, CircularProgressProps } from "@chakra-ui/react"
import React, { useEffect, useRef, useState, FC } from "react";

interface ProgressBeatProps {
    time: number;
    count: number
}

type ProgressDataProps = {
    percent: number;
    progressText: string;
    currentIndex: number;
}

export const ProgressBeat = ({ time, count }: ProgressBeatProps) => {

    const progressPercentValues = [25, 50, 75, 100]
    const progressTextValues = ["1/4", "2/4", "3/4", "4/4"]
    const colorsProgress = {
        "25": "green.400",
        "50": "yellow.400",
        "75": "orange.400",
        "100": "red.400"
    }

    const initialValue = {
        percent: progressPercentValues[0],
        progressText: progressTextValues[0],
        currentIndex: 0
    }

    const progressRef = useRef<ProgressDataProps>(initialValue);
    const [progress, setProgress] = useState<ProgressDataProps>(initialValue)
    const [firstLoad, setFirstLoad] = useState<boolean>(true)

    useEffect(() => {
        const timeInterval = (time * 1000) /4;
        if (firstLoad) {
            setFirstLoad(false)
        } else {
            progressRef.current = initialValue
            setProgress(initialValue)
            setTimeout(() => {
                updateProgress();
                setTimeout(() => {
                    updateProgress();
                    setTimeout(() => {
                        updateProgress();
                    }, timeInterval)
                }, timeInterval)
            }, timeInterval)
        }
    }, [count])


    const updateProgress = () => {
        const currentIndex = progressRef.current.currentIndex >=
            progressPercentValues.length - 1 ?
            0 :
            progressRef.current.currentIndex + 1;

        progressRef.current = {
            ...progressRef.current,
            currentIndex,
            percent: progressPercentValues[currentIndex],
            progressText: progressTextValues[currentIndex],
        }
        setProgress(progressRef.current)
    }

    return (
        <CircularProgress
            color={colorsProgress[`${progress.percent}`]}
            size="120px" value={progress.percent} >
            <CircularProgressLabel>{progress.progressText}</CircularProgressLabel>
        </CircularProgress>
    )
}
