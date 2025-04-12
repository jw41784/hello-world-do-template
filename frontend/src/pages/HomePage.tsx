import { Link } from 'react-router-dom';
import { FaWineGlassAlt, FaStar, FaUsers, FaMobileAlt, FaWineBottle, FaRegClipboard, FaRegChartBar, FaGlassCheers, FaUserFriends, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section with background */}
      <section className="relative py-20 md:py-28 overflow-hidden -mt-20">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-wine-800/90 to-wine-950/95 z-0"></div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 z-0" 
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-cormorant italic leading-tight mb-6">
                Your Personal <span className="text-wine-300">Wine</span> Journey
              </h1>
              <p className="text-xl font-outfit text-gray-200 mb-8 leading-relaxed">
                Create your personal wine journal, rate wines on multiple criteria, and join collaborative tasting sessions with friends.
              </p>
              {isAuthenticated ? (
                <div className="flex flex-wrap gap-4">
                  <Link to="/wines" className="btn-primary text-lg py-3 px-8 shadow-lg">
                    View My Collection
                  </Link>
                  <Link to="/wines/add" className="bg-white text-wine-700 hover:bg-gray-100 py-3 px-8 rounded-md transition-all font-medium text-lg shadow-lg flex items-center justify-center gap-2">
                    <FaWineBottle className="h-4 w-4" />
                    <span>Add New Wine</span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  <Link to="/register" className="btn-primary text-lg py-3 px-8 shadow-lg">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="bg-transparent hover:bg-white/10 text-white border border-white/30 py-3 px-8 rounded-md transition-all font-medium text-lg">
                    Sign In
                  </Link>
                </div>
              )}
              
              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <div className="text-3xl font-bold text-wine-300">5K+</div>
                  <div className="text-sm text-gray-300">Wines Rated</div>
                </div>
                <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <div className="text-3xl font-bold text-wine-300">2K+</div>
                  <div className="text-sm text-gray-300">Active Users</div>
                </div>
                <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <div className="text-3xl font-bold text-wine-300">200+</div>
                  <div className="text-sm text-gray-300">Tastings</div>
                </div>
              </div>
            </div>
            
            {/* Hero image/mockup */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-wine-600 rounded-full blur-3xl opacity-20 -z-10 scale-75 translate-x-10"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white/10 bg-wine-800">
                <div className="aspect-[3/4] relative bg-gradient-to-br from-wine-700 to-wine-900 p-4">
                  <div className="absolute top-0 left-0 right-0 h-6 bg-black/10 flex items-center justify-center">
                    <div className="w-20 h-1.5 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="mt-8 rounded-xl bg-white shadow-lg overflow-hidden">
                    <div className="h-14 bg-wine-600 flex items-center px-4">
                      <FaWineGlassAlt className="text-white h-5 w-5" />
                      <h3 className="text-white ml-2 font-medium">My Collection</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="rounded-lg border border-gray-200 p-3 bg-white shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-wine-700">Château Margaux {2015 + item}</div>
                              <div className="text-xs text-gray-500">Bordeaux, France</div>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar 
                                  key={star} 
                                  className={`h-3 w-3 ${star <= 4 ? 'text-amber-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="h-20 flex justify-center items-center">
                        <div className="text-wine-600 text-center">
                          <FaWineBottle className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-xs">Add Wine</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave shape divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-gray-50">
            <path d="M0,64L80,69.3C160,75,320,85,480,85.3C640,85,800,75,960,64C1120,53,1280,43,1360,37.3L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-cormorant text-wine-800 mb-4">Track, Rate, and Share Your Wine Journey</h2>
            <p className="text-lg font-outfit text-gray-600 leading-relaxed">All the tools you need to build your personal wine collection and share experiences with friends.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card group hover:border-wine-300 hover:translate-y-[-4px]">
              <div className="mb-5 inline-block p-3 rounded-lg bg-wine-50 text-wine-600 group-hover:bg-wine-100 transition-colors">
                <FaRegClipboard className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-cormorant italic mb-3 text-gray-900 group-hover:text-wine-700 transition-colors">Personal Collection</h3>
              <p className="text-gray-600 font-outfit">
                Keep track of every wine you try with details on name, type, origin, vintage, and personal notes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card group hover:border-wine-300 hover:translate-y-[-4px]">
              <div className="mb-5 inline-block p-3 rounded-lg bg-wine-50 text-wine-600 group-hover:bg-wine-100 transition-colors">
                <FaRegChartBar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-cormorant italic mb-3 text-gray-900 group-hover:text-wine-700 transition-colors">Detailed Ratings</h3>
              <p className="text-gray-600 font-outfit">
                Rate wines on multiple criteria including aroma, taste, balance, finish, and value for a comprehensive profile.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card group hover:border-wine-300 hover:translate-y-[-4px]">
              <div className="mb-5 inline-block p-3 rounded-lg bg-wine-50 text-wine-600 group-hover:bg-wine-100 transition-colors">
                <FaGlassCheers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-cormorant italic mb-3 text-gray-900 group-hover:text-wine-700 transition-colors">Virtual Tastings</h3>
              <p className="text-gray-600 font-outfit">
                Host virtual wine tastings with friends in real-time, sharing ratings and notes as you taste together.
              </p>
            </div>
          </div>
          
          {/* Additional features */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-1">
                <FaUserFriends className="h-5 w-5 text-wine-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Social Sharing</h4>
                <p className="text-gray-600 text-sm">Share your favorite wines and collections with friends and other enthusiasts.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-1">
                <FaMobileAlt className="h-5 w-5 text-wine-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Mobile Friendly</h4>
                <p className="text-gray-600 text-sm">Access your collection on the go from any device with our responsive design.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-1">
                <FaShieldAlt className="h-5 w-5 text-wine-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Private & Secure</h4>
                <p className="text-gray-600 text-sm">Your collection is private by default. You control what you share.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Diagonal Pattern Background */}
        <div className="absolute inset-0 bg-wine-700 opacity-[0.97] z-0"></div>
        <div className="absolute inset-0 opacity-10 z-0 bg-[radial-gradient(#fff_1px,transparent_1px)]" style={{ backgroundSize: "24px 24px" }}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold font-cormorant italic text-white mb-6">Ready to Start Your Wine Journey?</h2>
          <p className="text-xl font-outfit text-wine-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join Wine Rater today and transform how you experience, remember, and share your wine adventures with friends.
          </p>
          
          {!isAuthenticated && (
            <Link to="/register" className="inline-block bg-white text-wine-700 hover:bg-gray-100 py-4 px-10 rounded-md transition-all font-medium text-lg shadow-xl hover:shadow-2xl">
              Create Your Free Account
            </Link>
          )}
          
          {/* Trust badges */}
          <div className="mt-16 grid grid-cols-3 gap-4 text-white">
            <div className="text-center">
              <div className="font-bold text-3xl">100%</div>
              <div className="text-sm text-wine-100">Free to Use</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl">No Ads</div>
              <div className="text-sm text-wine-100">Clean Experience</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl">Privacy</div>
              <div className="text-sm text-wine-100">You Own Your Data</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;