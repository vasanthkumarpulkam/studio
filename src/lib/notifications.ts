
import type { Notification } from '@/types';

// This is a mock database for notifications.
// In a real application, this would be a table in your database.
export let notifications: Notification[] = [
    {
        id: 'notif-1',
        userId: 'user-1',
        message: 'Your job "Fix leaky kitchen sink" has received a new bid.',
        messageKey: 'notification_new_bid_simple',
        messageParams: { jobTitle: 'Fix leaky kitchen sink' },
        link: '/dashboard/jobs/job-1',
        isRead: false,
        createdAt: '2024-05-29T12:00:00.000Z',
    },
    {
        id: 'notif-2',
        userId: 'user-1',
        message: 'Your job "Fix leaky kitchen sink" has received another bid.',
        messageKey: 'notification_new_bid_simple_another',
        messageParams: { jobTitle: 'Fix leaky kitchen sink' },
        link: '/dashboard/jobs/job-1',
        isRead: true,
        createdAt: '2024-05-29T14:00:00.000Z',
    },
    {
        id: 'notif-3',
        userId: 'user-2',
        message: 'Welcome to ServiceHub! Start by finding jobs that match your skills.',
        messageKey: 'notification_welcome',
        link: '/dashboard',
        isRead: true,
        createdAt: '2024-05-25T12:00:00.000Z',
    }
];
