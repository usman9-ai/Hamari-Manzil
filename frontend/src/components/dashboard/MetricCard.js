import React from 'react';
import { Card, CardContent } from '../ui/Card';

const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = 'primary', 
    trend = null,
    onClick = null 
}) => {
    const colorClasses = {
        primary: 'text-primary',
        success: 'text-success',
        warning: 'text-warning',
        danger: 'text-danger',
        info: 'text-info'
    };

    const bgColorClasses = {
        primary: 'bg-primary bg-opacity-10',
        success: 'bg-success bg-opacity-10',
        warning: 'bg-warning bg-opacity-10',
        danger: 'bg-danger bg-opacity-10',
        info: 'bg-info bg-opacity-10'
    };

    return (
        <Card 
            className={`h-100 ${onClick ? 'cursor-pointer hover-shadow' : ''}`}
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                        <p className="text-muted small mb-1">{title}</p>
                        <h2 className="h3 fw-bold mb-0">{value}</h2>
                        {subtitle && (
                            <p className={`small mt-2 mb-0 ${colorClasses[color]}`}>
                                {subtitle}
                            </p>
                        )}
                        {trend && (
                            <div className="d-flex align-items-center mt-1">
                                <i className={`fas fa-arrow-${trend.direction} me-1 ${trend.direction === 'up' ? 'text-success' : 'text-danger'}`}></i>
                                <span className={`small ${trend.direction === 'up' ? 'text-success' : 'text-danger'}`}>
                                    {trend.value}%
                                </span>
                            </div>
                        )}
                    </div>
                    <div className={`rounded p-3 ${bgColorClasses[color]}`}>
                        <i className={`${icon} ${colorClasses[color]} fs-4`}></i>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MetricCard;

