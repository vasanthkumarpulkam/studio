import type { Notification } from '@/types';

// This is a mock database for notifications.
// In a real application, this would be a table in your database.
export let notifications: Notification[] = [
    {
        id: 'notif-1',
        userId: 'user-1',
        message: 'Your job "Fix leaky kitchen sink" has received a new bid.',
        link: '/dashboard/jobs/job-1',
        isRead: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'notif-2',
        userId: 'user-1',
        message: 'Your job "Fix leaky kitchen sink" has received another bid.',
        link: '/dashboard/jobs/job-1',
        isRead: true,
        createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'notif-3',
        userId: 'user-2',
        message: 'Welcome to ServiceHub! Start by finding jobs that match your skills.',
        link: '/dashboard',
        isRead: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    }
];
