import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerifiedBadge } from "./VerifiedBadge";
import { cn } from "@/lib/utils";
import { getStorageUrl } from "@/utils/getStorageUrl";

interface UserAvatarProps {
  user: {
    name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
    badge?: string[] | null;
  };
  size?: "sm" | "md" | "lg" | "xl";
  showVerifiedBadge?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const badgeSizes = {
  sm: "sm" as const,
  md: "sm" as const,
  lg: "md" as const,
  xl: "md" as const,
};

export function UserAvatar({
  user,
  size = "md",
  showVerifiedBadge = false,
  className = "",
}: UserAvatarProps) {
  const displayName = user.name || user.username || "User";
  const avatarFallback = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isVerified = user.badge?.includes("verified") || false;

  return (
    <div className={cn("relative inline-flex", className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage
          src={user?.avatar_url ? getStorageUrl(user.avatar_url) : undefined}
          alt={displayName}
        />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      {showVerifiedBadge && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <VerifiedBadge isVerified={isVerified} size={badgeSizes[size]} />
        </div>
      )}
    </div>
  );
}
