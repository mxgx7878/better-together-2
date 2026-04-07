const SupportPage = () => {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-ndis-green to-ndis-yellow text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Support for Participants</h1>
          <p className="text-xl">
            Resources and guidance to help you navigate your NDIS journey
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl text-gray-600 mb-8">
            This page will contain comprehensive support resources for NDIS participants.
          </p>
          <div className="bg-gray-100 rounded-lg p-12">
            <p className="text-gray-500">Content coming soon...</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
