import { useQuery } from "@tanstack/react-query";
import ContestCard from "./ContestCard";
import useAxiosPublic from "../hooks/useAxios";
import { Link } from "react-router";
import SkeletonCard from "./SkeletonCard";

const PopularContests = ({ searchText = "" }) => {
    const axiosPublic = useAxiosPublic();

    const { data: contestsData = {}, isLoading } = useQuery({
        queryKey: ['popular-contests', searchText], 
        queryFn: async () => {
            const res = await axiosPublic.get(`/all-contests?search=${searchText}&size=50`); 
            return res.data;
        }
    });

    const contests = contestsData.contests || [];


    const popularDisplay = [...contests]
        .sort((a, b) => (b.attemptedCount || 0) - (a.attemptedCount || 0))
        .slice(0, 6);

    return (
        <div className="py-20 container mx-auto px-4 font-outfit">
            {/* Section Header */}
            <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase italic">
                    Popular <span className="text-primary">Contests</span>
                </h2>
                <div className="w-20 h-1.5 bg-primary mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Content Logic */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            ) : popularDisplay.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {popularDisplay.map(contest => (
                        <div key={contest._id} className="hover:-translate-y-2 transition-transform duration-300">
                            <ContestCard contest={contest} />
                        </div>
                    ))}
                </div>
            ) : (
                
                <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-400 uppercase italic">
                        No results found {searchText && `for "${searchText}"`}
                    </h3>
                    <p className="text-slate-500 mt-2">Try searching by name or category (e.g., Coding, Design)</p>
                </div>
            )}

            {/* Show All Button */}
            {!isLoading && (
                <div className="text-center mt-12">
                    <Link to="/all-contests" className="btn btn-primary btn-lg px-10 rounded-full font-bold uppercase italic shadow-xl text-white hover:scale-105 transition-transform border-none">
                        Show All Contests
                    </Link>
                </div>
            )}
        </div>
    );
};

export default PopularContests;