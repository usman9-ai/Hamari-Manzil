// Mock data for hostels, rooms, notifications, reviews, and chat messages

export const hostels = [
  {
    id: 1,
    name: "City Backpackers Hostel",
    location: "Lahore, Pakistan",
    address: "123 Main Street, Gulberg, Lahore",
    price: 15000,
    rating: 4.5,
    totalReviews: 128,
    images: [
      "/hostel1.jpeg",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
    ],
    amenities: ["WiFi", "Air Conditioning", "Laundry", "Kitchen", "Common Room", "24/7 Security"],
    description: "A modern hostel in the heart of Lahore with excellent facilities and friendly staff.",
    verified: true,
    owner: {
      id: 1,
      name: "Ahmed Ali",
      email: "ahmed@citybackpackers.com",
      phone: "+92-300-1234567",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    },
    coordinates: { lat: 31.5204, lng: 74.3587 },
    rooms: [
      {
        id: 1,
        type: "Shared Dormitory",
        capacity: 6,
        price: 12000,
        available: 3,
        amenities: ["WiFi", "Air Conditioning", "Lockers"]
      },
      {
        id: 2,
        type: "Private Room",
        capacity: 2,
        price: 18000,
        available: 1,
        amenities: ["WiFi", "Air Conditioning", "Private Bathroom", "TV"]
      },
      {
        id: 3,
        type: "Deluxe Private",
        capacity: 2,
        price: 22000,
        available: 2,
        amenities: ["WiFi", "Air Conditioning", "Private Bathroom", "TV", "Mini Fridge"]
      }
    ]
  },
  {
    id: 2,
    name: "Beach View Hostel",
    location: "Karachi, Pakistan",
    address: "456 Sea View Road, Clifton, Karachi",
    price: 20000,
    rating: 4.8,
    totalReviews: 95,
    images: [
      "/hostel1.jpeg",
      "https://images.unsplash.com/photo-1520637836862-4d197d17c0a8",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d"
    ],
    amenities: ["WiFi", "Air Conditioning", "Laundry", "Kitchen", "Beach Access", "Rooftop", "24/7 Security"],
    description: "Experience the best of Karachi with stunning beach views and modern amenities.",
    owner: {
      id: 2,
      name: "Fatima Khan",
      email: "fatima@beachviewhostel.com",
      phone: "+92-300-2345678",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786"
    },
    coordinates: { lat: 24.8607, lng: 67.0011 },
    rooms: [
      {
        id: 4,
        type: "Shared Dormitory",
        capacity: 8,
        price: 15000,
        available: 4,
        amenities: ["WiFi", "Air Conditioning", "Lockers", "Sea View"]
      },
      {
        id: 5,
        type: "Private Room",
        capacity: 2,
        price: 25000,
        available: 2,
        amenities: ["WiFi", "Air Conditioning", "Private Bathroom", "Sea View", "Balcony"]
      }
    ]
  },
  {
    id: 3,
    name: "Mountain Retreat Hostel",
    location: "Islamabad, Pakistan",
    address: "789 Hill Station Road, F-8, Islamabad",
    price: 18000,
    rating: 4.3,
    totalReviews: 76,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d"
    ],
    amenities: ["WiFi", "Air Conditioning", "Laundry", "Kitchen", "Garden", "Hiking Trails", "24/7 Security"],
    description: "A peaceful retreat in the capital city with mountain views and nature trails.",
    verified: true,
    owner: {
      id: 3,
      name: "Hassan Sheikh",
      email: "hassan@mountainretreat.com",
      phone: "+92-300-3456789",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    coordinates: { lat: 33.6844, lng: 73.0479 },
    rooms: [
      {
        id: 6,
        type: "Shared Dormitory",
        capacity: 4,
        price: 14000,
        available: 2,
        amenities: ["WiFi", "Air Conditioning", "Lockers", "Mountain View"]
      },
      {
        id: 7,
        type: "Private Room",
        capacity: 2,
        price: 20000,
        available: 1,
        amenities: ["WiFi", "Air Conditioning", "Private Bathroom", "Mountain View", "Fireplace"]
      }
    ]
  },
  {
    id: 4,
    name: "Downtown Business Hostel",
    location: "Lahore, Pakistan",
    address: "321 Business District, DHA, Lahore",
    price: 16000,
    rating: 4.6,
    totalReviews: 89,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1520637836862-4d197d17c0a8"
    ],
    amenities: ["WiFi", "Air Conditioning", "Laundry", "Business Center", "Meeting Room", "24/7 Security"],
    description: "Perfect for business travelers with modern facilities and central location.",
    owner: {
      id: 4,
      name: "Sara Ahmed",
      email: "sara@downtownhostel.com",
      phone: "+92-300-4567890",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    },
    coordinates: { lat: 31.4707, lng: 74.3587 },
    rooms: [
      {
        id: 8,
        type: "Shared Dormitory",
        capacity: 6,
        price: 13000,
        available: 3,
        amenities: ["WiFi", "Air Conditioning", "Lockers", "Work Desk"]
      },
      {
        id: 9,
        type: "Private Room",
        capacity: 1,
        price: 19000,
        available: 2,
        amenities: ["WiFi", "Air Conditioning", "Private Bathroom", "Work Desk", "Coffee Machine"]
      }
    ]
  }
];


export const notifications = [
  {
    id: 1,
    type: "review_request",
    title: "Share Your Experience",
    message: "How was your stay at Mountain Retreat Hostel? We'd love to hear your feedback!",
    timestamp: "2023-12-26T16:45:00Z",
    read: true,
    bookingId: 3
    },
  {
      id: 2,
      title: "New Hostel Added",
      message: "A new hostel 'Sunrise Residency' is now available in your city.",
      time: "2 hours ago",
      unread: true
    },
  {
      id: 3,
      title: "Library Event",
      message: "Join our monthly Book Club Meetup this Saturday at 5 PM.",
      time: "1 day ago",
      unread: true
    },
  {
      id: 4,
      title: "Profile Update Reminder",
      message: "Please update your contact number in your profile settings.",
      time: "3 days ago",
      unread: false
    },
  {
      id: 5,
      type: "hostel_message",
      title: "Message from Mountain Retreat Hostel",
      message: "Welcome! We've prepared your room with extra amenities. Check-in starts at 2 PM.",
      timestamp: "2023-12-19T09:00:00Z",
      read: true,
      hostelId: 3
    },
];

export const reviews = [
  {
    id: 1,
    hostelId: 3,
    hostelName: "Mountain Retreat Hostel",
    userId: 1,
    userName: "Usman",
    rating: 5,
    title: "Amazing stay with beautiful views!",
    comment: "The hostel was clean, staff was friendly, and the mountain views were breathtaking. Highly recommended!",
    date: "2023-12-26",
    helpful: 12,
    verified: true
  },
  {
    id: 2,
    hostelId: 1,
    hostelName: "City Backpackers Hostel",
    userId: 2,
    userName: "Sarah",
    rating: 4,
    title: "Great location and facilities",
    comment: "Perfect location in the city center. The common room was nice and the kitchen was well-equipped.",
    date: "2024-01-05",
    helpful: 8,
    verified: true
  },
  {
    id: 3,
    hostelId: 2,
    hostelName: "Beach View Hostel",
    userId: 3,
    userName: "Areeba",
    rating: 5,
    title: "Best hostel in Karachi!",
    comment: "The beach access was incredible and the rooftop area was perfect for relaxing. Will definitely come back!",
    date: "2023-12-15",
    helpful: 15,
    verified: true
  }
];

export const chatMessages = [
  {
    id: 1,
    hostelId: 1,
    senderId: 1,
    senderName: "Ahmed Ali",
    senderType: "owner",
    message: "Hello! Welcome to City Backpackers Hostel. How can I help you?",
    timestamp: "2024-01-10T10:00:00Z"
  },
  {
    id: 2,
    hostelId: 1,
    senderId: 2,
    senderName: "You",
    senderType: "student",
    message: "Hi! I have a booking for Jan 15-20. What time is check-in?",
    timestamp: "2024-01-10T10:05:00Z"
  },
  {
    id: 3,
    hostelId: 1,
    senderId: 1,
    senderName: "Ahmed Ali",
    senderType: "owner",
    message: "Check-in is from 2 PM onwards. We'll have your room ready!",
    timestamp: "2024-01-10T10:07:00Z"
  },
  {
    id: 4,
    hostelId: 2,
    senderId: 3,
    senderName: "Fatima Khan",
    senderType: "owner",
    message: "Hi! I see you're interested in our beach view rooms. They're quite popular!",
    timestamp: "2024-01-12T14:00:00Z"
  }
];

export const wishlist = [
  {
    id: 1,
    hostelId: 4,
    addedDate: "2024-01-08"
  },
  {
    id: 2,
    hostelId: 2,
    addedDate: "2024-01-05"
  }
];

export const userProfile = {
  id: 1,
  firstName: "Talha",
  lastName: "Naeem",
  email: "talha.naeem@example.com",
  phone: "+92-300-1234567",
  city: "Lahore",
  gender: "Male",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  joinDate: "2023-06-15",
  totalBookings: 3,
  totalReviews: 2,
  averageRating: 4.5
};