import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events'; // Mock backend URL or real if it existed

// We will use mock data for the frontend display since there was no backend event logic requested
const mockEvents = [
    {
        _id: '1',
        name: 'Thaala Music Event',
        description: 'lkjhgfdsartyuikol',
        date: '2026-03-05T18:00:00Z',
        location: 'outside',
        price: 500.00,
        status: 'upcoming',
        imageUrl: null,
    },
    {
        _id: '2',
        name: 'Music Event',
        description: 'tewt4',
        date: '2026-03-20T19:28:00Z',
        location: 'SLIIT',
        price: 500.00,
        status: 'ongoing',
        imageUrl: null,
    },
    {
        _id: '3',
        name: 'Wiramaya Music Concert',
        description: 'tfyhjsedrfgthjkl;',
        date: '2026-04-11T18:30:00Z',
        location: 'New building',
        price: 1000.00,
        status: 'upcoming',
        imageUrl: null,
    },
    {
        _id: '4',
        name: 'University Tech Fest 2026',
        description: 'kefyefiqfeg',
        date: '2026-04-12T14:00:00Z',
        location: 'Main Auditorium, University Hall',
        price: 1700.00,
        status: 'upcoming',
        imageUrl: null,
    }
];

export const getEvents = async () => {
    // Attempt to fetch from backend if events are implemented, otherwise return mock
    return mockEvents;
};

export const getEventById = async (id) => {
    const event = mockEvents.find(e => e._id === id);
    if (!event) throw new Error('Event not found');
    return event;
};
