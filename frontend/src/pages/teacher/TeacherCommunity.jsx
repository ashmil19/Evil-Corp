import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CommunityUi from "../../components/common/CommunityUi";
import TeacherNavbar from "../../components/navbars/TeacherNavbar";

const TeacherCommunity = () => {
    const axiosPrivate = useAxiosPrivate();

  const [clicked, setClicked] = useState(false);
  const [communities, setCommunities] = useState(false);
  const [communityId, setCommunityId] = useState(null);
  const [community, setCommunity] = useState(null);

  const handleChatClick = (id, community) => {
    setClicked(true);
    setCommunityId(id);
    setCommunity(community);
  };

  const fetchCommunity = () => {
    axiosPrivate
      .get("/chat/community")
      .then((res) => {
        console.log(res);
        setCommunities(res?.data?.communities);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchCommunity();
  }, []);
  return (
    <>
      <div className="h-screen overflow-x-hidden">
        <TeacherNavbar />
        <div className="flex h-screen text-gray-800 antialiased">
          <div className="flex h-full w-full flex-row overflow-x-hidden">
            <div className="flex w-64 flex-shrink-0 flex-col bg-white py-8 pl-6 pr-2">
              <div className="flex h-12 w-full flex-row">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-2 text-2xl font-bold">Community</div>
              </div>
              <div className="mt-8 flex flex-col">
                <div className="flex flex-row items-center justify-between text-xs">
                  <span className="font-bold">Active Conversations</span>
                  {/* <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                                      4
                                  </span> */}
                </div>
                <div className="-mx-2 mt-4 flex h-full flex-col space-y-1 overflow-y-auto">
                  {communities &&
                    communities.map((community) => (
                      <button
                        key={community._id}
                        className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100"
                        onClick={() =>
                          handleChatClick(community?.communityId, community)
                        }
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200">
                          H
                        </div>
                        <div className="ml-2 text-sm font-semibold">
                          {community.communityName}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex h-5/6 flex-auto flex-col p-6">
              {clicked ? (
                <CommunityUi chatId={communityId} community={community} />
              ) : (
                <div className="flex h-full flex-shrink-0 items-center justify-center rounded-b-2xl bg-gray-300 p-4 text-2xl font-bold text-gray-600">
                  Start Chating
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherCommunity;
