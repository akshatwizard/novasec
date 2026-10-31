"use client";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ReactNode, Children, useCallback, useEffect, useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { EmblaCarouselType } from 'embla-carousel'
import { cn } from "@/lib/utils";
import Autoplay from 'embla-carousel-autoplay'

type PropType = {
    children: ReactNode;
    options?: EmblaOptionsType;
    className?: string;
    btnLeft?: string;
    btnRight?: string
    autoPlay?: boolean;
    /** Autoplay settings (delay in ms, pause on hover). Defaults keep the previous behaviour. */
    autoPlayOptions?: { delay?: number; stopOnMouseEnter?: boolean; stopOnInteraction?: boolean };
    viewportClassName?: string;
    /** Classes for each slide, e.g. a flex-basis to show a fixed number per view. */
    slideClassName?: string;
};

export default function SliderWrapper({ children, options, className, btnLeft, btnRight, autoPlay, autoPlayOptions, viewportClassName, slideClassName }: PropType) {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, autoPlay ? [Autoplay({ delay: 3000, ...autoPlayOptions })] : []);
    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)
    return (
        <section className="embla relative">
            <div className={cn("embla__viewport overflow-hidden py-5", viewportClassName)} ref={emblaRef}>
                <div className={cn("embla__container flex", className)}>
                    {Children.map(children, (child, index) => (
                        <div className={cn("embla__slide shrink-0", slideClassName)} key={index}>
                            {child}
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
                className={cn("absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-sm bg-black text-white flex items-center justify-center hover:bg-black cursor-pointer disabled:bg-black/40 disabled:cursor-not-allowed", btnLeft)}
            >
                <MoveLeft size={13} />
                <span className="sr-only">Previous slide</span>
            </button>

            <button
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
                className={cn("absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-sm bg-black text-white flex items-center justify-center hover:bg-black cursor-pointer disabled:bg-black/40 disabled:cursor-not-allowed", btnRight)}
            >
                <MoveRight size={13} />
                <span className="sr-only">Next slide</span>
            </button>
        </section>
    );
}

type UsePrevNextButtonsType = {
    prevBtnDisabled: boolean
    nextBtnDisabled: boolean
    onPrevButtonClick: () => void
    onNextButtonClick: () => void
}

const usePrevNextButtons = (emblaApi: EmblaCarouselType | undefined): UsePrevNextButtonsType => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return
        emblaApi.scrollPrev()
    }, [emblaApi])

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return
        emblaApi.scrollNext()
    }, [emblaApi])

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [])

    useEffect(() => {
        if (!emblaApi) return
        onSelect(emblaApi)
        emblaApi.on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onSelect])

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    }
}