import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const TopHostelsCard = ({ hostels = [], loading = false, onViewHostel = null }) => {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Hostels</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                        <div className="text-center">
                            <div className="spinner-border text-primary mb-3"></div>
                            <p className="text-muted">Loading hostels...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!hostels || hostels.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Hostels</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                        <div className="text-center">
                            <i className="fas fa-hotel fa-3x text-muted mb-3"></i>
                            <p className="text-muted">No hostels found</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Performing Hostels</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="d-flex flex-column gap-3">
                    {hostels.slice(0, 5).map((hostel, index) => (
                        <div key={hostel.id} className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center mb-1">
                                    <span className="badge bg-primary me-2">#{index + 1}</span>
                                    <h6 className="mb-0 fw-semibold">{hostel.name}</h6>
                                </div>
                                <div className="d-flex gap-3 small text-muted">
                                    <span>
                                        <i className="fas fa-eye me-1"></i>
                                        {hostel.views} views
                                    </span>
                                    <span>
                                        <i className="fas fa-phone me-1"></i>
                                        {hostel.contacts} contacts
                                    </span>
                                    <span>
                                        <i className="fas fa-star me-1"></i>
                                        {hostel.avg_rating}/5
                                    </span>
                                </div>
                            </div>
                            <div className="text-end">
                                <Badge 
                                    variant={hostel.conversion_rate > 5 ? 'success' : hostel.conversion_rate > 2 ? 'warning' : 'secondary'}
                                    className="mb-2"
                                >
                                    {hostel.conversion_rate}% conversion
                                </Badge>
                                {onViewHostel && (
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => onViewHostel(hostel.id)}
                                    >
                                        <i className="fas fa-eye me-1"></i>
                                        View
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default TopHostelsCard;

