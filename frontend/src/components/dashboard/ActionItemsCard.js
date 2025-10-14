import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const ActionItemsCard = ({ actionItems = {}, onActionClick = null }) => {
    const items = [
        {
            key: 'pending_reviews',
            title: 'Pending Reviews',
            count: actionItems.pending_reviews || 0,
            description: 'Reviews waiting for your response',
            icon: 'fas fa-comment-dots',
            color: 'warning',
            action: 'Respond to Reviews',
            path: '/hostel/reviews'
        },
        {
            key: 'unverified_hostels',
            title: 'Unverified Hostels',
            count: actionItems.unverified_hostels || 0,
            description: 'Hostels pending verification',
            icon: 'fas fa-building',
            color: 'danger',
            action: 'Verify Hostels',
            path: '/hostel/verification'
        },
        {
            key: 'unverified_rooms',
            title: 'Unverified Rooms',
            count: actionItems.unverified_rooms || 0,
            description: 'Rooms pending verification',
            icon: 'fas fa-bed',
            color: 'danger',
            action: 'Verify Rooms',
            path: '/hostel/room-verification'
        },
        {
            key: 'rooms_low_availability',
            title: 'Low Availability',
            count: actionItems.rooms_low_availability || 0,
            description: 'Rooms with less than 2 beds available',
            icon: 'fas fa-exclamation-triangle',
            color: 'warning',
            action: 'Update Rooms',
            path: '/hostel/rooms'
        }
    ];

    const hasActions = items.some(item => item.count > 0);

    if (!hasActions) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Action Items</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="text-center">
                        <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                        <h6 className="text-success mb-2">All caught up!</h6>
                        <p className="text-muted mb-0">No pending actions required</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Action Items</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="d-flex flex-column gap-3">
                    {items.filter(item => item.count > 0).map((item) => (
                        <div key={item.key} className="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div className="d-flex align-items-center">
                                <div className={`bg-${item.color} bg-opacity-10 rounded p-2 me-3`}>
                                    <i className={`${item.icon} text-${item.color}`}></i>
                                </div>
                                <div>
                                    <div className="d-flex align-items-center mb-1">
                                        <h6 className="mb-0 me-2">{item.title}</h6>
                                        <Badge variant={item.color}>{item.count}</Badge>
                                    </div>
                                    <p className="text-muted small mb-0">{item.description}</p>
                                </div>
                            </div>
                            {onActionClick && (
                                <Button
                                    variant={`outline-${item.color}`}
                                    size="sm"
                                    onClick={() => onActionClick(item.path)}
                                >
                                    {item.action}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ActionItemsCard;

