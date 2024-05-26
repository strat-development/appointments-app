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
            <Accordion.Root className="AccordionRoot" type="single" collapsible>
                <Accordion.Item className="AccordionItem" value="item-1">
                    <AccordionTrigger className="AccordionTrigger">
                        <div className='flex gap-4 items-center'>
                            <MagicStar className="AccordionIcon text-violet-500" />
                            For whom is “Visio” the best option?
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="AccordionContent">“Visio” is a great option for those who runs a business and those who just want to get the best service available in their location.</AccordionContent>
                </Accordion.Item>
                <Accordion.Item className="AccordionItem" value="item-2">
                    <AccordionTrigger className="AccordionTrigger">
                        <div className='flex gap-4 items-center'>
                            <MagicStar className="AccordionIcon text-violet-500" />
                            Are the notifications free of charge?
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="AccordionContent">
                        Yes, all notifications are completely free.
                    </AccordionContent>
                </Accordion.Item>
                <Accordion.Item className="AccordionItem" value="item-3">
                    <AccordionTrigger className="AccordionTrigger">
                        <div className='flex gap-4 items-center'>
                            <MagicStar className="AccordionIcon text-violet-500" />
                            Are clients availiable to book a visit by themselves?
                        </div>
                    </AccordionTrigger>
                    <Accordion.Content className="AccordionContent">
                        <div className="AccordionContentText">
                            Yes! You can book as a client or even unregistered user.
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item className="AccordionItem" value="item-4">
                    <AccordionTrigger className="AccordionTrigger">
                        <div className='flex gap-4 items-center'>
                            <MagicStar className="AccordionIcon text-violet-500" />
                            Do I need to have a business to use “Visio”
                        </div>
                    </AccordionTrigger>
                    <Accordion.Content className="AccordionContent">
                        <div className="AccordionContentText">
                            No you don't need to have a business to use “Visio” if you are a client.
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item className="AccordionItem" value="item-6">
                    <AccordionTrigger className="AccordionTrigger">
                        <div className='flex gap-4 items-center'>
                            <MagicStar className="AccordionIcon text-violet-500" />
                            Will I be able to delete account at any moment?
                        </div>
                    </AccordionTrigger>
                    <Accordion.Content className="AccordionContent">
                        <div className="AccordionContentText">
                            Yes, you can delete your account at any moment you want.
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