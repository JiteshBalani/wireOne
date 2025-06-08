import { useSelector } from "react-redux";

const TailwindLoader = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);

  return isLoading ? (
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#001529] mx-auto"></div>
      <h2 className="text-lg mt-4 text-black">Calculating...</h2>
    </div>
  ) : null;
};

export default TailwindLoader;
