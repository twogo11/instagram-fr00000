import { Grid3x3, Clapperboard, Bookmark, Tag } from "lucide-react";

export const PostType = () => {
  return (
    <div className="w-[600px] mx-auto flex justify-between items-center border-t border-b-2 border-gray-800 py-3 px-10 bg-black">
      <Grid3x3 className="w-6 h-6 " />

      {/* Divider */}
      <div className="w-px h-6 bg-gray-800" />

      <Clapperboard className="w-6 h-6 cursor-pointer hover:text-white text-gray-400" />

      {/* Divider */}
      <div className="w-px h-6 bg-gray-800" />

      <Bookmark className="w-6 h-6 cursor-pointer hover:text-white text-gray-400" />

      {/* Divider */}
      <div className="w-px h-6 bg-gray-800" />

      <Tag className="w-6 h-6 cursor-pointer hover:text-white text-gray-400" />
    </div>
  );
};
