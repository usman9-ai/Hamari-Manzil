import React from 'react';
import { cn } from '../../lib/utils';

const Badge = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
        default: "bg-gray-100 text-gray-900 border border-gray-300",
        success: "bg-green-50 text-green-700 border border-green-200",
        warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        danger: "bg-red-50 text-red-700 border border-red-200",
        info: "bg-blue-50 text-blue-700 border border-blue-200",
        primary: "bg-indigo-50 text-indigo-700 border border-indigo-200",
        verified: "bg-green-50 text-green-700 border border-green-300",
        available: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        occupied: "bg-orange-50 text-orange-700 border border-orange-200",
        maintenance: "bg-gray-50 text-gray-600 border border-gray-300",
    };

    // Title case helper
    const toTitleCase = (str) => {
        if (typeof str !== 'string') return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <span
            ref={ref}
            className={cn(
                "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors",
                variants[variant],
                className
            )}
            {...props}
        >
            {typeof children === 'string' ? toTitleCase(children) : children}
        </span>
    );
});

Badge.displayName = "Badge";

export { Badge };
