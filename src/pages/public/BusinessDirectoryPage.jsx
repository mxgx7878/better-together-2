import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  Shield,
  Building2,
  ArrowRight,
  Filter,
} from "lucide-react";
import FeaturedPartnersRibbon from "../../components/common/FeaturedPartnersRibbon";
import { fetchMarketingRibbon } from "../../store/actions/marketingRibbonActions";
import { useDispatch, useSelector } from "react-redux";

const mockBusinesses = [
  {
    id: 1,
    name: "Horizon Therapy Services",
    initials: "HT",
    serviceType: "Therapy Services",
    location: "Sydney, NSW",
    rating: 4.9,
    reviews: 127,
    ndisRegistered: true,
    description:
      "Specialising in occupational therapy, speech pathology, and physiotherapy for NDIS participants of all ages.",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    name: "BridgePoint Support Coordination",
    initials: "BP",
    serviceType: "Support Coordination",
    location: "Melbourne, VIC",
    rating: 4.8,
    reviews: 98,
    ndisRegistered: true,
    description:
      "Expert support coordinators helping participants navigate their NDIS plans and connect with quality providers.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: 3,
    name: "Evergreen Daily Living",
    initials: "ED",
    serviceType: "Daily Living",
    location: "Brisbane, QLD",
    rating: 4.7,
    reviews: 84,
    ndisRegistered: true,
    description:
      "Providing compassionate daily living assistance including personal care, meal preparation, and household tasks.",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    name: "Pathway Behavioural Support",
    initials: "PB",
    serviceType: "Behaviour Support",
    location: "Perth, WA",
    rating: 4.6,
    reviews: 63,
    ndisRegistered: true,
    description:
      "Positive behaviour support practitioners developing tailored strategies for participants and their families.",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: 5,
    name: "Atlas Community Access",
    initials: "AC",
    serviceType: "Community Participation",
    location: "Adelaide, SA",
    rating: 4.8,
    reviews: 71,
    ndisRegistered: false,
    description:
      "Empowering participants through social and community engagement activities, group outings, and skill building.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: 6,
    name: "SafeHaven Accommodation",
    initials: "SH",
    serviceType: "Supported Living",
    location: "Gold Coast, QLD",
    rating: 4.5,
    reviews: 52,
    ndisRegistered: true,
    description:
      "Quality supported independent living and shared accommodation options with 24/7 on-call assistance.",
    color: "from-rose-500 to-pink-500",
  },
  {
    id: 7,
    name: "MoveWell Allied Health",
    initials: "MW",
    serviceType: "Therapy Services",
    location: "Canberra, ACT",
    rating: 4.9,
    reviews: 110,
    ndisRegistered: true,
    description:
      "A multidisciplinary team offering physiotherapy, exercise physiology, and assistive technology assessments.",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: 8,
    name: "Spark Plan Management",
    initials: "SP",
    serviceType: "Plan Management",
    location: "Hobart, TAS",
    rating: 4.7,
    reviews: 89,
    ndisRegistered: true,
    description:
      "Hassle-free plan management with real-time budget tracking, fast invoice payments, and dedicated support.",
    color: "from-fuchsia-500 to-pink-500",
  },
];

const serviceTypes = [
  "All Services",
  "Therapy Services",
  "Support Coordination",
  "Daily Living",
  "Behaviour Support",
  "Community Participation",
  "Supported Living",
  "Plan Management",
];

const locations = [
  "All Locations",
  "Sydney, NSW",
  "Melbourne, VIC",
  "Brisbane, QLD",
  "Perth, WA",
  "Adelaide, SA",
  "Gold Coast, QLD",
  "Canberra, ACT",
  "Hobart, TAS",
];

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < fullStars
              ? "text-yellow-400 fill-yellow-400"
              : i === fullStars && hasHalf
                ? "text-yellow-400 fill-yellow-400 opacity-60"
                : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-700">{rating}</span>
      <span className="text-sm text-gray-400">
        ({rating >= 4.8 ? "100+" : `${Math.floor(rating * 15)}`} reviews)
      </span>
    </div>
  );
};

const BusinessDirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("All Services");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const filteredBusinesses = mockBusinesses.filter((biz) => {
    const matchesSearch =
      searchTerm === "" ||
      biz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService =
      selectedService === "All Services" || biz.serviceType === selectedService;
    const matchesLocation =
      selectedLocation === "All Locations" || biz.location === selectedLocation;
    return matchesSearch && matchesService && matchesLocation;
  });

  const dispatch = useDispatch();
  const sponsors = useSelector((s) => s.marketingRibbon.publicEntries);

  useEffect(() => {
    dispatch(fetchMarketingRibbon());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Building2 className="w-5 h-5 text-white" />
            <span className="text-white/90 text-sm font-medium">
              Trusted NDIS Providers
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Business Directory
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Find trusted NDIS providers and support services near you
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search providers by name or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Service Type Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="appearance-none pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white cursor-pointer min-w-[200px]"
              >
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="appearance-none pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white cursor-pointer min-w-[180px]"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Showing {filteredBusinesses.length} of {mockBusinesses.length}{" "}
            providers
          </p>
        </div>
      </section>

      {/* Business Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">
              No providers found
            </h3>
            <p className="text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBusinesses.map((biz) => (
              <div
                key={biz.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${biz.color} p-5`}>
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {biz.initials}
                      </span>
                    </div>
                    {biz.ndisRegistered && (
                      <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        <Shield className="w-3 h-3" />
                        NDIS Registered
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1 group-hover:text-purple-600 transition-colors">
                    {biz.name}
                  </h3>

                  <span className="inline-block text-xs font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full mb-3">
                    {biz.serviceType}
                  </span>

                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {biz.location}
                  </div>

                  <RatingStars rating={biz.rating} />

                  <p className="text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                    {biz.description}
                  </p>

                  <Link
                    to="/subscription"
                    state={{
                      message:
                        "Sign up to view full provider profiles and connect directly.",
                    }}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium py-2.5 px-4 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all"
                  >
                    View Profile
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500 rounded-2xl p-10 md:p-14 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-300 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl mb-6">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Are you a provider?
            </h2>
            <p className="text-lg text-purple-100 max-w-xl mx-auto mb-8">
              List your business on our directory and connect with NDIS
              participants looking for quality support services in their area.
            </p>
            <Link
              to="/subscription"
              className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold py-3.5 px-8 rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
            >
              List Your Business
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <FeaturedPartnersRibbon
          sponsors={sponsors}
          title="Our Marketing Partners"
          note="Sponsored providers"
        />
      </section>
    </div>
  );
};

export default BusinessDirectoryPage;
