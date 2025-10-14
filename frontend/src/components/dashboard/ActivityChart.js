import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

const ActivityChart = ({ data = [], loading = false }) => {
    const [timeRange, setTimeRange] = useState('week');

    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        
        // Process data for chart
        return data.map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            }),
            views: item.views,
            contacts: item.contacts,
            favorites: item.favorites
        }));
    }, [data]);

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        // In a real implementation, you would fetch data for the selected range
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Activity Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                        <div className="text-center">
                            <div className="spinner-border text-primary mb-3"></div>
                            <p className="text-muted">Loading chart data...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Activity Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                        <div className="text-center">
                            <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                            <p className="text-muted">No activity data available</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                    <CardTitle>Activity Overview</CardTitle>
                    <div className="btn-group btn-group-sm" role="group">
                        <Button
                            variant={timeRange === 'week' ? 'primary' : 'outline-primary'}
                            size="sm"
                            onClick={() => handleTimeRangeChange('week')}
                        >
                            7D
                        </Button>
                        <Button
                            variant={timeRange === 'month' ? 'primary' : 'outline-primary'}
                            size="sm"
                            onClick={() => handleTimeRangeChange('month')}
                        >
                            30D
                        </Button>
                        <Button
                            variant={timeRange === 'quarter' ? 'primary' : 'outline-primary'}
                            size="sm"
                            onClick={() => handleTimeRangeChange('quarter')}
                        >
                            90D
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="date" 
                                stroke="#666"
                                fontSize={12}
                            />
                            <YAxis 
                                stroke="#666"
                                fontSize={12}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="views" 
                                stroke="#007bff" 
                                strokeWidth={2}
                                dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
                                name="Views"
                            />
                            <Line 
                                type="monotone" 
                                dataKey="contacts" 
                                stroke="#28a745" 
                                strokeWidth={2}
                                dot={{ fill: '#28a745', strokeWidth: 2, r: 4 }}
                                name="Contacts"
                            />
                            <Line 
                                type="monotone" 
                                dataKey="favorites" 
                                stroke="#ffc107" 
                                strokeWidth={2}
                                dot={{ fill: '#ffc107', strokeWidth: 2, r: 4 }}
                                name="Favorites"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default ActivityChart;

