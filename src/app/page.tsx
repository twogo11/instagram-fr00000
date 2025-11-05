"use client";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "./providers/UserProvider";
import { redirect } from "next/navigation";
import { Post } from "./types";
import { PostCard } from "./components/PostCard";
import { Sidebar } from "./components/Sidebar";
import { Recommend } from "./components/Recommend";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user, loading } = useContext(UserContext);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);

  if (loading) {
    return <>Loading....</>;
  }

  if (!user) {
    return redirect("/signin");
  }

  return (
    <div className=" flex justify-between">
      <Sidebar />
      <div className="w-[600px] flex flex-col gap-4 mx-auto">
        {posts.slice().reverse().map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      <Recommend />
      
    </div>
  );
}
