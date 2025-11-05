// 📦 Importууд
import { Post } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Heart,
  UserRound,
  Verified,
  Ellipsis,
  MessageCircle,
  Send,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { useAxios } from "../hooks/useAxios";
import { useUser } from "../providers/UserProvider";

dayjs.extend(relativeTime);

// 🧩 PostCard component
export const PostCard = ({ post }: { post: Post }) => {
  // 🧠 State-ууд
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [totalComments, setTotalComments] = useState(3);
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [showHeart, setShowHeart] = useState(false);
  const [bookmarked, setBookmarked] = useState(false); // 🆕 Bookmark төлөв

  const axios = useAxios();
  const { user } = useUser();

  // 👀 Хэрэглэгч лайк дарсан эсэх
  useEffect(() => {
    if (user) {
      const userId = user._id;
      setIsLiked(post.likes.some((like) => like.createdBy._id === userId));
    }
  }, [user]);

  // 🏷️ Bookmark төлөвийг localStorage-с унших
  useEffect(() => {
    const saved = localStorage.getItem(`bookmark_${post._id}`);
    if (saved === "true") setBookmarked(true);
  }, [post._id]);

  // 💾 Bookmark toggle хийх
  const handleBookmark = () => {
    const newValue = !bookmarked;
    setBookmarked(newValue);
    localStorage.setItem(`bookmark_${post._id}`, String(newValue));
  };

  // 💬 Сэтгэгдэл илгээх
  const handleSubmitComment = async () => {
    if (!text.trim()) return;
    const response = await axios.post(`/posts/${post._id}/comments`, { text });
    if (response.status === 200) {
      setText("");
      setComments([...comments, response.data]);
    } else {
      toast.error("Алдаа гарлаа");
    }
  };

  // ❤️ Давхар дарахад лайк хийх
  const handleDoubleTap = async () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);

    if (!isLiked) {
      const response = await axios.post(`/posts/${post._id}/like`);
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  // 🖼️ UI
  return (
    <div key={post._id} className="mb-4 border-b py-4 text-white">
      {/* 👤 Постын дээд хэсэг */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          <UserRound />
          <Link href={`/${post.createdBy.username}`}>
            <div className="font-bold">{post.createdBy.username}</div>
          </Link>
          <Verified className="w-5 h-5 text-blue-500" />
          
          <span className="text-gray-400 text-sm">
            {dayjs(post.createdAt).fromNow()}
          </span>
        </div>
        <button>
          <Ellipsis />
        </button>
      </div>

      {/* 📸 Зураг хэсэг */}
      <div className="relative" onDoubleClick={handleDoubleTap}>
        <img src={post.imageUrl} alt="" className="w-full h-auto select-none" />

        {showHeart && (
          <Heart
            className="absolute inset-0 m-auto text-red-500 animate-scale"
            size={100}
            fill="red"
          />
        )}

        <style jsx>{`
          @keyframes scale {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }
          .animate-scale {
            animation: scale 0.8s forwards;
          }
        `}</style>
      </div>

      {/* ❤️, 💬, ✈️, 🔖 товчнууд */}
      <div className="flex items-center justify-between gap-4 mt-3">
        <div className="flex items-center gap-4 ">
          {/* ❤️ Like */}
          <div
            className="hover:opacity-60 cursor-pointer"
            onClick={async () => {
              const response = await axios.post(`/posts/${post._id}/like`);
              setIsLiked(response.data.isLiked);
              setLikeCount((prev) =>
                response.data.isLiked ? prev + 1 : prev - 1
              );
            }}
          >
            {isLiked ? <Heart fill="red" stroke="red" /> : <Heart />}
          </div>

          {/* 💬 Comment */}
          <div
            className="hover:opacity-60 cursor-pointer"
            onClick={() => setShowComments((prev) => !prev)}
          >
            <MessageCircle size={25} />
          </div>

          {/* ✈️ Share */}
          <div className="hover:opacity-60 cursor-pointer">
            <Send size={25} />
          </div>
        </div>

        {/* 🔖 Bookmark */}
        <p
          onClick={handleBookmark}
          className="hover:opacity-60 cursor-pointer transition-all"
        >
          {bookmarked ? (
            <BookmarkCheck size={25} fill="white" stroke="white" />
          ) : (
            <Bookmark size={25} />
          )}
        </p>
      </div>

      {/* ❤️ Лайк ба тайлбар */}
      <div>{likeCount} likes</div>
      <div className="flex flec-col items-center gap-1">
        <Link href={`/${post.createdBy.username}`}>
          <b>{post.createdBy.username}</b>
        </Link>{" "}
        <Verified className="w-4 h-4 text-blue-500" />
        {post.description}
      </div>

      {/* 💬 Сэтгэгдэл хэсэг */}
      {showComments && (
        <div className="mt-2">
          {comments.slice(0, totalComments).map((comment) => (
            <div key={comment._id}>
              <Link href={`/${comment.createdBy.username}`}>
                <b>{comment.createdBy.username}: </b>
              </Link>
              {comment.text}
            </div>
          ))}

          {comments.length > 3 && totalComments === 3 && (
            <div
              onClick={() => setTotalComments(100)}
              className="hover:underline cursor-pointer text-sm text-gray-400 mt-1"
            >
              View all {comments.length} comments
            </div>
          )}

          <div className="relative mt-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment"
              className="w-full resize-none"
              rows={1}
            />
            {text.length > 0 && (
              <div
                onClick={handleSubmitComment}
                className="absolute right-0 top-0 font-bold hover:underline cursor-pointer"
              >
                Post
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
