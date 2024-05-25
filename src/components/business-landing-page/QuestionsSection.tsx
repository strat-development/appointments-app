"use client"

import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import '../../styles/accordion.css';
import { ArrowDown2, MagicStar } from 'iconsax-react';

const AccordionDemo = () => (
    <>
        <div className='flex flex-col items-center gap-16'>
            <h2 className="text-5xl font-semibold tracking-wider text-transparent bg-gradient-to-b from-[#5100D6] to-[#A168FF] bg-clip-text">
                Frequently asked questions
            </h2>
            <Accordion.Root className="AccordionRoot" type="single" defaultValue="item-1" collapsible>
                <Accordion.Item className="AccordionItem" value="item-1">
                    <AccordionTrigger className="AccordionTrigger">
                        <div className='flex gap-4 items-center'>
                            <MagicStar className="AccordionIcon text-violet-500" />
                            For whom is “Visio” the best option?
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="AccordionContent">Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                </Accordion.Item>
                <Accordion.Item className="AccordionItem" value="item-2">
                    <AccordionTrigger className="AccordionTrigger">
                        <div className='flex gap-4 items-center'>
                            <MagicStar className="AccordionIcon text-violet-500" />
                            Are the notifications free of charge?
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="AccordionContent">
                        Yes. It's unstyled by default, giving you freedom over the look and feel.
                    </AccordionContent>
                </Accordion.Item>
                <Accordion.Item className="AccordionItem" value="item-3">
                    <AccordionTrigger className="AccordionTrigger">
                        <div className='flex gap-4 items-center'>
                            <MagicStar className="AccordionIcon text-violet-500" />
                            Are clients availiable to book a visit by yourself?
                        </div>
                    </AccordionTrigger>
                    <Accordion.Content className="AccordionContent">
                        <div className="AccordionContentText">
                            Yes! You can animate the Accordion with CSS or JavaScript.
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item className="AccordionItem" value="item-3">
                    <AccordionTrigger className="AccordionTrigger">
                        <div className='flex gap-4 items-center'>
                            <MagicStar className="AccordionIcon text-violet-500" />
                            Do I need to have a business to use “Visio”
                        </div>
                    </AccordionTrigger>
                    <Accordion.Content className="AccordionContent">
                        <div className="AccordionContentText">
                            Yes! You can animate the Accordion with CSS or JavaScript.
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item className="AccordionItem" value="item-3">
                    <AccordionTrigger className="AccordionTrigger">
                        <div className='flex gap-4 items-center'>
                            <MagicStar className="AccordionIcon text-violet-500" />
                            Do I have to provide card details for subscription?
                        </div>
                    </AccordionTrigger>
                    <Accordion.Content className="AccordionContent">
                        <div className="AccordionContentText">
                            Yes! You can animate the Accordion with CSS or JavaScript.
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item className="AccordionItem" value="item-3">
                    <AccordionTrigger className="AccordionTrigger">
                        <div className='flex gap-4 items-center'>
                            <MagicStar className="AccordionIcon text-violet-500" />
                            Will I be able to unsubscribe at any moment?
                        </div>
                    </AccordionTrigger>
                    <Accordion.Content className="AccordionContent">
                        <div className="AccordionContentText">
                            Yes! You can animate the Accordion with CSS or JavaScript.
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        </div>
    </>
);

const AccordionTrigger = React.forwardRef(({ children, className, ...props }: { children: React.ReactNode, className: string }, forwardedRef: React.Ref<HTMLButtonElement> | undefined) => (
    <Accordion.Header className="AccordionHeader">
        <Accordion.Trigger
            className="AccordionTrigger"
            {...props}
            ref={forwardedRef}
        >
            {children}
            <ArrowDown2 className="AccordionChevron" aria-hidden />
        </Accordion.Trigger>
    </Accordion.Header>
));

const AccordionContent = React.forwardRef(({ children, className, ...props }: { children: React.ReactNode, className: string }, forwardedRef: React.Ref<HTMLDivElement> | undefined) => (
    <Accordion.Content
        className="AccordionContent"
        {...props}
        ref={forwardedRef}
    >
        <div className="AccordionContentText">{children}</div>
    </Accordion.Content>
));

export default AccordionDemo;