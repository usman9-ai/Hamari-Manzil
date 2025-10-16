import React from 'react';
import { cn } from '../../lib/utils';

const Badge = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
        default: "badge bg-secondary",
        success: "badge bg-success",
        warning: "badge bg-warning text-dark",
        danger: "badge bg-danger",
        info: "badge bg-info",
        primary: "badge bg-primary",
        verified: "badge bg-success",
        available: "badge bg-success",
        occupied: "badge bg-warning text-dark",
        maintenance: "badge bg-secondary",
        pending: "badge bg-warning text-dark",
        approved: "badge bg-success",
        rejected: "badge bg-danger",
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
                variants[variant],
                className
            )}
            style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                fontWeight: '600',
                borderRadius: '6px'
            }}
            {...props}
        >
            {typeof children === 'string' ? toTitleCase(children) : children}
        </span>
    );
});

Badge.displayName = "Badge";

export { Badge };