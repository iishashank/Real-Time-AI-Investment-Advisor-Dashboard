const RiskCategory = ({ category = "Moderate" }) => (
  <div className="p-4 bg-indigo-800 text-white rounded-xl">
    Current Risk Profile: <strong>{category}</strong>
  </div>
);
export default RiskCategory;