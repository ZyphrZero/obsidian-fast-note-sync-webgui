import React, { useState } from "react";


interface TooltipProps {
    children: React.ReactNode;
    content: string;
    delay?: number;
}

export function Tooltip({ children, content, delay = 300 }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [timer, setTimer] = useState<number | null>(null);

    const showTooltip = () => {
        const id = window.setTimeout(() => setIsVisible(true), delay);
        setTimer(id);
    };

    const hideTooltip = () => {
        if (timer) window.clearTimeout(timer);
        setIsVisible(false);
    };

    return (
        <div className="flex-1 min-w-0" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
            {children}
            {isVisible && (
                <div className="fixed bg-gray-900 text-white text-xs rounded shadow-lg px-2 py-1 z-[100] animate-in fade-in zoom-in duration-200 whitespace-nowrap"
                    style={{
                        left: '190px',
                        marginTop: '-24px'
                    }}>
                    {content}
                </div>
            )}
        </div>
    );
}
