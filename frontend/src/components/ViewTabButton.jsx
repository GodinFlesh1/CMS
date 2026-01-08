const ViewTabButton = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
        active
          ? "bg-purple-600 text-white shadow-lg"
          : "bg-white text-gray-700 border border-gray-300 hover:border-purple-400"
      }`}
    >
      {label}
    </button>
  );
  
  export default ViewTabButton;
  