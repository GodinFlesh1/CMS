const ViewSection = ({ name, selected, children }) => {
    if (name !== selected) return null;
    return <>{children}</>;
  };
  
  export default ViewSection;
  