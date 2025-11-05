"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { Verified, Ellipsis } from "lucide-react";
import { User } from "../types";
import { PostType } from "../components/PostType";
import { useUser } from "../providers/UserProvider";
import { Sidebar } from "../components/Sidebar";

interface Post {
  _id: string;
  imageUrl: string;
  caption?: string;
  followings?: string[];
  createdBy?: {
    _id: string;
    username: string;
  };
  likes?: any[];
  comments?: any[];
}

const Page = () => {
  const { username } = useParams();
  const { user: currentUser } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [FollowingCount, setFollowingCount] = useState(0);
  const axios = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. username-аар хэрэглэгчийг авах
        const userRes = await axios.get(`/users/${username}`);
        const userData = userRes.data;
        setUser(userData);

        // 2️⃣ Followers тоог state-д хадгалах
        setFollowerCount(userData.followers?.length || 0);

        // 2. бүх постуудыг авах
        const allPostsRes = await axios.get(`/posts`);
        const allPosts = allPostsRes.data;

        // 3. тухайн хэрэглэгчийн постыг шүүх
        const userPosts = allPosts.filter(
          (post: any) => post.createdBy?._id === userData._id
        );
        setPosts(userPosts);

        // 4. Follow төлөв шалгах
        const isFollowed = userData.followers?.some(
          (f: any) => f.createdBy?._id === currentUser?._id
        );
        setIsFollowing(isFollowed);
      } catch (err: any) {
        if (err.response?.status === 404) setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchData();
  }, [username, currentUser?._id]);

  const handleFollow = async () => {
    if (!user) return;
    setFollowLoading(true);
    try {
      const res = await axios.post(`/users/${user.username}/follow`);
      setIsFollowing(res.data.isFollowing);

      // Follow/Unfollow үед тоо шинэчил
      setFollowerCount((prev) => (res.data.isFollowing ? prev + 1 : prev - 1));
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (isNotFound)
    return (
      <div className="text-center text-white mt-20">User not found 😢</div>
    );

  if (loading)
    return (
      <div className="text-center text-white mt-20 animate-pulse">
        Loading profile...
      </div>
    );

  return (
    <div>
      <Sidebar />
      <div className="min-h-screen bg-black text-white font-sans w-[600px] mx-auto py-8">
      {/* Profile Header */}
      <div className="w-full p-4 flex items-start gap-10 border-b border-gray-800">
        <div>
          <img
            src="https://www.politico.com/dims4/default/resize/1260/quality/90/format/webp?url=https%3A%2F%2Fstatic.politico.com%2F84%2Ff1%2F28d495534693990f6f40f8309cc0%2Fkanye-running.png"
            alt="Profile"
            className="w-[120px] h-[120px] rounded-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 font-semibold text-3xl">
              {user?.username}
              <Verified className="w-5 h-5 text-blue-500" />
            </div>

            <div className="flex items-center gap-2">
              {user?._id === currentUser?._id ? (
                <>
                  <button className="px-4 py-2 rounded-md bg-[#202327] font-medium hover:bg-[#2c2f33] transition">
                    Edit profile
                  </button>
                  <button className="px-4 py-2 rounded-md bg-[#202327] font-medium hover:bg-[#2c2f33] transition">
                    View archive
                  </button>
                  <div className="flex items-center justify-center p-2 rounded-md bg-[#202327] hover:bg-[#2c2f33] cursor-pointer transition">
                    <Ellipsis className="w-5 h-5" />
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`px-4 py-2 rounded-md font-medium transition ${
                      isFollowing
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {followLoading
                      ? "..."
                      : isFollowing
                      ? "Following"
                      : "Follow"}
                  </button>

                  <button className="px-4 py-2 rounded-md bg-[#202327] font-medium hover:bg-[#2c2f33] transition">
                    Message
                  </button>

                  <div className="flex items-center justify-center p-2 rounded-md bg-[#202327] hover:bg-[#2c2f33] cursor-pointer transition">
                    <Ellipsis className="w-5 h-5" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Posts/Followers/Following */}
          <div className="flex gap-10 text-gray-400 mt-5 text-l">
            <span>
              <span className="text-white font-semibold">
                {posts?.length || 0}
              </span>{" "}
              posts
            </span>
            <span>
              <span className="text-white font-semibold">
                {followerCount}
                </span>{" "}
              followers
            </span>
            <span>
              <span className="text-white font-semibold">
                {user?.followings?.length || 0}
              </span>{" "}
              following
            </span>
          </div>

          <div className="mt-2">
            <p className="text-white text-sb">
              I don’t follow trends. I design them.
            </p>
          </div>
        </div>
      </div>

      {/* Post Type Tabs */}
      <div>
        <PostType />
      </div>

      {/* User Posts */}
      <div className="posts grid grid-cols-3 mt-1 gap-[1px]">
        {posts.length > 0 ? (
          posts.slice().reverse().map((post) => (
            <div
              key={post._id}
              className="relative aspect-square overflow-hidden group cursor-pointer"
            >
              <img
                src={post.imageUrl}
                alt="post"
                className="w-full h-full object-cover group-hover:opacity-60 transition duration-300 ease-in-out"
              />

              {/* 👇 Hover үед like/comment тоо гарч ирнэ */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                <div className="flex items-center gap-6 text-white font-semibold text-lg">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44h.74C13.09 5.01 14.76 4 16.5 4 19.01 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>
                      {post.likes?.length || Math.floor(Math.random() * 500)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                    >
                      <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                    </svg>
                    <span>
                      {post.comments?.length || Math.floor(Math.random() * 100)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 mt-10">
            No posts yet
          </div>
        )}
      </div>

      
    </div>
    </div>
  );
};

export default Page;
