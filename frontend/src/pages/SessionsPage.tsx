import { useState } from 'react';
import { FaUserFriends, FaWineGlassAlt, FaPlus, FaUsers, FaClock, FaChevronRight } from 'react-icons/fa';

const SessionsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // This is a placeholder. In a real implementation, we would fetch sessions from the API
  const upcomingSessions = [
    {
      id: '1',
      title: 'Friday Night Wine Tasting',
      date: '2025-04-19T19:00:00',
      host: 'Jason Williamson',
      participants: 5,
      wine: 'Selected Reds from Bordeaux'
    },
    {
      id: '2',
      title: 'Summer Wine Exploration',
      date: '2025-05-15T18:30:00',
      host: 'Maria Johnson',
      participants: 3,
      wine: 'Light Whites & Rosés'
    }
  ];
  
  const pastSessions = [
    {
      id: '3',
      title: 'Napa Valley Special',
      date: '2025-03-10T20:00:00',
      host: 'Robert Chen',
      participants: 4,
      wine: 'Napa Valley Cabernets'
    },
    {
      id: '4',
      title: 'Italian Classics',
      date: '2025-02-28T19:00:00',
      host: 'Jason Williamson',
      participants: 7,
      wine: 'Barolo & Chianti Selections'
    },
    {
      id: '5',
      title: 'Budget Wines That Impress',
      date: '2025-02-14T18:00:00',
      host: 'Emma Davis',
      participants: 6,
      wine: 'Affordable Wines Under $20'
    }
  ];
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-cormorant italic text-wine-800 mb-2">Tasting Sessions</h1>
          <p className="text-gray-600">Join virtual wine tastings with friends</p>
        </div>
        <button className="btn-primary flex items-center gap-2 mt-4 md:mt-0">
          <FaPlus /> Create New Session
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            className={`pb-4 px-1 ${activeTab === 'upcoming' ? 'text-wine-600 border-b-2 border-wine-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`pb-4 px-1 ${activeTab === 'past' ? 'text-wine-600 border-b-2 border-wine-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('past')}
          >
            Past Sessions
          </button>
        </div>
      </div>

      {/* Session Cards */}
      <div className="space-y-4">
        {activeTab === 'upcoming' && upcomingSessions.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <FaUserFriends className="mx-auto text-4xl text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No upcoming sessions</h2>
            <p className="text-gray-600 mb-6">Create a new tasting session or join one by invitation.</p>
            <button className="btn-primary">Create New Session</button>
          </div>
        )}

        {activeTab === 'upcoming' && upcomingSessions.map(session => (
          <div key={session.id} className="card hover:border-wine-300 transition-all">
            <div className="flex flex-col md:flex-row md:items-center">
              {/* Date column */}
              <div className="mb-4 md:mb-0 md:w-52 md:flex-shrink-0">
                <div className="bg-wine-50 text-wine-700 p-3 rounded-lg inline-block">
                  <FaClock className="inline mr-2" /> {formatDate(session.date)}
                </div>
              </div>
              
              {/* Session details */}
              <div className="flex-1 md:pl-6">
                <h3 className="text-xl font-bold font-cormorant text-wine-800">{session.title}</h3>
                <div className="flex items-center mt-2 text-gray-600">
                  <FaWineGlassAlt className="mr-2 text-wine-500" size={14} />
                  <span>{session.wine}</span>
                </div>
                <div className="flex items-center mt-1 text-gray-600">
                  <FaUsers className="mr-2 text-wine-500" size={14} />
                  <span>{session.participants} participants • Hosted by {session.host}</span>
                </div>
              </div>
              
              {/* Action button */}
              <div className="mt-4 md:mt-0 md:ml-4 md:flex-shrink-0">
                <button className="btn-primary">
                  Join Session
                </button>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'past' && pastSessions.map(session => (
          <div key={session.id} className="card hover:border-wine-300 transition-all">
            <div className="flex flex-col md:flex-row md:items-center">
              {/* Date column */}
              <div className="mb-4 md:mb-0 md:w-52 md:flex-shrink-0">
                <div className="bg-gray-100 text-gray-600 p-3 rounded-lg inline-block">
                  <FaClock className="inline mr-2" /> {formatDate(session.date)}
                </div>
              </div>
              
              {/* Session details */}
              <div className="flex-1 md:pl-6">
                <h3 className="text-xl font-bold font-cormorant text-gray-800">{session.title}</h3>
                <div className="flex items-center mt-2 text-gray-600">
                  <FaWineGlassAlt className="mr-2 text-gray-500" size={14} />
                  <span>{session.wine}</span>
                </div>
                <div className="flex items-center mt-1 text-gray-600">
                  <FaUsers className="mr-2 text-gray-500" size={14} />
                  <span>{session.participants} participants • Hosted by {session.host}</span>
                </div>
              </div>
              
              {/* Action button */}
              <div className="mt-4 md:mt-0 md:ml-4 md:flex-shrink-0">
                <button className="btn-secondary">
                  View Results <FaChevronRight className="ml-1" size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Feature */}
      <div className="mt-12 bg-gradient-to-r from-wine-500 to-wine-700 rounded-lg text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-8 -translate-y-8">
          <div className="w-full h-full rounded-full bg-white opacity-10"></div>
        </div>
        
        <h2 className="text-2xl font-bold font-cormorant italic mb-2 relative z-10">Coming Soon: Mobile App</h2>
        <p className="text-wine-100 mb-4 max-w-2xl relative z-10">
          Take your wine tasting on the go! Our mobile app will let you scan wine labels, 
          save to your collection, and join tasting sessions from anywhere.
        </p>
        <button className="bg-white text-wine-700 hover:bg-wine-50 py-2 px-4 rounded font-medium text-sm relative z-10">
          Join Waitlist
        </button>
      </div>
    </div>
  );
};

export default SessionsPage;