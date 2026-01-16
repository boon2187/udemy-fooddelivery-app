"use client";

import { ReactNode, useState } from "react";
import { Button } from "./ui/button";

interface SectionProps {
    children: ReactNode;
    title: string;
    expandedContent?: ReactNode;
}

export default function Section({ children, title, expandedContent }: SectionProps) {
    const [isExpanded, setIsExpandes] = useState(false);
    const handleChange = () => {
        setIsExpandes((prev) => !prev);
    };
    return (
        <section>
            <div className="flex items-center justify-between py-4">
                <h2 className="text-2xl font-bold">{title}</h2>
                {expandedContent && (
                    <Button onClick={handleChange}>
                        {isExpanded ? "表示を戻す" : "すべて表示"}
                    </Button>
                )}
            </div>
            {isExpanded ? expandedContent : children}
        </section>
    );
}
