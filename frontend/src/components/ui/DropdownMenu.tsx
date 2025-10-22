import React from "react";
import {
  MoreVertical,
  MoreHorizontal,
  Share,
  Mail,
  Bookmark,
} from "lucide-react"; // added Bookmark icon
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ItemType = {
  _id: string;
  slug?: string;
  item_type?: string;
  type?: string;
  title?: string;
};

interface DropdownActionsProps {
  item: ItemType;
  isAdmin?: boolean;
  featuredId?: string | null;
  handleSetFeatured?: (item: ItemType) => void;
  handleRemoveFeatured?: (item: ItemType) => void;
  handleAddToNewsletter?: (item: ItemType) => void;
  handleSave?: (item: ItemType) => void; // save handler
  variant?: "light" | "dark";
}

const DropdownActions: React.FC<DropdownActionsProps> = ({
  item,
  isAdmin = false,
  featuredId = null,
  handleSetFeatured,
  handleRemoveFeatured,
  handleAddToNewsletter,
  handleSave,
  variant = "light",
}) => {
  const itemType = (item.item_type || item.type || "item").toLowerCase();
  const itemSlug = item.slug || item._id;

  const shareUrl = `${window.location.origin}/${itemType}s/${
    itemSlug ? itemSlug : ""
  }`;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: item.title,
          text: `Check out this ${itemType}!`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  const isDark = variant === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`p-1 rounded-full ${
            isDark
              ? "text-white bg-black/40 hover:bg-black/60"
              : "hover:bg-gray-800"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {isDark ? (
            <MoreHorizontal size={18} />
          ) : (
            <MoreVertical className="w-5 h-5 text-gray-400" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="left"
        align="end"
        className={`w-48 ${
          isDark
            ? "bg-black border border-gray-800 text-white text-sm shadow-xl"
            : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Share */}
        <DropdownMenuItem
          onClick={handleShare}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Share size={14} /> Share
        </DropdownMenuItem>

        {/* Save (for blogs) */}
        {handleSave && itemType === "blog" && (
          <DropdownMenuItem
            onClick={() => handleSave(item)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Bookmark size={14} /> Save
          </DropdownMenuItem>
        )}

        {/* Newsletter (Events + Admin) */}
        {isAdmin && handleAddToNewsletter && (itemType === "event" || itemType === "blog") && (
          <DropdownMenuItem
            onClick={() => handleAddToNewsletter(item)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Mail size={14} /> Add to Newsletter
          </DropdownMenuItem>
        )}

        {/* Featured controls (Admins only) */}
        {isAdmin && handleSetFeatured && featuredId !== item._id && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleSetFeatured(item);
            }}
          >
            Set as Featured
          </DropdownMenuItem>
        )}

        {isAdmin && handleRemoveFeatured && featuredId === item._id && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFeatured(item);
            }}
            className="text-red-600"
          >
            Remove Featured
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownActions;