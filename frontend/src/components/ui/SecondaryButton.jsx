const SecondaryButton = ({ onClick, children, loading, className = "" }) => (
  <button
    onClick={onClick}
    className={`w-full bg-transparent text-gray-200 border-2 border-gray-600 rounded-lg py-4 px-4 text-lg font-semibold hover:bg-gray-800 hover:border-gray-500 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 ${className}`}
  >
    {loading ? (
      <>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <span>Please wait...</span>
      </>
    ) : (
      children
    )}{" "}
  </button>
);

export default SecondaryButton;
