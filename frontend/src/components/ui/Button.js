import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({
    className,
    variant = 'default',
    size = 'default',
    children,
    disabled,
    ...props
}, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-300 bg-white hover:bg-gray-100",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100",
        link: "underline-offset-4 hover:underline text-primary",
    };

    const sizes = {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-sm",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            ref={ref}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
