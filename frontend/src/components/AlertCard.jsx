import React from "react";

const AlertCard = ({ 
  title, 
  count, 
  description, 
  onClick, 
  bgColor, 
  borderColor, 
  textColor, 
  icon 
}) => {
  return (
    <div className={`p-6 rounded-xl shadow-md border-l-4 ${bgColor} ${borderColor}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-6 h-6 ${textColor}`}>
          {icon}
        </div>
        <h3 className={`text-lg font-bold ${textColor}`}>
          {title}
        </h3>
      </div>

      <p className={`${textColor.replace("600", "700")} mb-3`}>
        <span className="text-2xl font-bold">{count}</span> {description}
      </p>

      <button
        onClick={onClick}
        className={`${textColor} hover:${textColor.replace("600", "800")} font-medium flex items-center gap-1`}
      >
        View Details →
      </button>
    </div>
  );
};

export default AlertCard;
