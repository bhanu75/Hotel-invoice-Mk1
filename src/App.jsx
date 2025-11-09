import React, { useState, useEffect } from 'react';
import { Home, Bed, Calendar, Users, FileText, Plus, Search, Edit2, Trash2, X, LogIn, LogOut, Clock, TrendingUp, IndianRupee, BookOpen, Grid3x3, UserPlus, UtensilsCrossed, Coffee, Cake, ChefHat } from 'lucide-react';

// Initialize localStorage with sample data if empty
const initializeStorage = () => {
  if (!localStorage.getItem('rooms')) {
    const sampleRooms = [
      { id: 1, number: '101', name: 'Deluxe #101', type: 'Deluxe', price: 3500, status: 'Available' },
      { id: 2, number: '102', name: 'Deluxe #102', type: 'Deluxe', price: 3500, status: 'Checked In' },
      { id: 3, number: '103', name: 'Deluxe #103', type: 'Deluxe', price: 3500, status: 'Guaranteed' },
      { id: 4, number: '104', name: 'Deluxe #104', type: 'Deluxe', price: 3500, status: 'Checked In' },
      { id: 5, number: '201', name: 'Suite #201', type: 'Suite', price: 8500, status: 'Available' },
    ];
    localStorage.setItem('rooms', JSON.stringify(sampleRooms));
  }

  if (!localStorage.getItem('bookings')) {
    const sampleBookings = [
      { id: 1, guest: 'Rachita Grant', guestPhone: '9876543210', guestEmail: 'rachita@email.com', room: 'Deluxe #101', roomNumber: '101', roomId: 1, checkin: '2025-11-09', checkout: '2025-11-12', status: 'Guaranteed', amount: 10500 },
      { id: 2, guest: 'Christy Cantley', guestPhone: '9876543211', guestEmail: 'christy@email.com', room: 'Deluxe #102', roomNumber: '102', roomId: 2, checkin: '2025-11-08', checkout: '2025-11-11', status: 'Checked In', amount: 10500 },
      { id: 3, guest: 'Bob Loblaw', guestPhone: '9876543212', guestEmail: 'bob@email.com', room: 'Deluxe #103', roomNumber: '103', roomId: 3, checkin: '2025-11-09', checkout: '2025-11-10', status: 'Checked In', amount: 3500 },
    ];
    localStorage.setItem('bookings', JSON.stringify(sampleBookings));
  }

  if (!localStorage.getItem('guests')) {
    const sampleGuests = [
      { id: 1, name: 'Rachita Grant', phone: '9876543210', email: 'rachita@email.com', lastStay: '2025-11-09' },
      { id: 2, name: 'Christy Cantley', phone: '9876543211', email: 'christy@email.com', lastStay: '2025-11-08' },
      { id: 3, name: 'Bob Loblaw', phone: '9876543212', email: 'bob@email.com', lastStay: '2025-11-09' },
    ];
    localStorage.setItem('guests', JSON.stringify(sampleGuests));
  }

  if (!localStorage.getItem('foodMenu')) {
    const foodMenu = [
      // Drinks
      { id: 1, name: 'Chai (Tea)', category: 'Drinks', price: 40, icon: '☕' },
      { id: 2, name: 'Coffee', category: 'Drinks', price: 60, icon: '☕' },
      { id: 3, name: 'Cold Coffee', category: 'Drinks', price: 100, icon: '🥤' },
      { id: 4, name: 'Fresh Lime Soda', category: 'Drinks', price: 80, icon: '🍋' },
      { id: 5, name: 'Lassi', category: 'Drinks', price: 70, icon: '🥛' },
      
      // Cakes and Treats
      { id: 10, name: 'Samosa (2 Pcs)', category: 'Cakes and Treats', price: 40, icon: '🥟' },
      { id: 11, name: 'Pakora Plate', category: 'Cakes and Treats', price: 80, icon: '🍤' },
      { id: 12, name: 'Sandwich', category: 'Cakes and Treats', price: 100, icon: '🥪' },
      { id: 13, name: 'French Fries', category: 'Cakes and Treats', price: 120, icon: '🍟' },
      
      // Entrees
      { id: 20, name: 'Veg Thali', category: 'Entrees', price: 400, icon: '🍛' },
      { id: 21, name: 'Dal Bati Churma', category: 'Entrees', price: 380, icon: '🍲' },
      { id: 22, name: 'Paneer Butter Masala', category: 'Entrees', price: 320, icon: '🧈' },
      { id: 23, name: 'Gatte Ki Sabzi', category: 'Entrees', price: 280, icon: '🥘' },
      
      // Mains
      { id: 30, name: 'Chicken Curry', category: 'Mains', price: 400, icon: '🍗' },
      { id: 31, name: 'Mutton Rogan Josh', category: 'Mains', price: 520, icon: '🍖' },
      { id: 32, name: 'Biryani (Chicken)', category: 'Mains', price: 380, icon: '🍚' },
      { id: 33, name: 'Fish Curry', category: 'Mains', price: 450, icon: '🐟' },
    ];
    localStorage.setItem('foodMenu', JSON.stringify(foodMenu));
  }

  if (!localStorage.getItem('foodOrders')) {
    localStorage.setItem('foodOrders', JSON.stringify([]));
  }
};

export default function HotelCMS() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [guests, setGuests] = useState([]);
  const [foodMenu, setFoodMenu] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingItem, setEditingItem] = useState(null);
  
  // Food ordering states
  const [selectedCategory, setSelectedCategory] = useState('Menu');
  const [cart, setCart] = useState([]);
  const [customItem, setCustomItem] = useState({ name: '', price: '' });
  const [selectedRoom, setSelectedRoom] = useState('');

  useEffect(() => {
    initializeStorage();
    loadData();
  }, []);

  const loadData = () => {
    setRooms(JSON.parse(localStorage.getItem('rooms') || '[]'));
    setBookings(JSON.parse(localStorage.getItem('bookings') || '[]'));
    setGuests(JSON.parse(localStorage.getItem('guests') || '[]'));
    setFoodMenu(JSON.parse(localStorage.getItem('foodMenu') || '[]'));
    setFoodOrders(JSON.parse(localStorage.getItem('foodOrders') || '[]'));
  };

  const getDashboardStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const arrivals = bookings.filter(b => b.checkin === today && b.status !== 'Checked In');
    const departures = bookings.filter(b => b.checkout === today && b.status === 'Checked In');
    const currentGuests = bookings.filter(b => b.status === 'Checked In');
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'Checked In').length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    const newBookings = bookings.filter(b => b.status === 'Guaranteed').length;

    return { arrivals, departures, currentGuests, occupancyRate, newBookings };
  };

  const stats = getDashboardStats();

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const addRoom = (roomData) => {
    const newRoom = { ...roomData, id: Date.now() };
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    closeModal();
  };

  const updateRoom = (roomData) => {
    const updatedRooms = rooms.map(r => r.id === roomData.id ? roomData : r);
    setRooms(updatedRooms);
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    closeModal();
  };

  const deleteRoom = (id) => {
    if (confirm('Are you sure you want to delete this room?')) {
      const updatedRooms = rooms.filter(r => r.id !== id);
      setRooms(updatedRooms);
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    }
  };

  const addBooking = (bookingData) => {
    const newBooking = { ...bookingData, id: Date.now() };
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    const updatedRooms = rooms.map(r => 
      r.id === parseInt(bookingData.roomId) ? { ...r, status: bookingData.status } : r
    );
    setRooms(updatedRooms);
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    
    const guestExists = guests.find(g => g.phone === bookingData.guestPhone);
    if (!guestExists) {
      const newGuest = {
        id: Date.now(),
        name: bookingData.guest,
        phone: bookingData.guestPhone,
        email: bookingData.guestEmail,
        lastStay: bookingData.checkin
      };
      const updatedGuests = [...guests, newGuest];
      setGuests(updatedGuests);
      localStorage.setItem('guests', JSON.stringify(updatedGuests));
    }
    
    closeModal();
  };

  const deleteBooking = (id) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      const booking = bookings.find(b => b.id === id);
      const updatedBookings = bookings.filter(b => b.id !== id);
      setBookings(updatedBookings);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      
      if (booking) {
        const updatedRooms = rooms.map(r => 
          r.id === booking.roomId ? { ...r, status: 'Available' } : r
        );
        setRooms(updatedRooms);
        localStorage.setItem('rooms', JSON.stringify(updatedRooms));
      }
    }
  };

  const deleteGuest = (id) => {
    if (confirm('Are you sure you want to delete this guest?')) {
      const updatedGuests = guests.filter(g => g.id !== id);
      setGuests(updatedGuests);
      localStorage.setItem('guests', JSON.stringify(updatedGuests));
    }
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Top Grid - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Arrivals Card */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-white font-semibold text-lg">Arrivals</h3>
            <button className="text-white/80 hover:text-white">
              <Search size={20} />
            </button>
          </div>
          <div className="bg-white/20 rounded-xl p-4 mb-4">
            <table className="w-full text-white text-sm">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="text-left py-2">Guest name</th>
                  <th className="text-left py-2">Room</th>
                  <th className="text-left py-2">Room type</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.arrivals.slice(0, 1).map(booking => (
                  <tr key={booking.id}>
                    <td className="py-2">{booking.guest}</td>
                    <td className="py-2">{booking.roomNumber}</td>
                    <td className="py-2">Deluxe</td>
                    <td className="py-2">{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Departures Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-white font-semibold text-lg">Departures</h3>
            <button className="text-white/80 hover:text-white">
              <Search size={20} />
            </button>
          </div>
          <div className="bg-white/20 rounded-xl p-4 mb-4">
            <table className="w-full text-white text-sm">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="text-left py-2">Guest name</th>
                  <th className="text-left py-2">Room</th>
                  <th className="text-left py-2">Room type</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.departures.slice(0, 1).map(booking => (
                  <tr key={booking.id}>
                    <td className="py-2">{booking.guest}</td>
                    <td className="py-2">{booking.roomNumber}</td>
                    <td className="py-2">Deluxe</td>
                    <td className="py-2">Checked In</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Diary Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
          <Grid3x3 size={64} className="text-white/90 mb-4" />
          <h3 className="text-white font-semibold text-xl">Daily Diary</h3>
        </div>
      </div>

      {/* Middle Grid - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Guests Card */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-white font-semibold">Current Guests</h3>
            <button className="text-white/80 hover:text-white">
              <Search size={18} />
            </button>
          </div>
          <div className="bg-white/10 rounded-xl p-3 mb-3">
            <table className="w-full text-white text-xs">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-1">Guest</th>
                  <th className="text-left py-1">Room</th>
                  <th className="text-left py-1">Type</th>
                  <th className="text-left py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.currentGuests.slice(0, 2).map(booking => (
                  <tr key={booking.id}>
                    <td className="py-1 text-xs">{booking.guest.split(' ')[0]}</td>
                    <td className="py-1">{booking.roomNumber}</td>
                    <td className="py-1">Deluxe</td>
                    <td className="py-1 text-xs">Checked In</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bookmarks Card */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-white font-semibold">Bookmarks</h3>
            <button className="text-white/80 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-2">
            <div className="bg-white/20 rounded-lg px-3 py-2 text-white text-sm flex justify-between items-center">
              <span>Online Booking</span>
              <X size={14} className="text-white/60" />
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-2 text-white text-sm flex justify-between items-center">
              <span>Rate Management</span>
              <X size={14} className="text-white/60" />
            </div>
          </div>
        </div>

        {/* Occupancy Card */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
          <div className="text-8xl font-bold text-white mb-2">{stats.occupancyRate}</div>
          <div className="text-white text-lg font-semibold">Occupancy</div>
        </div>

        {/* Action Buttons Card */}
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <button
            onClick={() => openModal('booking')}
            className="bg-white/30 hover:bg-white/40 backdrop-blur text-white rounded-xl p-4 flex items-center gap-3 transition font-semibold"
          >
            <Plus size={24} />
            <span>Booking</span>
          </button>
          <button
            onClick={() => openModal('group-booking')}
            className="bg-white/30 hover:bg-white/40 backdrop-blur text-white rounded-xl p-4 flex items-center gap-3 transition font-semibold"
          >
            <Plus size={24} />
            <span>Group Booking</span>
          </button>
        </div>
      </div>

      {/* Bottom Grid - 4 equal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center">
          <div className="text-7xl font-bold text-white mb-2">0</div>
          <div className="text-white/90 text-lg">TrevPar</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-700 to-yellow-800 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center">
          <div className="text-7xl font-bold text-white mb-2">{stats.newBookings}</div>
          <div className="text-white/90 text-lg">New Bookings</div>
        </div>

        <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center">
          <div className="text-7xl font-bold text-white mb-2">0</div>
          <div className="text-white/90 text-lg">Advance</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center">
          <div className="text-7xl font-bold text-white mb-2">0</div>
          <div className="text-white/90 text-lg">Revenue</div>
        </div>
      </div>
    </div>
  );

  // Render other pages (keeping previous implementations)
  const renderRooms = () => {
    const filteredRooms = rooms.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           room.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'All' || room.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Room Management</h1>
          <button
            onClick={() => openModal('room')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-lg"
          >
            <Plus size={20} />
            Add Room
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500"
          >
            <option>All</option>
            <option>Available</option>
            <option>Checked In</option>
            <option>Guaranteed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <div key={room.id} className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{room.name}</h3>
                  <p className="text-gray-400 text-sm">{room.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  room.status === 'Available' ? 'bg-green-500/20 text-green-400' : 
                  room.status === 'Checked In' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {room.status}
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-4">₹{room.price}/night</div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal('room', room)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => deleteRoom(room.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBookings = () => {
    const filteredBookings = bookings.filter(booking =>
      booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Booking Management</h1>
          <button
            onClick={() => openModal('booking')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-lg"
          >
            <Plus size={20} />
            Add Booking
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Guest Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Room</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Check-in</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Check-out</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id} className="border-t border-gray-700 hover:bg-gray-750 transition">
                  <td className="px-6 py-4 text-white">{booking.guest}</td>
                  <td className="px-6 py-4 text-gray-300">{booking.room}</td>
                  <td className="px-6 py-4 text-gray-300">{new Date(booking.checkin).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-300">{new Date(booking.checkout).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-green-400 font-semibold">₹{booking.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'Checked In' ? 'bg-blue-500/20 text-blue-400' :
                      booking.status === 'Guaranteed' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderGuests = () => {
    const filteredGuests = guests.filter(guest =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm)
    );

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Guest Management</h1>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Last Stay</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map(guest => (
                <tr key={guest.id} className="border-t border-gray-700 hover:bg-gray-750 transition">
                  <td className="px-6 py-4 text-white font-medium">{guest.name}</td>
                  <td className="px-6 py-4 text-gray-300">{guest.phone}</td>
                  <td className="px-6 py-4 text-gray-300">{guest.email}</td>
                  <td className="px-6 py-4 text-gray-300">{new Date(guest.lastStay).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteGuest(guest.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderInvoice = () => (
    <div className="bg-gray-800 rounded-xl p-8 shadow-xl">
      <h1 className="text-3xl font-bold text-white mb-6">Generate Invoice</h1>
      <div className="text-center py-12">
        <FileText size={64} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400 mb-6">Invoice generation integrated with your billing system</p>
        <button
          onClick={() => window.open('about:blank')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition"
        >
          Open Billing System
        </button>
      </div>
    </div>
  );

  // Render Food Ordering Page
  const renderFoodOrdering = () => {
    const categories = ['Menu', 'Basket', 'Card', 'Cash', 'Cancel'];
    const menuCategories = ['Drinks', 'Cakes and Treats', 'Entrees', 'Mains'];

    const addToCart = (item) => {
      const existingItem = cart.find(i => i.id === item.id);
      if (existingItem) {
        setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
        setCart([...cart, { ...item, quantity: 1 }]);
      }
    };

    const removeFromCart = (id) => {
      setCart(cart.filter(i => i.id !== id));
    };

    const updateQuantity = (id, quantity) => {
      if (quantity <= 0) {
        removeFromCart(id);
      } else {
        setCart(cart.map(i => i.id === id ? { ...i, quantity } : i));
      }
    };

    const addCustomItem = () => {
      if (customItem.name && customItem.price) {
        const newItem = {
          id: Date.now(),
          name: customItem.name,
          price: parseFloat(customItem.price),
          category: 'Custom',
          icon: '✏️',
          quantity: 1
        };
        setCart([...cart, newItem]);
        setCustomItem({ name: '', price: '' });
      }
    };

    const placeOrder = () => {
      if (cart.length === 0) {
        alert('Please add items to cart');
        return;
      }
      if (!selectedRoom) {
        alert('Please select a room');
        return;
      }

      const order = {
        id: Date.now(),
        room: selectedRoom,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'Pending'
      };

      const updatedOrders = [...foodOrders, order];
      setFoodOrders(updatedOrders);
      localStorage.setItem('foodOrders', JSON.stringify(updatedOrders));
      setCart([]);
      setSelectedRoom('');
      alert('Order placed successfully!');
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <UtensilsCrossed size={40} className="text-white" />
              <h1 className="text-4xl font-bold text-white">Order & Pay</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  selectedCategory === cat
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="p-8">
            {selectedCategory === 'Menu' && (
              <div className="space-y-6">
                {/* Room Selection */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                  <label className="block text-lg font-bold text-gray-800 mb-3">Select Room Number</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-purple-300 rounded-xl text-gray-800 font-semibold focus:border-purple-500 focus:ring-4 focus:ring-purple-200"
                  >
                    <option value="">Choose room...</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.number}>
                        Room {room.number} - {room.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Menu Categories */}
                {menuCategories.map(category => {
                  const items = foodMenu.filter(item => item.category === category);
                  const categoryIcons = {
                    'Drinks': <Coffee className="text-blue-500" size={32} />,
                    'Cakes and Treats': <Cake className="text-pink-500" size={32} />,
                    'Entrees': <ChefHat className="text-orange-500" size={32} />,
                    'Mains': <UtensilsCrossed className="text-red-500" size={32} />
                  };

                  return (
                    <div key={category} className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-blue-100 rounded-2xl p-6 flex items-center gap-4 transition shadow-md hover:shadow-lg border-2 border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                          {categoryIcons[category]}
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{category}</span>
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                        {items.map(item => (
                          <div key={item.id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition border-2 border-gray-100 hover:border-blue-300">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{item.icon}</span>
                                <div>
                                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                  <p className="text-blue-600 font-bold">₹{item.price}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => addToCart(item)}
                                className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition shadow-md"
                              >
                                <Plus size={20} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Custom Item */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Add Custom Item</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Item name..."
                      value={customItem.name}
                      onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                      className="flex-1 px-4 py-3 bg-white border-2 border-yellow-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={customItem.price}
                      onChange={(e) => setCustomItem({ ...customItem, price: e.target.value })}
                      className="w-32 px-4 py-3 bg-white border-2 border-yellow-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200"
                    />
                    <button
                      onClick={addCustomItem}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 rounded-xl font-semibold transition shadow-md"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedCategory === 'Basket' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart</h2>
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">Cart is empty</p>
                  </div>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{item.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                            <p className="text-blue-600">₹{item.price} each</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold text-gray-800 w-24 text-right">₹{item.price * item.quantity}</span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-semibold">Total Amount:</span>
                        <span className="text-3xl font-bold">₹{cartTotal}</span>
                      </div>
                      <button
                        onClick={placeOrder}
                        className="w-full bg-white text-blue-600 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg"
                      >
                        Place Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {selectedCategory === 'Card' && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Card Payment Coming Soon</p>
              </div>
            )}

            {selectedCategory === 'Cash' && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Cash Payment - Pay at Counter</p>
              </div>
            )}

            {selectedCategory === 'Cancel' && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Order Cancelled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {editingItem ? 'Edit' : 'Add'} {modalType === 'room' ? 'Room' : modalType === 'group-booking' ? 'Group Booking' : 'Booking'}
            </h2>
            <button onClick={closeModal} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {modalType === 'room' ? (
            <RoomForm 
              room={editingItem} 
              onSubmit={editingItem ? updateRoom : addRoom}
              onCancel={closeModal}
            />
          ) : (
            <BookingForm 
              rooms={rooms.filter(r => r.status === 'Available')}
              onSubmit={addBooking}
              onCancel={closeModal}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-16 bg-blue-600 flex flex-col items-center py-6 space-y-6">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <Home size={24} className="text-blue-600" />
        </div>
        
        <div className="flex-1 space-y-4">
          {[
            { id: 'dashboard', icon: Home },
            { id: 'rooms', icon: Bed },
            { id: 'bookings', icon: Calendar },
            { id: 'guests', icon: Users },
            { id: 'food', icon: UtensilsCrossed },
            { id: 'invoice', icon: FileText },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setSearchTerm(''); }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                currentPage === item.id
                  ? 'bg-white text-blue-600'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon size={24} />
            </button>
          ))}
        </div>

        <button className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
          <Users size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-gray-800 px-8 py-4 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Hotel Grand Sita</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Kent Howard</span>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          {currentPage === 'dashboard' && renderDashboard()}
          {currentPage === 'rooms' && renderRooms()}
          {currentPage === 'bookings' && renderBookings()}
          {currentPage === 'guests' && renderGuests()}
          {currentPage === 'food' && renderFoodOrdering()}
          {currentPage === 'invoice' && renderInvoice()}
        </div>
      </div>

      {renderModal()}
    </div>
  );
}

// Room Form Component
function RoomForm({ room, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(room || {
    number: '',
    name: '',
    type: 'Deluxe',
    price: '',
    status: 'Available'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const roomName = formData.name || `${formData.type} #${formData.number}`;
    onSubmit({ ...formData, name: roomName, price: parseFloat(formData.price) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Room Number</label>
        <input
          type="text"
          required
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="101"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Room Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500"
        >
          <option>Deluxe</option>
          <option>Super Deluxe</option>
          <option>Suite</option>
          <option>Royal Suite</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Price per Night</label>
        <input
          type="number"
          required
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500"
        >
          <option>Available</option>
          <option>Checked In</option>
          <option>Guaranteed</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          {room ? 'Update' : 'Add'} Room
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Booking Form Component
function BookingForm({ rooms, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    guest: '',
    guestPhone: '',
    guestEmail: '',
    roomId: '',
    room: '',
    roomNumber: '',
    checkin: '',
    checkout: '',
    status: 'Guaranteed',
    amount: 0
  });

  const handleRoomChange = (e) => {
    const selectedRoom = rooms.find(r => r.id === parseInt(e.target.value));
    if (selectedRoom) {
      setFormData({
        ...formData,
        roomId: selectedRoom.id,
        room: selectedRoom.name,
        roomNumber: selectedRoom.number,
        amount: calculateAmount(formData.checkin, formData.checkout, selectedRoom.price)
      });
    }
  };

  const calculateAmount = (checkin, checkout, price) => {
    if (!checkin || !checkout || !price) return 0;
    const days = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * price : 0;
  };

  const handleDateChange = (field, value) => {
    const selectedRoom = rooms.find(r => r.id === parseInt(formData.roomId));
    const newFormData = { ...formData, [field]: value };
    if (selectedRoom) {
      newFormData.amount = calculateAmount(
        field === 'checkin' ? value : formData.checkin,
        field === 'checkout' ? value : formData.checkout,
        selectedRoom.price
      );
    }
    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.roomId) {
      alert('Please select a room');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Guest Name</label>
        <input
          type="text"
          required
          value={formData.guest}
          onChange={(e) => setFormData({ ...formData, guest: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
        <input
          type="tel"
          required
          value={formData.guestPhone}
          onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
        <input
          type="email"
          required
          value={formData.guestEmail}
          onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Select Room</label>
        <select
          required
          value={formData.roomId}
          onChange={handleRoomChange}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500"
        >
          <option value="">Choose a room...</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>
              {room.name} - {room.type} (₹{room.price}/night)
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Check-in Date</label>
          <input
            type="date"
            required
            value={formData.checkin}
            onChange={(e) => handleDateChange('checkin', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Check-out Date</label>
          <input
            type="date"
            required
            value={formData.checkout}
            onChange={(e) => handleDateChange('checkout', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500"
        >
          <option>Guaranteed</option>
          <option>Checked In</option>
          <option>Cancelled</option>
        </select>
      </div>

      {formData.amount > 0 && (
        <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-4">
          <div className="text-sm text-blue-300 mb-1">Total Amount</div>
          <div className="text-3xl font-bold text-blue-400">₹{formData.amount.toLocaleString()}</div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Add Booking
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
